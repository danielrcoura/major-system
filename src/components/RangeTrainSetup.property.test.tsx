import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { render, screen, fireEvent } from '@testing-library/react';
import RangeTrainSetup from './RangeTrainSetup';
import type { FilledEntry } from '../utils/trainUtils';
import { countFilledInRange, countFilledWithDigit } from '../utils/trainUtils';

// Feature: range-based-training, Property 4: Opções sem cartões preenchidos são desabilitadas

/**
 * Arbitrary for FilledEntry[]: generates 0-20 entries with unique nums (00-99),
 * each with a non-empty persona and arbitrary action/object/image strings.
 */
const filledEntriesArb: fc.Arbitrary<FilledEntry[]> = fc
  .uniqueArray(fc.integer({ min: 0, max: 99 }), { minLength: 0, maxLength: 20 })
  .chain((nums) =>
    fc.tuple(
      fc.constant(nums),
      fc.array(
        fc.record({
          persona: fc.string({ minLength: 1, maxLength: 20 }),
          action: fc.string({ maxLength: 20 }),
          object: fc.string({ maxLength: 20 }),
          image: fc.string({ maxLength: 50 }),
        }),
        { minLength: nums.length, maxLength: nums.length }
      )
    )
  )
  .map(([nums, entries]): FilledEntry[] =>
    nums.map((n, i) => ({
      num: String(n).padStart(2, '0'),
      persona: entries[i].persona,
      action: entries[i].action,
      object: entries[i].object,
      image: entries[i].image,
    }))
  );

/**
 * Property 4: Opções sem cartões preenchidos são desabilitadas
 * Validates: Requirements 1.6, 2.6
 *
 * For any set of FilledEntry[] and any filter option (range 0-9 or digit 0-9),
 * if the count of filled cards for that option is zero, then the option must be
 * disabled (not selectable).
 */
describe('Property 4: Opções sem cartões preenchidos são desabilitadas', () => {
  it('range items with zero filled cards are disabled', () => {
    fc.assert(
      fc.property(filledEntriesArb, (entries: FilledEntry[]) => {
        const { unmount } = render(
          <RangeTrainSetup filledEntries={entries} onStart={() => {}} />
        );

        for (let r = 0; r < 10; r++) {
          const count = countFilledInRange(entries, r);
          const btn = screen.getByTestId(`range-item-${r}`);
          if (count === 0) {
            expect(btn).toBeDisabled();
          } else {
            expect(btn).not.toBeDisabled();
          }
        }

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('digit items with zero filled cards are disabled', () => {
    fc.assert(
      fc.property(filledEntriesArb, (entries: FilledEntry[]) => {
        const { unmount } = render(
          <RangeTrainSetup filledEntries={entries} onStart={() => {}} />
        );

        // Switch to digit mode
        fireEvent.click(screen.getByTestId('selection-mode-digit'));

        for (let d = 0; d < 10; d++) {
          const count = countFilledWithDigit(entries, d);
          const btn = screen.getByTestId(`digit-item-${d}`);
          if (count === 0) {
            expect(btn).toBeDisabled();
          } else {
            expect(btn).not.toBeDisabled();
          }
        }

        unmount();
      }),
      { numRuns: 100 }
    );
  });
});


// Feature: range-based-training, Property 5: Seleção única — apenas um item selecionado por vez

/**
 * Arbitrary for FilledEntry[] covering ALL 100 numbers (00-99) so every item is enabled.
 */
const allFilledEntriesArb: fc.Arbitrary<FilledEntry[]> = fc
  .array(
    fc.record({
      persona: fc.string({ minLength: 1, maxLength: 20 }),
      action: fc.string({ maxLength: 20 }),
      object: fc.string({ maxLength: 20 }),
      image: fc.string({ maxLength: 50 }),
    }),
    { minLength: 100, maxLength: 100 }
  )
  .map((entries): FilledEntry[] =>
    entries.map((e, i) => ({
      num: String(i).padStart(2, '0'),
      ...e,
    }))
  );

/**
 * Property 5: Seleção única — apenas um item selecionado por vez
 * Validates: Requirements 1.4, 2.3
 *
 * For any sequence of selections of range or digit, after selecting a new item,
 * only the last selected item should be active. All previously selected items
 * should be inactive.
 */
describe('Property 5: Seleção única — apenas um item selecionado por vez', () => {
  it('only the last selected range item has the active class', () => {
    fc.assert(
      fc.property(
        allFilledEntriesArb,
        fc.array(fc.integer({ min: 0, max: 9 }), { minLength: 2, maxLength: 5 }),
        (entries: FilledEntry[], clicks: number[]) => {
          const { unmount } = render(
            <RangeTrainSetup filledEntries={entries} onStart={() => {}} />
          );

          for (const idx of clicks) {
            fireEvent.click(screen.getByTestId(`range-item-${idx}`));

            for (let r = 0; r < 10; r++) {
              const btn = screen.getByTestId(`range-item-${r}`);
              if (r === idx) {
                expect(btn.className).toContain('active');
              } else {
                expect(btn.className).not.toContain('active');
              }
            }
          }

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('only the last selected digit item has the active class', () => {
    fc.assert(
      fc.property(
        allFilledEntriesArb,
        fc.array(fc.integer({ min: 0, max: 9 }), { minLength: 2, maxLength: 5 }),
        (entries: FilledEntry[], clicks: number[]) => {
          const { unmount } = render(
            <RangeTrainSetup filledEntries={entries} onStart={() => {}} />
          );

          // Switch to digit mode
          fireEvent.click(screen.getByTestId('selection-mode-digit'));

          for (const idx of clicks) {
            fireEvent.click(screen.getByTestId(`digit-item-${idx}`));

            for (let d = 0; d < 10; d++) {
              const btn = screen.getByTestId(`digit-item-${d}`);
              if (d === idx) {
                expect(btn.className).toContain('active');
              } else {
                expect(btn.className).not.toContain('active');
              }
            }
          }

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});


// Feature: range-based-training, Property 6: Botão de iniciar habilitado quando filtro tem cartões

/**
 * Property 6: Botão de iniciar habilitado quando filtro tem cartões
 * Validates: Requirements 4.1, 4.2
 *
 * For any deck state and any selected filter (range or digit), the start button
 * must be enabled if and only if the selected filter has at least 1 filled card.
 * Also: when no range or digit is selected, the button must be disabled.
 */
describe('Property 6: Botão de iniciar habilitado quando filtro tem cartões', () => {
  it('start button is disabled when no range is selected', () => {
    fc.assert(
      fc.property(filledEntriesArb, (entries: FilledEntry[]) => {
        const { unmount } = render(
          <RangeTrainSetup filledEntries={entries} onStart={() => {}} />
        );

        const startBtn = screen.getByTestId('start-btn');
        expect(startBtn).toBeDisabled();

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('start button is enabled iff selected range has filled cards', () => {
    fc.assert(
      fc.property(
        filledEntriesArb,
        fc.integer({ min: 0, max: 9 }),
        (entries: FilledEntry[], range: number) => {
          const { unmount } = render(
            <RangeTrainSetup filledEntries={entries} onStart={() => {}} />
          );

          const rangeBtn = screen.getByTestId(`range-item-${range}`);
          const count = countFilledInRange(entries, range);
          const startBtn = screen.getByTestId('start-btn');

          if (count > 0) {
            // Range has cards — click it and verify start is enabled
            fireEvent.click(rangeBtn);
            expect(startBtn).not.toBeDisabled();
          } else {
            // Range has no cards — button is disabled, can't click it
            // Start button should remain disabled
            expect(rangeBtn).toBeDisabled();
            expect(startBtn).toBeDisabled();
          }

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('start button is disabled when no digit is selected', () => {
    fc.assert(
      fc.property(filledEntriesArb, (entries: FilledEntry[]) => {
        const { unmount } = render(
          <RangeTrainSetup filledEntries={entries} onStart={() => {}} />
        );

        // Switch to digit mode
        fireEvent.click(screen.getByTestId('selection-mode-digit'));

        const startBtn = screen.getByTestId('start-btn');
        expect(startBtn).toBeDisabled();

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('start button is enabled iff selected digit has filled cards', () => {
    fc.assert(
      fc.property(
        filledEntriesArb,
        fc.integer({ min: 0, max: 9 }),
        (entries: FilledEntry[], digit: number) => {
          const { unmount } = render(
            <RangeTrainSetup filledEntries={entries} onStart={() => {}} />
          );

          // Switch to digit mode
          fireEvent.click(screen.getByTestId('selection-mode-digit'));

          const digitBtn = screen.getByTestId(`digit-item-${digit}`);
          const count = countFilledWithDigit(entries, digit);
          const startBtn = screen.getByTestId('start-btn');

          if (count > 0) {
            // Digit has cards — click it and verify start is enabled
            fireEvent.click(digitBtn);
            expect(startBtn).not.toBeDisabled();
          } else {
            // Digit has no cards — button is disabled, can't click it
            // Start button should remain disabled
            expect(digitBtn).toBeDisabled();
            expect(startBtn).toBeDisabled();
          }

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
