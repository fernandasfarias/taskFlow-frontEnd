import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiSearch, HiPlus, HiCheck, HiOfficeBuilding } from 'react-icons/hi';
import {
    listarColaboradoresDoProjeto,
    listarClientesDoProjeto,
    associarColaborador,
    desassociarColaborador,
    associarCliente,
    desassociarCliente,
} from '../../services/projetoService';

const SEARCH_CLASS = 'w-full bg-[#0a0e1a] border border-[#1e2a4a] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#3d4a63] focus:outline-none focus:border-[#6366f1]/60 transition-colors';

function SearchInput({ value, onChange, placeholder }) {
    return (
        <div className="relative mb-3">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3d4a63]" size={15} />
            <input type="text" value={value} onChange={onChange} placeholder={placeholder} className={SEARCH_CLASS} />
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

function ClienteAvatar() {
    return (
        <div className="w-10 h-10 rounded-full bg-[#1a2035] border border-[#1e2a4a] flex items-center justify-center shrink-0">
            <HiOfficeBuilding size={18} className="text-[#64748b]" />
        </div>
    );
}

function AddButton({ isAdded, isLoading, onClick }) {
    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 shrink-0 disabled:opacity-50
                ${isAdded
                    ? 'border-emerald-400 text-emerald-400 bg-emerald-400/10'
                    : 'border-[#22d3ee] text-[#22d3ee] hover:bg-[#22d3ee]/10'
                }`}
        >
            {isLoading
                ? <span className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
                : isAdded ? <HiCheck size={15} /> : <HiPlus size={15} />
            }
        </button>
    );
}

function PessoaItem({ nome, subtitulo, isCliente, isAdded, isLoading, onToggle }) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0d1320] hover:bg-[#101628] transition-colors">
            {isCliente ? <ClienteAvatar /> : <InitialAvatar nome={nome} />}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{nome}</p>
                <p className="text-xs text-[#64748b] truncate">{subtitulo}</p>
            </div>
            <AddButton isAdded={isAdded} isLoading={isLoading} onClick={onToggle} />
        </div>
    );
}

export default function AssociarUsuarios() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const projeto = state?.projeto;

    const [colaboradores, setColaboradores] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [buscaMembro, setBuscaMembro] = useState('');
    const [buscaCliente, setBuscaCliente] = useState('');
    const [membrosAdicionados, setMembrosAdicionados] = useState(new Set());
    const [clientesAdicionados, setClientesAdicionados] = useState(new Set());
    const [loadingColab, setLoadingColab] = useState(new Set());
    const [loadingCliente, setLoadingCliente] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');

    useEffect(() => {
        if (!projeto?.id) { navigate('/projetos'); return; }
        Promise.all([
            listarColaboradoresDoProjeto(projeto.id),
            listarClientesDoProjeto(projeto.id),
        ])
            .then(([colabs, cls]) => {
                setColaboradores(colabs);
                setClientes(cls);
            })
            .catch(e => { console.error(e); setErro('Erro ao carregar pessoas.'); })
            .finally(() => setLoading(false));
    }, []);

    const handleToggleColab = async (idColaborador) => {
        if (loadingColab.has(idColaborador)) return;
        setLoadingColab(prev => new Set([...prev, idColaborador]));
        const isAdded = membrosAdicionados.has(idColaborador);
        try {
            if (isAdded) {
                await desassociarColaborador(projeto.id, idColaborador);
                setMembrosAdicionados(prev => { const s = new Set(prev); s.delete(idColaborador); return s; });
            } else {
                await associarColaborador(projeto.id, idColaborador);
                setMembrosAdicionados(prev => new Set([...prev, idColaborador]));
            }
        } catch (e) {
            console.error(e);
            setErro('Erro ao atualizar associação. Tente novamente.');
        } finally {
            setLoadingColab(prev => { const s = new Set(prev); s.delete(idColaborador); return s; });
        }
    };

    const handleToggleCliente = async (idCliente) => {
        if (loadingCliente.has(idCliente)) return;
        setLoadingCliente(prev => new Set([...prev, idCliente]));
        const isAdded = clientesAdicionados.has(idCliente);
        try {
            if (isAdded) {
                await desassociarCliente(projeto.id, idCliente);
                setClientesAdicionados(prev => { const s = new Set(prev); s.delete(idCliente); return s; });
            } else {
                await associarCliente(projeto.id, idCliente);
                setClientesAdicionados(prev => new Set([...prev, idCliente]));
            }
        } catch (e) {
            console.error(e);
            setErro('Erro ao atualizar associação. Tente novamente.');
        } finally {
            setLoadingCliente(prev => { const s = new Set(prev); s.delete(idCliente); return s; });
        }
    };

    const filtradosColabs = colaboradores.filter(c =>
        c.nome?.toLowerCase().includes(buscaMembro.toLowerCase()) ||
        c.email?.toLowerCase().includes(buscaMembro.toLowerCase())
    );

    const filtradosClientes = clientes.filter(c =>
        c.nomeCliente?.toLowerCase().includes(buscaCliente.toLowerCase()) ||
        c.email?.toLowerCase().includes(buscaCliente.toLowerCase()) ||
        c.empresa?.nomeEmpresa?.toLowerCase().includes(buscaCliente.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-6">
            <div className="w-full max-w-3xl border border-[#1e2a4a] rounded-2xl p-10">
                <div className="mb-7">
                    <h2 className="text-xl font-bold text-white">Associar pessoas</h2>
                    <p className="text-sm text-[#64748b] mt-1">Busque e adicione membros da equipe e clientes</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <span className="w-8 h-8 border-2 border-[#6366f1]/30 border-t-[#6366f1] rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <SearchInput
                                value={buscaMembro}
                                onChange={e => setBuscaMembro(e.target.value)}
                                placeholder="Buscar membro..."
                            />
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {filtradosColabs.map(c => (
                                    <PessoaItem
                                        key={c.idColaborador}
                                        nome={c.nome}
                                        subtitulo={c.especialidades?.[0]?.nomeEspecialidade || c.email}
                                        isCliente={false}
                                        isAdded={membrosAdicionados.has(c.idColaborador)}
                                        isLoading={loadingColab.has(c.idColaborador)}
                                        onToggle={() => handleToggleColab(c.idColaborador)}
                                    />
                                ))}
                                {filtradosColabs.length === 0 && !loading && (
                                    <p className="text-xs text-[#475569] text-center py-6">Nenhum colaborador encontrado.</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <SearchInput
                                value={buscaCliente}
                                onChange={e => setBuscaCliente(e.target.value)}
                                placeholder="Buscar Cliente..."
                            />
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {filtradosClientes.map(c => (
                                    <PessoaItem
                                        key={c.idCliente}
                                        nome={c.nomeCliente}
                                        subtitulo={c.empresa?.nomeEmpresa || c.email}
                                        isCliente={true}
                                        isAdded={clientesAdicionados.has(c.idCliente)}
                                        isLoading={loadingCliente.has(c.idCliente)}
                                        onToggle={() => handleToggleCliente(c.idCliente)}
                                    />
                                ))}
                                {filtradosClientes.length === 0 && !loading && (
                                    <p className="text-xs text-[#475569] text-center py-6">Nenhum cliente encontrado.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {erro && (
                    <p className="text-xs text-red-400 mt-4 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                        {erro}
                    </p>
                )}

                <div className="flex gap-4 mt-8">
                    <button
                        onClick={() => navigate('/projetos/criar')}
                        className="flex-1 py-3 rounded-xl border border-[#1e2a4a] text-[#94a3b8] text-sm font-medium hover:bg-[#1e293b] hover:text-white transition-colors"
                    >
                        Voltar
                    </button>
                    <button
                        onClick={() => navigate('/projetos')}
                        className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#6366f1] to-[#7c3aed] hover:opacity-90 transition-opacity"
                    >
                        Próximo
                    </button>
                </div>
            </div>
        </div>
    );
}