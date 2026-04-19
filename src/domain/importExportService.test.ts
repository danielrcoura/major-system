import { describe, it, expect } from 'vitest';
import { createEmptyCard, type Card, type ReviewLog, Rating, State } from 'ts-fsrs';
import { exportAll, importAll } from './importExportService';
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

describe('importAll', () => {
  it('rejects malformed JSON', () => {
    const deckRepo = makeDeckRepo({});
    const fsrsRepo = makeFSRSRepo({}, {});
    const result = importAll('not json', deckRepo, fsrsRepo);
    expect(result).toEqual({ success: false, error: expect.stringContaining('JSON') });
  });

  it('rejects missing version', () => {
    const json = JSON.stringify({ deck: {}, fsrs: { cards: {}, logs: {} } });
    const deckRepo = makeDeckRepo({});
    const fsrsRepo = makeFSRSRepo({}, {});
    const result = importAll(json, deckRepo, fsrsRepo);
    expect(result).toEqual({ success: false, error: expect.stringContaining('versão') });
  });

  it('rejects invalid deck structure', () => {
    const json = JSON.stringify({ version: 2, deck: { bad: 'data' }, fsrs: { cards: {}, logs: {} } });
    const deckRepo = makeDeckRepo({});
    const fsrsRepo = makeFSRSRepo({}, {});
    const result = importAll(json, deckRepo, fsrsRepo);
    expect(result).toEqual({ success: false, error: expect.stringContaining('deck') });
  });

  it('rejects invalid FSRS structure', () => {
    const json = JSON.stringify({ version: 2, deck: {}, fsrs: 'bad' });
    const deckRepo = makeDeckRepo({});
    const fsrsRepo = makeFSRSRepo({}, {});
    const result = importAll(json, deckRepo, fsrsRepo);
    expect(result).toEqual({ success: false, error: expect.stringContaining('FSRS') });
  });

  it('imports valid v2 data into both repos', () => {
    const card = createEmptyCard();
    const exported = exportAll(
      makeDeckRepo({ '01': { persona: 'P', action: 'A', object: 'O', image: 'I' } }),
      makeFSRSRepo({ '01': card }, {}),
    );

    let importedDeck: DeckData = {};
    let importedFSRS: { cards: Record<string, Card>; logs: Record<string, ReviewLog[]> } = { cards: {}, logs: {} };

    const deckRepo: Repository = {
      getAll: () => ({}),
      getOne: () => undefined,
      saveCard: () => {},
      importAll: (data) => { importedDeck = data; },
    };
    const fsrsRepo: FSRSRepository = {
      getCard: () => null,
      getAllCards: () => ({}),
      saveReview: () => {},
      loadAll: () => ({ cards: {}, logs: {} }),
      importAll: (data) => { importedFSRS = data; },
    };

    const result = importAll(exported, deckRepo, fsrsRepo);
    expect(result).toEqual({ success: true });
    expect(importedDeck['01'].persona).toBe('P');
    expect(importedFSRS.cards['01']).toBeDefined();
  });
});
