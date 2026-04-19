import { describe, it, expect } from 'vitest';
import { createEmptyCard, type Card, type ReviewLog, Rating, State } from 'ts-fsrs';
import { exportAll } from './importExportService';
import type { DeckData } from './types';
import type { Repository } from './repository';
import type { FSRSRepository } from './fsrsRepository';

function makeDeckRepo(data: DeckData): Repository {
  return {
    getAll: () => data,
    getOne: (key) => data[key],
    saveCard: () => {},
    importAll: () => {},
  };
}

function makeFSRSRepo(
  cards: Record<string, Card>,
  logs: Record<string, ReviewLog[]>,
): FSRSRepository {
  return {
    getCard: (key) => cards[key] ?? null,
    getAllCards: () => cards,
    saveReview: () => {},
    loadAll: () => ({ cards, logs }),
    importAll: () => {},
  };
}

describe('exportAll', () => {
  it('produces v2 JSON with deck and fsrs data', () => {
    const deck: DeckData = {
      '00': { persona: 'P', action: 'A', object: 'O', image: 'I' },
    };
    const card = createEmptyCard();
    const deckRepo = makeDeckRepo(deck);
    const fsrsRepo = makeFSRSRepo({ '00': card }, {});

    const json = exportAll(deckRepo, fsrsRepo);
    const parsed = JSON.parse(json);

    expect(parsed.version).toBe(2);
    expect(parsed.deck).toEqual(deck);
    expect(parsed.fsrs.cards['00']).toBeDefined();
    expect(parsed.fsrs.cards['00'].due).toBeTypeOf('string');
  });

  it('handles empty repositories', () => {
    const json = exportAll(makeDeckRepo({}), makeFSRSRepo({}, {}));
    const parsed = JSON.parse(json);
    expect(parsed).toEqual({ version: 2, deck: {}, fsrs: { cards: {}, logs: {} } });
  });

  it('includes review logs in export', () => {
    const card = createEmptyCard();
    const log: ReviewLog = {
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
    } as ReviewLog;
    const json = exportAll(makeDeckRepo({}), makeFSRSRepo({ '00': card }, { '00': [log] }));
    const parsed = JSON.parse(json);
    expect(parsed.fsrs.logs['00']).toHaveLength(1);
  });
});
