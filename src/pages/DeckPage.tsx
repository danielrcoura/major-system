import { useState, useCallback } from 'react';
import { useDeckData } from '../hooks/useDeckData';
import { usePendingReviews } from '../hooks/usePendingReviews';
import { DeckEntry } from '../types';
import ProgressBar from '../components/ProgressBar';
import ReviewCallout from '../components/ReviewCallout';
import CardGrid from '../components/CardGrid';
import EditModal from '../components/EditModal';

export default function DeckPage() {
  const { data, saveCard } = useDeckData();
  const { pendingCount } = usePendingReviews();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedCardNum, setSelectedCardNum] = useState<string | null>(null);

  const handleCardClick = useCallback((num: string) => {
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
      <ProgressBar />
      <ReviewCallout pendingCount={pendingCount} />
      <CardGrid data={data} onCardClick={handleCardClick} />
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
