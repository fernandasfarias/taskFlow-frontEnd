import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Autenticacao from './pages/Autenticacao/index';
import DashBoardPage from './features/dashboard/DashBoardPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Autenticacao />} />
      <Route path="/dashboard" element={<DashBoardPage />} />
    </Routes>
  );
}