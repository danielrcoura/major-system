import { useState, useCallback, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useDeckData } from '../hooks/useDeckData';
import { TrainDirection } from '../types';
import { FilledEntry, filterByRange } from '../utils/trainUtils';
import FlashCards from '../components/FlashCards';
import ResultScreen from '../components/ResultScreen';

interface TrainLocationState {
  rangeIndex?: number;
  direction?: TrainDirection;
}

export default function TrainPage() {
  const { getFilledEntries } = useDeckData();
  const location = useLocation();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<'challenge' | 'result'>('challenge');
  const [totalCards, setTotalCards] = useState<number>(0);
  const [rangeDirection, setRangeDirection] = useState<TrainDirection>('numToChar');
  const [rangeFilteredEntries, setRangeFilteredEntries] = useState<FilledEntry[]>([]);
  const sessionRef = useRef<number>(0);
  const initializedFromState = useRef(false);

  useEffect(() => {
    const state = location.state as TrainLocationState | null;
    if (state?.rangeIndex != null && state?.direction && !initializedFromState.current) {
      initializedFromState.current = true;
      const entries = getFilledEntries();
      const filtered = filterByRange(entries, state.rangeIndex);
      if (filtered.length > 0) {
        setRangeFilteredEntries(filtered);
        setRangeDirection(state.direction);
        setTotalCards(0);
        sessionRef.current += 1;
        setPhase('challenge');
      } else {
        navigate('/');
      }
    } else if (!initializedFromState.current) {
      navigate('/');
    }
  }, [location.state, getFilledEntries, navigate]);

  const handleFlashComplete = useCallback((cardCount: number) => {
    setTotalCards(cardCount);
    setPhase('result');
  }, []);

  const handleRetry = useCallback(() => {
    setTotalCards(0);
    sessionRef.current += 1;
    setPhase('challenge');
  }, []);

  const handleBackToSetup = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const sessionKey = sessionRef.current;

  if (rangeFilteredEntries.length === 0) {
    return null;
  }

  return (
    <main>
      {phase === 'challenge' && (
        <FlashCards
          key={sessionKey}
          filledEntries={rangeFilteredEntries}
          direction={rangeDirection}
          onComplete={handleFlashComplete}
        />
      )}

      {phase === 'result' && (
        <ResultScreen
          mode="rangeTrain"
          totalCards={totalCards}
          onRetry={handleRetry}
          onBackToSetup={handleBackToSetup}
        />
      )}
    </main>
  );
}
