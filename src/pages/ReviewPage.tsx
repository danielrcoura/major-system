import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { usePendingReviews } from '../hooks/usePendingReviews';
import { useReviewSession } from '../hooks/useReviewSession';
import ReviewCard from '../components/ReviewCard';
import ReviewResultScreen from '../components/ReviewResultScreen';

export default function ReviewPage() {
  const navigate = useNavigate();
  const { pendingCards } = usePendingReviews();
  const { currentCard, isFlipped, progress, flip, rate, isComplete, totalReviewed } =
    useReviewSession(pendingCards);

  useEffect(() => {
    if (pendingCards.length === 0) {
      navigate('/', { replace: true });
    }
  }, [pendingCards.length, navigate]);

  if (pendingCards.length === 0) return null;

  if (isComplete) {
    return (
      <main className="train-panel">
        <ReviewResultScreen
          totalReviewed={totalReviewed}
          onReviewAgain={() => navigate(0)}
          onBackToDeck={() => navigate('/')}
        />
      </main>
    );
  }

  return (
    <main className="train-panel">
      <p className="progress-text">
        {progress.current} / {progress.total}
      </p>
      {currentCard && (
        <ReviewCard
          card={currentCard}
          isFlipped={isFlipped}
          onFlip={flip}
          onRate={rate}
        />
      )}
    </main>
  );
}
