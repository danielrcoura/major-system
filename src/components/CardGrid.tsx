import { DeckData, DeckEntry } from '../types';
import { getConsonants } from '../utils/majorSystem';
import CardSection from './CardSection';

interface CardGridProps {
  data: DeckData;
  filter: string;
  onCardClick: (num: string) => void;
}

export default function CardGrid({ data, filter, onCardClick }: CardGridProps) {
  const sections: React.ReactElement[] = [];

  for (let group = 0; group < 10; group++) {
    const start = group * 10;
    const end = start + 9;
    const cards: { num: string; entry: Partial<DeckEntry> }[] = [];
    let filledCount = 0;

    for (let i = start; i <= end; i++) {
      const num = String(i).padStart(2, '0');
      const entry: Partial<DeckEntry> = data[num] || {};
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
