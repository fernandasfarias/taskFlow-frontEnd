import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatsSection from "./components/StatsSection";
import CardProjeto from "../../pages/Projetos/CardProjeto";
import { listarProjetos, getStats, getUserProfile, searchProjects } from "../../services/projetoService";

import {
  HiOutlineSearch,
  HiOutlineFolder,
  HiOutlineExclamationCircle,
} from "react-icons/hi";

export default function DashBoardPage() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    emAndamento: 0,
    concluidos: 0,
    aFazer: 0,
  });

  const [projects, setProjects] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [user, setUser] = useState({
    name: "Carregando...",
    role: "",
    avatarUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState("");

  function normalizarProjetos(resposta) {
    if (Array.isArray(resposta)) return resposta;
    if (Array.isArray(resposta?.data)) return resposta.data;
    if (Array.isArray(resposta?.content)) return resposta.content;
    if (Array.isArray(resposta?.projetos)) return resposta.projetos;
    return [];
  }

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);

        const [backendStats, backendUser] = await Promise.all([
          getStats(),
          getUserProfile()
        ]);

        setStats({
          total: backendStats.total ?? 0,
          emAndamento: backendStats.emAndamento ?? 0,
          concluidos: backendStats.concluidos ?? 0,
          aFazer: backendStats.aFazer ?? 0,
        });

        setUser(backendUser);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
        setErro("Não foi possível carregar os dados do dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

 useEffect(() => {
  if (loading) return;

  const timer = setTimeout(async () => {
    try {
      setBuscando(true);

      const resposta = busca.trim()
        ? await searchProjects(busca)
        : await listarProjetos();

      setProjects(normalizarProjetos(resposta));
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar os projetos.");
    } finally {
      setBuscando(false);
    }
  }, 400);

  return () => clearTimeout(timer);
}, [busca, loading]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#090d16] text-white font-sans">
        <div className="flex flex-col items-center text-center">
          <img
            src="/Frame2.png"
            alt="TaskFlow"
            className="w-20 mb-6 animate-pulse"
          />
          <h1 className="text-white text-2xl font-bold mb-2">TaskFlow</h1>
          <p className="text-slate-400">Preparando o seu ambiente...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-[#090d16] font-sans overflow-hidden">
      <Sidebar
        user={user}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col p-10 gap-8 overflow-y-auto h-screen">
        <Header userName={user.name} />

        <StatsSection stats={stats} />

        <div className="relative max-w-sm">
          <HiOutlineSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569]"
            size={17}
          />

          {buscando && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#6366f1]/30 border-t-[#6366f1] rounded-full animate-spin" />
          )}

          <input
            type="text"
            placeholder="Buscar projeto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full bg-[#141b2d] border border-[#1e293b] rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-[#6366f1] transition-colors"
          />
        </div>

        {erro && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <HiOutlineExclamationCircle
              className="text-red-400 shrink-0"
              size={18}
            />
            <p className="text-sm text-red-400">{erro}</p>
          </div>
        )}

        {projects.length === 0 && !erro ? (
          <div className="flex flex-col items-center justify-center flex-1 py-20 text-[#475569]">
            <HiOutlineFolder size={52} className="mb-4 opacity-40" />
            <p className="text-base font-semibold text-[#64748b]">
              {busca ? "Nenhum projeto encontrado." : "Nenhum projeto ainda."}
            </p>

            {!busca && (
              <button
                onClick={() => navigate("/projetos/criar")}
                className="mt-4 text-sm text-[#6366f1] hover:underline"
              >
                Criar primeiro projeto →
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((projeto) => (
              <CardProjeto key={projeto.id_projeto} projeto={projeto} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
