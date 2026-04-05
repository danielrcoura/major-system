import { Link, useLocation } from 'react-router';

export default function Header(): React.JSX.Element {
  const { pathname } = useLocation();

  const isDeck: boolean = pathname === '/';
  const isTreino: boolean = pathname === '/treino';

  const title: string = isDeck ? '🃏 Memory Deck' : '🧠 Treino';
  const subtitle: string = isDeck
    ? 'Crie sua lista de imagens de 00 a 99 com personagens de ficção'
    : 'Associe os números aos personagens corretos';

  return (
    <header>
      <h1>{title}</h1>
      <p className="subtitle">{subtitle}</p>
      <nav className="nav-links">
        <Link to="/" className={isDeck ? 'active' : ''}>📇 Deck</Link>
        <Link to="/treino" className={isTreino ? 'active' : ''}>🏋️ Treino</Link>
      </nav>
    </header>
  );
}
