import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import { criarProjeto } from '../../services/projetoService';
import { getPerfil } from '../../services/perfilService';
import logoImg from '../../assets/Frame2.png';

const INPUT_CLASS = 'w-full bg-[#0a0e1a] border border-[#1e2a4a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#3d4a63] focus:outline-none focus:border-[#6366f1]/60 transition-colors';

function DateInput({ name, value, onChange, placeholder }) {
    const [type, setType] = useState('text');
    return (
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            onFocus={() => setType('date')}
            onBlur={() => { if (!value) setType('text'); }}
            placeholder={placeholder}
            className={`${INPUT_CLASS} [color-scheme:dark]`}
        />
    );
}

export default function CriarProjetos() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ nome: '', objetivo: '', dataInicio: '', dataEntrega: '', orcamento: '' });
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');
    const [idManager, setIdManager] = useState(null);

    useEffect(() => {
        getPerfil()
            .then(p => {
                const id = p.id ?? p.idManager ?? p.idColaborador ?? null;
                console.log('[getPerfil] idManager resolvido:', id, '| perfil completo:', p);
                setIdManager(id);
            })
            .catch(e => console.error('[getPerfil] erro:', e));
    }, []);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setErro('');
    };

    const handleProximo = async () => {
        if (!form.nome.trim()) { setErro('Informe o nome do projeto.'); return; }
        setLoading(true);
        try {
            const projeto = await criarProjeto({
                nome: form.nome,
                descricao: form.objetivo,
                dataInicio: form.dataInicio || null,
                dataEntrega: form.dataEntrega || null,
                orcamento: parseFloat(form.orcamento) || 0,
                idManager,
                idClientes: [],
                idColaboradores: [],
            });
            navigate('/projetos/associar-usuarios', { state: { projeto } });
        } catch (e) {
            console.error(e);
            setErro('Erro ao criar projeto. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-6">
            <div className="w-full max-w-4xl border border-[#1e2a4a] rounded-2xl p-10 lg:p-14">
                <div className="flex gap-16 items-center">
                    <div className="flex-1">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-2 text-white font-semibold text-lg mb-8 hover:text-[#a5b4fc] transition-colors"
                        >
                            <HiArrowLeft size={20} />
                            Voltar
                        </button>
                        <p className="flex items-center gap-2 text-white font-semibold text-lg mb-8">Novo Projeto</p>
                        <div className="space-y-4">
                            <input
                                name="nome"
                                value={form.nome}
                                onChange={handleChange}
                                placeholder="Digite o nome do projeto"
                                className={INPUT_CLASS}
                            />
                            <textarea
                                name="objetivo"
                                value={form.objetivo}
                                onChange={handleChange}
                                placeholder="Descreva o objetivo do projeto"
                                rows={5}
                                className={`${INPUT_CLASS} resize-none`}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <DateInput name="dataInicio" value={form.dataInicio} onChange={handleChange} placeholder="Data de início" />
                                <DateInput name="dataEntrega" value={form.dataEntrega} onChange={handleChange} placeholder="Data de entrega" />
                            </div>
                            <input
                                name="orcamento"
                                value={form.orcamento}
                                onChange={handleChange}
                                placeholder="Orçamento"
                                type="number"
                                min="0"
                                step="0.01"
                                className={INPUT_CLASS}
                            />
                        </div>

                        {erro && (
                            <p className="text-xs text-red-400 mt-3 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                                {erro}
                            </p>
                        )}

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="flex-1 py-3 rounded-xl border border-[#1e2a4a] text-[#94a3b8] text-sm font-medium hover:bg-[#1e293b] hover:text-white transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleProximo}
                                disabled={!form.nome.trim() || loading}
                                className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#6366f1] to-[#7c3aed] hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center"
                            >
                                {loading
                                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    : 'Próximo'
                                }
                            </button>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center justify-center w-56 shrink-0 select-none pointer-events-none">
                        <img
                            src={logoImg}
                            alt=""
                            className="w-full"
                            style={{ opacity: 0.06, filter: 'grayscale(1) brightness(4)' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
