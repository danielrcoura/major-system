import { useContext } from 'react';
import { DeckDataContext } from '../context/DeckDataContext';

export function useDeckData() {
  const context = useContext(DeckDataContext);
  if (!context) {
    throw new Error('useDeckData must be used within a DeckDataProvider');
  }

  const { state, dispatch } = context;

  function saveCard(num, entry) {
    dispatch({ type: 'SAVE_CARD', num, entry });
  }

  function importData(data) {
    dispatch({ type: 'IMPORT_DATA', data });
  }

  function getFilledEntries() {
    return Object.entries(state.data)
      .filter(([, entry]) => entry.persona && entry.persona.trim() !== '')
      .map(([num, entry]) => ({ num, ...entry }));
  }

  return { data: state.data, saveCard, importData, getFilledEntries };
}
