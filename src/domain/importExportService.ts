import type { Repository } from './repository';
import type { FSRSRepository } from './fsrsRepository';
import { serializeFSRSStore, deserializeFSRSStore } from './fsrsSerializer';
import { validateDeckData } from './validator';
import type { DeckData } from './types';

export function exportAll(deckRepo: Repository, fsrsRepo: FSRSRepository): string {
  const deck = deckRepo.getAll();
  const fsrsStore = fsrsRepo.loadAll();
  // Serialize→parse roundtrip: serializeCard/serializeLog aren't exported from fsrsSerializer,
  // so we reuse serializeFSRSStore to get properly serialized dates, then parse back to embed as JSON.
  const fsrs = JSON.parse(serializeFSRSStore(fsrsStore));
  return JSON.stringify({ version: 2, deck, fsrs }, null, 2);
}

type ImportResult = { success: true } | { success: false; error: string };

export function importAll(
  json: string,
  deckRepo: Repository,
  fsrsRepo: FSRSRepository,
): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { success: false, error: 'JSON malformado: não foi possível fazer parse da string' };
  }

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    (parsed as Record<string, unknown>).version !== 2
  ) {
    return { success: false, error: 'Formato inválido: versão 2 é obrigatória' };
  }

  const obj = parsed as Record<string, unknown>;

  if (!validateDeckData(obj.deck)) {
    return { success: false, error: 'Estrutura inválida: dados do deck não correspondem ao formato esperado' };
  }

  const fsrsData = deserializeFSRSStore(JSON.stringify(obj.fsrs));
  if (!fsrsData) {
    return { success: false, error: 'Estrutura inválida: dados FSRS não correspondem ao formato esperado' };
  }

  deckRepo.importAll(obj.deck as DeckData);
  fsrsRepo.importAll(fsrsData);

  return { success: true };
}
