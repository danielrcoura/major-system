import type { Card, ReviewLog } from 'ts-fsrs';

export interface SerializedFSRSCard {
  due: string;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  learning_steps: number;
  state: number;
  last_review?: string;
}

export interface SerializedReviewLog {
  rating: number;
  state: number;
  due: string;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  last_elapsed_days: number;
  scheduled_days: number;
  learning_steps: number;
  review: string;
}

export interface FSRSStoreData {
  cards: Record<string, SerializedFSRSCard>;
  logs: Record<string, SerializedReviewLog[]>;
}

function serializeCard(card: Card): SerializedFSRSCard {
  const serialized: SerializedFSRSCard = {
    due: card.due.toISOString(),
    stability: card.stability,
    difficulty: card.difficulty,
    elapsed_days: card.elapsed_days,
    scheduled_days: card.scheduled_days,
    reps: card.reps,
    lapses: card.lapses,
    learning_steps: card.learning_steps,
    state: card.state as number,
  };
  if (card.last_review) {
    serialized.last_review = card.last_review.toISOString();
  }
  return serialized;
}

function deserializeCard(s: SerializedFSRSCard): Card {
  return {
    due: new Date(s.due),
    stability: s.stability,
    difficulty: s.difficulty,
    elapsed_days: s.elapsed_days,
    scheduled_days: s.scheduled_days,
    reps: s.reps,
    lapses: s.lapses,
    learning_steps: s.learning_steps,
    state: s.state,
    ...(s.last_review ? { last_review: new Date(s.last_review) } : {}),
  } as Card;
}

function serializeLog(log: ReviewLog): SerializedReviewLog {
  return {
    rating: log.rating as number,
    state: log.state as number,
    due: log.due.toISOString(),
    stability: log.stability,
    difficulty: log.difficulty,
    elapsed_days: log.elapsed_days,
    last_elapsed_days: log.last_elapsed_days,
    scheduled_days: log.scheduled_days,
    learning_steps: log.learning_steps,
    review: log.review.toISOString(),
  };
}

function deserializeLog(s: SerializedReviewLog): ReviewLog {
  return {
    rating: s.rating,
    state: s.state,
    due: new Date(s.due),
    stability: s.stability,
    difficulty: s.difficulty,
    elapsed_days: s.elapsed_days,
    last_elapsed_days: s.last_elapsed_days,
    scheduled_days: s.scheduled_days,
    learning_steps: s.learning_steps,
    review: new Date(s.review),
  } as ReviewLog;
}

export function serializeFSRSStore(data: {
  cards: Record<string, Card>;
  logs: Record<string, ReviewLog[]>;
}): string {
  const store: FSRSStoreData = { cards: {}, logs: {} };
  for (const [key, card] of Object.entries(data.cards)) {
    store.cards[key] = serializeCard(card);
  }
  for (const [key, logList] of Object.entries(data.logs)) {
    store.logs[key] = logList.map(serializeLog);
  }
  return JSON.stringify(store);
}

export function deserializeFSRSStore(
  json: string,
): { cards: Record<string, Card>; logs: Record<string, ReviewLog[]> } | null {
  try {
    const parsed = JSON.parse(json);
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      typeof parsed.cards !== 'object' ||
      typeof parsed.logs !== 'object'
    ) {
      return null;
    }
    const cards: Record<string, Card> = {};
    const logs: Record<string, ReviewLog[]> = {};
    for (const [key, val] of Object.entries(parsed.cards)) {
      const s = val as SerializedFSRSCard;
      if (typeof s.due !== 'string' || typeof s.stability !== 'number') {
        return null;
      }
      cards[key] = deserializeCard(s);
    }
    for (const [key, val] of Object.entries(parsed.logs)) {
      if (!Array.isArray(val)) return null;
      logs[key] = (val as SerializedReviewLog[]).map(deserializeLog);
    }
    return { cards, logs };
  } catch {
    return null;
  }
}
