import { useNavigate } from 'react-router';

interface ReviewCalloutProps {
  pendingCount: number;
}

export default function ReviewCallout({ pendingCount }: ReviewCalloutProps) {
  const navigate = useNavigate();

  if (pendingCount <= 0) return null;

  return (
    <div className="review-callout">
      <span className="review-callout-icon" aria-hidden="true">🔔</span>
      <div className="review-callout-content">
        <span>
          {pendingCount === 1
            ? '1 card pendente de revisão'
            : `${pendingCount} cards pendentes de revisão`}
        </span>
        <button
          className="btn-review-now"
          onClick={() => navigate('/revisao')}
        >
          Revisar agora
        </button>
      </div>
    </div>
  );
}
