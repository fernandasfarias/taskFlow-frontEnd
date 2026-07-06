import React from 'react';

export default function MensagemBubble({ mensagem, isUser }) {
  // Extrai apenas o primeiro nome (ex: "Jeff Bezos" -> "Jeff")
  const primeiroNome = mensagem.remetenteNome ? mensagem.remetenteNome.split(' ')[0] : 'Usuário';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Container responsivo: 85% no celular, 70% no desktop */}
      <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        
        {/* Nome do Remetente */}
        <span className="text-xs text-gray-400 mb-1 px-1 font-medium tracking-wide">
          {primeiroNome}
        </span>
        
        {/* Bolha do Chat com bordas arredondadas assimétricas */}
        <div className={`px-4 py-3 shadow-md ${
          isUser 
            ? 'bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white rounded-2xl rounded-tr-sm' 
            : 'bg-[#1e293b] text-gray-200 rounded-2xl rounded-tl-sm border border-[#334155]'
        }`}>
          <p className="text-sm break-words whitespace-pre-wrap">{mensagem.conteudo}</p>
          
          {/* Hora do Envio */}
          <div className={`text-[10px] mt-1.5 font-medium flex ${isUser ? 'justify-end text-indigo-200' : 'justify-start text-gray-500'}`}>
            {mensagem.dataEnvio}
          </div>
        </div>

      </div>
    </div>
  );
}