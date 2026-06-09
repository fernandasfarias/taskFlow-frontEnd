import { Route, Routes } from 'react-router-dom';

import DashBoardPage from './features/dashboard/DashBoardPage';
import Autenticacao from './pages/Autenticacao/index';

import Certificacoes from "./pages/onboarding/certificacoes/Certificacoes";
import Empresa from "./pages/onboarding/empresa/Empresa";
import Especialidades from "./pages/onboarding/especialidades/Especialidades";
import RecuperarSenha from "./pages/recuperarSenha/RecuperarSenha";
import RedefinirSenha from "./pages/redefinirSenha/RedefinirSenha";

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<Autenticacao />} />
      <Route path="/dashboard" element={<DashBoardPage />} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} />
      <Route path="/redefinir-senha" element={<RedefinirSenha />} />

      {/* onboarding */}
      <Route path="/onboarding/certificacoes" element={<Certificacoes />}></Route>
      <Route path="/onboarding/especialidades" element={<Especialidades />}></Route>
      <Route path="/onboarding/empresa" element={<Empresa />}></Route>


    </Routes>
  );
}