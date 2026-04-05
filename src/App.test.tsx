import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the app title on the deck page', () => {
    render(<App />);
    expect(screen.getByText(/Memory Deck/)).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<App />);
    expect(screen.getByText('📇 Deck')).toBeInTheDocument();
    expect(screen.getByText('🏋️ Treino')).toBeInTheDocument();
  });

  it('highlights the active deck link on /', () => {
    render(<App />);
    const deckLink = screen.getByText('📇 Deck');
    expect(deckLink).toHaveClass('active');
  });
});
