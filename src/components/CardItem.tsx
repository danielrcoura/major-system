import { DeckEntry } from '../types';

interface CardItemProps {
  num: string;
  entry: Partial<DeckEntry>;
  onClick: (num: string) => void;
}

export default function CardItem({ num, entry, onClick }: CardItemProps) {
  const persona = entry?.persona?.trim() || '';
  const image = entry?.image?.trim() || '';
  const isFilled = persona !== '';

  function handleImageError(e: React.SyntheticEvent<HTMLImageElement>) {
    e.currentTarget.style.display = 'none';
  }

  return (
    <div
      className={`card${isFilled ? ' filled' : ''}`}
      onClick={() => onClick(num)}
    >
      <div className="card-corner card-corner-top">{num}</div>
      <div className="card-art">
        {image ? (
          <img src={image} alt={persona} onError={handleImageError} />
        ) : (
          <span className="card-art-empty">🃏</span>
        )}
      </div>
      <div className="card-info">
        <div className="card-name">{isFilled ? persona : '???'}</div>
      </div>
    </div>
  );
}
