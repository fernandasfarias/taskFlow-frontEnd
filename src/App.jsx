import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Autenticacao from './pages/Autenticacao/index';
import Kanban from './pages/kanban/KanBan';
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
import Projeto from './pages/Projetos/Projeto';
import AssociarUsuarios from './pages/Projetos/AssociarUsuarios';
import ExibirProjeto from './pages/Projetos/ExibirProjeto';

import ChatProjeto from './features/chat/ConversaPage';
import CriarAtividade from './pages/atividade/CriarAtividade';
import AssociarColaboradoresAtividade from './pages/atividade/AssociarColaboradoresAtividade';
import CriarTarefa from './pages/tarefa/CriarTarefa';

export default function App() {
  return (
    <Routes>

      {/* tela de login, tela de cadastro e telas para redefinir as senhas.*/}
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
      <Route path="/projetos" element={<Projeto/>}></Route>
      <Route path="/projetos/novo" element={<CriarProjetos />}></Route>
      <Route path="/projetos/associar-colaboradores" element={<AssociarUsuarios />}></Route>
      <Route path="/projetos/:id" element={<ExibirProjeto />}></Route>
      <Route path="/projetos/editar/:id" element={<CriarProjetos />} />
      
      {/* Rota do Kanban */}
      <Route path="/kanban" element={<Kanban />} />
      
      {/* Rotas específicas de ação dentro do projeto */}
      <Route path="/projetos/:id/chat" element={<ChatProjeto />} />
      <Route path="/projetos/:idProjeto/nova-atividade" element={<CriarAtividade />} />
      <Route path="/projetos/:idProjeto/atividade/:idAtividade/nova-tarefa" element={<CriarTarefa />} />
      <Route path="/projetos/:idProjeto/kanban" element={<Kanban />} />
      
      <Route path="/atividades/:idAtividade/associar-colaboradores" element={<AssociarColaboradoresAtividade />} />
      <Route path="/projetos/:idProjeto/atividades/:idAtividade/editar" element={<CriarAtividade />} />
      <Route path="/projetos/:idProjeto/atividade/:idAtividade/tarefas/:idTarefa/editar" element={<CriarTarefa />} />

    </Routes>
  );
}