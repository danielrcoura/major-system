import { useMemo } from 'react';
import { useDeckData } from './useDeckData';
import { getPendingCards, type PendingCard } from '../domain/reviewService';
import { createFSRSRepository } from '../domain/fsrsRepository';

const repo = createFSRSRepository();

export interface UsePendingReviewsReturn {
  pendingCount: number;
  pendingCards: PendingCard[];
}

export function usePendingReviews(): UsePendingReviewsReturn {
  const { data } = useDeckData();

  const pendingCards = useMemo(
    () => getPendingCards(data, repo),
    [data],
  );

  return {
    pendingCount: pendingCards.length,
    pendingCards,
  };
}
