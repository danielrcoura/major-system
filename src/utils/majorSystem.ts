export type MajorMap = Record<number, string[]>;

export interface ConsonantsResult {
  first: string[];
  second: string[];
  label: string;
}

// Major System mapping: digit -> consonant sounds
export const MAJOR: MajorMap = {
  0: ['s', 'z'],
  1: ['t', 'd', 'th'],
  2: ['n'],
  3: ['m'],
  4: ['r'],
  5: ['l'],
  6: ['j', 'ch', 'sh'],
  7: ['g', 'c', 'k', 'q', 'ck'],
  8: ['v', 'f', 'ph'],
  9: ['p', 'b'],
};

// All valid single-character consonants in the Major System
const MAJOR_CONSONANTS = new Set(
  Object.values(MAJOR).flat().filter((s) => s.length === 1)
);

/**
 * Get consonants for a two-digit number (0–99).
 * @param {number} num - A number between 0 and 99
 * @returns {{ first: string[], second: string[], label: string }}
 */
export function getConsonants(num: number): ConsonantsResult {
  const d1 = Math.floor(num / 10);
  const d2 = num % 10;
  return {
    first: MAJOR[d1],
    second: MAJOR[d2],
    label: `${d1}=${MAJOR[d1].join('/')} + ${d2}=${MAJOR[d2].join('/')}`,
  };
}

/**
 * Extract Major System consonants from a string, handling multi-char sounds
 * (th, ch, sh, ck, ph) as single units.
 * @param {string} name - Input string (e.g. a character name)
 * @returns {string[]} Array of Major System consonant sounds found
 */
export function extractMajorConsonants(name: string): string[] {
  const lower = name.toLowerCase().replace(/[^a-z]/g, '');
  const consonants: string[] = [];

  for (let i = 0; i < lower.length; i++) {
    const ch = lower[i];
    const next = lower[i + 1] || '';

    // Multi-char sounds
    if (ch === 't' && next === 'h') { consonants.push('th'); i++; continue; }
    if (ch === 'c' && next === 'h') { consonants.push('ch'); i++; continue; }
    if (ch === 's' && next === 'h') { consonants.push('sh'); i++; continue; }
    if (ch === 'c' && next === 'k') { consonants.push('ck'); i++; continue; }
    if (ch === 'p' && next === 'h') { consonants.push('ph'); i++; continue; }

    // Single consonants in major system
    if (MAJOR_CONSONANTS.has(ch)) {
      consonants.push(ch);
    }
  }

  return consonants;
}
