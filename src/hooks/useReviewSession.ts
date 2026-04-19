import { useState, useCallback, useRef } from 'react';
import type { Rating } from 'ts-fsrs';
import { processRating, type PendingCard } from '../domain/reviewService';
import { createFSRSRepository } from '../domain/fsrsRepository';

const repo = createFSRSRepository();
const FLIP_ANIMATION_MS = 500;

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
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    timerRef.current = setTimeout(() => {
      setCurrentIndex((i) => i + 1);
    }, FLIP_ANIMATION_MS);
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
