import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { render, screen } from '@testing-library/react';
import CardGrid from './CardGrid';

// Arbitrary for a valid CardEntry
const cardEntryArb = fc.record({
  persona: fc.string({ maxLength: 30 }),
  action: fc.string({ maxLength: 30 }),
  object: fc.string({ maxLength: 30 }),
  image: fc.string({ maxLength: 100 }),
});

// Arbitrary for DeckData: random subset of 00-99 keys with entries
const deckDataArb = fc
  .uniqueArray(fc.integer({ min: 0, max: 99 }), { minLength: 0, maxLength: 30 })
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
 * Feature: react-migration, Property 5: Grid renderiza 10 seções com 10 cartões cada
 * Validates: Requirements 2.1
 */
describe('Property 5: Grid renderiza 10 seções com 10 cartões cada', () => {
  it('for any DeckData (including empty), CardGrid without filter produces exactly 10 sections with 10 cards each, covering 00-99', () => {
    fc.assert(
      fc.property(deckDataArb, (data) => {
        const onClick = () => {};
        const { container } = render(
          <CardGrid data={data} filter="" onCardClick={onClick} />
        );

        // Should have exactly 10 sections
        const sections = container.querySelectorAll('.section');
        expect(sections.length).toBe(10);

        const allCardNums = [];

        sections.forEach((section, group) => {
          // Each section should have exactly 10 cards
          const cards = section.querySelectorAll('.card');
          expect(cards.length).toBe(10);

          // Verify the section header shows correct range
          const title = section.querySelector('.section-title');
          const startStr = String(group * 10).padStart(2, '0');
          const endStr = String(group * 10 + 9).padStart(2, '0');
          expect(title.textContent).toContain(startStr);
          expect(title.textContent).toContain(endStr);

          // Collect card numbers
          cards.forEach((card) => {
            const corner = card.querySelector('.card-corner');
            allCardNums.push(corner.textContent);
          });
        });

        // All 100 numbers 00-99 should be present
        expect(allCardNums.length).toBe(100);
        for (let i = 0; i < 100; i++) {
          const num = String(i).padStart(2, '0');
          expect(allCardNums).toContain(num);
        }
      }),
      { numRuns: 100 }
    );
  });
});
