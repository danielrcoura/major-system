import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { LocalStorageRepository } from './localStorageRepository';
import type { DeckEntry, DeckData } from './types';

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

const arbitraryDeckData: fc.Arbitrary<DeckData> = fc
  .array(fc.tuple(arbitraryDeckKey, arbitraryDeckEntry), { maxLength: 20 })
  .map((pairs) => Object.fromEntries(pairs));

// --- Setup ---

let repo: LocalStorageRepository;

beforeEach(() => {
  localStorage.clear();
  repo = new LocalStorageRepository();
});

// Feature: domain-layer-extraction, Property 1: LocalStorageRepository round-trip
// **Validates: Requirements 2.1, 2.2**
describe('Property 1: LocalStorageRepository round-trip', () => {
  it('importAll then getAll returns equivalent DeckData', () => {
    fc.assert(
      fc.property(arbitraryDeckData, (data) => {
        localStorage.clear();
        const freshRepo = new LocalStorageRepository();
        freshRepo.importAll(data);
        const retrieved = freshRepo.getAll();
        expect(retrieved).toEqual(data);
      }),
      { numRuns: 100 },
    );
  });
});

// Feature: domain-layer-extraction, Property 2: saveCard updates persisted data
// **Validates: Requirements 2.5**
describe('Property 2: saveCard updates persisted data', () => {
  it('saveCard updates the target key and preserves all other entries', () => {
    fc.assert(
      fc.property(
        arbitraryDeckData,
        arbitraryDeckKey,
        arbitraryDeckEntry,
        (existingData, key, newEntry) => {
          localStorage.clear();
          const freshRepo = new LocalStorageRepository();
          freshRepo.importAll(existingData);

          freshRepo.saveCard(key, newEntry);
          const result = freshRepo.getAll();

          // The saved key should have the new entry
          expect(result[key]).toEqual(newEntry);

          // All other entries should remain unchanged
          for (const k of Object.keys(existingData)) {
            if (k !== key) {
              expect(result[k]).toEqual(existingData[k]);
            }
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});

// Feature: domain-layer-extraction, Property 3: importAll replaces all data
// **Validates: Requirements 2.6**
describe('Property 3: importAll replaces all data', () => {
  it('importAll with new data leaves no traces of old data', () => {
    fc.assert(
      fc.property(
        arbitraryDeckData,
        arbitraryDeckData,
        (oldData, newData) => {
          localStorage.clear();
          const freshRepo = new LocalStorageRepository();
          freshRepo.importAll(oldData);
          freshRepo.importAll(newData);
          const result = freshRepo.getAll();
          expect(result).toEqual(newData);
        },
      ),
      { numRuns: 100 },
    );
  });
});
