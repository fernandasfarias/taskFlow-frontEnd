import api from "./api";

export async function criarTarefa(idAtividade, dados) {
  const response = await api.post(
    `/atividades/${idAtividade}/tarefas`,
    dados
  );

  return response.data;
}

export async function excluirTarefa(idTarefa) {
  const response = await api.delete(`/atividades/deletar-tarefa/${idTarefa}`);
  return response.data;
}