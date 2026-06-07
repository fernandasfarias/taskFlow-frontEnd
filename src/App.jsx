import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Autenticacao from './pages/Autenticacao/index';
import DashBoardPage from './features/dashboard/DashBoardPage';

import Certificacoes from "./pages/onboarding/certificacoes/Certificacoes";
import Empresa from "./pages/onboarding/empresa/Empresa";
import Especialidades from "./pages/onboarding/especialidades/Especialidades";

import Profile from "./pages/Perfil/Perfil";

export default function App() {
  return (
    <Routes>

      {/* tela de login e tela de cadastro */}
      <Route path="/" element={<Autenticacao />} />

      {/* onboarding: cadastro das certificacoes, especialidades ou empresa do cliente*/}
      <Route path="/onboarding/certificacoes" element={<Certificacoes />}></Route>
      <Route path="/onboarding/especialidades" element={<Especialidades />}></Route>
      <Route path="/onboarding/empresa" element={<Empresa />}></Route>

      {/* dashboard: tela principal */}
      <Route path="/dashboard" element={<DashBoardPage />} />

      {/* tela de perfil */}
      <Route path="/profile" element={<Profile />}></Route>

    </Routes>
  );
}