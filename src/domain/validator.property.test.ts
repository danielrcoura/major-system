import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateDeckEntry, validateDeckData } from './validator';
import type { DeckEntry } from './types';

// --- Generators ---

const arbitraryDeckEntry: fc.Arbitrary<DeckEntry> = fc.record({
  persona: fc.string(),
  action: fc.string(),
  object: fc.string(),
  image: fc.string(),
});

const arbitraryDeckKey: fc.Arbitrary<string> = fc
  .integer({ min: 0, max: 99 })
  .map((n) => n.toString().padStart(2, '0'));

const arbitraryDeckData: fc.Arbitrary<Record<string, DeckEntry>> = fc
  .array(fc.tuple(arbitraryDeckKey, arbitraryDeckEntry), { maxLength: 20 })
  .map((pairs) => Object.fromEntries(pairs));

const DECK_ENTRY_FIELDS = ['persona', 'action', 'object', 'image'] as const;

const arbitraryInvalidDeckEntry: fc.Arbitrary<unknown> = fc.oneof(
  // Missing one required field
  fc
    .tuple(
      fc.integer({ min: 0, max: 3 }),
      fc.string(),
      fc.string(),
      fc.string(),
      fc.string(),
    )
    .map(([dropIdx, s1, s2, s3, s4]) => {
      const values = [s1, s2, s3, s4];
      const obj: Record<string, string> = {};
      let vi = 0;
      for (let i = 0; i < 4; i++) {
        if (i !== dropIdx) {
          obj[DECK_ENTRY_FIELDS[i]] = values[vi++];
        }
      }
      return obj;
    }),
  // One field has wrong type (number instead of string)
  fc
    .tuple(
      fc.integer({ min: 0, max: 3 }),
      fc.string(),
      fc.string(),
      fc.string(),
      fc.integer(),
    )
    .map(([fieldIdx, s1, s2, s3, num]) => {
      const values: (string | number)[] = [s1, s2, s3];
      const obj: Record<string, string | number> = {};
      let vi = 0;
      for (let i = 0; i < 4; i++) {
        if (i === fieldIdx) {
          obj[DECK_ENTRY_FIELDS[i]] = num;
        } else {
          obj[DECK_ENTRY_FIELDS[i]] = values[vi++] as string;
        }
      }
      return obj;
    }),
  // Primitives and null
  fc.oneof(fc.constant(null), fc.constant(undefined), fc.integer(), fc.boolean()),
  // Arrays
  fc.array(fc.anything(), { maxLength: 5 }),
);

/**
 * Feature: domain-layer-extraction, Property 7: Validation correctness
 * Validates: Requirements 5.1, 5.2
 */
describe('Property 7: Validation correctness', () => {
  // Feature: domain-layer-extraction, Property 7: Validation correctness

  it('validateDeckEntry returns true for any valid DeckEntry', () => {
    fc.assert(
      fc.property(arbitraryDeckEntry, (entry) => {
        expect(validateDeckEntry(entry)).toBe(true);
      }),
      { numRuns: 100 },
    );
  });

  it('validateDeckEntry returns false for any invalid entry', () => {
    fc.assert(
      fc.property(arbitraryInvalidDeckEntry, (invalid) => {
        expect(validateDeckEntry(invalid)).toBe(false);
      }),
      { numRuns: 100 },
    );
  });

  it('validateDeckData returns true for any valid DeckData', () => {
    fc.assert(
      fc.property(arbitraryDeckData, (data) => {
        expect(validateDeckData(data)).toBe(true);
      }),
      { numRuns: 100 },
    );
  });

  it('validateDeckData returns false when a key is outside 00-99 range', () => {
    fc.assert(
      fc.property(
        arbitraryDeckData,
        arbitraryDeckEntry,
        fc.oneof(
          // 3-digit numeric string
          fc.integer({ min: 100, max: 999 }).map(String),
          // single digit without leading zero
          fc.integer({ min: 0, max: 9 }).map(String),
          // non-numeric string
          fc.string({ minLength: 1 }).filter((s) => !/^\d{2}$/.test(s) || parseInt(s, 10) > 99),
        ),
        (validData, entry, badKey) => {
          const data = { ...validData, [badKey]: entry };
          expect(validateDeckData(data)).toBe(false);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('validateDeckData returns false when a value fails validateDeckEntry', () => {
    fc.assert(
      fc.property(
        arbitraryDeckKey,
        arbitraryInvalidDeckEntry,
        (key, invalidEntry) => {
          const data = { [key]: invalidEntry };
          expect(validateDeckData(data)).toBe(false);
        },
      ),
      { numRuns: 100 },
    );
  });
});
