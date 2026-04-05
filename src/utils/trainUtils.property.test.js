import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  generateNumToCharRound,
  generateCharToNumRound,
  shuffle,
  getResultEmoji,
  calculateProgress,
  CARDS_PER_ROUND,
  DISTRACTORS,
} from './trainUtils';

// Arbitrary for a filled entry
const filledEntryArb = (num) =>
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
        const serialize = (a) => a.map((x) => JSON.stringify(x)).sort();
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
