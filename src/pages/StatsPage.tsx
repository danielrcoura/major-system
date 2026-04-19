import { useMemo } from 'react';
import { useDeckData } from '../hooks/useDeckData';
import { createFSRSRepository } from '../domain/fsrsRepository';
import { computeStats } from '../domain/statsService';

const repo = createFSRSRepository();

const RATING_COLORS: Record<string, string> = {
  Again: '#c0392b', Hard: '#d4a017', Good: '#2d6a4f', Easy: '#4a90d9',
};

const STATE_COLORS: Record<string, string> = {
  Novo: '#999', Aprendendo: '#d4a017', Revisão: '#2d6a4f', Reaprendendo: '#c0392b',
};

export default function StatsPage() {
  const { data } = useDeckData();
  const stats = useMemo(() => computeStats(data, repo), [data]);

  const totalRatings = Object.values(stats.ratingDistribution).reduce((a, b) => a + b, 0);
  const totalCards = Object.values(stats.cardsByState).reduce((a, b) => a + b, 0);

  return (
    <main>
      <div className="section">
        <div className="section-header">
          <span className="section-title">📊 Distribuição de Avaliações</span>
          <span className="section-progress">{totalRatings} revisões</span>
        </div>
        <div className="stats-bars">
          {totalRatings === 0 ? (
            <p className="stats-empty">Nenhuma revisão registrada ainda.</p>
          ) : (
            Object.entries(stats.ratingDistribution).map(([label, count]) => (
              <div key={label} className="stats-bar-row">
                <span className="stats-bar-label" style={{ color: RATING_COLORS[label] }}>{label}</span>
                <div className="stats-bar-track">
                  <div
                    className="stats-bar-fill"
                    style={{
                      width: `${(count / totalRatings) * 100}%`,
                      background: RATING_COLORS[label],
                    }}
                  />
                </div>
                <span className="stats-bar-count">{count}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <span className="section-title">🗂️ Cards por Estado</span>
          <span className="section-progress">{totalCards} cards</span>
        </div>
        <div className="stats-bars">
          {totalCards === 0 ? (
            <p className="stats-empty">Nenhum card preenchido ainda.</p>
          ) : (
            Object.entries(stats.cardsByState).map(([label, count]) => (
              <div key={label} className="stats-bar-row">
                <span className="stats-bar-label" style={{ color: STATE_COLORS[label] }}>{label}</span>
                <div className="stats-bar-track">
                  <div
                    className="stats-bar-fill"
                    style={{
                      width: `${(count / totalCards) * 100}%`,
                      background: STATE_COLORS[label],
                    }}
                  />
                </div>
                <span className="stats-bar-count">{count}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <span className="section-title">🔥 Top 10 Cards Mais Difíceis</span>
        </div>
        <div className="stats-table-wrap">
          {stats.hardestCards.length === 0 ? (
            <p className="stats-empty">Nenhum card revisado ainda.</p>
          ) : (
            <table className="stats-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Persona</th>
                  <th>Lapsos</th>
                  <th>Dificuldade</th>
                </tr>
              </thead>
              <tbody>
                {stats.hardestCards.map((card, i) => (
                  <tr key={card.key}>
                    <td>{card.key}</td>
                    <td>{card.persona}</td>
                    <td>{card.lapses}</td>
                    <td>{card.difficulty.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
