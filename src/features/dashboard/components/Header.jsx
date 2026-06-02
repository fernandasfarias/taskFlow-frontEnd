import React from 'react';
import { HiOutlineBell, HiPlus } from 'react-icons/hi';

export default function Header({ userName}) {
  const firstName = userName ? userName.split(' ')[0] : 'Usuário';
 
  return (

    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Olá, {firstName}!</h1>
        <p className="text-xs text-gray-400 mt-1">Aqui está o resumo dos seus projetos.</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white px-5 py-2.5 rounded-xl font-medium text-sm shadow-lg shadow-[#6366f1]/20 hover:opacity-90 transition">
          <HiPlus size={18} />
          Novo Projeto
        </button>
        <button className="p-2.5 rounded-xl bg-[#141b2d] border border-[#1e293b] text-gray-400 hover:text-white transition relative">
          <HiOutlineBell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-purple-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}