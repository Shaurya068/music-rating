import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import AlbumPage from './components/AlbumPage';

function App() {
  return (
    <Router>
      <div className="container">
        <header>
          <h1>Music Library Hub</h1>
        </header>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/album/:id" element={<AlbumPage />} />
        </Routes>

        <footer>
          &copy; 2024 Music Review Hub | By: RA2211028010136 & RA2211028010093
        </footer>
      </div>
    </Router>
  );
}

export default App;
