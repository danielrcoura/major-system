# Import/Export FSRS Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Export and import FSRS review data alongside deck cards in a single v2 JSON file.

**Architecture:** New `importExportService.ts` orchestrates both `Repository` (deck) and `FSRSRepository` (review data). The service validates, serializes, and delegates storage to existing repos. `Navbar.tsx` calls the service instead of `deckCore` directly.

**Tech Stack:** TypeScript, Vitest, ts-fsrs, localStorage

---

### Task 1: Add `importAll` to FSRSRepository

**Files:**
- Modify: `src/domain/fsrsRepository.ts:4-8` (interface) and `src/domain/fsrsRepository.ts:32-56` (implementation)
- Test: `src/domain/fsrsRepository.test.ts` (create)

- [ ] **Step 1: Write the failing test**

Create `src/domain/fsrsRepository.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { createEmptyCard, type Card, type ReviewLog, Rating, State } from 'ts-fsrs';
import { createFSRSRepository } from './fsrsRepository';

describe('FSRSRepository.importAll', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('replaces all FSRS data', () => {
    const repo = createFSRSRepository();
    const existingCard = createEmptyCard();
    repo.saveReview('01', existingCard, {
      rating: Rating.Good,
      state: State.New,
      due: new Date('2026-01-01'),
      stability: 0,
      difficulty: 0,
      elapsed_days: 0,
      last_elapsed_days: 0,
      scheduled_days: 0,
      learning_steps: 0,
      review: new Date('2026-01-01'),
    } as ReviewLog);

    const newCard: Card = { ...createEmptyCard(), stability: 99 };
    repo.importAll({
      cards: { '50': newCard },
      logs: {},
    });

    const store = repo.loadAll();
    expect(store.cards['01']).toBeUndefined();
    expect(store.cards['50'].stability).toBe(99);
    expect(store.logs['01']).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/domain/fsrsRepository.test.ts`
Expected: FAIL — `importAll` is not a function

- [ ] **Step 3: Write minimal implementation**

In `src/domain/fsrsRepository.ts`, add `importAll` to the interface (line 8):

```typescript
export interface FSRSRepository {
  getCard(key: string): Card | null;
  getAllCards(): Record<string, Card>;
  saveReview(key: string, card: Card, log: ReviewLog): void;
  loadAll(): { cards: Record<string, Card>; logs: Record<string, ReviewLog[]> };
  importAll(data: { cards: Record<string, Card>; logs: Record<string, ReviewLog[]> }): void;
}
```

Add the method to the returned object in `createFSRSRepository` (after `loadAll`):

```typescript
    importAll(data: { cards: Record<string, Card>; logs: Record<string, ReviewLog[]> }): void {
      saveStore(data);
    },
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/domain/fsrsRepository.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/domain/fsrsRepository.ts src/domain/fsrsRepository.test.ts
git commit -m "feat: add importAll to FSRSRepository"
```

---

### Task 2: Create importExportService with export

**Files:**
- Create: `src/domain/importExportService.ts`
- Test: `src/domain/importExportService.test.ts` (create)

- [ ] **Step 1: Write the failing test for exportAll**

Create `src/domain/importExportService.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { createEmptyCard, type Card, type ReviewLog } from 'ts-fsrs';
import { exportAll } from './importExportService';
import type { DeckData } from './types';
import type { Repository } from './repository';
import type { FSRSRepository } from './fsrsRepository';

function makeDeckRepo(data: DeckData): Repository {
  return {
    getAll: () => data,
    getOne: (key) => data[key],
    saveCard: () => {},
    importAll: () => {},
  };
}

function makeFSRSRepo(
  cards: Record<string, Card>,
  logs: Record<string, ReviewLog[]>,
): FSRSRepository {
  return {
    getCard: (key) => cards[key] ?? null,
    getAllCards: () => cards,
    saveReview: () => {},
    loadAll: () => ({ cards, logs }),
    importAll: () => {},
  };
}

describe('exportAll', () => {
  it('produces v2 JSON with deck and fsrs data', () => {
    const deck: DeckData = {
      '00': { persona: 'P', action: 'A', object: 'O', image: 'I' },
    };
    const card = createEmptyCard();
    const deckRepo = makeDeckRepo(deck);
    const fsrsRepo = makeFSRSRepo({ '00': card }, {});

    const json = exportAll(deckRepo, fsrsRepo);
    const parsed = JSON.parse(json);

    expect(parsed.version).toBe(2);
    expect(parsed.deck).toEqual(deck);
    expect(parsed.fsrs.cards['00']).toBeDefined();
    expect(parsed.fsrs.cards['00'].due).toBeTypeOf('string');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/domain/importExportService.test.ts`
Expected: FAIL — cannot import `exportAll`

- [ ] **Step 3: Write minimal implementation**

Create `src/domain/importExportService.ts`:

```typescript
import type { Repository } from './repository';
import type { FSRSRepository } from './fsrsRepository';
import { serializeFSRSStore } from './fsrsSerializer';

export function exportAll(deckRepo: Repository, fsrsRepo: FSRSRepository): string {
  const deck = deckRepo.getAll();
  const fsrsStore = fsrsRepo.loadAll();
  const fsrs = JSON.parse(serializeFSRSStore(fsrsStore));
  return JSON.stringify({ version: 2, deck, fsrs }, null, 2);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/domain/importExportService.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/domain/importExportService.ts src/domain/importExportService.test.ts
git commit -m "feat: add exportAll to importExportService"
```

---

### Task 3: Add importAll to importExportService

**Files:**
- Modify: `src/domain/importExportService.ts`
- Modify: `src/domain/importExportService.test.ts`

- [ ] **Step 1: Write the failing tests for importAll**

Append to `src/domain/importExportService.test.ts`:

```typescript
import { importAll } from './importExportService';

describe('importAll', () => {
  it('rejects malformed JSON', () => {
    const deckRepo = makeDeckRepo({});
    const fsrsRepo = makeFSRSRepo({}, {});
    const result = importAll('not json', deckRepo, fsrsRepo);
    expect(result).toEqual({ success: false, error: expect.stringContaining('JSON') });
  });

  it('rejects missing version', () => {
    const json = JSON.stringify({ deck: {}, fsrs: { cards: {}, logs: {} } });
    const deckRepo = makeDeckRepo({});
    const fsrsRepo = makeFSRSRepo({}, {});
    const result = importAll(json, deckRepo, fsrsRepo);
    expect(result).toEqual({ success: false, error: expect.stringContaining('versão') });
  });

  it('rejects invalid deck structure', () => {
    const json = JSON.stringify({ version: 2, deck: { bad: 'data' }, fsrs: { cards: {}, logs: {} } });
    const deckRepo = makeDeckRepo({});
    const fsrsRepo = makeFSRSRepo({}, {});
    const result = importAll(json, deckRepo, fsrsRepo);
    expect(result).toEqual({ success: false, error: expect.stringContaining('deck') });
  });

  it('rejects invalid FSRS structure', () => {
    const json = JSON.stringify({ version: 2, deck: {}, fsrs: 'bad' });
    const deckRepo = makeDeckRepo({});
    const fsrsRepo = makeFSRSRepo({}, {});
    const result = importAll(json, deckRepo, fsrsRepo);
    expect(result).toEqual({ success: false, error: expect.stringContaining('FSRS') });
  });

  it('imports valid v2 data into both repos', () => {
    const card = createEmptyCard();
    const exported = exportAll(
      makeDeckRepo({ '01': { persona: 'P', action: 'A', object: 'O', image: 'I' } }),
      makeFSRSRepo({ '01': card }, {}),
    );

    let importedDeck: DeckData = {};
    let importedFSRS: { cards: Record<string, Card>; logs: Record<string, ReviewLog[]> } = { cards: {}, logs: {} };

    const deckRepo: Repository = {
      getAll: () => ({}),
      getOne: () => undefined,
      saveCard: () => {},
      importAll: (data) => { importedDeck = data; },
    };
    const fsrsRepo: FSRSRepository = {
      getCard: () => null,
      getAllCards: () => ({}),
      saveReview: () => {},
      loadAll: () => ({ cards: {}, logs: {} }),
      importAll: (data) => { importedFSRS = data; },
    };

    const result = importAll(exported, deckRepo, fsrsRepo);
    expect(result).toEqual({ success: true });
    expect(importedDeck['01'].persona).toBe('P');
    expect(importedFSRS.cards['01']).toBeDefined();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/domain/importExportService.test.ts`
Expected: FAIL — `importAll` is not exported

- [ ] **Step 3: Write minimal implementation**

Add to `src/domain/importExportService.ts`:

```typescript
import { validateDeckData } from './validator';
import { deserializeFSRSStore } from './fsrsSerializer';
import type { DeckData } from './types';

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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/domain/importExportService.test.ts`
Expected: PASS (all 5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/domain/importExportService.ts src/domain/importExportService.test.ts
git commit -m "feat: add importAll to importExportService"
```

---

### Task 4: Wire Navbar to use importExportService

**Files:**
- Modify: `src/components/Navbar.tsx`

- [ ] **Step 1: Update imports and export handler**

Replace the import/export logic in `src/components/Navbar.tsx`. Change:

```typescript
import { deckCore } from '../domain';
```

To:

```typescript
import { deckCore } from '../domain';
import { exportAll, importAll } from '../domain/importExportService';
import { LocalStorageRepository } from '../domain/localStorageRepository';
import { createFSRSRepository } from '../domain/fsrsRepository';
```

Replace the `handleExport` function:

```typescript
  function handleExport(): void {
    const deckRepo = new LocalStorageRepository();
    const fsrsRepo = createFSRSRepository();
    const blob = new Blob([exportAll(deckRepo, fsrsRepo)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'pao-major-system.json';
    a.click();
    setMenuOpen(false);
  }
```

- [ ] **Step 2: Update import handler**

Replace the `handleImport` function:

```typescript
  function handleImport(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const jsonString = ev.target?.result as string;
      const deckRepo = new LocalStorageRepository();
      const fsrsRepo = createFSRSRepository();
      const result = importAll(jsonString, deckRepo, fsrsRepo);
      if (!result.success) {
        alert(result.error);
      } else {
        importData(deckRepo.getAll());
      }
    };
    reader.readAsText(file);
    e.target.value = '';
    setMenuOpen(false);
  }
```

- [ ] **Step 3: Run full test suite**

Run: `npx vitest run`
Expected: All tests pass

- [ ] **Step 4: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: wire Navbar to importExportService for v2 import/export"
```
