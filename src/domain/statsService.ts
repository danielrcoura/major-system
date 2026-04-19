import { State, Rating, type Card, type ReviewLog } from 'ts-fsrs';
import type { DeckData } from './types';
import type { FSRSRepository } from './fsrsRepository';

export interface ReviewStats {
  ratingDistribution: Record<string, number>;
  cardsByState: Record<string, number>;
  hardestCards: { key: string; persona: string; lapses: number; difficulty: number }[];
}

const STATE_LABELS: Record<number, string> = {
  [State.New]: 'Novo',
  [State.Learning]: 'Aprendendo',
  [State.Review]: 'Revisão',
  [State.Relearning]: 'Reaprendendo',
};

const RATING_LABELS: Record<number, string> = {
  [Rating.Again]: 'Again',
  [Rating.Hard]: 'Hard',
  [Rating.Good]: 'Good',
  [Rating.Easy]: 'Easy',
};

export function computeStats(deckData: DeckData, repo: FSRSRepository): ReviewStats {
  const { cards, logs } = repo.loadAll();

  // Rating distribution from all logs
  const ratingDistribution: Record<string, number> = {
    Again: 0, Hard: 0, Good: 0, Easy: 0,
  };
  for (const logList of Object.values(logs)) {
    for (const log of logList) {
      const label = RATING_LABELS[log.rating as number];
      if (label) ratingDistribution[label]++;
    }
  }

  // Cards by state — count filled deck entries
  const cardsByState: Record<string, number> = {
    Novo: 0, Aprendendo: 0, Revisão: 0, Reaprendendo: 0,
  };
  for (const [key, entry] of Object.entries(deckData)) {
    if (!entry.persona || entry.persona.trim() === '') continue;
    const card = cards[key];
    const label = STATE_LABELS[card ? (card.state as number) : State.New];
    if (label) cardsByState[label]++;
  }

  // Top 10 hardest cards by lapses (tiebreak by difficulty)
  const hardestCards = Object.entries(cards)
    .filter(([key]) => deckData[key]?.persona)
    .map(([key, card]) => ({
      key,
      persona: deckData[key].persona,
      lapses: card.lapses,
      difficulty: card.difficulty,
    }))
    .sort((a, b) => b.lapses - a.lapses || b.difficulty - a.difficulty)
    .slice(0, 10);

  return { ratingDistribution, cardsByState, hardestCards };
}
