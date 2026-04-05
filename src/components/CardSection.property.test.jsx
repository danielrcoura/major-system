import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { render } from '@testing-library/react';
import CardGrid from './CardGrid';

// Arbitrary for a valid CardEntry with controllable persona
const cardEntryArb = fc.record({
  persona: fc.oneof(
    fc.constant(''),
    fc.constant('  '),
    fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim() !== '')
  ),
  action: fc.string({ maxLength: 20 }),
  object: fc.string({ maxLength: 20 }),
  image: fc.string({ maxLength: 50 }),
});

// Arbitrary for DeckData
const deckDataArb = fc
  .uniqueArray(fc.integer({ min: 0, max: 99 }), { minLength: 0, maxLength: 40 })
  .chain((nums) =>
    fc.tuple(
      fc.constant(nums.map((n) => String(n).padStart(2, '0'))),
      fc.array(cardEntryArb, { minLength: nums.length, maxLength: nums.length })
    )
  )
  .map(([nums, entries]) => {
    const data = {};
    nums.forEach((num, i) => {
      data[num] = entries[i];
    });
    return data;
  });

/**
 * Feature: react-migration, Property 6: Contagem de cartões preenchidos é consistente
 * Validates: Requirements 2.2, 6.1
 */
describe('Property 6: Contagem de cartões preenchidos é consistente', () => {
  it('for any DeckData, filled count in each section header equals entries with non-empty persona (after trim) in that decade', () => {
    fc.assert(
      fc.property(deckDataArb, (data) => {
        const { container } = render(
          <CardGrid data={data} filter="" onCardClick={() => {}} />
        );

        const sections = container.querySelectorAll('.section');

        sections.forEach((section, group) => {
          // Count filled entries for this decade from the data
          const start = group * 10;
          let expectedFilled = 0;
          for (let i = start; i < start + 10; i++) {
            const num = String(i).padStart(2, '0');
            const entry = data[num];
            if (entry && entry.persona && entry.persona.trim() !== '') {
              expectedFilled++;
            }
          }

          // Read the displayed count from the section header
          const progress = section.querySelector('.section-progress');
          expect(progress.textContent).toBe(`${expectedFilled}/10`);
        });
      }),
      { numRuns: 100 }
    );
  });
});
