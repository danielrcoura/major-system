import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  shuffle,
  calculateProgress,
  filterByRange,
  filterByDigit,
  countFilledInRange,
  countFilledWithDigit,
} from './trainUtils';
import type { FilledEntry } from './trainUtils';

// Arbitrary for a filled entry
const filledEntryArb = (num: string): fc.Arbitrary<FilledEntry> =>
  fc.record({
    num: fc.constant(num),
    persona: fc.string({ minLength: 1, maxLength: 20 }),
    action: fc.string({ maxLength: 20 }),
    object: fc.string({ maxLength: 20 }),
    image: fc.string({ maxLength: 100 }),
  });

// Generate a list of 5-20 unique filled entries with unique nums
const filledEntriesArb = fc
  .uniqueArray(fc.integer({ min: 0, max: 99 }), { minLength: 5, maxLength: 20 })
  .chain((nums) =>
    fc.tuple(
      ...nums.map((n) => filledEntryArb(String(n).padStart(2, '0')))
    )
  )
  .map((entries) => [...entries]);

/**
 * Feature: react-migration, Property 11: Shuffle dos flash cards preserva todos os elementos
 * Validates: Requisito 10.1
 */
describe('Property 11: Shuffle dos flash cards preserva todos os elementos', () => {
  it('shuffled array has same length and same elements as original', () => {
    const entryArb = fc.record({
      num: fc.stringMatching(/^\d{2}$/),
      persona: fc.string({ minLength: 1, maxLength: 20 }),
      image: fc.string({ maxLength: 50 }),
    });
    const arrArb = fc.array(entryArb, { minLength: 0, maxLength: 50 });

    fc.assert(
      fc.property(arrArb, (arr) => {
        const shuffled = shuffle(arr);
        expect(shuffled).toHaveLength(arr.length);
        const serialize = (a: typeof arr) => a.map((x) => JSON.stringify(x)).sort();
        expect(serialize(shuffled)).toEqual(serialize(arr));
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: react-migration, Property 12: Progresso dos flash cards é calculado corretamente
 * Validates: Requisito 10.4
 */
describe('Property 12: Progresso dos flash cards é calculado corretamente', () => {
  it('progress label and percentage are correct for any index and total', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 200 }).chain((total) =>
          fc.tuple(fc.integer({ min: 0, max: total - 1 }), fc.constant(total))
        ),
        ([currentIndex, total]) => {
          const progress = calculateProgress(currentIndex, total);
          expect(progress.label).toBe(`Carta ${currentIndex + 1} / ${total}`);
          expect(progress.percentage).toBe(Math.round((currentIndex / total) * 100));
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: range-based-training, Property 1: Filtragem por range retorna apenas entradas do range
describe('Property 1: Filtragem por range retorna apenas entradas do range', () => {
  it('filterByRange returns only entries in the range and omits none', () => {
    const rangeArb = fc.integer({ min: 0, max: 9 });

    fc.assert(
      fc.property(filledEntriesArb, rangeArb, (entries, rangeStart) => {
        const result = filterByRange(entries, rangeStart);
        for (const entry of result) {
          expect(Math.floor(parseInt(entry.num) / 10)).toBe(rangeStart);
        }
        const expected = entries.filter(
          (e) => Math.floor(parseInt(e.num) / 10) === rangeStart
        );
        expect(result).toHaveLength(expected.length);
        const resultNums = result.map((e) => e.num).sort();
        const expectedNums = expected.map((e) => e.num).sort();
        expect(resultNums).toEqual(expectedNums);
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: range-based-training, Property 2: Filtragem por dígito retorna apenas entradas contendo o dígito
describe('Property 2: Filtragem por dígito retorna apenas entradas contendo o dígito', () => {
  it('filterByDigit returns only entries containing the digit and omits none', () => {
    const digitArb = fc.integer({ min: 0, max: 9 });

    fc.assert(
      fc.property(filledEntriesArb, digitArb, (entries, digit) => {
        const result = filterByDigit(entries, digit);
        const d = String(digit);
        for (const entry of result) {
          expect(entry.num.includes(d)).toBe(true);
        }
        const expected = entries.filter((e) => e.num.includes(d));
        expect(result).toHaveLength(expected.length);
        const resultNums = result.map((e) => e.num).sort();
        const expectedNums = expected.map((e) => e.num).sort();
        expect(resultNums).toEqual(expectedNums);
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: range-based-training, Property 3: Contagem de cartões preenchidos corresponde ao filtro
describe('Property 3: Contagem de cartões preenchidos corresponde ao filtro', () => {
  it('countFilledInRange equals filterByRange length for any entries and range', () => {
    const rangeArb = fc.integer({ min: 0, max: 9 });

    fc.assert(
      fc.property(filledEntriesArb, rangeArb, (entries, rangeStart) => {
        const count = countFilledInRange(entries, rangeStart);
        const filtered = filterByRange(entries, rangeStart);
        expect(count).toBe(filtered.length);
      }),
      { numRuns: 100 }
    );
  });

  it('countFilledWithDigit equals filterByDigit length for any entries and digit', () => {
    const digitArb = fc.integer({ min: 0, max: 9 });

    fc.assert(
      fc.property(filledEntriesArb, digitArb, (entries, digit) => {
        const count = countFilledWithDigit(entries, digit);
        const filtered = filterByDigit(entries, digit);
        expect(count).toBe(filtered.length);
      }),
      { numRuns: 100 }
    );
  });
});
