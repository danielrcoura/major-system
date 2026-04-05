import type { DeckData, ImportResult } from './types';
import { validateDeckData } from './validator';

export function exportDeck(data: DeckData): string {
  return JSON.stringify(data, null, 2);
}

export function importDeck(json: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { success: false, error: 'JSON malformado: não foi possível fazer parse da string' };
  }

  if (!validateDeckData(parsed)) {
    return { success: false, error: 'Estrutura inválida: o JSON não corresponde ao formato DeckData esperado' };
  }

  return { success: true, data: parsed };
}
