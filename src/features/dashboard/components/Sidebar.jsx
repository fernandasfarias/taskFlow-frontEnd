import React, { useEffect, useState } from "react";
import { 
  HiOutlineHome, 
  HiOutlineFolder, 
  HiOutlineCalendar, 
  HiOutlineClipboardList, 
  HiOutlineChatAlt2, 
  HiOutlineBookOpen, 
  HiMenu, 
  HiX 
} from 'react-icons/hi';
import { MdKeyboardArrowDown } from 'react-icons/md';
import logoImg from '../../../assets/Frame2.png';
import { useNavigate, useLocation } from 'react-router-dom';
import fotoPerfil from '../../../assets/fotoPerfil.svg';
import { getPerfil } from "../../../services/perfilService";

export default function Sidebar({ user, isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    async function carregarPerfil(){
      try{
        const data = await getPerfil();
        setPerfil(data);
      }catch(error) {console.log(error);}
    }
    carregarPerfil();
  }, []);

  // Atualizamos os botões da Sidebar aqui
  const menuItems = [
    { name: 'Home', path: '/dashboard', icon: <HiOutlineHome size={20} /> },
    { name: 'Projetos', path: '/projetos', icon: <HiOutlineFolder size={20} /> },
    { name: 'Chat', path: '/chat', icon: <HiOutlineChatAlt2 size={20} /> },
    { name: 'Tutorial', url: 'https://github.com/fernandasfarias/taskFlow-frontEnd/blob/main/README.md', icon: <HiOutlineBookOpen size={20} /> },
  ];

  const handleNavigation = (item) => {
    if(item.url){
      window.open(item.url, "_blank");  
    } else {
      navigate(item.path);
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Botão para abrir no mobile */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1e293b] rounded-lg text-white"
        onClick={() => setIsOpen(true)}
      >
        <HiMenu size={24} />
      </button>

      {/* Overlay (fundo escuro) */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0d121f] text-[#94a3b8] flex flex-col justify-between p-6 border-r border-[#1e293b]
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div>
          {/* Logo + Botão de fechar (visível apenas no mobile) */}
          <div className="flex items-center justify-between mb-10 pl-2">
            <div className="flex items-center gap-1.5">
              <img src={logoImg} alt="TaskFlow Logo" className="w-12 h-12 object-contain" />
              <span className="text-white font-bold text-xl tracking-wide">TaskFlow</span>
            </div>
            <button className="lg:hidden text-white" onClick={() => setIsOpen(false)}>
              <HiX size={24} />
            </button>
          </div>

          {/* Menu */}
          <nav className="space-y-2">
            {menuItems.map((item, index) => {
              // Verifica se o item é o Chat e se o usuário é Colaborador
              const isChat = item.name === 'Chat';
              const isColaborador = perfil?.tipo === "COLABORADOR";
              const isChatDisabled = isChat && isColaborador;

              return (
                <button
                  key={index}
                  onClick={() => !isChatDisabled && handleNavigation(item)}
                  disabled={isChatDisabled}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                    location.pathname === item.path 
                      ? 'bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white shadow-lg shadow-[#6366f1]/20' 
                      : 'hover:bg-[#1e293b] hover:text-white'
                  } ${
                    isChatDisabled ? 'opacity-40 cursor-not-allowed hover:bg-transparent hover:text-[#94a3b8]' : ''
                  }`}
                  title={isChatDisabled ? 'Acesso restrito para colaboradores' : ''}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Perfil */}
        <div
            onClick={() => handleNavigation('/profile')}
            className="flex items-center justify-between p-2 rounded-xl bg-[#141b2d] border border-[#1e293b] cursor-pointer hover:border-[#6366f1] transition-colors">
          <div className="flex items-center gap-3">
            <img 
              src={fotoPerfil} 
              alt={perfil?.nome} 
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#6366f1]"
            />
            <div className="text-left">
              <h4 className="text-sm font-semibold text-white leading-tight truncate max-w-[120px]">{perfil?.nome}</h4>
              <span className="text-xs text-gray-400">
                        {perfil?.tipo === "PROJECT_MANAGER"? "Project Manager": perfil?.tipo === "COLABORADOR"? "Colaborador": perfil?.tipo === "CLIENTE"? "Cliente": perfil?.tipo}
              </span>
            </div>
          </div>
          <MdKeyboardArrowDown className="cursor-pointer text-gray-400 hover:text-white" size={20} />
        </div>
      </aside>
    </>
  );
}