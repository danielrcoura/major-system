import { BrowserRouter, Routes, Route } from 'react-router';
import { DeckDataProvider } from './context/DeckDataContext';
import Header from './components/Header';
import DeckPage from './pages/DeckPage';
import TrainPage from './pages/TrainPage';

export default function App() {
  return (
    <DeckDataProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<DeckPage />} />
          <Route path="/treino" element={<TrainPage />} />
        </Routes>
      </BrowserRouter>
    </DeckDataProvider>
  );
}
