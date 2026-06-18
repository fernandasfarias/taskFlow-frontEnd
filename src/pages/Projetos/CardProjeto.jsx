import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineCalendar, HiOutlineUsers, HiArrowRight, HiOutlineCurrencyDollar } from 'react-icons/hi';

function formatarData(dataStr) {
    if (!dataStr) return '—';
    return new Date(dataStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatarOrcamento(valor) {
    if (valor == null || valor === 0) return null;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(valor);
}

const hoje = new Date().toISOString().split('T')[0];

export default function CardProjeto({ projeto }) {
    const navigate = useNavigate();
    const totalMembros = projeto.idColaboradores?.length || 0;
    const vencido = projeto.dataEntrega && projeto.dataEntrega < hoje;
    const orcamentoFormatado = formatarOrcamento(projeto.orcamento);

    return (
        <div
            onClick={() => navigate(`/projetos/${projeto.id}`)}
            className="group bg-[#141b2d] border border-[#1e293b] rounded-2xl p-6 flex flex-col justify-between h-52 cursor-pointer
                       hover:border-[#6366f1]/50 hover:shadow-lg hover:shadow-[#6366f1]/10 transition-all duration-300"
        >
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-semibold text-white leading-snug line-clamp-1 flex-1 pr-3 group-hover:text-[#a5b4fc] transition-colors">
                        {projeto.nome}
                    </h3>
                    {vencido && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 whitespace-nowrap shrink-0">
                            Vencido
                        </span>
                    )}
                </div>
                <p className="text-xs text-[#64748b] leading-relaxed line-clamp-3">
                    {projeto.descricao || 'Sem descrição.'}
                </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#1e293b]">
                <div className="flex items-center gap-4 text-[11px] text-[#64748b]">
                    <span className="flex items-center gap-1">
                        <HiOutlineCalendar size={13} />
                        {formatarData(projeto.dataEntrega)}
                    </span>
                    <span className="flex items-center gap-1">
                        <HiOutlineUsers size={13} />
                        {totalMembros} membro{totalMembros !== 1 ? 's' : ''}
                    </span>
                    {orcamentoFormatado && (
                        <span className="flex items-center gap-1">
                            <HiOutlineCurrencyDollar size={13} />
                            {orcamentoFormatado}
                        </span>
                    )}
                </div>
                <HiArrowRight size={15} className="text-[#6366f1] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        </div>
    );
}