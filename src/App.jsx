import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Autenticacao from './pages/Autenticacao/index';
import DashBoardPage from './features/dashboard/DashBoardPage';
import ListaConversasPage from './features/chat/ListaConversaPage';
import ConversaPage from './features/chat/ConversaPage';


import Certificacoes from "./pages/onboarding/certificacoes/Certificacoes";
import Empresa from "./pages/onboarding/empresa/Empresa";
import Especialidades from "./pages/onboarding/especialidades/Especialidades";

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<Autenticacao />} />
      <Route path="/dashboard" element={<DashBoardPage />} />

      {/* onboarding */}
      <Route path="/onboarding/certificacoes" element={<Certificacoes />}></Route>
      <Route path="/onboarding/especialidades" element={<Especialidades />}></Route>
      <Route path="/onboarding/empresa" element={<Empresa />}></Route>

        {/* mensagens */}
      <Route path="/chat" element={<ListaConversasPage />} />
      <Route path="/chat/:idProjeto" element={<ConversaPage />} />


    </Routes>
  );
}