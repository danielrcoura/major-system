import { useDeckData } from '../hooks/useDeckData';

export default function ProgressBar(): React.JSX.Element {
  const { data } = useDeckData();
  const filled: number = Object.values(data).filter(
    (v) => v.persona && v.persona.trim()
  ).length;
  const pct: number = Math.round((filled / 100) * 100);

  return (
    <div className="global-progress">
      <span>{filled} / 100 cartas</span>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span>{pct}%</span>
    </div>
  );
}
