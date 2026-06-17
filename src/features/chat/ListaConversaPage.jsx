import React, { useState, useEffect } from 'react';
import { HiArrowLeft } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { ChatService } from './services/ChatService';
import ConversationCard from './components/ConversationCard';

export default function ListaConversasPage() {
  const navigate = useNavigate();
  const [conversas, setConversas] = useState([]);

  useEffect(() => {
    // Usando o Mock definido no seu ChatService
    ChatService.getMinhasConversasMock().then(data => setConversas(data));
  }, []);

  return (
    <div className="p-10 bg-[#090d16] min-h-screen text-white">
      <button 
        onClick={() => navigate('/dashboard')} 
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
      >
        <HiArrowLeft size={20} /> Voltar para o Dashboard
      </button>

      <h1 className="text-2xl font-bold mb-6">Suas Conversas</h1>
      
      <div className="space-y-3">
        {conversas && conversas.length > 0 ? (
          conversas.map((conversa) => (
            <ConversationCard 
              key={conversa.id} 
              conversa={conversa} 
              onClick={() => navigate(`/chat/${conversa.id}`)} 
            />
          ))
        ) : (
          <p className="text-gray-500">Nenhuma conversa encontrada...</p>
        )}
      </div>
    </div>
  );
}