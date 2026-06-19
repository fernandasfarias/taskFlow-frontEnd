import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsSection from './components/StatsSection';
import ProjectsSection from './components/ProjectsSection';
import { DashboardService } from './services/DashboardService';
import { getPerfil } from '../../services/perfilService'; 

export default function DashBoardPage() {

  const [stats, setStats] = useState({ total: 0, emAndamento: 0, concluidos: 0, aFazer: 0 });
  const [projects, setProjects] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [user, setUser] = useState({ nome: 'Carregando...', tipo: '', avatarUrl: '' });
  const [loading, setLoading] = useState(true);
  
  async function loadDashboardData() {
    try {
      setLoading(true);

      const [backendUser, backendProjects] = await Promise.all([
        getPerfil(),
        listarProjetos()
      ]);

      setUser(backendUser);
      setProjects(backendProjects);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Ecrã de carregamento
  if (loading) {
      return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#090d16] text-white font-sans">
          <div className="flex flex-col items-center text-center">
              <img src="/Frame2.png" alt="TaskFlow" className="w-20 mb-6 animate-pulse"/>
              <h1 className="text-white text-2xl font-bold mb-2">TaskFlow</h1>
              <p className="text-slate-400">A preparar o seu ambiente...</p>
          </div>
      </div>
      );
  }

  return (
    <div className="flex min-h-screen w-full bg-[#090d16] font-sans overflow-hidden">
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col p-10 gap-8 overflow-y-auto h-screen">
        
        {/* nome extraído do backend */}
        <Header userName={user.nome || user.name} />
        
        <StatsSection stats={stats} />
        <ProjectsSection projects={projects} />
        
      </div>
    </div>
  );
}