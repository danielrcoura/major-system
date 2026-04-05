import type { DeckEntry, DeckData } from './types';

const DECK_ENTRY_FIELDS = ['persona', 'action', 'object', 'image'] as const;

export function validateDeckEntry(entry: unknown): entry is DeckEntry {
  if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) {
    return false;
  }
  const record = entry as Record<string, unknown>;
  return DECK_ENTRY_FIELDS.every(
    (field) => typeof record[field] === 'string'
  );
}

const VALID_KEY_REGEX = /^[0-9]{2}$/;

export function validateDeckData(data: unknown): data is DeckData {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return false;
  }
  const record = data as Record<string, unknown>;
  return Object.entries(record).every(([key, value]) => {
    if (!VALID_KEY_REGEX.test(key)) return false;
    const num = parseInt(key, 10);
    if (num < 0 || num > 99) return false;
    return validateDeckEntry(value);
  });
}
