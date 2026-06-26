import api from "./api";

export async function criarAtividade(dados) {
  const response = await api.post("/atividades", dados);
  return response.data;
}