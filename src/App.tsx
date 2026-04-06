import { BrowserRouter, Routes, Route } from 'react-router';
import { DeckDataProvider } from './context/DeckDataContext';
import Navbar from './components/Navbar';
import DeckPage from './pages/DeckPage';
import TrainPage from './pages/TrainPage';
import ReviewPage from './pages/ReviewPage';

export default function App() {
  return (
    <DeckDataProvider>
      <BrowserRouter basename="/major-system">
        <Navbar />
        <Routes>
          <Route path="/" element={<DeckPage />} />
          <Route path="/treino" element={<TrainPage />} />
          <Route path="/revisao" element={<ReviewPage />} />
        </Routes>
      </BrowserRouter>
    </DeckDataProvider>
  );
}
