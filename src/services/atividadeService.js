import api from "./api";

export async function criarAtividade(dados) {
  const response = await api.post("/atividades", dados);
  return response.data;
}

export async function listarColaboradores() {
  const response = await api.get("/atividades/colaboradores");
  return response.data;
}

export async function associarColaboradorAtividade(idAtividade, idColaborador) {
  const response = await api.post("/atividades/associar-colaborador", {
    idAtividade,
    idColaborador,
  });

  return response.data;
}

export async function buscarAtividade(idAtividade) {
  const response = await api.get(`/atividades/${idAtividade}`);
  return response.data;
}

export async function atualizarAtividade(idAtividade, dados) {
  await api.put(`/atividades/${idAtividade}`, dados);
}