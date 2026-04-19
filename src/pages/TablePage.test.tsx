import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { DeckDataContext } from '../context/DeckDataContext';
import TablePage from './TablePage';

function renderWithContext(data = {}) {
  const dispatch = vi.fn();
  return {
    dispatch,
    ...render(
      <DeckDataContext.Provider value={{ state: { data }, dispatch }}>
        <MemoryRouter>
          <TablePage />
        </MemoryRouter>
      </DeckDataContext.Provider>
    ),
  };
}

describe('TablePage integration', () => {
  it('renders the 10×10 table grid', () => {
    const { container } = renderWithContext();
    expect(container.querySelectorAll('.table-cell').length).toBe(100);
  });

  it('opens EditModal when a cell is clicked', () => {
    renderWithContext({ '37': { persona: 'Mike', action: '', object: '', image: '' } });
    fireEvent.click(screen.getByText('Mike').closest('.table-cell')!);
    expect(screen.getByText(/Editar PAO/)).toBeInTheDocument();
  });

  it('saves card and closes modal', () => {
    const { dispatch } = renderWithContext({ '42': { persona: 'Rain', action: 'run', object: 'ball', image: '' } });
    fireEvent.click(screen.getByText('Rain').closest('.table-cell')!);
    fireEvent.click(screen.getByText('Salvar'));
    expect(screen.queryByText(/Editar PAO/)).not.toBeInTheDocument();
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'SAVE_CARD', num: '42' }));
  });
});
