interface ReviewResultScreenProps {
  totalReviewed: number;
  onReviewAgain: () => void;
  onBackToDeck: () => void;
}

export default function ReviewResultScreen({
  totalReviewed,
  onReviewAgain,
  onBackToDeck,
}: ReviewResultScreenProps) {
  return (
    <div className="train-panel">
      <div className="result-box">
        <h2>📝 Revisão Concluída</h2>
        <p>Você revisou {totalReviewed} {totalReviewed === 1 ? 'card' : 'cards'}.</p>
      </div>
      <button className="btn-start" onClick={onReviewAgain}>
        Revisar novamente
      </button>
      <button className="btn-start" style={{ marginTop: '0.5rem' }} onClick={onBackToDeck}>
        Voltar ao deck
      </button>
    </div>
  );
}
