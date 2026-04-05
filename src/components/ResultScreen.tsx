import { getResultEmoji } from '../utils/trainUtils';
import { TrainMode } from '../types';

interface ResultScreenProps {
  mode: TrainMode;
  score: number;
  totalRounds: number;
  totalCards: number;
  onRetry: () => void;
  onBackToSetup?: () => void;
}

export default function ResultScreen({ mode, score, totalRounds, totalCards, onRetry, onBackToSetup }: ResultScreenProps) {
  const isFlash = mode === 'flashCards';
  const isRange = mode === 'rangeTrain';

  let title: string;
  let scoreText: string;

  if (isFlash || isRange) {
    title = isRange ? '🎯 Treino por Range Concluído' : '🃏 Flash Cards Concluído';
    scoreText = `Você revisou ${totalCards} cartas.`;
  } else {
    const emoji = getResultEmoji(score, totalRounds);
    const pct = Math.round((score / totalRounds) * 100);
    title = `${emoji} Treino Concluído`;
    scoreText = `Acertos perfeitos: ${score} / ${totalRounds} (${pct}%)`;
  }

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
