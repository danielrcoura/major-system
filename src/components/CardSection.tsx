import { useNavigate } from 'react-router';
import { DeckEntry } from '../types';
import { TrainDirection } from '../types';
import CardItem from './CardItem';

interface CardSectionProps {
  start: number;
  end: number;
  cards: { num: string; entry: Partial<DeckEntry> }[];
  filledCount: number;
  onCardClick: (num: string) => void;
}

export default function CardSection({ start, end, cards, filledCount, onCardClick }: CardSectionProps) {
  const navigate = useNavigate();
  const startStr = String(start).padStart(2, '0');
  const endStr = String(end).padStart(2, '0');
  const rangeIndex = Math.floor(start / 10);

  function handleTrain(direction: TrainDirection) {
    navigate('/treino', { state: { rangeIndex, direction } });
  }

  return (
    <div className="section">
      <div className="section-header">
        <span className="section-title">
          {startStr} — {endStr}
        </span>
        <div className="section-header-actions">
          <button
            className="section-train-btn"
            title="Treinar: Número → Personagem"
            disabled={filledCount === 0}
            onClick={() => handleTrain('numToChar')}
            aria-label={`Treinar ${startStr} a ${endStr}: Número para Personagem`}
          >
            🔢→👤
          </button>
          <button
            className="section-train-btn"
            title="Treinar: Personagem → Número"
            disabled={filledCount === 0}
            onClick={() => handleTrain('charToNum')}
            aria-label={`Treinar ${startStr} a ${endStr}: Personagem para Número`}
          >
            👤→🔢
          </button>
          <span className="section-progress">{filledCount}/10</span>
        </div>
      </div>
      <div className="section-cards">
        {cards.map(({ num, entry }) => (
          <CardItem key={num} num={num} entry={entry} onClick={onCardClick} />
        ))}
      </div>
    </div>
  );
}
