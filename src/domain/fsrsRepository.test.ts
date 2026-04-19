import { describe, it, expect, beforeEach } from 'vitest';
import { createEmptyCard, type Card, type ReviewLog, Rating, State } from 'ts-fsrs';
import { createFSRSRepository } from './fsrsRepository';

describe('FSRSRepository.importAll', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('replaces all FSRS data', () => {
    const repo = createFSRSRepository();
    const existingCard = createEmptyCard();
    repo.saveReview('01', existingCard, {
      rating: Rating.Good,
      state: State.New,
      due: new Date('2026-01-01'),
      stability: 0,
      difficulty: 0,
      elapsed_days: 0,
      last_elapsed_days: 0,
      scheduled_days: 0,
      learning_steps: 0,
      review: new Date('2026-01-01'),
    } as ReviewLog);

    const newCard: Card = { ...createEmptyCard(), stability: 99 };
    repo.importAll({
      cards: { '50': newCard },
      logs: {},
    });

    const store = repo.loadAll();
    expect(store.cards['01']).toBeUndefined();
    expect(store.cards['50'].stability).toBe(99);
    expect(store.logs['01']).toBeUndefined();
  });
});
