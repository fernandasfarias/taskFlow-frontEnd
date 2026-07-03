import api from "./api";

export async function listarKanban(idProjeto) {
  const response = await api.get(`/projetos/${idProjeto}/kanban`);
  return response.data;
}

export async function alterarStatusAtividade( idProjeto, idAtividade, status ) {
  await api.patch(`/projetos/${idProjeto}/kanban/atividades/${idAtividade}/status`, {
    status
  });
}

export async function excluir(idProjeto, idAtividade) {
  const response = await api.delete(`/projetos/${idProjeto}/kanban/atividades/${idAtividade}/excluir`);
  return response.data;
}

export async function buscarDetalhesAtividade(idProjeto, idAtividade) {
  const response = await api.get(`/projetos/${idProjeto}/kanban/${idAtividade}/detalhes`);
  return response.data;
}