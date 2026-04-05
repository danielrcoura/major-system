import React, { createContext, useReducer } from 'react';
import { DeckData, DeckEntry } from '../types';
import { deckCore } from '../domain';

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

export function deckDataReducer(state: DeckState, action: DeckAction): DeckState {
  switch (action.type) {
    case 'SAVE_CARD': {
      deckCore.saveCard(action.num, action.entry);
      const newData = { ...state.data, [action.num]: action.entry };
      return { ...state, data: newData };
    }
    case 'IMPORT_DATA': {
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
    data: deckCore.getAll(),
  });

  return (
    <DeckDataContext.Provider value={{ state, dispatch }}>
      {children}
    </DeckDataContext.Provider>
  );
}
