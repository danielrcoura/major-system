export interface DeckEntry {
  persona: string;
  action: string;
  object: string;
  image: string;
}

export type DeckData = Record<string, DeckEntry>;

export type ImportResult =
  | { success: true; data: DeckData }
  | { success: false; error: string };
