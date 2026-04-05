import { useState, useRef } from 'react';
import { useLocation } from 'react-router';
import { useDeckData } from '../hooks/useDeckData';
import { deckCore } from '../domain';

export default function Navbar(): React.JSX.Element {
  const { pathname } = useLocation();
  const { importData } = useDeckData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const isDeck = pathname === '/';
  const title = isDeck ? '🃏 Memory Deck' : '🧠 Treino';

  function handleExport(): void {
    const blob = new Blob([deckCore.exportCards()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'pao-major-system.json';
    a.click();
    setMenuOpen(false);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const jsonString = ev.target?.result as string;
        deckCore.importCards(jsonString);
        importData(deckCore.getAll());
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Arquivo JSON inválido.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
    setMenuOpen(false);
  }

  return (
    <nav className="navbar">
      <span className="navbar-title">{title}</span>
      <div className="navbar-actions-desktop">
        <button onClick={handleExport}>📥 Exportar</button>
        <button onClick={() => fileInputRef.current?.click()}>📤 Importar</button>
      </div>
      <button
        className="navbar-hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Abrir menu"
        aria-expanded={menuOpen}
      >
        <span className={`hamburger-icon ${menuOpen ? 'open' : ''}`} />
      </button>
      {menuOpen && (
        <div className="navbar-dropdown">
          <button onClick={handleExport}>📥 Exportar</button>
          <button onClick={() => { fileInputRef.current?.click(); setMenuOpen(false); }}>📤 Importar</button>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleImport}
      />
    </nav>
  );
}
