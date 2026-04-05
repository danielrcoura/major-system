export default function SearchBar({ onSearch }) {
  return (
    <input
      id="search"
      type="text"
      placeholder="Buscar por número, nome ou consoantes..."
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}
