import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsSection from './components/StatsSection';
import ProjectsSection from './components/ProjectsSection';
import { DashboardService } from './services/DashboardService';

export default function DashBoardPage() {


  const [stats, setStats] = useState({ total: 0, emAndamento: 0, concluidos: 0, aFazer: 0 });
  const [projects, setProjects] = useState([]);
  

  const [user, setUser] = useState({ name: 'Carregando...', role: '', avatarUrl: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
    
        // chamadas em paralelo para o back
        const [backendStats, backendProjects, backendUser] = await Promise.all([
          DashboardService.getStats(),
          DashboardService.getProjects(),
          DashboardService.getUserProfile()
        ]);

        // atualiza com dados vindos do back
        setStats(backendStats);
        setProjects(backendProjects);
        setUser(backendUser);
    
      } catch (error) {
        console.log("ERRO AO CONECTAR COM O BACKEND.");
      }finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

        // tela de carregamento enquanto o java responde
        if (loading) {
            return (
            <div className="flex-1 flex items-center justify-center bg-[#090d16] text-white font-sans">
                <p className="animate-pulse">Carregando informações do TaskFlow...</p>
            </div>
            );
        }

  return (

    <div className="flex-1 flex flex-col bg-[#090d16] p-10 gap-8 overflow-y-auto h-screen">
      
      <Header />
      <StatsSection stats={stats} />
      <ProjectsSection projects={projects} />
      
    </div>
  );
}