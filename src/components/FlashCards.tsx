import { useState, useEffect, useRef, useCallback } from 'react';
import { FilledEntry, shuffle, calculateProgress } from '../utils/trainUtils';

interface FlashCardsProps {
  filledEntries: FilledEntry[];
  onComplete: (cardCount: number) => void;
}

export default function FlashCards({ filledEntries, onComplete }: FlashCardsProps) {
  const [deck, setDeck] = useState<FilledEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [flipped, setFlipped] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setDeck(shuffle(filledEntries));
    setCurrentIndex(0);
    setFlipped(false);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [filledEntries]);

  const handleClick = useCallback(() => {
    if (flipped) return;
    setFlipped(true);

    timerRef.current = setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= deck.length) {
        onComplete(deck.length);
        return;
      }
      setCurrentIndex(nextIndex);
      setFlipped(false);
    }, 1500);
  }, [flipped, currentIndex, deck, onComplete]);

  if (deck.length === 0) return null;

  const entry = deck[currentIndex];
  const progress = calculateProgress(currentIndex, deck.length);

  return (
    <div className="train-panel">
      <div className="challenge-header">
        <span className="round-label" id="flashRoundLabel">{progress.label}</span>
        <span className="score-label" id="flashProgress">{progress.percentage}%</span>
      </div>

      <div className="flash-card-wrapper">
        <div
          ref={cardRef}
          className={`flash-card${flipped ? ' flipped' : ''}`}
          onClick={handleClick}
        >
          <div className="flash-front">
            <span className="flash-number">{entry.num}</span>
          </div>
          <div className="flash-back">
            <div className="flash-art">
              {entry.image ? (
                <img
                  src={entry.image}
                  alt={entry.persona}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    if (e.currentTarget.parentElement) {
                      e.currentTarget.parentElement.innerHTML = '<span>🧑</span>';
                    }
                  }}
                />
              ) : (
                <span>🧑</span>
              )}
            </div>
            <div className="flash-name">{entry.persona}</div>
          </div>
        </div>
      </div>

      <p className="instruction">
        {flipped ? '' : 'Clique na carta para revelar'}
      </p>
    </div>
  );
}
