export interface DeckEntry {
  persona: string;
  action: string;
  object: string;
  image: string;
}

export type DeckData = Record<string, DeckEntry>;

export type TrainMode = 'flashCards' | 'rangeTrain';

export type SelectionMode = 'range' | 'digit';

export type TrainDirection = 'numToChar' | 'charToNum';

export interface RangeTrainConfig {
  selectionMode: SelectionMode;
  selectedValue: number;
  direction: TrainDirection;
}
