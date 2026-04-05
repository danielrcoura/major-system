import { useState } from 'react';
import { SelectionMode, TrainDirection } from '../types';
import {
  FilledEntry,
  filterByRange,
  filterByDigit,
  countFilledInRange,
  countFilledWithDigit,
} from '../utils/trainUtils';

interface RangeTrainSetupProps {
  filledEntries: FilledEntry[];
  onStart: (filteredEntries: FilledEntry[], direction: TrainDirection) => void;
  onBack?: () => void;
}

const RANGES = Array.from({ length: 10 }, (_, i) => i);
const DIGITS = Array.from({ length: 10 }, (_, i) => i);

function rangeLabel(r: number): string {
  return `${String(r * 10).padStart(2, '0')}-${String(r * 10 + 9).padStart(2, '0')}`;
}

export default function RangeTrainSetup({ filledEntries, onStart, onBack }: RangeTrainSetupProps) {
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('range');
  const [selected, setSelected] = useState<number | null>(null);
  const [direction, setDirection] = useState<TrainDirection>('numToChar');

  const filledCount =
    selected !== null
      ? selectionMode === 'range'
        ? countFilledInRange(filledEntries, selected)
        : countFilledWithDigit(filledEntries, selected)
      : 0;

  const canStart = selected !== null && filledCount >= 1;

  function handleModeChange(mode: SelectionMode) {
    setSelectionMode(mode);
    setSelected(null);
  }

  function handleSelect(value: number) {
    setSelected(value);
  }

  function handleStart() {
    if (selected === null) return;
    const filtered =
      selectionMode === 'range'
        ? filterByRange(filledEntries, selected)
        : filterByDigit(filledEntries, selected);
    onStart(filtered, direction);
  }

  return (
    <div className="train-panel">
      <h2>Treino por Range</h2>

      {/* Selection mode toggle */}
      <div className="mode-selector">
        <button
          className={`mode-btn${selectionMode === 'range' ? ' active' : ''}`}
          data-testid="selection-mode-range"
          onClick={() => handleModeChange('range')}
        >
          Por Range
        </button>
        <button
          className={`mode-btn${selectionMode === 'digit' ? ' active' : ''}`}
          data-testid="selection-mode-digit"
          onClick={() => handleModeChange('digit')}
        >
          Por Dígito
        </button>
      </div>

      {/* Range or digit grid */}
      <div className="range-grid">
        {selectionMode === 'range'
          ? RANGES.map((r) => {
              const count = countFilledInRange(filledEntries, r);
              const isDisabled = count === 0;
              const isActive = selected === r;
              return (
                <button
                  key={r}
                  className={`mode-btn${isActive ? ' active' : ''}`}
                  data-testid={`range-item-${r}`}
                  disabled={isDisabled}
                  onClick={() => handleSelect(r)}
                >
                  {rangeLabel(r)}
                  <span className="item-count">({count})</span>
                </button>
              );
            })
          : DIGITS.map((d) => {
              const count = countFilledWithDigit(filledEntries, d);
              const isDisabled = count === 0;
              const isActive = selected === d;
              return (
                <button
                  key={d}
                  className={`mode-btn${isActive ? ' active' : ''}`}
                  data-testid={`digit-item-${d}`}
                  disabled={isDisabled}
                  onClick={() => handleSelect(d)}
                >
                  {d}
                  <span className="item-count">({count})</span>
                </button>
              );
            })}
      </div>

      {/* Filled count display */}
      <p className="train-info" data-testid="filled-count">
        {selected !== null
          ? `Cartões preenchidos: ${filledCount}`
          : 'Selecione um range ou dígito'}
      </p>

      {/* Direction toggle */}
      <div className="mode-selector">
        <button
          className={`mode-btn${direction === 'numToChar' ? ' active' : ''}`}
          data-testid="direction-numToChar"
          onClick={() => setDirection('numToChar')}
        >
          Número → Personagem
        </button>
        <button
          className={`mode-btn${direction === 'charToNum' ? ' active' : ''}`}
          data-testid="direction-charToNum"
          onClick={() => setDirection('charToNum')}
        >
          Personagem → Número
        </button>
      </div>

      {/* Start button */}
      <button
        className="btn-start"
        data-testid="start-btn"
        disabled={!canStart}
        onClick={handleStart}
      >
        Começar Treino
      </button>

      {onBack && (
        <button
          className="btn-start"
          data-testid="back-btn"
          style={{ marginTop: '0.5rem' }}
          onClick={onBack}
        >
          Voltar
        </button>
      )}
    </div>
  );
}
