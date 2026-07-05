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
  const [currentUserEmail, setCurrentUserEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setCurrentUserEmail(payload.sub);
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
      setMensagens([]); // Em caso de erro, limpa a lista para não quebrar a tela
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

  const isMensagemDoUsuario = (msg) => {
      
      if (msg?.projectManager?.email === currentUserEmail) return true;
      if (msg?.cliente?.email === currentUserEmail) return true;
      return msg.remetenteEmail === currentUserEmail;
  };

  return (
    <div className="flex flex-col h-screen bg-[#090d16]">
      <div className="p-4 border-b border-[#1e293b] flex items-center gap-4 bg-[#0d121f]">
        <button 
          onClick={() => navigate('/chat')} 
          className="text-gray-400 hover:text-white transition-all p-2 bg-[#1e293b] rounded-lg"
        >
          <HiArrowLeft size={20} />
        </button>
        <h2 className="text-white font-semibold">Chat do Projeto</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-[#1e293b] scrollbar-track-transparent">
        {loading ? (
            <div className="flex justify-center items-center h-full text-gray-500">
               Carregando mensagens...
            </div>
        ) : mensagens.length === 0 ? (
            <div className="flex justify-center items-center h-full text-gray-500 text-center">
                Sem mensagens ainda.<br/>Inicie a conversa!
            </div>
        ) : (
            mensagens.map(msg => (
                <MensagemBubble 
                    
                    key={msg.idMensagem || Math.random()} 
                    mensagem={{
                      conteudo: msg.conteudo, 
                      
                      dataEnvio: msg.dataHora ? new Date(msg.dataHora).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''
                    }} 
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