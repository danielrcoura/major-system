import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the app title on the deck page', () => {
    // Set window location to match basename
    window.history.pushState({}, '', '/major-system/');
    render(<App />);
    expect(screen.getByText(/Memory Deck/)).toBeInTheDocument();
  });

  it('renders the subtitle on the deck page', () => {
    window.history.pushState({}, '', '/major-system/');
    render(<App />);
    expect(screen.getByText(/Crie sua lista de imagens/)).toBeInTheDocument();
  });

  it('renders ProgressBar and controls on the deck page', () => {
    window.history.pushState({}, '', '/major-system/');
    render(<App />);
    expect(screen.getByText(/Exportar/)).toBeInTheDocument();
    expect(screen.getByText(/Importar/)).toBeInTheDocument();
  });
});
