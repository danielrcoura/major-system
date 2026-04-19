import type { Repository } from './repository';
import type { FSRSRepository } from './fsrsRepository';
import { serializeFSRSStore } from './fsrsSerializer';

export function exportAll(deckRepo: Repository, fsrsRepo: FSRSRepository): string {
  const deck = deckRepo.getAll();
  const fsrsStore = fsrsRepo.loadAll();
  // Serialize→parse roundtrip: serializeCard/serializeLog aren't exported from fsrsSerializer,
  // so we reuse serializeFSRSStore to get properly serialized dates, then parse back to embed as JSON.
  const fsrs = JSON.parse(serializeFSRSStore(fsrsStore));
  return JSON.stringify({ version: 2, deck, fsrs }, null, 2);
}
