import { describe, it, expect, vi } from 'vitest';
import * as fc from 'fast-check';
import { render } from '@testing-library/react';
import EditModal from './EditModal';
import { getConsonants } from '../utils/majorSystem';

/**
 * **Feature: react-migration, Property 14: Modal exibe consoantes corretas para o número do cartão**
 * **Validates: Requirements 3.1**
 */
describe('Property 14: Modal exibe consoantes corretas para o número do cartão', () => {
  it('for any card number 00-99, the consonants displayed in the modal must match getConsonants(num).label', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 99 }),
        (num) => {
          const numStr = String(num).padStart(2, '0');
          const expected = getConsonants(num);

          const { container } = render(
            <EditModal
              isOpen={true}
              cardNum={num}
              entry={{}}
              onSave={vi.fn()}
              onClose={vi.fn()}
            />
          );

          const consonantsEl = container.querySelector('.consonants-info');
          expect(consonantsEl).not.toBeNull();
          expect(consonantsEl.textContent).toBe(`Consoantes: ${expected.label}`);
        }
      ),
      { numRuns: 100 }
    );
  });
});
