import { DeckEntry } from '../types';

interface TableCellProps {
  num: string;
  entry: Partial<DeckEntry>;
  onClick: (num: string) => void;
}

export default function TableCell({ num, entry, onClick }: TableCellProps) {
  const persona = entry?.persona?.trim() || '';
  const image = entry?.image?.trim() || '';
  const isFilled = persona !== '';

  return (
    <div
      className={`table-cell${isFilled ? ' filled' : ''}`}
      onClick={() => onClick(num)}
      role="button"
      tabIndex={0}
      aria-label={`Card ${num}: ${isFilled ? persona : 'empty'}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(num); }}
    >
      <span className="table-cell-num">{num}</span>
      <div className="table-cell-img">
        {image ? (
          <img src={image} alt={persona} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        ) : (
          <span className="table-cell-placeholder">🃏</span>
        )}
      </div>
      <span className="table-cell-name">{isFilled ? persona : '???'}</span>
    </div>
  );
}
