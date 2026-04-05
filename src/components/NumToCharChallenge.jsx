import { useState, useCallback, useEffect, useRef } from 'react';
import { generateNumToCharRound, TOTAL_ROUNDS, CARDS_PER_ROUND } from '../utils/trainUtils';

export default function NumToCharChallenge({ filledEntries, onComplete }) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [challenge, setChallenge] = useState(null);
  const [expectedIndex, setExpectedIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [matchedNums, setMatchedNums] = useState(new Set());
  const [correctChoices, setCorrectChoices] = useState(new Set());
  const [wrongChoice, setWrongChoice] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const timerRef = useRef(null);

  const startRound = useCallback(
    (currentRound, currentScore) => {
      if (currentRound >= TOTAL_ROUNDS) {
        onComplete(currentScore);
        return;
      }
      const roundData = generateNumToCharRound(filledEntries);
      setChallenge(roundData);
      setExpectedIndex(0);
      setMistakes(0);
      setMatchedNums(new Set());
      setCorrectChoices(new Set());
      setWrongChoice(null);
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

  const handleChoice = (entry) => {
    if (!challenge || feedback) return;
    const expectedNum = challenge.ordered[expectedIndex].num;

    if (entry.num === expectedNum) {
      const newMatched = new Set(matchedNums);
      newMatched.add(expectedNum);
      setMatchedNums(newMatched);

      const newCorrect = new Set(correctChoices);
      newCorrect.add(entry.num);
      setCorrectChoices(newCorrect);

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
      setWrongChoice(entry.num);
      setTimeout(() => setWrongChoice(null), 400);
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
            className={`number-card${matchedNums.has(entry.num) ? ' matched' : ''}`}
          >
            <span className="num">{entry.num}</span>
          </div>
        ))}
      </div>

      <p className="instruction">Clique nos personagens na ordem correta</p>

      <div className="choices-row">
        {challenge.choices.map((entry) => {
          let cls = 'choice-card';
          if (correctChoices.has(entry.num)) cls += ' correct disabled';
          else if (wrongChoice === entry.num) cls += ' wrong';
          return (
            <div
              key={entry.num}
              className={cls}
              data-num={entry.num}
              onClick={() => handleChoice(entry)}
            >
              <div className="choice-art">
                {entry.image ? (
                  <img
                    src={entry.image}
                    alt={entry.persona}
                    onError={(e) => {
                      e.target.parentElement.innerHTML = '<span>🧑</span>';
                    }}
                  />
                ) : (
                  <span>🧑</span>
                )}
              </div>
              <div className="choice-name">{entry.persona}</div>
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
