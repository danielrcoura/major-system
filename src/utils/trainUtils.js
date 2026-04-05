export const TOTAL_ROUNDS = 10;
export const CARDS_PER_ROUND = 3;
export const DISTRACTORS = 2;

/**
 * Fisher-Yates shuffle — returns a new shuffled array.
 * @param {any[]} arr
 * @returns {any[]}
 */
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Generate a random 2-digit string not in the exclude set.
 * @param {Set<string>} exclude
 * @returns {string}
 */
export function randomNum(exclude) {
  let n;
  do {
    n = String(Math.floor(Math.random() * 100)).padStart(2, '0');
  } while (exclude.has(n));
  return n;
}

/**
 * Generate a challenge round for NumToChar mode.
 * Picks 3 targets from filledEntries, adds 2 distractors, shuffles choices.
 * @param {Array} filledEntries
 * @returns {{ ordered: Array, choices: Array }}
 */
export function generateNumToCharRound(filledEntries) {
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
 * @param {Array} filledEntries
 * @returns {{ ordered: Array, numChoices: string[] }}
 */
export function generateCharToNumRound(filledEntries) {
  const shuffled = shuffle(filledEntries);
  const picked = shuffled.slice(0, CARDS_PER_ROUND);
  const pickedNums = new Set(picked.map((e) => e.num));
  const extraNums = [];
  for (let i = 0; i < DISTRACTORS; i++) {
    const n = randomNum(new Set([...pickedNums, ...extraNums]));
    extraNums.push(n);
  }
  const numChoices = shuffle([...picked.map((e) => e.num), ...extraNums]);
  return { ordered: picked, numChoices };
}

/**
 * Get the result emoji based on score percentage.
 * @param {number} score
 * @param {number} totalRounds
 * @returns {string}
 */
export function getResultEmoji(score, totalRounds) {
  const pct = Math.round((score / totalRounds) * 100);
  if (pct >= 80) return '🏆';
  if (pct >= 50) return '👍';
  return '💪';
}

/**
 * Calculate flash card progress.
 * @param {number} currentIndex - 0-based index of current card
 * @param {number} total - total number of cards
 * @returns {{ label: string, percentage: number }}
 */
export function calculateProgress(currentIndex, total) {
  return {
    label: `Carta ${currentIndex + 1} / ${total}`,
    percentage: Math.round((currentIndex / total) * 100),
  };
}

/**
 * Check if the start button should be enabled.
 * @param {string} mode - 'numToChar' | 'charToNum' | 'flashCards'
 * @param {number} filledCount
 * @returns {boolean}
 */
export function isStartEnabled(mode, filledCount) {
  if (mode === 'flashCards') return filledCount >= 1;
  return filledCount >= CARDS_PER_ROUND + DISTRACTORS; // >= 5
}
