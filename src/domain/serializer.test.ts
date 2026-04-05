import { describe, it, expect } from 'vitest';
import { exportDeck, importDeck } from './serializer';
import type { DeckData } from './types';

describe('exportDeck', () => {
  it('serializes DeckData with 2-space indentation', () => {
    const data: DeckData = {
      '00': { persona: 'a', action: 'b', object: 'c', image: 'd' },
    };
    expect(exportDeck(data)).toBe(JSON.stringify(data, null, 2));
  });

  it('serializes an empty DeckData', () => {
    expect(exportDeck({})).toBe('{}');
  });
});

describe('importDeck', () => {
  it('returns success for valid DeckData JSON', () => {
    const data: DeckData = {
      '00': { persona: 'a', action: 'b', object: 'c', image: 'd' },
      '42': { persona: 'e', action: 'f', object: 'g', image: 'h' },
    };
    const json = JSON.stringify(data);
    const result = importDeck(json);
    expect(result).toEqual({ success: true, data });
  });

  it('returns success for empty object JSON', () => {
    const result = importDeck('{}');
    expect(result).toEqual({ success: true, data: {} });
  });

  it('returns failure for malformed JSON', () => {
    const result = importDeck('not json at all');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeTruthy();
    }
  });

  it('returns failure for valid JSON with invalid DeckData structure', () => {
    const result = importDeck('{"abc": {"persona": "a"}}');
    expect(result.success).toBe(false);
  });

  it('returns failure for JSON array', () => {
    const result = importDeck('[1, 2, 3]');
    expect(result.success).toBe(false);
  });

  it('returns failure for JSON with key out of range', () => {
    const json = JSON.stringify({ '100': { persona: 'a', action: 'b', object: 'c', image: 'd' } });
    const result = importDeck(json);
    expect(result.success).toBe(false);
  });

  it('returns failure for JSON with missing DeckEntry fields', () => {
    const json = JSON.stringify({ '01': { persona: 'a', action: 'b' } });
    const result = importDeck(json);
    expect(result.success).toBe(false);
  });

  it('round-trips correctly with exportDeck', () => {
    const data: DeckData = {
      '05': { persona: 'p', action: 'a', object: 'o', image: 'i' },
    };
    const result = importDeck(exportDeck(data));
    expect(result).toEqual({ success: true, data });
  });
});
