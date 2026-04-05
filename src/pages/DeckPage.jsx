import { useState, useCallback } from 'react';
import { useDeckData } from '../hooks/useDeckData';
import ProgressBar from '../components/ProgressBar';
import SearchBar from '../components/SearchBar';
import ImportExportControls from '../components/ImportExportControls';
import CardGrid from '../components/CardGrid';
import EditModal from '../components/EditModal';

export default function DeckPage() {
  const { data, saveCard } = useDeckData();
  const [searchFilter, setSearchFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCardNum, setSelectedCardNum] = useState(null);

  const handleCardClick = useCallback((num) => {
    setSelectedCardNum(num);
    setModalOpen(true);
  }, []);

  const handleSave = useCallback((num, entry) => {
    saveCard(num, entry);
    setModalOpen(false);
  }, [saveCard]);

  const handleClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  return (
    <main>
      <ProgressBar />
      <div className="controls">
        <SearchBar onSearch={setSearchFilter} />
        <ImportExportControls />
      </div>
      <CardGrid data={data} filter={searchFilter} onCardClick={handleCardClick} />
      <EditModal
        isOpen={modalOpen}
        cardNum={selectedCardNum}
        entry={data[selectedCardNum] || {}}
        onSave={handleSave}
        onClose={handleClose}
      />
    </main>
  );
}
