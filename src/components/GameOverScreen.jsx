import { useGameStore } from "../store/gameStore";

export default function GameOverScreen() {
  const { gameOverReason, resetGame, day, metrics } = useGameStore();

  return (
    <div className="gameover-overlay">
      <div className="gameover-card">
        <div className="gameover-press">THE PRESS</div>
        <h1 className="gameover-headline">PRESS SHUT DOWN</h1>
        <p className="gameover-subtitle">— Edition {day} was your last —</p>
        <p className="gameover-reason">{gameOverReason}</p>

        <div className="gameover-final-metrics">
          <FinalStat label="Trust" value={metrics.trust} />
          <FinalStat label="Revenue" value={metrics.revenue} />
          <FinalStat label="Safety" value={metrics.safety} />
          <FinalStat label="Legal Risk" value={metrics.legalRisk} />
        </div>

        <button className="restart-btn" onClick={resetGame}>
          RESTART THE PRESS
        </button>
      </div>
    </div>
  );
}

function FinalStat({ label, value }) {
  return (
    <div className="final-stat">
      <span className="final-stat-val">{value}</span>
      <span className="final-stat-label">{label}</span>
    </div>
  );
}
