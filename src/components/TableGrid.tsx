import { DeckData, DeckEntry } from '../types';
import TableCell from './TableCell';

interface TableGridProps {
  data: DeckData;
  onCellClick: (num: string) => void;
}

const COLS = Array.from({ length: 10 }, (_, i) => i);
const ROWS = Array.from({ length: 10 }, (_, i) => i);

export default function TableGrid({ data, onCellClick }: TableGridProps) {
  return (
    <div className="table-view">
      <table className="table-grid">
        <thead>
          <tr>
            <th className="table-header" />
            {COLS.map((c) => (
              <th key={c} className="table-header">{c}x</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r}>
              <th className="table-header">x{r}</th>
              {COLS.map((c) => {
                const num = String(c * 10 + r).padStart(2, '0');
                const entry: Partial<DeckEntry> = data[num] || {};
                return (
                  <td key={num}>
                    <TableCell num={num} entry={entry} onClick={onCellClick} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
