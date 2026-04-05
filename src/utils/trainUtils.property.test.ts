import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  generateNumToCharRound,
  generateCharToNumRound,
  shuffle,
  getResultEmoji,
  calculateProgress,
  filterByRange,
  filterByDigit,
  countFilledInRange,
  countFilledWithDigit,
  CARDS_PER_ROUND,
  DISTRACTORS,
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
 * Feature: react-migration, Property 10: Geração de rodada de desafio é válida
 * Validates: Requirements 8.1, 9.1
 */
describe('Property 10: Geração de rodada de desafio é válida', () => {
  it('NumToChar round has 3 targets and 5 choices (3 correct + 2 distractors)', () => {
    fc.assert(
      fc.property(filledEntriesArb, (filledEntries) => {
        const round = generateNumToCharRound(filledEntries);

        // Exactly 3 targets
        expect(round.ordered).toHaveLength(CARDS_PER_ROUND);

        // Exactly 5 choices
        expect(round.choices).toHaveLength(CARDS_PER_ROUND + DISTRACTORS);

        // All 3 targets are in the choices
        const choiceNums = new Set(round.choices.map((c) => c.num));
        for (const target of round.ordered) {
          expect(choiceNums.has(target.num)).toBe(true);
        }

        // The 2 distractors are different from the 3 targets
        const targetNums = new Set(round.ordered.map((t) => t.num));
        const distractors = round.choices.filter((c) => !targetNums.has(c.num));
        expect(distractors).toHaveLength(DISTRACTORS);
        for (const d of distractors) {
          expect(targetNums.has(d.num)).toBe(false);
        }

        // All targets come from filledEntries
        const allNums = new Set(filledEntries.map((e) => e.num));
        for (const target of round.ordered) {
          expect(allNums.has(target.num)).toBe(true);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('CharToNum round has 3 targets and 5 number choices (3 correct + 2 distractors)', () => {
    fc.assert(
      fc.property(filledEntriesArb, (filledEntries) => {
        const round = generateCharToNumRound(filledEntries);

        // Exactly 3 targets
        expect(round.ordered).toHaveLength(CARDS_PER_ROUND);

        // Exactly 5 number choices
        expect(round.numChoices).toHaveLength(CARDS_PER_ROUND + DISTRACTORS);

        // All 3 target nums are in the number choices
        const choiceSet = new Set(round.numChoices);
        for (const target of round.ordered) {
          expect(choiceSet.has(target.num)).toBe(true);
        }

        // The 2 distractor nums are different from the 3 target nums
        const targetNums = new Set(round.ordered.map((t) => t.num));
        const distractorNums = round.numChoices.filter((n) => !targetNums.has(n));
        expect(distractorNums).toHaveLength(DISTRACTORS);
        for (const d of distractorNums) {
          expect(targetNums.has(d)).toBe(false);
        }

        // All number choices are valid 2-digit strings
        for (const n of round.numChoices) {
          expect(n).toMatch(/^\d{2}$/);
        }
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: react-migration, Property 11: Shuffle dos flash cards preserva todos os elementos
 * Validates: Requisito 10.1
 */
describe('Property 11: Shuffle dos flash cards preserva todos os elementos', () => {
  it('shuffled array has same length and same elements as original', () => {
    // Use filled entry-like objects to match real usage
    const entryArb = fc.record({
      num: fc.stringMatching(/^\d{2}$/),
      persona: fc.string({ minLength: 1, maxLength: 20 }),
      image: fc.string({ maxLength: 50 }),
    });
    const arrArb = fc.array(entryArb, { minLength: 0, maxLength: 50 });

    fc.assert(
      fc.property(arrArb, (arr) => {
        const shuffled = shuffle(arr);

        // Same length
        expect(shuffled).toHaveLength(arr.length);

        // Same elements (as multiset) — compare by JSON serialization
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

/**
 * Feature: react-migration, Property 13: Emoji do resultado segue os limiares corretos
 * Validates: Requisito 11.1
 */
describe('Property 13: Emoji do resultado segue os limiares corretos', () => {
  it('emoji follows correct thresholds for any score and totalRounds', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }).chain((totalRounds) =>
          fc.tuple(
            fc.integer({ min: 0, max: totalRounds }),
            fc.constant(totalRounds)
          )
        ),
        ([score, totalRounds]) => {
          const emoji = getResultEmoji(score, totalRounds);
          const pct = Math.round((score / totalRounds) * 100);

          if (pct >= 80) {
            expect(emoji).toBe('🏆');
          } else if (pct >= 50) {
            expect(emoji).toBe('👍');
          } else {
            expect(emoji).toBe('💪');
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});


// Feature: range-based-training, Property 1: Filtragem por range retorna apenas entradas do range
/**
 * **Validates: Requirements 5.1**
 */
describe('Property 1: Filtragem por range retorna apenas entradas do range', () => {
  it('filterByRange returns only entries in the range and omits none', () => {
    const rangeArb = fc.integer({ min: 0, max: 9 });

    fc.assert(
      fc.property(filledEntriesArb, rangeArb, (entries, rangeStart) => {
        const result = filterByRange(entries, rangeStart);

        // All returned entries belong to the range
        for (const entry of result) {
          expect(Math.floor(parseInt(entry.num) / 10)).toBe(rangeStart);
        }

        // No valid entries were omitted
        const expected = entries.filter(
          (e) => Math.floor(parseInt(e.num) / 10) === rangeStart
        );
        expect(result).toHaveLength(expected.length);

        // Same entries (by num) in both sets
        const resultNums = result.map((e) => e.num).sort();
        const expectedNums = expected.map((e) => e.num).sort();
        expect(resultNums).toEqual(expectedNums);
      }),
      { numRuns: 100 }
    );
  });
});


// Feature: range-based-training, Property 2: Filtragem por dígito retorna apenas entradas contendo o dígito
/**
 * **Validates: Requirements 2.4, 5.2**
 */
describe('Property 2: Filtragem por dígito retorna apenas entradas contendo o dígito', () => {
  it('filterByDigit returns only entries containing the digit and omits none', () => {
    const digitArb = fc.integer({ min: 0, max: 9 });

    fc.assert(
      fc.property(filledEntriesArb, digitArb, (entries, digit) => {
        const result = filterByDigit(entries, digit);
        const d = String(digit);

        // All returned entries contain the digit in their num
        for (const entry of result) {
          expect(entry.num.includes(d)).toBe(true);
        }

        // No valid entries were omitted
        const expected = entries.filter((e) => e.num.includes(d));
        expect(result).toHaveLength(expected.length);

        // Same entries (by num) in both sets
        const resultNums = result.map((e) => e.num).sort();
        const expectedNums = expected.map((e) => e.num).sort();
        expect(resultNums).toEqual(expectedNums);
      }),
      { numRuns: 100 }
    );
  });
});


// Feature: range-based-training, Property 3: Contagem de cartões preenchidos corresponde ao filtro
/**
 * **Validates: Requirements 1.5, 2.5**
 */
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
