import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { deckDataReducer, DeckState } from './DeckDataContext';
import { DeckEntry, DeckData } from '../types';

const STORAGE_KEY = 'pao-major-system';


// Arbitrary for a valid CardEntry
const cardEntryArb: fc.Arbitrary<DeckEntry> = fc.record({
  persona: fc.string({ minLength: 1, maxLength: 50 }),
  action: fc.string({ maxLength: 50 }),
  object: fc.string({ maxLength: 50 }),
  image: fc.string({ maxLength: 200 }),
});

// Arbitrary for a valid card number (00–99)
const cardNumArb: fc.Arbitrary<string> = fc.integer({ min: 0, max: 99 }).map((n) => String(n).padStart(2, '0'));

/**
 * Feature: react-migration, Property 3: Round-trip de persistência no LocalStorage
 * Validates: Requirements 3.4, 12.1, 12.2
 */
describe('Property 3: Round-trip de persistência no LocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('for any valid CardEntry, saving via reducer and reading from localStorage produces equivalent data', () => {
    fc.assert(
      fc.property(
        cardNumArb,
        cardEntryArb,
        (num, entry) => {
          localStorage.clear();
          const initialState: DeckState = { data: {} };

          const newState = deckDataReducer(initialState, {
            type: 'SAVE_CARD',
            num,
            entry,
          });

          // State should contain the saved card
          expect(newState.data[num]).toEqual(entry);

          // LocalStorage should contain the same data
          const stored: DeckData = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
          expect(stored[num]).toEqual(entry);

          // Round-trip: what's in state matches what's in localStorage
          expect(newState.data).toEqual(stored);
        }
      ),
      { numRuns: 100 }
    );
  });
});


// Arbitrary for a valid DeckData object (Record<string, CardEntry>)
const deckDataArb: fc.Arbitrary<DeckData> = fc
  .uniqueArray(fc.integer({ min: 0, max: 99 }), { minLength: 0, maxLength: 20 })
  .chain((nums) =>
    fc.tuple(
      fc.constant(nums.map((n) => String(n).padStart(2, '0'))),
      fc.array(cardEntryArb, { minLength: nums.length, maxLength: nums.length })
    )
  )
  .map(([nums, entries]) => {
    const data: DeckData = {};
    nums.forEach((num, i) => {
      data[num] = entries[i];
    });
    return data;
  });

/**
 * Feature: react-migration, Property 4: Round-trip de importação de dados
 * Validates: Requirements 5.2, 12.3
 */
describe('Property 4: Round-trip de importação de dados', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('for any valid DeckData, importing and then reading state produces equivalent data', () => {
    fc.assert(
      fc.property(
        deckDataArb,
        (importedData) => {
          const initialState: DeckState = { data: { '00': { persona: 'old', action: '', object: '', image: '' } } };

          const newState = deckDataReducer(initialState, {
            type: 'IMPORT_DATA',
            data: importedData,
          });

          // State should exactly match the imported data
          expect(newState.data).toEqual(importedData);
        }
      ),
      { numRuns: 100 }
    );
  });
});
