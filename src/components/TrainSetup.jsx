import { isStartEnabled } from '../utils/trainUtils';

const MODE_DESCRIPTIONS = {
  numToChar: 'Veja 3 números e clique nos personagens na ordem correta.',
  charToNum: 'Veja 3 personagens e clique nos números na ordem correta.',
  flashCards:
    'Veja o número, clique para revelar o personagem. Revise todos os cartões preenchidos.',
};

const MODES = [
  { key: 'numToChar', label: 'Número → Personagem' },
  { key: 'charToNum', label: 'Personagem → Número' },
  { key: 'flashCards', label: 'Flash Cards' },
];

export default function TrainSetup({ filledCount, mode, onModeChange, onStart }) {
  const enabled = isStartEnabled(mode, filledCount);

  return (
    <div className="train-panel">
      <h2>Treino</h2>
      <div className="mode-selector">
        {MODES.map((m) => (
          <button
            key={m.key}
            className={`mode-btn${mode === m.key ? ' active' : ''}`}
            data-mode={m.key}
            onClick={() => onModeChange(m.key)}
          >
            {m.label}
          </button>
        ))}
      </div>
      <p className="train-info" id="modeDescription">
        {MODE_DESCRIPTIONS[mode]}
      </p>
      <p className="train-info" id="filledCount">
        Cartões preenchidos: {filledCount}
      </p>
      <button
        className="btn-start"
        id="startBtn"
        disabled={!enabled}
        onClick={onStart}
      >
        Começar Treino
      </button>
    </div>
  );
}
