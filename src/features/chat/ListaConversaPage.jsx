import React, { useState, useEffect } from 'react';
import { HiArrowLeft, HiOutlineChatAlt2 } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
// MUDANÇA: Usando o serviço de projetos que você já tem configurado e funcionando!
import { listarProjetos } from '../../services/projetoService'; 
import ConversationCard from './components/ConversationCard'; // Ajuste os '../' conforme sua estrutura de pastas

export default function ListaConversasPage() {
  const navigate = useNavigate();
  const [conversas, setConversas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarConversas() {
      try {
        // Usa a função do seu projetoService que já bate na URL certa ('/projetos')
        const response = await listarProjetos();
        
        // Proteção: Se a resposta não for array, força virar array para não quebrar o .map()
        const projetosArray = Array.isArray(response) ? response : (response?.data || response?.content || []);
        
        // Pega as propriedades corretas do seu ProjetoDTO
        const conversasFormatadas = projetosArray.map(proj => ({
          id: proj.id || proj.idProjeto, // dependendo de como o DTO chega
          nome: proj.nome || proj.nomeProjeto, 
          ultimaMensagem: "Acessar chat do projeto"
        }));
        
        setConversas(conversasFormatadas);
      } catch (error) {
        console.error("Erro ao carregar conversas:", error);
        setConversas([]); 
      } finally {
        setLoading(false);
      }
    }
    carregarConversas();
  }, []);

  return (
    <div className="p-10 bg-[#090d16] min-h-screen text-white">
      <button 
        onClick={() => navigate('/dashboard')} 
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <HiArrowLeft size={20} /> 
      </button>

      <div className="flex items-center gap-3 mb-8">
        <HiOutlineChatAlt2 size={32} className="text-[#6366f1]" />
        <h1 className="text-3xl font-bold">Suas Conversas</h1>
      </div>
      
      <div className="space-y-3">
        {loading ? (
          <p className="text-gray-500 animate-pulse">Carregando chats...</p>
        ) : conversas.length > 0 ? (
          conversas.map((conversa) => (
            <ConversationCard 
              key={conversa.id} 
              conversa={conversa} 
              onClick={() => navigate(`/chat/${conversa.id}`)} 
            />
          ))
        ) : (
          <div className="p-8 bg-[#141b2d] rounded-2xl border border-[#1e293b] text-center">
            <p className="text-gray-400">Nenhuma conversa encontrada para os seus projetos.</p>
          </div>
        )}
      </div>
    </div>
  );
}