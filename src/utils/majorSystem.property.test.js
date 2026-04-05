import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { MAJOR, getConsonants, extractMajorConsonants } from './majorSystem';

/**
 * Feature: react-migration, Property 1: Mapeamento do Sistema Major é correto
 * Validates: Requirements 13.2
 */
describe('Property 1: Mapeamento do Sistema Major é correto', () => {
  it('for any two-digit number (0–99), getConsonants returns consonants matching the MAJOR mapping and label contains both sets', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 99 }),
        (num) => {
          const d1 = Math.floor(num / 10);
          const d2 = num % 10;
          const result = getConsonants(num);

          // first and second must match the MAJOR mapping for each digit
          expect(result.first).toEqual(MAJOR[d1]);
          expect(result.second).toEqual(MAJOR[d2]);

          // label must contain both consonant sets
          for (const c of MAJOR[d1]) {
            expect(result.label).toContain(c);
          }
          for (const c of MAJOR[d2]) {
            expect(result.label).toContain(c);
          }

          // label must contain both digit references
          expect(result.label).toContain(`${d1}=`);
          expect(result.label).toContain(`${d2}=`);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: react-migration, Property 2: Extração de consoantes retorna apenas sons do Sistema Major
 * Validates: Requirements 13.3
 */
describe('Property 2: Extração de consoantes retorna apenas sons do Sistema Major', () => {
  // Build the set of all valid Major System sounds (single and multi-char)
  const ALL_MAJOR_SOUNDS = new Set(Object.values(MAJOR).flat());

  it('for any input string, extractMajorConsonants returns only valid Major System sounds and multi-char sounds are single units', () => {
    fc.assert(
      fc.property(
        fc.string(),
        (input) => {
          const result = extractMajorConsonants(input);

          // Every returned element must be a valid Major System sound
          for (const sound of result) {
            expect(ALL_MAJOR_SOUNDS.has(sound)).toBe(true);
          }

          // Multi-char sounds must appear as single units, never split
          const multiCharSounds = ['th', 'ch', 'sh', 'ck', 'ph'];
          for (const sound of result) {
            if (sound.length > 1) {
              expect(multiCharSounds).toContain(sound);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
