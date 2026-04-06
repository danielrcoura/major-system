import type { Card, ReviewLog } from 'ts-fsrs';
import { serializeFSRSStore, deserializeFSRSStore } from './fsrsSerializer';

export interface FSRSRepository {
  getCard(key: string): Card | null;
  getAllCards(): Record<string, Card>;
  saveReview(key: string, card: Card, log: ReviewLog): void;
  loadAll(): { cards: Record<string, Card>; logs: Record<string, ReviewLog[]> };
}

const STORAGE_KEY = 'fsrs-data';

function loadStore(): { cards: Record<string, Card>; logs: Record<string, ReviewLog[]> } {
  const empty = { cards: {}, logs: {} };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return empty;
    return deserializeFSRSStore(raw) ?? empty;
  } catch {
    return empty;
  }
}

function saveStore(data: { cards: Record<string, Card>; logs: Record<string, ReviewLog[]> }): void {
  try {
    localStorage.setItem(STORAGE_KEY, serializeFSRSStore(data));
  } catch {
    // Silently fail (e.g. quota exceeded, private mode)
  }
}

export function createFSRSRepository(): FSRSRepository {
  return {
    getCard(key: string): Card | null {
      return loadStore().cards[key] ?? null;
    },

    getAllCards(): Record<string, Card> {
      return loadStore().cards;
    },

    saveReview(key: string, card: Card, log: ReviewLog): void {
      const store = loadStore();
      store.cards[key] = card;
      if (!store.logs[key]) {
        store.logs[key] = [];
      }
      store.logs[key].push(log);
      saveStore(store);
    },

    loadAll(): { cards: Record<string, Card>; logs: Record<string, ReviewLog[]> } {
      return loadStore();
    },
  };
}
