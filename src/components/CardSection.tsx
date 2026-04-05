import { DeckEntry } from '../types';
import CardItem from './CardItem';

interface CardSectionProps {
  start: number;
  end: number;
  cards: { num: string; entry: Partial<DeckEntry> }[];
  filledCount: number;
  onCardClick: (num: string) => void;
}

export default function CardSection({ start, end, cards, filledCount, onCardClick }: CardSectionProps) {
  const startStr = String(start).padStart(2, '0');
  const endStr = String(end).padStart(2, '0');

  return (
    <div className="section">
      <div className="section-header">
        <span className="section-title">
          {startStr} — {endStr}
        </span>
        <span className="section-progress">{filledCount}/10</span>
      </div>
      <div className="section-cards">
        {cards.map(({ num, entry }) => (
          <CardItem key={num} num={num} entry={entry} onClick={onCardClick} />
        ))}
      </div>
    </div>
  );
}
