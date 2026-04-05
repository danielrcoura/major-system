interface SearchBarProps {
  onSearch: (value: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <input
      id="search"
      type="text"
      placeholder="Buscar por número, nome ou consoantes..."
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}
