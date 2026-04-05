import { useDeckData } from '../hooks/useDeckData';

export default function ProgressBar(): React.JSX.Element | null {
  const { data } = useDeckData();
  const filled: number = Object.values(data).filter(
    (v) => v.persona && v.persona.trim()
  ).length;

  if (filled === 100) return null;

  const pct = Math.round((filled / 100) * 100);

  return (
    <div className="progress-callout" role="status">
      <span className="progress-callout-icon" aria-hidden="true">🎯</span>
      <div className="progress-callout-content">
        <strong>Objetivo: preencha o deck completo</strong>
        <div className="progress-callout-bar">
          <span>{filled} / 100 cartas</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span>{pct}%</span>
        </div>
      </div>
    </div>
  );
}
