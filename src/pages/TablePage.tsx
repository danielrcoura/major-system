import { useState, useCallback } from 'react';
import { useDeckData } from '../hooks/useDeckData';
import { DeckEntry } from '../types';
import TableGrid from '../components/TableGrid';
import EditModal from '../components/EditModal';

export default function TablePage() {
  const { data, saveCard } = useDeckData();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCardNum, setSelectedCardNum] = useState<string | null>(null);

  const handleCellClick = useCallback((num: string) => {
    setSelectedCardNum(num);
    setModalOpen(true);
  }, []);

  const handleSave = useCallback((num: number | string, entry: DeckEntry) => {
    saveCard(String(num), entry);
    setModalOpen(false);
  }, [saveCard]);

  const handleClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  return (
    <main>
      <TableGrid data={data} onCellClick={handleCellClick} />
      <EditModal
        isOpen={modalOpen}
        cardNum={selectedCardNum}
        entry={data[selectedCardNum!] || {}}
        onSave={handleSave}
        onClose={handleClose}
      />
    </main>
  );
}
