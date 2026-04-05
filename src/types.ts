export type { DeckEntry, DeckData } from './domain/types';

export type TrainMode = 'flashCards' | 'rangeTrain';

export type SelectionMode = 'range' | 'digit';

export type TrainDirection = 'numToChar' | 'charToNum';

export interface RangeTrainConfig {
  selectionMode: SelectionMode;
  selectedValue: number;
  direction: TrainDirection;
}
