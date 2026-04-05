import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { render } from '@testing-library/react';
import CardItem from './CardItem';

// Arbitrary for a valid card number string
const cardNumArb = fc
  .integer({ min: 0, max: 99 })
  .map((n) => String(n).padStart(2, '0'));

// Arbitrary for a CardEntry with controllable persona and image
const cardEntryArb = fc.record({
  persona: fc.oneof(
    fc.constant(''),
    fc.constant('  '),
    fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim() !== '')
  ),
  action: fc.string({ maxLength: 20 }),
  object: fc.string({ maxLength: 20 }),
  image: fc.oneof(
    fc.constant(''),
    fc.constant('  '),
    fc.string({ minLength: 1, maxLength: 100 }).filter((s) => s.trim() !== '')
  ),
});

/**
 * Feature: react-migration, Property 7: CardItem renderiza corretamente baseado no estado do cartão
 * Validates: Requirements 2.3, 2.4
 */
describe('Property 7: CardItem renderiza corretamente baseado no estado do cartão', () => {
  it('for any CardEntry, CardItem shows persona name if non-empty else "???", shows image if non-empty else placeholder, applies "filled" class iff persona is non-empty (after trim)', () => {
    fc.assert(
      fc.property(cardNumArb, cardEntryArb, (num, entry) => {
        const { container } = render(
          <CardItem num={num} entry={entry} onClick={() => {}} />
        );

        const card = container.querySelector('.card');
        const cardName = container.querySelector('.card-name');
        const personaTrimmed = (entry.persona || '').trim();
        const imageTrimmed = (entry.image || '').trim();
        const isFilled = personaTrimmed !== '';

        // "filled" class iff persona is non-empty after trim
        if (isFilled) {
          expect(card.classList.contains('filled')).toBe(true);
        } else {
          expect(card.classList.contains('filled')).toBe(false);
        }

        // Name: persona if non-empty, else "???"
        if (isFilled) {
          expect(cardName.textContent).toBe(personaTrimmed);
        } else {
          expect(cardName.textContent).toBe('???');
        }

        // Image: <img> if image non-empty, else placeholder 🃏
        const img = container.querySelector('.card-art img');
        const placeholder = container.querySelector('.card-art-empty');
        if (imageTrimmed !== '') {
          expect(img).not.toBeNull();
          expect(placeholder).toBeNull();
        } else {
          expect(img).toBeNull();
          expect(placeholder).not.toBeNull();
          expect(placeholder.textContent).toBe('🃏');
        }
      }),
      { numRuns: 100 }
    );
  });
});
