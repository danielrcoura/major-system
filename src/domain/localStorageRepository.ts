import type { DeckData, DeckEntry } from './types';
import type { Repository } from './repository';

export class LocalStorageRepository implements Repository {
  private readonly storageKey = 'pao-major-system';

  getAll(): DeckData {
    const raw = localStorage.getItem(this.storageKey);
    if (raw === null) return {};
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {};
      return parsed as DeckData;
    } catch {
      return {};
    }
  }

  getOne(key: string): DeckEntry | undefined {
    return this.getAll()[key];
  }

  saveCard(key: string, entry: DeckEntry): void {
    const data = this.getAll();
    data[key] = entry;
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  importAll(data: DeckData): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }
}
