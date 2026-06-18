import React from 'react';
import { HiOutlineBell, HiPlus } from 'react-icons/hi';
import { MdBlock } from 'react-icons/md';

import {getPerfil} from "../../../services/perfilService";

import {useEffect, useState} from "react";

import {useNavigate} from "react-router-dom";

export default function Header() {
  const [perfil, setPerfil] = useState({nome: "", email: "", senha: "", tipo: ""});

  const navigate = useNavigate();

      useEffect(()=>{
        async function carregarPerfil(){
            try {
                const data = await getPerfil();
                console.log(data);
                setPerfil(data);
            } catch (error) {
                console.log("Erro ao carregar o perfil", error);
            }
        }
        carregarPerfil();
    }, []);
    
  return (

    <header className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Olá, {perfil.nome}!</h1>
        <p className="text-xs text-gray-400 mt-1">Aqui está o resumo dos seus projetos.</p>
      </div>

      <div className="flex items-center gap-4 w-full sm:w-auto">
        {
          perfil.tipo === "PROJECT_MANAGER"? (
            <button onClick={() => navigate("/projetos/novo")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white
                            bg-gradient-to-r from-[#6366f1] to-[#a855f7]
                            hover:opacity-90 hover:shadow-lg hover:shadow-[#6366f1]/30 transition-all duration-200">
              <HiPlus size={18}></HiPlus>
              Novo Projeto</button>
          ) : (
            <button disabled
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-700 text-slate-400 px-5 py-2.5 rounded-xl font-medium text-sm cursor-not-allowed">
              <MdBlock size={18}></MdBlock>
              Novo Projeto</button>
          )
        }
        <button className="p-2.5 rounded-xl bg-[#141b2d] border border-[#1e293b] text-gray-400 hover:text-white transition relative">
          <HiOutlineBell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}