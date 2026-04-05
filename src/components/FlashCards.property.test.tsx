import { describe, it, expect, vi } from 'vitest';
import * as fc from 'fast-check';
import { render } from '@testing-library/react';

vi.mock('../utils/trainUtils', async () => {
  const actual = await vi.importActual('../utils/trainUtils');
  return {
    ...actual,
    shuffle: <T,>(arr: T[]): T[] => [...arr],
  };
});

import FlashCards from './FlashCards';
import type { FilledEntry } from '../utils/trainUtils';
import type { TrainDirection } from '../types';

// Feature: range-based-training, Property 7: Direção do flashcard determina conteúdo da frente e do verso

/**
 * Property 7: Direção do flashcard determina conteúdo da frente e do verso
 * Validates: Requirements 3.4, 3.5, 5.3
 */
describe('Property 7: Direção do flashcard determina conteúdo da frente e do verso', () => {
  const filledEntryArb: fc.Arbitrary<FilledEntry> = fc.record({
    num: fc.integer({ min: 0, max: 99 }).map((n) => String(n).padStart(2, '0')),
    persona: fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim() !== ''),
    action: fc.string({ maxLength: 20 }),
    object: fc.string({ maxLength: 20 }),
    image: fc.constant(''),
  });

  const directionArb: fc.Arbitrary<TrainDirection> = fc.constantFrom('numToChar' as TrainDirection, 'charToNum' as TrainDirection);

  it('front and back content corresponds to the selected direction', () => {
    fc.assert(
      fc.property(filledEntryArb, directionArb, (entry: FilledEntry, direction: TrainDirection) => {
        const { container } = render(
          <FlashCards
            filledEntries={[entry]}
            direction={direction}
            onComplete={() => {}}
          />
        );

        const front = container.querySelector('.flash-front');
        const back = container.querySelector('.flash-back');

        if (direction === 'numToChar') {
          // Front shows number, back shows persona name
          const frontNumber = front!.querySelector('.flash-number');
          expect(frontNumber).not.toBeNull();
          expect(frontNumber!.textContent).toBe(entry.num);

          const backName = back!.querySelector('.flash-name');
          expect(backName).not.toBeNull();
          expect(backName!.textContent).toBe(entry.persona);
        } else {
          // charToNum: front shows persona name, back shows number
          const frontName = front!.querySelector('.flash-name');
          expect(frontName).not.toBeNull();
          expect(frontName!.textContent).toBe(entry.persona);

          const backNumber = back!.querySelector('.flash-number');
          expect(backNumber).not.toBeNull();
          expect(backNumber!.textContent).toBe(entry.num);
        }
      }),
      { numRuns: 100 }
    );
  });
});
