import { describe, it, expect, vi } from 'vitest';
import * as fc from 'fast-check';
import { render, fireEvent } from '@testing-library/react';
import TableCell from './TableCell';
import type { DeckEntry } from '../types';

const cardNumArb = fc.integer({ min: 0, max: 99 }).map((n) => String(n).padStart(2, '0'));

const cardEntryArb: fc.Arbitrary<DeckEntry> = fc.record({
  persona: fc.oneof(fc.constant(''), fc.constant('  '), fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim() !== '')),
  action: fc.string({ maxLength: 20 }),
  object: fc.string({ maxLength: 20 }),
  image: fc.oneof(fc.constant(''), fc.constant('  '), fc.string({ minLength: 1, maxLength: 100 }).filter((s) => s.trim() !== '')),
});

describe('TableCell renders correctly based on entry state', () => {
  it('shows persona if non-empty else "???", applies filled class, shows image or placeholder', () => {
    fc.assert(
      fc.property(cardNumArb, cardEntryArb, (num, entry) => {
        const { container } = render(<TableCell num={num} entry={entry} onClick={() => {}} />);
        const cell = container.querySelector('.table-cell')!;
        const name = container.querySelector('.table-cell-name')!;
        const personaTrimmed = (entry.persona || '').trim();
        const imageTrimmed = (entry.image || '').trim();
        const isFilled = personaTrimmed !== '';

        expect(cell.classList.contains('filled')).toBe(isFilled);
        expect(container.querySelector('.table-cell-num')!.textContent).toBe(num);
        expect(name.textContent).toBe(isFilled ? personaTrimmed : '???');

        const img = container.querySelector('.table-cell-img img');
        const placeholder = container.querySelector('.table-cell-placeholder');
        if (imageTrimmed !== '') {
          expect(img).not.toBeNull();
          expect(placeholder).toBeNull();
        } else {
          expect(img).toBeNull();
          expect(placeholder).not.toBeNull();
        }
      }),
      { numRuns: 100 }
    );
  });

  it('calls onClick with the correct num when clicked', () => {
    fc.assert(
      fc.property(cardNumArb, (num) => {
        const onClick = vi.fn();
        const { container } = render(<TableCell num={num} entry={{}} onClick={onClick} />);
        fireEvent.click(container.querySelector('.table-cell')!);
        expect(onClick).toHaveBeenCalledWith(num);
      }),
      { numRuns: 50 }
    );
  });
});
