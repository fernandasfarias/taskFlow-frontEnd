import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import MensagemBubble from './components/MensagemBubble'; 
import MensagemInput from './components/MensagemInput';   
import { ChatService } from './services/ChatService';     

export default function ConversaPage() {
  const { idProjeto } = useParams();
  const navigate = useNavigate();
  const [mensagens, setMensagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  
  // Alterado o nome da variável para ficar claro que estamos guardando o ID
  const [currentUserId, setCurrentUserId] = useState(''); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setCurrentUserId(payload.sub); // O payload.sub traz o ID do Token
        } catch (e) { console.error("Erro ao ler token", e); }
    }

    carregarMensagens();
    const interval = setInterval(carregarMensagens, 5000);
    return () => clearInterval(interval);
  }, [idProjeto]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const carregarMensagens = async () => {
    try {
      const data = await ChatService.getMensagensPorProjeto(idProjeto);
      const mensagensArray = Array.isArray(data) ? data : (data?.content || []);
      setMensagens(mensagensArray);
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
      setMensagens([]); 
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (conteudo) => {
    try {
      const dto = { conteudo: conteudo, idProjeto: idProjeto };
      const novaMensagem = await ChatService.enviarMensagem(dto);
      setMensagens((prev) => [...prev, novaMensagem]);
    } catch (error) {
      console.error("Erro ao enviar a mensagem:", error);
      alert("Não foi possível enviar a mensagem. Verifique a conexão.");
    }
  };

  // compara o ID que veio do banco com o ID do seu Token
  const isMensagemDoUsuario = (msg) => {
      return msg.remetenteId === currentUserId; 
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[#090d16]">
      <div className="p-4 border-b border-[#1e293b] flex items-center gap-3 bg-[#0d121f] sticky top-0 z-10">
        <button 
          onClick={() => navigate('/chat')} 
          className="text-gray-400 hover:text-white transition-all p-2 bg-[#1e293b] rounded-lg active:scale-95"
        >
          <HiArrowLeft size={20} />
        </button>
        <h2 className="text-white font-semibold truncate">Chat do Projeto</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-[#1e293b] scrollbar-track-transparent">
        {loading ? (
            <div className="flex justify-center items-center h-full text-[#6366f1] animate-pulse">
               Carregando mensagens...
            </div>
        ) : mensagens.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-full text-gray-500 text-center gap-2">
                <p>Sem mensagens ainda.</p>
                <p className="text-sm">Envie o primeiro "Oi" para a equipe!</p>
            </div>
        ) : (
            mensagens.map(msg => (
                <MensagemBubble 
                    key={msg.idMensagem || Math.random()} 
                    mensagem={{
                      conteudo: msg.conteudo, 
                      dataEnvio: msg.dataHora ? new Date(msg.dataHora).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '',
                      remetenteNome: msg.remetenteNome 
                    }} 
                    // Passa a verificação corrigida para o componente da bolha
                    isUser={isMensagemDoUsuario(msg)} 
                />
            ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <MensagemInput onSend={handleSend} />
    </div>
  );
}