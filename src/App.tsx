import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/landing/LandingPage';
import GalleryPage from './components/gallery/GalleryPage';
import Mp3StatsPage from './components/mp3-stats/Mp3StatsPage';
import StudioPage from './components/studio/StudioPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/mp3-stats" element={<Mp3StatsPage />} />
        <Route path="/studio" element={<StudioPage />} />
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
