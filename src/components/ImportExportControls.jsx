import { useRef } from 'react';
import { useDeckData } from '../hooks/useDeckData';

export default function ImportExportControls() {
  const { data, importData } = useDeckData();
  const fileInputRef = useRef(null);

  function handleExport() {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'pao-major-system.json';
    a.click();
  }

  function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        importData(parsed);
      } catch {
        alert('Arquivo JSON inválido.');
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
