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

export async function buscarTarefa(idTarefa) {
    const response = await api.get(`/atividades/buscar-tarefa/${idTarefa}`);
    return response.data;
}

export async function editarTarefa(idTarefa, dados) {
    const response = await api.put(`/atividades/editar-tarefa/${idTarefa}`, dados);
    return response.data;
}

export async function associarColaboradorTarefa(idTarefa, idColaborador) {
  await api.post("/atividades/tarefa/associar-colaborador", {
    idTarefa,
    idColaborador,
  });
}