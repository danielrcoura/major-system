import { getResultEmoji } from '../utils/trainUtils';

export default function ResultScreen({ mode, score, totalRounds, totalCards, onRetry }) {
  const isFlash = mode === 'flashCards';

  let title;
  let scoreText;

  if (isFlash) {
    title = '🃏 Flash Cards Concluído';
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
    </div>
  );
}
