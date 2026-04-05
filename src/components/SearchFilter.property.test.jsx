import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { render } from '@testing-library/react';
import CardGrid from './CardGrid';
import { getConsonants } from '../utils/majorSystem';

// Arbitrary for a CardEntry with non-empty persona (to make filtering interesting)
const filledEntryArb = fc.record({
  persona: fc.string({ minLength: 1, maxLength: 20 }).filter((s) => s.trim() !== ''),
  action: fc.string({ maxLength: 20 }),
  object: fc.string({ maxLength: 20 }),
  image: fc.string({ maxLength: 50 }),
});

// Arbitrary for DeckData with some filled entries
const deckDataArb = fc
  .uniqueArray(fc.integer({ min: 0, max: 99 }), { minLength: 1, maxLength: 30 })
  .chain((nums) =>
    fc.tuple(
      fc.constant(nums.map((n) => String(n).padStart(2, '0'))),
      fc.array(filledEntryArb, { minLength: nums.length, maxLength: nums.length })
    )
  )
  .map(([nums, entries]) => {
    const data = {};
    nums.forEach((num, i) => {
      data[num] = entries[i];
    });
    return data;
  });

// Search string arbitrary: short alphanumeric strings
const searchArb = fc.string({ minLength: 1, maxLength: 5 }).filter((s) => s.trim() !== '');

/**
 * Feature: react-migration, Property 8: Filtro de busca retorna apenas cartões correspondentes
 * Validates: Requirements 4.1, 4.2
 */
describe('Property 8: Filtro de busca retorna apenas cartões correspondentes', () => {
  it('for any DeckData and search string, all visible cards match by number, persona name, or consonant label; sections with no matches are hidden', () => {
    fc.assert(
      fc.property(deckDataArb, searchArb, (data, search) => {
        const { container } = render(
          <CardGrid data={data} filter={search} onCardClick={() => {}} />
        );

        const f = search.toLowerCase();

        // Compute expected visible card numbers
        const expectedVisible = new Set();
        for (let i = 0; i < 100; i++) {
          const num = String(i).padStart(2, '0');
          const entry = data[num] || {};
          const { label } = getConsonants(i);
          const matchNum = num.includes(f);
          const matchName = (entry.persona || '').toLowerCase().includes(f);
          const matchCons = label.toLowerCase().includes(f);
          if (matchNum || matchName || matchCons) {
            expectedVisible.add(num);
          }
        }

        // All rendered cards should be in the expected set
        const renderedCards = container.querySelectorAll('.card');
        const renderedNums = new Set();
        renderedCards.forEach((card) => {
          const corner = card.querySelector('.card-corner');
          renderedNums.add(corner.textContent);
        });

        expect(renderedNums).toEqual(expectedVisible);

        // Sections with no matching cards should not be rendered
        const sections = container.querySelectorAll('.section');
        sections.forEach((section) => {
          const cards = section.querySelectorAll('.card');
          expect(cards.length).toBeGreaterThan(0);
        });

        // Verify each decade: if no expected cards in a decade, no section for it
        for (let group = 0; group < 10; group++) {
          const start = group * 10;
          let hasMatch = false;
          for (let i = start; i < start + 10; i++) {
            if (expectedVisible.has(String(i).padStart(2, '0'))) {
              hasMatch = true;
              break;
            }
          }
          const startStr = String(start).padStart(2, '0');
          const endStr = String(start + 9).padStart(2, '0');
          const sectionTitle = container.querySelector(
            `.section-title`
          );
          // If no match in this decade, there should be no section with this range
          if (!hasMatch) {
            const allTitles = Array.from(
              container.querySelectorAll('.section-title')
            ).map((el) => el.textContent);
            const found = allTitles.some(
              (t) => t.includes(startStr) && t.includes(endStr)
            );
            expect(found).toBe(false);
          }
        }
      }),
      { numRuns: 100 }
    );
  });
});
