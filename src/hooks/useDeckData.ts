import { useContext } from 'react';
import { DeckDataContext } from '../context/DeckDataContext';
import { DeckData, DeckEntry } from '../types';
import { FilledEntry } from '../utils/trainUtils';

export interface UseDeckDataReturn {
  data: DeckData;
  saveCard: (num: string, entry: DeckEntry) => void;
  importData: (data: DeckData) => void;
  getFilledEntries: () => FilledEntry[];
}

export function useDeckData(): UseDeckDataReturn {
  const context = useContext(DeckDataContext);
  if (!context) {
    throw new Error('useDeckData must be used within a DeckDataProvider');
  }

  const { state, dispatch } = context;

  function saveCard(num: string, entry: DeckEntry): void {
    dispatch({ type: 'SAVE_CARD', num, entry });
  }

  function importData(data: DeckData): void {
    dispatch({ type: 'IMPORT_DATA', data });
  }

  function getFilledEntries(): FilledEntry[] {
    return Object.entries(state.data)
      .filter(([, entry]) => entry.persona && entry.persona.trim() !== '')
      .map(([num, entry]) => ({ num, ...entry }));
  }

  return { data: state.data, saveCard, importData, getFilledEntries };
}
