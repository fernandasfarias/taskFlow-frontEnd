import React from 'react';
import ProjectCard from './ProjectCard';
import CardProjeto from '../../../pages/Projetos/CardProjeto';

export default function ProjectsSection({ projects }) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-white tracking-wide">Meus Projetos</h2>
        <input
          type="text"
          placeholder="Buscar projeto..."
          className="bg-[#141b2d] border border-[#1e293b] rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#6366f1] w-full sm:w-64 transition"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((projeto) => (
          <CardProjeto key={projeto.id} project={projeto} />
        ))}
      </div>
    </div>
  );
}