# Import/Export FSRS Data Alongside Cards

## Summary

Extend the import/export feature to include FSRS review data (card states and review logs) in a single JSON file alongside deck cards. A new dedicated import/export service orchestrates both repositories.

## Decisions

- **Single file**: one JSON containing both deck cards and FSRS data.
- **Full wipe + replace**: import replaces all local data (both cards and FSRS), not a merge.
- **No backward compatibility**: old card-only exports are rejected on import.
- **Approach C**: new `importExportService.ts` to keep separation of concerns.

## Export Format

Version 2 JSON structure:

```json
{
  "version": 2,
  "deck": {
    "00": { "persona": "...", "action": "...", "object": "...", "image": "..." }
  },
  "fsrs": {
    "cards": {
      "00": { "due": "2026-04-20T00:00:00.000Z", "stability": 5.0, "difficulty": 3.2, "elapsed_days": 1, "scheduled_days": 5, "reps": 3, "lapses": 0, "learning_steps": 0, "state": 2, "last_review": "2026-04-19T00:00:00.000Z" }
    },
    "logs": {
      "00": [{ "rating": 3, "state": 2, "due": "...", "stability": 5.0, "difficulty": 3.2, "elapsed_days": 1, "last_elapsed_days": 0, "scheduled_days": 5, "learning_steps": 0, "review": "..." }]
    }
  }
}
```

- `version: 2` — required field, import rejects anything else.
- `deck` — existing `DeckData` shape (`Record<string, DeckEntry>`).
- `fsrs` — existing `FSRSStoreData` shape from `fsrsSerializer.ts`.

## Architecture

### New file: `src/domain/importExportService.ts`

Responsibilities:
- `exportAll(deckRepo, fsrsRepo)` — reads deck data and FSRS data from their repos, combines into v2 JSON string.
- `importAll(json, deckRepo, fsrsRepo)` — parses JSON, validates version and both data sections, writes to both repos via full wipe + replace.

Dependencies (injected, not imported as singletons):
- `Repository` (deck) — `getAll()` for export, `importAll()` for import.
- `FSRSRepository` — `loadAll()` for export, new `importAll()` for import.
- `validateDeckData` — existing deck validation.
- `deserializeFSRSStore` — existing FSRS validation and deserialization.
- `serializeFSRSStore` — existing FSRS serialization.

Return type for import:
- `{ success: true }` or `{ success: false, error: string }`

Error messages in Portuguese to match existing UI.

### Changes to existing files

**`src/domain/fsrsRepository.ts`**
- Add `importAll(data: { cards: Record<string, Card>; logs: Record<string, ReviewLog[]> }): void` to the `FSRSRepository` interface and implementation. Wipes existing FSRS localStorage and writes the new data.

**`src/components/Navbar.tsx`**
- Replace `deckCore.exportCards()` with `importExportService.exportAll()`.
- Replace `deckCore.importCards()` with `importExportService.importAll()`.
- Still call `importData()` from `useDeckData` after import to update React state.

**`src/domain/serializer.ts`**
- No changes. The old `exportDeck`/`importDeck` functions remain but are no longer called from Navbar.

## Testing

**Unit tests for `importExportService`:**
- Export produces valid v2 JSON with correct structure.
- Import accepts valid v2 JSON and calls both repos.
- Import rejects: missing version, wrong version, invalid deck structure, invalid FSRS structure, malformed JSON.

**Unit test for `fsrsRepository.importAll`:**
- Wipes and replaces localStorage FSRS data correctly.

**No UI tests** — Navbar changes are a mechanical swap of which service gets called.

Test tooling: Vitest (already configured).
