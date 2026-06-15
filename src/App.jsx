import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Autenticacao from './pages/Autenticacao/index';
import DashBoardPage from './features/dashboard/DashBoardPage';
import ListaConversasPage from './features/chat/ListaConversaPage';
import ConversaPage from './features/chat/ConversaPage';


import Certificacoes from "./pages/onboarding/certificacoes/Certificacoes";
import Empresa from "./pages/onboarding/empresa/Empresa";
import Especialidades from "./pages/onboarding/especialidades/Especialidades";

import Profile from "./pages/Perfil/Perfil";

import RecuperarSenha from "./pages/recuperarSenha/RecuperarSenha";
import RedefinirSenha from "./pages/redefinirSenha/RedefinirSenha";

import CriarProjetos from "./pages/Projetos/CriarProjetos";
import AssociarColaboradores from './pages/Projetos/AssociarColaboradores';
import AssociarClientes from './pages/Projetos/AssociarClientes';
import Projeto from './pages/Projetos/Projeto';

export default function App() {
  return (
    <Routes>

      {/* tela de login, tela de cadastro e telas para redifinir as senhas.*/}
      <Route path="/" element={<Autenticacao />} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} />
      <Route path="/redefinir-senha" element={<RedefinirSenha />} />

      {/* onboarding: cadastro das certificacoes, especialidades ou empresa do cliente*/}
      <Route path="/onboarding/certificacoes" element={<Certificacoes />}></Route>
      <Route path="/onboarding/especialidades" element={<Especialidades />}></Route>
      <Route path="/onboarding/empresa" element={<Empresa />}></Route>

      {/* dashboard: tela principal */}
      <Route path="/dashboard" element={<DashBoardPage />} />
      
      {/* mensagens */}
      <Route path="/chat" element={<ListaConversasPage />} />
      <Route path="/chat/:idProjeto" element={<ConversaPage />} />

      {/* tela de perfil */}
      <Route path="/profile" element={<Profile />}></Route>

      {/* PROJETO */}
      <Route path="/projetos/novo" element={<CriarProjetos />}></Route>
      <Route path="/projetos/associar-colaboradores" element={<AssociarColaboradores />}></Route>
      <Route path="/projetos/associar-clientes" element={<AssociarClientes />}></Route>
      <Route path="/projetos/projeto" element={<Projeto />}></Route>

    </Routes>
  );
}