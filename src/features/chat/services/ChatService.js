import axios from 'axios';

// Adicionamos um "fallback" (|| 'http://localhost:8080'). 
// Se a variável do Vite falhar, ele garante que vai bater na porta do Java!
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080', 
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptador para garantir que o Token seja enviado
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const ChatService = {
  // Busca as mensagens direto no 8080
  getMensagensPorProjeto: async (idProjeto) => {
    const response = await API.get(`/mensagens/${idProjeto}`);
    return response.data;
  },

  // Envia a mensagem direto no 8080
  enviarMensagem: async (mensagemDTO) => {
    const response = await API.post('/mensagens', mensagemDTO);
    return response.data;
  }
};