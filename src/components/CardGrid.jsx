import { getConsonants } from '../utils/majorSystem';
import CardSection from './CardSection';

export default function CardGrid({ data, filter, onCardClick }) {
  const sections = [];

  for (let group = 0; group < 10; group++) {
    const start = group * 10;
    const end = start + 9;
    const cards = [];
    let filledCount = 0;

    for (let i = start; i <= end; i++) {
      const num = String(i).padStart(2, '0');
      const entry = data[num] || {};
      const { label } = getConsonants(i);

      if (filter) {
        const f = filter.toLowerCase();
        const matchNum = num.includes(f);
        const matchName = (entry.persona || '').toLowerCase().includes(f);
        const matchCons = label.toLowerCase().includes(f);
        if (!matchNum && !matchName && !matchCons) continue;
      }

      if (entry.persona && entry.persona.trim()) {
        filledCount++;
      }
      cards.push({ num, entry });
    }

    if (cards.length === 0) continue;

    sections.push(
      <CardSection
        key={group}
        start={start}
        end={end}
        cards={cards}
        filledCount={filledCount}
        onCardClick={onCardClick}
      />
    );
  }

  return <>{sections}</>;
}
