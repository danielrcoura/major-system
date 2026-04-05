import { TrainMode } from '../types';
import { isStartEnabled } from '../utils/trainUtils';

const MODE_DESCRIPTIONS: Record<TrainMode, string> = {
  numToChar: 'Veja 3 números e clique nos personagens na ordem correta.',
  charToNum: 'Veja 3 personagens e clique nos números na ordem correta.',
  flashCards:
    'Veja o número, clique para revelar o personagem. Revise todos os cartões preenchidos.',
};

interface ModeOption {
  key: TrainMode;
  label: string;
}

const MODES: ModeOption[] = [
  { key: 'numToChar', label: 'Número → Personagem' },
  { key: 'charToNum', label: 'Personagem → Número' },
  { key: 'flashCards', label: 'Flash Cards' },
];

interface TrainSetupProps {
  filledCount: number;
  mode: TrainMode;
  onModeChange: (mode: TrainMode) => void;
  onStart: () => void;
}

export default function TrainSetup({ filledCount, mode, onModeChange, onStart }: TrainSetupProps) {
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
