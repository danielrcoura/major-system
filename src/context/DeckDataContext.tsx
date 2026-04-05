import React, { createContext, useReducer } from 'react';
import { DeckData, DeckEntry } from '../types';

const STORAGE_KEY = 'pao-major-system';

export interface DeckState {
  data: DeckData;
}

export type DeckAction =
  | { type: 'SAVE_CARD'; num: string; entry: DeckEntry }
  | { type: 'IMPORT_DATA'; data: DeckData }
  | { type: 'LOAD_DATA'; data: DeckData };

export interface DeckDataContextValue {
  state: DeckState;
  dispatch: React.Dispatch<DeckAction>;
}

function loadFromStorage(): DeckData {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function persistToStorage(data: DeckData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function deckDataReducer(state: DeckState, action: DeckAction): DeckState {
  switch (action.type) {
    case 'SAVE_CARD': {
      const newData = { ...state.data, [action.num]: action.entry };
      persistToStorage(newData);
      return { ...state, data: newData };
    }
    case 'IMPORT_DATA': {
      persistToStorage(action.data);
      return { ...state, data: action.data };
    }
    case 'LOAD_DATA': {
      return { ...state, data: action.data };
    }
    default:
      return state;
  }
}

export const DeckDataContext = createContext<DeckDataContextValue | undefined>(undefined);

export function DeckDataProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(deckDataReducer, {
    data: loadFromStorage(),
  });

  return (
    <DeckDataContext.Provider value={{ state, dispatch }}>
      {children}
    </DeckDataContext.Provider>
  );
}
