import { createContext, useReducer } from 'react';

const STORAGE_KEY = 'pao-major-system';

function loadFromStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function persistToStorage(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function deckDataReducer(state, action) {
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

export const DeckDataContext = createContext(null);

export function DeckDataProvider({ children }) {
  const [state, dispatch] = useReducer(deckDataReducer, {
    data: loadFromStorage(),
  });

  return (
    <DeckDataContext.Provider value={{ state, dispatch }}>
      {children}
    </DeckDataContext.Provider>
  );
}
