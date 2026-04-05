import { DeckEntry, TrainMode } from '../types';

export interface FilledEntry extends DeckEntry {
  num: string;
}

export interface NumToCharRound {
  ordered: FilledEntry[];
  choices: FilledEntry[];
}

export interface CharToNumRound {
  ordered: FilledEntry[];
  numChoices: string[];
}

export interface ProgressInfo {
  label: string;
  percentage: number;
}

export const TOTAL_ROUNDS = 10;
export const CARDS_PER_ROUND = 3;
export const DISTRACTORS = 2;

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
 * Generate a random 2-digit string not in the exclude set.
 */
export function randomNum(exclude: Set<string>): string {
  let n: string;
  do {
    n = String(Math.floor(Math.random() * 100)).padStart(2, '0');
  } while (exclude.has(n));
  return n;
}

/**
 * Generate a challenge round for NumToChar mode.
 * Picks 3 targets from filledEntries, adds 2 distractors, shuffles choices.
 */
export function generateNumToCharRound(filledEntries: FilledEntry[]): NumToCharRound {
  const shuffled = shuffle(filledEntries);
  const picked = shuffled.slice(0, CARDS_PER_ROUND);
  const pickedNums = new Set(picked.map((e) => e.num));
  const extras = shuffled.filter((e) => !pickedNums.has(e.num)).slice(0, DISTRACTORS);
  const choices = shuffle([...picked, ...extras]);
  return { ordered: picked, choices };
}

/**
 * Generate a challenge round for CharToNum mode.
 * Picks 3 targets from filledEntries, adds 2 distractor numbers, shuffles number choices.
 */
export function generateCharToNumRound(filledEntries: FilledEntry[]): CharToNumRound {
  const shuffled = shuffle(filledEntries);
  const picked = shuffled.slice(0, CARDS_PER_ROUND);
  const pickedNums = new Set(picked.map((e) => e.num));
  const extraNums: string[] = [];
  for (let i = 0; i < DISTRACTORS; i++) {
    const n = randomNum(new Set([...pickedNums, ...extraNums]));
    extraNums.push(n);
  }
  const numChoices = shuffle([...picked.map((e) => e.num), ...extraNums]);
  return { ordered: picked, numChoices };
}

/**
 * Get the result emoji based on score percentage.
 */
export function getResultEmoji(score: number, totalRounds: number): string {
  const pct = Math.round((score / totalRounds) * 100);
  if (pct >= 80) return '🏆';
  if (pct >= 50) return '👍';
  return '💪';
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
 * Check if the start button should be enabled.
 */
export function isStartEnabled(mode: TrainMode, filledCount: number): boolean {
  if (mode === 'flashCards' || mode === 'rangeTrain') return filledCount >= 1;
  return filledCount >= CARDS_PER_ROUND + DISTRACTORS; // >= 5
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
