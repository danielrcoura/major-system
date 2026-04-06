import { Rating } from 'ts-fsrs';
import type { PendingCard } from '../domain/reviewService';

interface ReviewCardProps {
  card: PendingCard;
  isFlipped: boolean;
  onFlip: () => void;
  onRate: (rating: Rating) => void;
}

const ratingButtons: { label: string; rating: Rating }[] = [
  { label: 'Again', rating: Rating.Again },
  { label: 'Hard', rating: Rating.Hard },
  { label: 'Good', rating: Rating.Good },
  { label: 'Easy', rating: Rating.Easy },
];

export default function ReviewCard({ card, isFlipped, onFlip, onRate }: ReviewCardProps) {
  return (
    <div className="review-card-wrapper">
      <div
        className={`flash-card${isFlipped ? ' flipped' : ''}`}
        onClick={!isFlipped ? onFlip : undefined}
        role="button"
        tabIndex={0}
        aria-label={isFlipped ? 'Card revelado' : 'Clique para revelar'}
        onKeyDown={(e) => {
          if (!isFlipped && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onFlip();
          }
        }}
      >
        <div className="flash-front">
          <span className="flash-number">{card.key}</span>
        </div>
        <div className="flash-back">
          <div className="flash-art">
            {card.entry.image ? (
              <img
                src={card.entry.image}
                alt={card.entry.persona}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  if (e.currentTarget.parentElement) {
                    e.currentTarget.parentElement.innerHTML = '<span>🧑</span>';
                  }
                }}
              />
            ) : (
              <span>🧑</span>
            )}
          </div>
          <div className="flash-name">{card.entry.persona}</div>
        </div>
      </div>

      {isFlipped && (
        <div className="rating-buttons">
          {ratingButtons.map(({ label, rating }) => (
            <button
              key={label}
              className={`btn-rating btn-rating-${label.toLowerCase()}`}
              onClick={() => onRate(rating)}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {!isFlipped && (
        <p className="instruction">Clique na carta para revelar</p>
      )}
    </div>
  );
}
