import { FSRS, createEmptyCard, type Card, type ReviewLog, type Rating } from 'ts-fsrs';
import type { DeckData, DeckEntry } from './types';
import type { FSRSRepository } from './fsrsRepository';

export interface PendingCard {
  key: string;
  entry: DeckEntry;
  fsrsCard: Card;
}

const fsrs = new FSRS({});

export function getPendingCards(
  deckData: DeckData,
  repo: FSRSRepository,
  now: Date = new Date(),
): PendingCard[] {
  const allCards = repo.getAllCards();
  const pending: PendingCard[] = [];

  for (const [key, entry] of Object.entries(deckData)) {
    if (!entry.persona || entry.persona.trim() === '') continue;

    const fsrsCard = allCards[key];
    if (!fsrsCard || fsrsCard.due <= now) {
      pending.push({
        key,
        entry,
        fsrsCard: fsrsCard ?? createEmptyCard(),
      });
    }
  }

  return pending;
}

export function processRating(
  key: string,
  card: Card,
  rating: Rating,
  repo: FSRSRepository,
): { card: Card; log: ReviewLog } {
  const result = fsrs.repeat(card, new Date());
  const scheduled = result[rating];
  repo.saveReview(key, scheduled.card, scheduled.log);
  return { card: scheduled.card, log: scheduled.log };
}

export function getOrCreateCard(key: string, repo: FSRSRepository): Card {
  return repo.getCard(key) ?? createEmptyCard();
}
