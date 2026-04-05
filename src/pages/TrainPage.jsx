import { useState, useCallback, useRef } from 'react';
import { useDeckData } from '../hooks/useDeckData';
import { TOTAL_ROUNDS } from '../utils/trainUtils';
import TrainSetup from '../components/TrainSetup';
import NumToCharChallenge from '../components/NumToCharChallenge';
import CharToNumChallenge from '../components/CharToNumChallenge';
import FlashCards from '../components/FlashCards';
import ResultScreen from '../components/ResultScreen';

export default function TrainPage() {
  const { getFilledEntries } = useDeckData();

  const [mode, setMode] = useState('numToChar');
  const [phase, setPhase] = useState('setup');
  const [score, setScore] = useState(0);
  const [totalCards, setTotalCards] = useState(0);
  const [filledEntries, setFilledEntries] = useState([]);
  const sessionRef = useRef(0);

  const handleStart = useCallback(() => {
    const entries = getFilledEntries();
    setFilledEntries(entries);
    setScore(0);
    setTotalCards(0);
    sessionRef.current += 1;
    setPhase('challenge');
  }, [getFilledEntries]);

  const handleChallengeComplete = useCallback((finalScore) => {
    setScore(finalScore);
    setPhase('result');
  }, []);

  const handleFlashComplete = useCallback((cardCount) => {
    setTotalCards(cardCount);
    setPhase('result');
  }, []);

  const handleRetry = useCallback(() => {
    const entries = getFilledEntries();
    setFilledEntries(entries);
    setScore(0);
    setTotalCards(0);
    sessionRef.current += 1;
    setPhase('challenge');
  }, [getFilledEntries]);

  const currentFilledCount = getFilledEntries().length;
  const sessionKey = sessionRef.current;

  return (
    <main>
      {phase === 'setup' && (
        <TrainSetup
          filledCount={currentFilledCount}
          mode={mode}
          onModeChange={setMode}
          onStart={handleStart}
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

      {phase === 'result' && (
        <ResultScreen
          mode={mode}
          score={score}
          totalRounds={TOTAL_ROUNDS}
          totalCards={totalCards}
          onRetry={handleRetry}
        />
      )}
    </main>
  );
}
