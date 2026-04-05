import { describe, it, expect } from 'vitest';
import { validateDeckEntry, validateDeckData } from './validator';

describe('validateDeckEntry', () => {
  it('returns true for a valid DeckEntry', () => {
    expect(validateDeckEntry({ persona: 'a', action: 'b', object: 'c', image: 'd' })).toBe(true);
  });

  it('returns true for empty strings', () => {
    expect(validateDeckEntry({ persona: '', action: '', object: '', image: '' })).toBe(true);
  });

  it('returns false when a field is missing', () => {
    expect(validateDeckEntry({ persona: 'a', action: 'b', object: 'c' })).toBe(false);
  });

  it('returns false when a field is not a string', () => {
    expect(validateDeckEntry({ persona: 1, action: 'b', object: 'c', image: 'd' })).toBe(false);
  });

  it('returns false for null', () => {
    expect(validateDeckEntry(null)).toBe(false);
  });

  it('returns false for an array', () => {
    expect(validateDeckEntry([1, 2, 3])).toBe(false);
  });

  it('returns false for a primitive', () => {
    expect(validateDeckEntry('hello')).toBe(false);
  });

  it('returns true even with extra fields', () => {
    expect(validateDeckEntry({ persona: 'a', action: 'b', object: 'c', image: 'd', extra: 42 })).toBe(true);
  });
});

describe('validateDeckData', () => {
  it('returns true for an empty object', () => {
    expect(validateDeckData({})).toBe(true);
  });

  it('returns true for valid keys and entries', () => {
    const data = {
      '00': { persona: 'a', action: 'b', object: 'c', image: 'd' },
      '99': { persona: 'e', action: 'f', object: 'g', image: 'h' },
    };
    expect(validateDeckData(data)).toBe(true);
  });

  it('returns false for a key outside 00-99 range', () => {
    const data = {
      '100': { persona: 'a', action: 'b', object: 'c', image: 'd' },
    };
    expect(validateDeckData(data)).toBe(false);
  });

  it('returns false for a non-numeric key', () => {
    const data = {
      abc: { persona: 'a', action: 'b', object: 'c', image: 'd' },
    };
    expect(validateDeckData(data)).toBe(false);
  });

  it('returns false for a single-digit key without leading zero', () => {
    const data = {
      '5': { persona: 'a', action: 'b', object: 'c', image: 'd' },
    };
    expect(validateDeckData(data)).toBe(false);
  });

  it('returns false when a value is not a valid DeckEntry', () => {
    const data = {
      '01': { persona: 'a', action: 'b' },
    };
    expect(validateDeckData(data)).toBe(false);
  });

  it('returns false for null', () => {
    expect(validateDeckData(null)).toBe(false);
  });

  it('returns false for an array', () => {
    expect(validateDeckData([])).toBe(false);
  });
});
