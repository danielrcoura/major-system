import { useState, useCallback, useRef } from 'react';
import { useDeckData } from '../hooks/useDeckData';
import { TrainMode, TrainDirection } from '../types';
import { FilledEntry, TOTAL_ROUNDS } from '../utils/trainUtils';
import TrainSetup from '../components/TrainSetup';
import RangeTrainSetup from '../components/RangeTrainSetup';
import NumToCharChallenge from '../components/NumToCharChallenge';
import CharToNumChallenge from '../components/CharToNumChallenge';
import FlashCards from '../components/FlashCards';
import ResultScreen from '../components/ResultScreen';

export default function TrainPage() {
  const { getFilledEntries } = useDeckData();

  const [mode, setMode] = useState<TrainMode>('numToChar');
  const [phase, setPhase] = useState<'setup' | 'challenge' | 'result'>('setup');
  const [score, setScore] = useState<number>(0);
  const [totalCards, setTotalCards] = useState<number>(0);
  const [filledEntries, setFilledEntries] = useState<FilledEntry[]>([]);
  const sessionRef = useRef<number>(0);

  // rangeTrain-specific state
  const [rangeDirection, setRangeDirection] = useState<TrainDirection>('numToChar');
  const [rangeFilteredEntries, setRangeFilteredEntries] = useState<FilledEntry[]>([]);

  const handleStart = useCallback(() => {
    const entries: FilledEntry[] = getFilledEntries();
    setFilledEntries(entries);
    setScore(0);
    setTotalCards(0);
    sessionRef.current += 1;
    setPhase('challenge');
  }, [getFilledEntries]);

  const handleRangeStart = useCallback((filteredEntries: FilledEntry[], direction: TrainDirection) => {
    setRangeFilteredEntries(filteredEntries);
    setRangeDirection(direction);
    setTotalCards(0);
    sessionRef.current += 1;
    setPhase('challenge');
  }, []);

  const handleChallengeComplete = useCallback((finalScore: number) => {
    setScore(finalScore);
    setPhase('result');
  }, []);

  const handleFlashComplete = useCallback((cardCount: number) => {
    setTotalCards(cardCount);
    setPhase('result');
  }, []);

  const handleRetry = useCallback(() => {
    if (mode === 'rangeTrain') {
      // Restart with same filtered entries and direction
      setTotalCards(0);
      sessionRef.current += 1;
      setPhase('challenge');
      return;
    }
    const entries: FilledEntry[] = getFilledEntries();
    setFilledEntries(entries);
    setScore(0);
    setTotalCards(0);
    sessionRef.current += 1;
    setPhase('challenge');
  }, [mode, getFilledEntries]);

  const handleBackToSetup = useCallback(() => {
    setPhase('setup');
  }, []);

  const currentFilledCount = getFilledEntries().length;
  const sessionKey = sessionRef.current;

  return (
    <main>
      {phase === 'setup' && mode !== 'rangeTrain' && (
        <TrainSetup
          filledCount={currentFilledCount}
          mode={mode}
          onModeChange={setMode}
          onStart={handleStart}
        />
      )}

      {phase === 'setup' && mode === 'rangeTrain' && (
        <RangeTrainSetup
          filledEntries={getFilledEntries()}
          onStart={handleRangeStart}
          onBack={() => setMode('numToChar')}
        />
      )}

      {phase === 'challenge' && mode === 'numToChar' && (
        <NumToCharChallenge
          key={sessionKey}
          filledEntries={filledEntries}
          onComplete={handleChallengeComplete}
        />
      )}

      {phase === 'challenge' && mode === 'charToNum' && (
        <CharToNumChallenge
          key={sessionKey}
          filledEntries={filledEntries}
          onComplete={handleChallengeComplete}
        />
      )}

      {phase === 'challenge' && mode === 'flashCards' && (
        <FlashCards
          key={sessionKey}
          filledEntries={filledEntries}
          onComplete={handleFlashComplete}
        />
      )}

      {phase === 'challenge' && mode === 'rangeTrain' && (
        <FlashCards
          key={sessionKey}
          filledEntries={rangeFilteredEntries}
          direction={rangeDirection}
          onComplete={handleFlashComplete}
        />
      )}

      {phase === 'result' && (
        <ResultScreen
          mode={mode}
          score={score}
          totalRounds={TOTAL_ROUNDS}
          totalCards={totalCards}
          onRetry={handleRetry}
          onBackToSetup={mode === 'rangeTrain' ? handleBackToSetup : undefined}
        />
      )}
    </main>
  );
}
