import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { HiArrowLeft } from 'react-icons/hi';
import MensagemBubble from '../components/MensagemBubble'; 
import MensagemInput from '../components/MensagemInput';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const ChatService = {

getMinhasConversasMock: async () => {
    return [
      { id: 1, nome: "Projeto Sistema de Barbearia", ultimaMensagem: "Como está o progresso?" },
      { id: 2, nome: "Redesign Website TaskFlow", ultimaMensagem: "Aprovado!" },
      { id: 3, nome: "Pesquisa Reconhecimento Facial", ultimaMensagem: "Pode verificar o método?" },
    ];
  },



  // Busca os projetos onde o usuário tem permissão
  getMinhasConversas: async (token) => {
    return await axios.get(`${API_URL}/projetos/meus`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Busca mensagens de um projeto específico
  getMensagensPorProjeto: async (idProjeto, token) => {
    return await axios.get(`${API_URL}/mensagens/${idProjeto}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Envio de mensagem (usando seu DTO)
  enviarMensagem: async (mensagemDTO, token) => {
    return await axios.post(`${API_URL}/mensagens`, mensagemDTO, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};