import { TrainMode } from '../types';

interface ResultScreenProps {
  mode: TrainMode;
  totalCards: number;
  onRetry: () => void;
  onBackToSetup?: () => void;
}

export default function ResultScreen({ mode, totalCards, onRetry, onBackToSetup }: ResultScreenProps) {
  const isRange = mode === 'rangeTrain';
  const title = isRange ? '🎯 Treino por Range Concluído' : '🃏 Flash Cards Concluído';
  const scoreText = `Você revisou ${totalCards} cartas.`;

  return (
    <div className="train-panel">
      <div className="result-box">
        <h2>{title}</h2>
        <p>{scoreText}</p>
      </div>
      <button className="btn-start" onClick={onRetry}>
        Treinar Novamente
      </button>
      {onBackToSetup && (
        <button className="btn-start" style={{ marginTop: '0.5rem' }} onClick={onBackToSetup}>
          Voltar à Configuração
        </button>
      )}
    </div>
  );
}
