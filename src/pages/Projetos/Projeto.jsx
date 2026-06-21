import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../features/dashboard/components/Sidebar';
import StatCard from '../../features/dashboard/components/StatCard';
import CardProjeto from './CardProjeto';
import { listarProjetos, buscarProjetos } from '../../services/projetoService';
import { getPerfil } from '../../services/perfilService';   
import {
    HiOutlineSearch, HiOutlineFolder,
    HiOutlineCollection, HiOutlineUsers, HiOutlineCalendar, HiOutlineExclamationCircle, HiPlus
} from 'react-icons/hi';

import { MdBlock } from 'react-icons/md';

const HOJE = new Date().toISOString().split('T')[0];

export default function Projeto() {
    const navigate = useNavigate();
    const [projetos, setProjetos] = useState([]);
    const [busca, setBusca] = useState('');
    const [loading, setLoading] = useState(true);
    const [buscando, setBuscando] = useState(false);
    const [erro, setErro] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState({ name: 'Carregando...', role: '' });
    const [perfil, setPerfil] = useState({nome: "", email: "", senha: "", tipo: ""});

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

    useEffect(() => {
        async function carregar() {
            try {
                const [lista, perfil] = await Promise.all([listarProjetos(), getPerfil()]);
                setProjetos(lista);
                setUser({ name: perfil.nome, role: perfil.tipo });
            } catch (e) {
                console.error(e);
                setErro('Não foi possível carregar os projetos.');
            } finally {
                setLoading(false);
            }
        }
        carregar();
    }, []);

    useEffect(() => {
        if (!busca.trim()) {
            if (!loading) {
                listarProjetos().then(setProjetos).catch(console.error);
            }
            return;
        }
        setBuscando(true);
        const timer = setTimeout(() => {
            buscarProjetos(busca)
                .then(setProjetos)
                .catch(console.error)
                .finally(() => setBuscando(false));
        }, 400);
        return () => clearTimeout(timer);
    }, [busca]);

    const stats = [
        {
            title: 'Total de Projetos',
            value: projetos.length,
            icon: <HiOutlineCollection size={20} />,
            colorClass: 'bg-[#6366f1]/20 text-[#6366f1]',
        },
        {
            title: 'Total de Membros',
            value: projetos.reduce((acc, p) => acc + (p.idColaboradores?.length || 0), 0),
            icon: <HiOutlineUsers size={20} />,
            colorClass: 'bg-blue-500/20 text-blue-400',
        },
        {
            title: 'No Prazo',
            value: projetos.filter(p => !p.dataEntrega || p.dataEntrega >= HOJE).length,
            icon: <HiOutlineCalendar size={20} />,
            colorClass: 'bg-emerald-500/20 text-emerald-400',
        },
        {
            title: 'Vencidos',
            value: projetos.filter(p => p.dataEntrega && p.dataEntrega < HOJE).length,
            icon: <HiOutlineExclamationCircle size={20} />,
            colorClass: 'bg-red-500/20 text-red-400',
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#090d16] text-white">
                <div className="flex flex-col items-center">
                    <img src="/Frame2.png" alt="TaskFlow" className="w-20 mb-6 animate-pulse" />
                    <p className="text-slate-400">Carregando projetos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full bg-[#090d16] font-sans overflow-hidden">
            <Sidebar user={user} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col p-10 gap-8 overflow-y-auto h-screen">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Projetos</h1>
                        <p className="text-sm text-[#64748b] mt-0.5">
                            {projetos.length} projeto{projetos.length !== 1 ? 's' : ''} cadastrado{projetos.length !== 1 ? 's' : ''}
                        </p>
                    </div>
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
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map(s => <StatCard key={s.title} {...s} />)}
                </div>

                <div className="relative max-w-sm">
                    <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569]" size={17} />
                    {buscando && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#6366f1]/30 border-t-[#6366f1] rounded-full animate-spin" />
                    )}
                    <input
                        type="text"
                        placeholder="Buscar projeto..."
                        value={busca}
                        onChange={e => setBusca(e.target.value)}
                        className="w-full bg-[#141b2d] border border-[#1e293b] rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-[#6366f1] transition-colors"
                    />
                </div>

                {erro && (
                    <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                        <HiOutlineExclamationCircle className="text-red-400 shrink-0" size={18} />
                        <p className="text-sm text-red-400">{erro}</p>
                    </div>
                )}

                {projetos.length === 0 && !erro ? (
                    <div className="flex flex-col items-center justify-center flex-1 py-20 text-[#475569]">
                        <HiOutlineFolder size={52} className="mb-4 opacity-40" />
                        <p className="text-base font-semibold text-[#64748b]">
                            {busca ? 'Nenhum projeto encontrado.' : 'Nenhum projeto ainda.'}
                        </p>
                        {!busca && (
                            <button
                                onClick={() => navigate('/projetos/criar')}
                                className="mt-4 text-sm text-[#6366f1] hover:underline"
                            >
                                Criar primeiro projeto →
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {projetos.map(projeto => (
                            <CardProjeto key={projeto.id} projeto={projeto} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}