import { DeckData, DeckEntry } from './types';

export interface Repository {
  getAll(): DeckData;
  getOne(key: string): DeckEntry | undefined;
  saveCard(key: string, entry: DeckEntry): void;
  importAll(data: DeckData): void;
}
