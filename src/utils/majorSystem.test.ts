import { describe, it, expect } from 'vitest';
import { MAJOR, getConsonants, extractMajorConsonants } from './majorSystem';

describe('MAJOR constant', () => {
  it('maps all 10 digits (0–9)', () => {
    for (let d = 0; d <= 9; d++) {
      expect(MAJOR[d]).toBeDefined();
      expect(Array.isArray(MAJOR[d])).toBe(true);
      expect(MAJOR[d].length).toBeGreaterThan(0);
    }
  });

  it('contains the correct mappings', () => {
    expect(MAJOR[0]).toEqual(['s', 'z']);
    expect(MAJOR[1]).toEqual(['t', 'd', 'th']);
    expect(MAJOR[2]).toEqual(['n']);
    expect(MAJOR[3]).toEqual(['m']);
    expect(MAJOR[4]).toEqual(['r']);
    expect(MAJOR[5]).toEqual(['l']);
    expect(MAJOR[6]).toEqual(['j', 'ch', 'sh']);
    expect(MAJOR[7]).toEqual(['g', 'c', 'k', 'q', 'ck']);
    expect(MAJOR[8]).toEqual(['v', 'f', 'ph']);
    expect(MAJOR[9]).toEqual(['p', 'b']);
  });
});

describe('getConsonants', () => {
  it('returns correct consonants for 00', () => {
    const result = getConsonants(0);
    expect(result.first).toEqual(['s', 'z']);
    expect(result.second).toEqual(['s', 'z']);
    expect(result.label).toBe('0=s/z + 0=s/z');
  });

  it('returns correct consonants for 42', () => {
    const result = getConsonants(42);
    expect(result.first).toEqual(['r']);
    expect(result.second).toEqual(['n']);
    expect(result.label).toBe('4=r + 2=n');
  });

  it('returns correct consonants for 99', () => {
    const result = getConsonants(99);
    expect(result.first).toEqual(['p', 'b']);
    expect(result.second).toEqual(['p', 'b']);
    expect(result.label).toBe('9=p/b + 9=p/b');
  });

  it('returns correct consonants for 17 (includes multi-char sounds)', () => {
    const result = getConsonants(17);
    expect(result.first).toEqual(['t', 'd', 'th']);
    expect(result.second).toEqual(['g', 'c', 'k', 'q', 'ck']);
  });
});

describe('extractMajorConsonants', () => {
  it('extracts single consonants', () => {
    expect(extractMajorConsonants('Sam')).toEqual(['s', 'm']);
  });

  it('handles multi-char sound "th"', () => {
    expect(extractMajorConsonants('Thor')).toEqual(['th', 'r']);
  });

  it('handles multi-char sound "ch"', () => {
    expect(extractMajorConsonants('Chuck')).toEqual(['ch', 'ck']);
  });

  it('handles multi-char sound "sh"', () => {
    expect(extractMajorConsonants('Shrek')).toEqual(['sh', 'r', 'k']);
  });

  it('handles multi-char sound "ck"', () => {
    expect(extractMajorConsonants('Jack')).toEqual(['j', 'ck']);
  });

  it('handles multi-char sound "ph"', () => {
    expect(extractMajorConsonants('Phil')).toEqual(['ph', 'l']);
  });

  it('ignores vowels and non-major consonants', () => {
    // 'h', 'w', 'y', 'x' are not in the Major System
    expect(extractMajorConsonants('Howie')).toEqual([]);
  });

  it('strips non-alpha characters', () => {
    expect(extractMajorConsonants('Mr. T!')).toEqual(['m', 'r', 't']);
  });

  it('returns empty array for empty string', () => {
    expect(extractMajorConsonants('')).toEqual([]);
  });

  it('is case-insensitive', () => {
    expect(extractMajorConsonants('SAM')).toEqual(extractMajorConsonants('sam'));
  });
});
