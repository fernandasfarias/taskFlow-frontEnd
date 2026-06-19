import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    HiArrowLeft, HiOutlineCalendar, HiOutlineCurrencyDollar,
    HiOutlineOfficeBuilding, HiOutlineBriefcase,
    HiOutlineClipboardList, HiOutlineUsers, HiX,
} from 'react-icons/hi';
import Sidebar from '../../features/dashboard/components/Sidebar';
import {
    buscarProjeto,
    listarColaboradoresDoProjeto,
    listarClientesDoProjeto,
    desassociarColaborador,
    desassociarCliente,
} from '../../services/projetoService';
import { getPerfil } from '../../services/perfilService';

const HOJE = new Date().toISOString().split('T')[0];

function formatarData(dataStr) {
    if (!dataStr) return '—';
    return new Date(dataStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatarOrcamento(valor) {
    if (!valor) return '—';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

function InfoCard({ icon, label, value, colorClass }) {
    return (
        <div className="bg-[#141b2d] border border-[#1e293b] rounded-2xl p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl shrink-0 ${colorClass}`}>{icon}</div>
            <div>
                <p className="text-xs text-[#64748b] font-medium">{label}</p>
                <p className="text-base font-bold text-white mt-0.5">{value}</p>
            </div>
        </div>
    );
}

function InitialAvatar({ nome }) {
    return (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center text-white font-bold text-sm shrink-0">
            {nome?.charAt(0).toUpperCase()}
        </div>
    );
}

function EmpresaAvatar() {
    return (
        <div className="w-10 h-10 rounded-full bg-[#1a2035] border border-[#1e2a4a] flex items-center justify-center shrink-0">
            <HiOutlineOfficeBuilding size={18} className="text-[#64748b]" />
        </div>
    );
}

function PessoaRow({ nome, subtitulo, isCliente, onRemover, removendo }) {
    return (
        <div className="flex items-center gap-3 py-3 border-b border-[#1e293b] last:border-0">
            {isCliente ? <EmpresaAvatar /> : <InitialAvatar nome={nome} />}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{nome}</p>
                <p className="text-xs text-[#64748b] truncate">{subtitulo}</p>
            </div>
            <button
                onClick={onRemover}
                disabled={removendo}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#475569] hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-40 shrink-0"
            >
                {removendo
                    ? <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                    : <HiX size={14} />
                }
            </button>
        </div>
    );
}

function SectionCard({ title, icon, count, children }) {
    return (
        <div className="bg-[#141b2d] border border-[#1e293b] rounded-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    {icon}
                    <h3 className="text-sm font-semibold text-white">{title}</h3>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#6366f1]/20 text-[#a5b4fc]">
                    {count}
                </span>
            </div>
            <div className="overflow-y-auto max-h-72">{children}</div>
        </div>
    );
}

export default function ExibirProjeto() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [projeto, setProjeto] = useState(null);
    const [colaboradores, setColaboradores] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [removendoColab, setRemovendoColab] = useState(new Set());
    const [removendoCliente, setRemovendoCliente] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState({ name: '', role: '' });

    useEffect(() => {
        async function carregar() {
            try {
                const [proj, colabs, cls, perfil] = await Promise.all([
                    buscarProjeto(id),
                    listarColaboradoresDoProjeto(id),
                    listarClientesDoProjeto(id),
                    getPerfil(),
                ]);
                setProjeto(proj);
                setColaboradores(colabs);
                setClientes(cls);
                setUser({ name: perfil.nome, role: perfil.tipo });
            } catch (e) {
                console.error(e);
                setErro('Não foi possível carregar os detalhes do projeto.');
            } finally {
                setLoading(false);
            }
        }
        carregar();
    }, [id]);

    const handleRemoverColab = async (idColaborador) => {
        if (removendoColab.has(idColaborador)) return;
        setRemovendoColab(prev => new Set([...prev, idColaborador]));
        try {
            await desassociarColaborador(id, idColaborador);
            setColaboradores(prev => prev.filter(c => c.idColaborador !== idColaborador));
        } catch (e) {
            console.error(e);
        } finally {
            setRemovendoColab(prev => { const s = new Set(prev); s.delete(idColaborador); return s; });
        }
    };

    const handleRemoverCliente = async (idCliente) => {
        if (removendoCliente.has(idCliente)) return;
        setRemovendoCliente(prev => new Set([...prev, idCliente]));
        try {
            await desassociarCliente(id, idCliente);
            setClientes(prev => prev.filter(c => c.idCliente !== idCliente));
        } catch (e) {
            console.error(e);
        } finally {
            setRemovendoCliente(prev => { const s = new Set(prev); s.delete(idCliente); return s; });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#090d16]">
                <span className="w-10 h-10 border-2 border-[#6366f1]/30 border-t-[#6366f1] rounded-full animate-spin" />
            </div>
        );
    }

    if (erro || !projeto) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#090d16] flex-col gap-4">
                <p className="text-[#64748b]">{erro || 'Projeto não encontrado.'}</p>
                <button onClick={() => navigate('/projetos')} className="text-sm text-[#6366f1] hover:underline">
                    ← Voltar para projetos
                </button>
            </div>
        );
    }

    const vencido = projeto.dataEntrega && projeto.dataEntrega < HOJE;

    return (
        <div className="flex min-h-screen w-full bg-[#090d16] font-sans overflow-hidden">
            <Sidebar user={user} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 overflow-y-auto h-screen">
                <div className="p-8 lg:p-10 max-w-6xl mx-auto flex flex-col gap-8">

                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <button
                                onClick={() => navigate('/projetos')}
                                className="mt-1 p-2 rounded-xl bg-[#141b2d] border border-[#1e293b] text-[#64748b] hover:text-white hover:border-[#6366f1]/50 transition-all"
                            >
                                <HiArrowLeft size={18} />
                            </button>
                            <div>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h1 className="text-2xl font-bold text-white">{projeto.nome}</h1>
                                    {vencido && (
                                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                                            Vencido
                                        </span>
                                    )}
                                </div>
                                {projeto.descricao && (
                                    <p className="text-sm text-[#64748b] mt-1.5 max-w-2xl leading-relaxed">
                                        {projeto.descricao}
                                    </p>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/projetos/associar-colaboradores', {
                                state: { projeto, from: `/projetos/${id}` }
                            })}
                            className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white
                                bg-gradient-to-r from-[#6366f1] to-[#a855f7]
                                hover:opacity-90 hover:shadow-lg hover:shadow-[#6366f1]/30 transition-all"
                        >
                            <HiOutlineUsers size={16} />
                            Gerenciar equipe
                        </button>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <InfoCard
                            icon={<HiOutlineCalendar size={20} className="text-white" />}
                            label="Início"
                            value={formatarData(projeto.dataInicio)}
                            colorClass="bg-[#6366f1]/20 text-[#6366f1]"
                        />
                        <InfoCard
                            icon={<HiOutlineCalendar size={20} className="text-white" />}
                            label="Entrega"
                            value={formatarData(projeto.dataEntrega)}
                            colorClass={vencido ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}
                        />
                        <InfoCard
                            icon={<HiOutlineCurrencyDollar size={20} className="text-white" />}
                            label="Orçamento"
                            value={formatarOrcamento(projeto.orcamento)}
                            colorClass="bg-amber-500/20 text-amber-400"
                        />
                        <InfoCard
                            icon={<HiOutlineClipboardList size={20} className="text-white" />}
                            label="Membros"
                            value={`${colaboradores.length + clientes.length} pessoa${colaboradores.length + clientes.length !== 1 ? 's' : ''}`}
                            colorClass="bg-blue-500/20 text-blue-400"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <SectionCard
                            title="Colaboradores"
                            icon={<HiOutlineBriefcase size={16} className="text-[#6366f1]" />}
                            count={colaboradores.length}
                        >
                            {colaboradores.length === 0 ? (
                                <p className="text-xs text-[#475569] text-center py-8">Nenhum colaborador associado.</p>
                            ) : (
                                colaboradores.map(c => (
                                    <PessoaRow
                                        key={c.idColaborador}
                                        nome={c.nome}
                                        subtitulo={c.especialidades?.[0]?.nomeEspecialidade || c.email}
                                        isCliente={false}
                                        removendo={removendoColab.has(c.idColaborador)}
                                        onRemover={() => handleRemoverColab(c.idColaborador)}
                                    />
                                ))
                            )}
                        </SectionCard>

                        <SectionCard
                            title="Clientes"
                            icon={<HiOutlineOfficeBuilding size={16} className="text-[#a855f7]" />}
                            count={clientes.length}
                        >
                            {clientes.length === 0 ? (
                                <p className="text-xs text-[#475569] text-center py-8">Nenhum cliente associado.</p>
                            ) : (
                                clientes.map(c => (
                                    <PessoaRow
                                        key={c.idCliente}
                                        nome={c.nomeCliente}
                                        subtitulo={c.empresa?.nomeEmpresa || c.email}
                                        isCliente={true}
                                        removendo={removendoCliente.has(c.idCliente)}
                                        onRemover={() => handleRemoverCliente(c.idCliente)}
                                    />
                                ))
                            )}
                        </SectionCard>
                    </div>

                </div>
            </div>
        </div>
    );
}
