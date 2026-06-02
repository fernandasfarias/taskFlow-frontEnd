import React from 'react';
import { HiEllipsisHorizontal } from 'react-icons/hi2';

export default function ProjectCard({ project }) {
  
  const tagStyles = {
    'Project Manager': 'bg-[#1e2548] text-[#6366f1]',
    'Membro da Equipe': 'bg-[#142d2a] text-[#10b981]',
    'Cliente': 'bg-[#2d221c] text-[#d97706]'
  };

  return (
    <div className="bg-[#141b2d] border border-[#1e293b] p-6 rounded-2xl flex flex-col justify-between h-64">
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-white tracking-wide">{project.name}</h3>
          <button className="text-gray-400 hover:text-white transition">
            <HiEllipsisHorizontal size={24} />
          </button>
        </div>

        <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${tagStyles[project.role] || 'bg-gray-800 text-gray-300'}`}>
          {project.role}
        </span>

        <p className="text-xs text-gray-400 mt-4 line-clamp-3 leading-relaxed">
          {project.description}
        </p>
      </div>

      <div>
        <div className="flex justify-between items-center text-[10px] text-gray-400 mb-2">
          <span>Prazo: {project.dueDate}</span>
          <span className="font-semibold text-white">{project.progress}%</span>
        </div>
        {/* Barra de progresso */}
        <div className="w-full bg-[#1e293b] h-1.5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#2563eb] to-[#6366f1] transition-all duration-500" 
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}