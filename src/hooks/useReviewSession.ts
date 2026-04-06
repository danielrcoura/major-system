import { useState, useCallback } from 'react';
import type { Rating } from 'ts-fsrs';
import { processRating, type PendingCard } from '../domain/reviewService';
import { createFSRSRepository } from '../domain/fsrsRepository';

const repo = createFSRSRepository();

export interface UseReviewSessionReturn {
  currentCard: PendingCard | null;
  isFlipped: boolean;
  progress: { current: number; total: number };
  flip: () => void;
  rate: (rating: Rating) => void;
  isComplete: boolean;
  totalReviewed: number;
}

export function useReviewSession(pendingCards: PendingCard[]): UseReviewSessionReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const total = pendingCards.length;
  const isComplete = currentIndex >= total;
  const currentCard = isComplete ? null : pendingCards[currentIndex];

  const flip = useCallback(() => {
    setIsFlipped(true);
  }, []);

  const rate = useCallback((rating: Rating) => {
    if (currentIndex >= total) return;
    const card = pendingCards[currentIndex];
    processRating(card.key, card.fsrsCard, rating, repo);
    setIsFlipped(false);
    setCurrentIndex((i) => i + 1);
  }, [currentIndex, total, pendingCards]);

  return {
    currentCard,
    isFlipped,
    progress: { current: Math.min(currentIndex + 1, total), total },
    flip,
    rate,
    isComplete,
    totalReviewed: Math.min(currentIndex, total),
  };
}
