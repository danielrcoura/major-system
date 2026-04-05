import { DeckEntry } from '../types';

export interface FilledEntry extends DeckEntry {
  num: string;
}

export interface ProgressInfo {
  label: string;
  percentage: number;
}

/**
 * Fisher-Yates shuffle — returns a new shuffled array.
 */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Calculate flash card progress.
 */
export function calculateProgress(currentIndex: number, total: number): ProgressInfo {
  return {
    label: `Carta ${currentIndex + 1} / ${total}`,
    percentage: Math.round((currentIndex / total) * 100),
  };
}

/**
 * Filter entries whose number belongs to the given range (e.g., rangeStart=1 → 10-19).
 */
export function filterByRange(entries: FilledEntry[], rangeStart: number): FilledEntry[] {
  return entries.filter((e) => Math.floor(parseInt(e.num) / 10) === rangeStart);
}

/**
 * Filter entries whose number contains the given digit in any position.
 */
export function filterByDigit(entries: FilledEntry[], digit: number): FilledEntry[] {
  const d = String(digit);
  return entries.filter((e) => e.num.includes(d));
}

/**
 * Count filled entries whose number belongs to the given range.
 */
export function countFilledInRange(entries: FilledEntry[], rangeStart: number): number {
  return filterByRange(entries, rangeStart).length;
}

/**
 * Count filled entries whose number contains the given digit.
 */
export function countFilledWithDigit(entries: FilledEntry[], digit: number): number {
  return filterByDigit(entries, digit).length;
}
