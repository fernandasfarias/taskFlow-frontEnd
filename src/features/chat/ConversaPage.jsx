import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import MensagemBubble from './components/MensagemBubble';
import MensagemInput from './components/MensagemInput';    

export default function ConversaPage() {
  const { idProjeto } = useParams();
  const navigate = useNavigate();
  const [mensagens, setMensagens] = useState([]);

  const handleSend = (conteudo) => {
    console.log("Enviando:", conteudo);
  };
return (
    <div className="flex flex-col h-screen bg-[#090d16]">
      {/* 4. Cabeçalho com o Botão Voltar */}
      <div className="p-4 border-b border-[#1e293b] flex items-center gap-4 bg-[#0d121f]">
        <button 
          onClick={() => navigate('/chat')} // Volta para a listagem
          className="text-gray-400 hover:text-white transition-all"
        >
          <HiArrowLeft size={24} />
        </button>
        <h2 className="text-white font-semibold">Conversa {idProjeto}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {mensagens.map(msg => (
          <MensagemBubble key={msg.id} mensagem={msg} isUser={true} />
        ))}
      </div>
      
      <MensagemInput onSend={handleSend} />
    </div>
  );
}