/**
 * Decision Engine
 * Calculates metric impacts based on story attributes and player decision.
 * All returned deltas are applied to current metrics (clamped 0–100 by store).
 */

const EVIDENCE_WEIGHT = { strong: 1.0, moderate: 0.6, weak: 0.2 };
const RISK_WEIGHT = { low: 0.2, medium: 0.55, high: 1.0 };

function norm(value, max = 100) {
  return value / max;
}

/**
 * @param {object} story - { truthScore, evidence, viralityScore, riskLevel }
 * @param {"publish"|"reject"|"spin"|"delay"} decision
 * @param {number} politicalPressure - current political pressure (0–100)
 * @returns {{ trust, revenue, safety, legalRisk, politicalPressure, narrative }}
 */
export function calculateImpact(story, decision, politicalPressure = 0) {
  const t = norm(story.truthScore);
  const v = norm(story.viralityScore);
  const e = EVIDENCE_WEIGHT[story.evidence] ?? 0.5;
  const r = RISK_WEIGHT[story.riskLevel] ?? 0.5;
  const pp = norm(politicalPressure); // political pressure modifier

  let impact = {
    trust: 0,
    revenue: 0,
    safety: 0,
    legalRisk: 0,
    politicalPressure: 0,
  };

  let narrative = "";

  switch (decision) {
    case "publish": {
      // Truth and evidence improve trust; viral stories amplify
      impact.trust = Math.round((t * 0.6 + e * 0.4) * 20 * (1 + v * 0.5));
      // Revenue driven by virality
      impact.revenue = Math.round(v * 18 + t * 5);
      // Low evidence = legal risk; high risk story = legal risk
      impact.legalRisk = Math.round((1 - e) * 25 + r * 15);
      // Safety threatened by high-risk stories
      impact.safety = -Math.round(r * 12 * (1 + pp * 0.5));
      // Political pressure rises when publishing controversial high-risk content
      impact.politicalPressure = Math.round(r * 10 - t * 5);

      if (t > 0.8 && e === 1.0) {
        narrative = "Solid investigative piece. The newsroom buzzes with pride.";
      } else if (t < 0.4) {
        narrative = "Readers are calling out factual errors. Trust is bleeding.";
      } else if (r === 1.0) {
        narrative = "Legal is already on the phone. This story has teeth.";
      } else {
        narrative = "Story hits the front page. Reactions are mixed.";
      }
      break;
    }

    case "reject": {
      // Rejecting protects from legal and safety risk
      impact.legalRisk = -Math.round(r * 8);
      impact.safety = Math.round(r * 6);
      // But costs revenue (especially viral stories) and some trust if obvious suppression
      impact.revenue = -Math.round(v * 10);
      impact.trust = -Math.round((1 - t) * 3 + v * 0.05 * 10);
      // Rejecting lowers political pressure
      impact.politicalPressure = -Math.round(r * 5);

      if (v > 0.8) {
        narrative =
          "The story leaked to rivals within the hour. Revenue drops as readers flee.";
      } else if (r === 1.0) {
        narrative = "Smart call. The source was questionable. Bullet dodged.";
      } else {
        narrative = "Story shelved. The newsroom questions the decision quietly.";
      }
      break;
    }

    case "spin": {
      // Spin increases revenue and virality benefit but always hurts trust
      impact.revenue = Math.round(v * 22 + 5);
      impact.trust = -Math.round((1 - t) * 18 + 8);
      // Spin elevates legal risk if evidence was weak
      impact.legalRisk = Math.round((1 - e) * 20 + 5);
      // Safety slightly improved (less threatening framing)
      impact.safety = Math.round(r * 3);
      // Spin always increases political pressure
      impact.politicalPressure = Math.round(v * 12 + r * 8);

      if (t < 0.4) {
        narrative =
          "The spin worked short-term. But fact-checkers are already circling.";
      } else if (v > 0.7) {
        narrative =
          "The story goes viral. Revenue spikes — but critics call it sensationalism.";
      } else {
        narrative = "Readers detect the angle. Trust erodes quietly.";
      }
      break;
    }

    case "delay": {
      // Delay buys time — minor revenue loss, moderate risk reduction
      impact.revenue = -Math.round(v * 5 + 3);
      impact.legalRisk = -Math.round(e * 10);
      impact.safety = Math.round(r * 4);
      impact.trust = Math.round(t * 4 - 2);
      impact.politicalPressure = -Math.round(r * 3);

      narrative =
        "Story held pending verification. Editors scramble to gather more evidence.";
      break;
    }

    default:
      narrative = "No decision made.";
  }

  return { ...impact, narrative };
}
