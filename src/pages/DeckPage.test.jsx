import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DeckDataContext } from '../context/DeckDataContext';
import DeckPage from './DeckPage';

function renderWithContext(data = {}) {
  const dispatch = vi.fn();
  return {
    dispatch,
    ...render(
      <DeckDataContext.Provider value={{ state: { data }, dispatch }}>
        <DeckPage />
      </DeckDataContext.Provider>
    ),
  };
}

describe('DeckPage integration', () => {
  it('renders ProgressBar, SearchBar, CardGrid and controls', () => {
    renderWithContext();
    // ProgressBar shows "0 / 100 cartas"
    expect(screen.getByText(/0 \/ 100 cartas/)).toBeInTheDocument();
    // SearchBar input
    expect(screen.getByPlaceholderText(/Buscar/)).toBeInTheDocument();
    // ImportExportControls buttons
    expect(screen.getByText(/Exportar/)).toBeInTheDocument();
    expect(screen.getByText(/Importar/)).toBeInTheDocument();
  });

  it('opens EditModal when a card is clicked', () => {
    renderWithContext({ '05': { persona: 'Alice', action: '', object: '', image: '' } });
    const card = screen.getByText('Alice');
    fireEvent.click(card.closest('.card'));
    // Modal should be open with card number
    expect(screen.getByText(/Editar PAO/)).toBeInTheDocument();
  });

  it('filters cards when typing in SearchBar', () => {
    renderWithContext({ '12': { persona: 'Bob', action: '', object: '', image: '' } });
    const input = screen.getByPlaceholderText(/Buscar/);
    fireEvent.change(input, { target: { value: 'Bob' } });
    expect(screen.getByText('Bob')).toBeInTheDocument();
    // Cards that don't match should be hidden — section 00-09 should not appear
    expect(screen.queryByText('00 — 09')).not.toBeInTheDocument();
  });

  it('saves card and closes modal via onSave', () => {
    const { dispatch } = renderWithContext({ '03': { persona: 'Eve', action: 'run', object: 'ball', image: '' } });
    // Open modal
    const card = screen.getByText('Eve');
    fireEvent.click(card.closest('.card'));
    expect(screen.getByText(/Editar PAO/)).toBeInTheDocument();
    // Click save
    fireEvent.click(screen.getByText('Salvar'));
    // Modal should close
    expect(screen.queryByText(/Editar PAO/)).not.toBeInTheDocument();
    // dispatch should have been called with SAVE_CARD
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'SAVE_CARD', num: '03' })
    );
  });

  it('closes modal on Escape without saving', () => {
    const { dispatch } = renderWithContext({ '07': { persona: 'Zara', action: '', object: '', image: '' } });
    const card = screen.getByText('Zara');
    fireEvent.click(card.closest('.card'));
    expect(screen.getByText(/Editar PAO/)).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByText(/Editar PAO/)).not.toBeInTheDocument();
    // No SAVE_CARD dispatch
    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'SAVE_CARD' })
    );
  });
});
