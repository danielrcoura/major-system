import { useRef } from 'react';
import { useDeckData } from '../hooks/useDeckData';
import { deckCore } from '../domain';

export default function ImportExportControls(): React.JSX.Element {
  const { importData } = useDeckData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExport(): void {
    const blob = new Blob([deckCore.exportCards()], {
      type: 'application/json',
    });
    const a: HTMLAnchorElement = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'pao-major-system.json';
    a.click();
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>): void {
    const file: File | undefined = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev: ProgressEvent<FileReader>): void => {
      try {
        const jsonString = ev.target?.result as string;
        deckCore.importCards(jsonString);
        importData(deckCore.getAll());
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Arquivo JSON inválido.');
      }
    };
    reader.readAsText(file);
    // Reset so the same file can be re-imported
    e.target.value = '';
  }

  return (
    <div className="controls">
      <button onClick={handleExport}>📥 Exportar</button>
      <button onClick={() => fileInputRef.current?.click()}>📤 Importar</button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleImport}
      />
    </div>
  );
}
