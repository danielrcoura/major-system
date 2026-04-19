import { describe, it, expect, vi } from 'vitest';
import * as fc from 'fast-check';
import { render, fireEvent } from '@testing-library/react';
import TableGrid from './TableGrid';
import type { DeckData } from '../types';

describe('TableGrid renders a 10×10 table with correct mapping', () => {
  it('renders all 100 cells with correct numbers', () => {
    const { container } = render(<TableGrid data={{}} onCellClick={() => {}} />);
    const cells = container.querySelectorAll('.table-cell');
    expect(cells.length).toBe(100);

    const nums = Array.from(cells).map((c) => c.querySelector('.table-cell-num')!.textContent);
    for (let i = 0; i < 100; i++) {
      expect(nums).toContain(String(i).padStart(2, '0'));
    }
  });

  it('renders correct column headers (0x–9x) and row headers (x0–x9)', () => {
    const { container } = render(<TableGrid data={{}} onCellClick={() => {}} />);
    const headers = Array.from(container.querySelectorAll('.table-header')).map((h) => h.textContent);
    for (let i = 0; i < 10; i++) {
      expect(headers).toContain(`${i}x`);
      expect(headers).toContain(`x${i}`);
    }
  });

  it('cell at column c, row r maps to number c*10+r', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 9 }), fc.integer({ min: 0, max: 9 }), (c, r) => {
        const { container } = render(<TableGrid data={{}} onCellClick={() => {}} />);
        // row r+1 (skip thead), col c+2 (skip row header th, 1-indexed)
        const row = container.querySelectorAll('tbody tr')[r];
        const cell = row.querySelectorAll('td')[c];
        const num = cell.querySelector('.table-cell-num')!.textContent;
        expect(num).toBe(String(c * 10 + r).padStart(2, '0'));
      }),
      { numRuns: 30 }
    );
  });

  it('propagates onCellClick with correct num', () => {
    const onClick = vi.fn();
    const { container } = render(<TableGrid data={{}} onCellClick={onClick} />);
    const cell37 = Array.from(container.querySelectorAll('.table-cell')).find(
      (c) => c.querySelector('.table-cell-num')!.textContent === '37'
    )!;
    fireEvent.click(cell37);
    expect(onClick).toHaveBeenCalledWith('37');
  });

  it('shows persona from data in the correct cell', () => {
    const data: DeckData = { '42': { persona: 'Rain', action: '', object: '', image: '' } };
    const { container } = render(<TableGrid data={data} onCellClick={() => {}} />);
    const cell42 = Array.from(container.querySelectorAll('.table-cell')).find(
      (c) => c.querySelector('.table-cell-num')!.textContent === '42'
    )!;
    expect(cell42.querySelector('.table-cell-name')!.textContent).toBe('Rain');
  });
});
