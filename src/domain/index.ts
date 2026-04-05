import type { DeckData, DeckEntry } from './types';
import type { Repository } from './repository';
import { exportDeck, importDeck } from './serializer';
import { LocalStorageRepository } from './localStorageRepository';

export interface DeckCoreAPI {
  getAll(): DeckData;
  getOne(key: string): DeckEntry | undefined;
  saveCard(key: string, entry: DeckEntry): void;
  importCards(json: string): void;
  exportCards(): string;
}

export function createDeckCore(repo: Repository): DeckCoreAPI {
  return {
    getAll: () => repo.getAll(),
    getOne: (key) => repo.getOne(key),
    saveCard: (key, entry) => repo.saveCard(key, entry),
    importCards(json: string): void {
      const result = importDeck(json);
      if (!result.success) {
        throw new Error(result.error);
      }
      repo.importAll(result.data);
    },
    exportCards(): string {
      return exportDeck(repo.getAll());
    },
  };
}

export const deckCore: DeckCoreAPI = createDeckCore(new LocalStorageRepository());

export type { DeckEntry, DeckData, ImportResult } from './types';
export type { Repository } from './repository';
