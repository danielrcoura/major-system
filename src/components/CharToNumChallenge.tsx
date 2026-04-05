import { useState, useCallback, useEffect, useRef } from 'react';
import { FilledEntry, CharToNumRound, generateCharToNumRound, TOTAL_ROUNDS, CARDS_PER_ROUND } from '../utils/trainUtils';

interface CharToNumChallengeProps {
  filledEntries: FilledEntry[];
  onComplete: (score: number) => void;
}

interface FeedbackState {
  text: string;
  success: boolean;
}

export default function CharToNumChallenge({ filledEntries, onComplete }: CharToNumChallengeProps) {
  const [round, setRound] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [challenge, setChallenge] = useState<CharToNumRound | null>(null);
  const [expectedIndex, setExpectedIndex] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [matchedChars, setMatchedChars] = useState<Set<number>>(new Set());
  const [correctNums, setCorrectNums] = useState<Set<string>>(new Set());
  const [wrongNum, setWrongNum] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startRound = useCallback(
    (currentRound: number, currentScore: number) => {
      if (currentRound >= TOTAL_ROUNDS) {
        onComplete(currentScore);
        return;
      }
      const roundData = generateCharToNumRound(filledEntries);
      setChallenge(roundData);
      setExpectedIndex(0);
      setMistakes(0);
      setMatchedChars(new Set());
      setCorrectNums(new Set());
      setWrongNum(null);
      setFeedback(null);
    },
    [filledEntries, onComplete]
  );

  useEffect(() => {
    startRound(0, 0);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startRound]);

  const handleChoice = (num: string): void => {
    if (!challenge || feedback) return;
    const expectedNum = challenge.ordered[expectedIndex].num;

    if (num === expectedNum) {
      const newMatchedChars = new Set(matchedChars);
      newMatchedChars.add(expectedIndex);
      setMatchedChars(newMatchedChars);

      const newCorrectNums = new Set(correctNums);
      newCorrectNums.add(num);
      setCorrectNums(newCorrectNums);

      const nextIndex = expectedIndex + 1;
      setExpectedIndex(nextIndex);

      if (nextIndex >= CARDS_PER_ROUND) {
        const newScore = mistakes === 0 ? score + 1 : score;
        setScore(newScore);
        const fb =
          mistakes === 0
            ? 'Perfeito!'
            : `Concluído com ${mistakes} erro(s)`;
        setFeedback({ text: fb, success: mistakes === 0 });

        const nextRound = round + 1;
        setRound(nextRound);

        timerRef.current = setTimeout(() => {
          startRound(nextRound, newScore);
        }, 1200);
      }
    } else {
      setMistakes((m) => m + 1);
      setWrongNum(num);
      setTimeout(() => setWrongNum(null), 400);
    }
  };

  if (!challenge) return null;

  return (
    <div className="train-panel">
      <div className="challenge-header">
        <span className="round-label">Desafio {round + 1} / {TOTAL_ROUNDS}</span>
        <span className="score-label">✓ {score}</span>
      </div>

      <div className="numbers-row">
        {challenge.ordered.map((entry, i) => (
          <div
            key={entry.num}
            className={`char-display${matchedChars.has(i) ? ' matched' : ''}`}
          >
            <div className="choice-art">
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
            <div className="choice-name">{entry.persona}</div>
          </div>
        ))}
      </div>

      <p className="instruction">Clique nos números na ordem correta</p>

      <div className="choices-row">
        {challenge.numChoices.map((num) => {
          let cls = 'number-choice';
          if (correctNums.has(num)) cls += ' correct disabled';
          else if (wrongNum === num) cls += ' wrong';
          return (
            <div
              key={num}
              className={cls}
              data-num={num}
              onClick={() => handleChoice(num)}
            >
              {num}
            </div>
          );
        })}
      </div>

      {feedback && (
        <div className={`feedback ${feedback.success ? 'success' : 'fail'}`}>
          {feedback.text}
        </div>
      )}
    </div>
  );
}
