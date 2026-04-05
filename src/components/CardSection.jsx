import CardItem from './CardItem';

export default function CardSection({ start, end, cards, filledCount, onCardClick }) {
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
