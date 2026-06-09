import React, { useState } from 'react';
import { HiPaperAirplane } from 'react-icons/hi';

export default function MensagemInput({ onSend }) {
  const [mensagem, setMensagem] = useState('');

  const handleSend = () => {
    if (mensagem.trim()) {
      onSend(mensagem);
      setMensagem('');
    }
  };

  return (
    <div className="p-4 bg-[#0d121f] border-t border-[#1e293b] flex items-center gap-3">
      <input
        type="text"
        value={mensagem}
        onChange={(e) => setMensagem(e.target.value)}
        placeholder="Digite sua mensagem..."
        className="flex-1 bg-[#141b2d] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#6366f1]"
      />
      <button 
        onClick={handleSend}
        className="p-3 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl text-white hover:opacity-90 transition-all"
      >
        <HiPaperAirplane size={20} />
      </button>
    </div>
  );
}