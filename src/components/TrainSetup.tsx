import { TrainMode } from '../types';

const MODE_DESCRIPTIONS: Record<TrainMode, string> = {
  flashCards:
    'Veja o número, clique para revelar o personagem. Revise todos os cartões preenchidos.',
  rangeTrain:
    'Filtre por range ou dígito e pratique com flashcards na direção escolhida.',
};

interface ModeOption {
  key: TrainMode;
  label: string;
}

const MODES: ModeOption[] = [
  { key: 'flashCards', label: 'Flash Cards' },
  { key: 'rangeTrain', label: 'Treino por Range' },
];

interface TrainSetupProps {
  filledCount: number;
  mode: TrainMode;
  onModeChange: (mode: TrainMode) => void;
  onStart: () => void;
}

export default function TrainSetup({ filledCount, mode, onModeChange, onStart }: TrainSetupProps) {
  const enabled = filledCount >= 1;

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
