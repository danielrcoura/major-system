import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { render, screen } from '@testing-library/react';
import TrainSetup from './TrainSetup';
import type { TrainMode } from '../types';

/**
 * Feature: react-migration, Property 9: Botão de início do treino respeita mínimo de cartões
 * Validates: Requirements 7.3, 7.4, 7.5
 */
describe('Property 9: Botão de início do treino respeita mínimo de cartões', () => {
  it('start button is disabled when filledCount < 5 for challenge modes, and < 1 for flashCards', () => {
    const modeArb: fc.Arbitrary<TrainMode> = fc.constantFrom('numToChar' as TrainMode, 'charToNum' as TrainMode, 'flashCards' as TrainMode);
    const filledCountArb: fc.Arbitrary<number> = fc.integer({ min: 0, max: 100 });

    fc.assert(
      fc.property(modeArb, filledCountArb, (mode: TrainMode, filledCount: number) => {
        const { container } = render(
          <TrainSetup
            filledCount={filledCount}
            mode={mode}
            onModeChange={(_mode: TrainMode) => {}}
            onStart={() => {}}
          />
        );

        const btn = container.querySelector('.btn-start');

        if (mode === 'flashCards') {
          if (filledCount >= 1) {
            expect(btn.disabled).toBe(false);
          } else {
            expect(btn.disabled).toBe(true);
          }
        } else {
          // numToChar or charToNum require >= 5
          if (filledCount >= 5) {
            expect(btn.disabled).toBe(false);
          } else {
            expect(btn.disabled).toBe(true);
          }
        }
      }),
      { numRuns: 100 }
    );
  });
});
