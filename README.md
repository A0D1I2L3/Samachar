# NewsFuse — The Editor's Burden

A web-based newspaper editorial simulation game where you make high-stakes decisions as Lead Editor.

## Tech Stack
- **Frontend**: React + Vite
- **State**: Zustand
- **Database**: Firebase Firestore (client-side only)

## Project Structure

```
src/
  firebase/
    config.js              ← Firebase app initialization (uses YOUR credentials from the screenshot)
    firestoreService.js    ← getDocs / addDoc wrappers + story seeder
  engine/
    decisionEngine.js      ← Deterministic impact calculator
  store/
    gameStore.js           ← Zustand global state + actions
  components/
    MetricsDashboard.jsx   ← Left panel: trust, revenue, safety, etc.
    StoryPanel.jsx         ← Story display + 4 decision buttons
    ResultPanel.jsx        ← Impact report after each decision
    GameOverScreen.jsx     ← Shown when any terminal condition fires
  App.jsx                  ← Root layout
  App.css                  ← Full editorial dark theme
```

## Setup

```bash
npm install
npm run dev
```

## Firestore Rules (development)
Set open rules during dev in Firebase Console:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Game Mechanics

### Metrics (all clamped 0–100)
| Metric | Game Over Condition |
|--------|-------------------|
| Trust | = 0 → Loss of credibility |
| Revenue | = 0 → Company shutdown |
| Safety | = 0 → Threat realized |
| Legal Risk | ≥ 100 → Lawsuit/shutdown |
| Political Pressure | Modifier only (increases bias weighting) |

### Decisions
| Decision | Effect Summary |
|----------|---------------|
| **Publish** | High-truth + evidence → trust up. Low evidence → legal risk. |
| **Reject** | Lowers risk, but costs revenue on viral stories. |
| **Spin** | Revenue spike + virality, but always hurts trust. |
| **Delay** | Safe, minor revenue loss, allows future verification. |

### Story Seeding
On first run with an empty Firestore `stories` collection, the app auto-seeds 12 pre-written stories. Subsequent runs fetch from Firestore.

## Extensions Roadmap
- AI-generated stories via Anthropic API
- Bias memory system (past spin decisions affect future weights)
- Random external events (elections, scandals) every N days
- Difficulty scaling: shorter deadlines, more stories per day
- Auth + leaderboard
