import React from "react";
import { HiOutlineHome, HiOutlineFolder, HiOutlineCalendar, HiOutlineClipboardList, HiOutlineChatAlt2, HiOutlineChartBar, HiOutlineAdjustments } from 'react-icons/hi';
import { MdKeyboardArrowDown } from 'react-icons/md';
import logoImg from '../../../assets/Frame2.png';

export default function Sidebar() {
    
    const menuItems = [
    { name: 'Home', icon: <HiOutlineHome size={20} />, active: true },
    { name: 'Projetos', icon: <HiOutlineFolder size={20} /> },
    { name: 'Cronograma', icon: <HiOutlineCalendar size={20} /> },
    { name: 'Kanban', icon: <HiOutlineClipboardList size={20} /> },
    { name: 'Comunicações', icon: <HiOutlineChatAlt2 size={20} /> },
    { name: 'Relatórios', icon: <HiOutlineChartBar size={20} /> },
    { name: 'Configurações', icon: <HiOutlineAdjustments size={20} /> },
  ];

  return (
    <aside className="w-64 bg-[#0d121f] text-[#94a3b8] flex flex-col justify-between p-6 border-r border-[#1e293b]">
      <div>
        {/* Logo */}
        <div className="flex items-center justify-center gap-1.5 mb-10 w-full"> 
          <img 
            src={logoImg} 
            alt="TaskFlow Logo" 
            className="w-12 h-12 object-contain" 
          />
          <span className="text-white font-bold text-xl tracking-wide">TaskFlow</span>
        </div>

        {/* Menu Navegação */}
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                item.active 
                  ? 'bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white shadow-lg shadow-[#6366f1]/20' 
                  : 'hover:bg-[#1e293b] hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Perfil do Usuário */}
      <div className="flex items-center justify-between p-2 rounded-xl bg-[#141b2d] border border-[#1e293b]">
        <div className="flex items-center gap-3">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
            alt="Alice" 
            className="w-10 h-10 rounded-full object-cover ring-2 ring-[#6366f1]"
          />
          <div className="text-left">
            <h4 className="text-sm font-semibold text-white leading-tight">Alice Silva</h4>
            <span className="text-xs text-gray-400">Project Manager</span>
          </div>
        </div>
        <MdKeyboardArrowDown className="cursor-pointer hover:text-white" size={20} />
      </div>
    </aside>
  );
}