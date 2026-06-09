import React from 'react';

export default function ConversationCard({ conversa, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="bg-[#141b2d] p-5 rounded-2xl border border-[#1e293b] hover:border-[#6366f1] cursor-pointer transition-all flex flex-col gap-1 group"
    >
      <h2 className="font-semibold text-lg text-white group-hover:text-[#6366f1] transition-colors">
        {conversa.nome}
      </h2>
      <p className="text-sm text-gray-400 truncate">
        {conversa.ultimaMensagem || "Nenhuma mensagem recente."}
      </p>
    </div>
  );
}