import api from './api';

export const listarProjetos = () =>
    api.get('/projetos').then(r => r.data);

export const buscarProjetos = (nome) =>
    api.get('/projetos/buscar', { params: { nome } }).then(r => r.data);

export const criarProjeto = (dados) =>
    api.post('/projetos/criar', dados).then(r => r.data);

export const buscarProjeto = (id) =>
    api.get(`/projetos/${id}`).then(r => r.data);

export const atualizarProjeto = (id, dados) =>
    api.put(`/projetos/${id}`, dados).then(r => r.data);

export const deletarProjeto = (id) =>
    api.delete(`/projetos/${id}`).then(r => r.data);

export const listarColaboradoresDoProjeto = (idProjeto) =>
    api.get(`/projetos/${idProjeto}/colaboradores`).then(r => r.data);

export const listarClientesDoProjeto = (idProjeto) =>
    api.get(`/projetos/${idProjeto}/clientes`).then(r => r.data);

export const associarColaborador = (idProjeto, idColaborador) =>
    api.post(`/projetos/${idProjeto}/colaborador/${idColaborador}`).then(r => r.data);

export const desassociarColaborador = (idProjeto, idColaborador) =>
    api.delete(`/projetos/${idProjeto}/colaborador/${idColaborador}`).then(r => r.data);

export const associarCliente = (idProjeto, idCliente) =>
    api.post(`/projetos/${idProjeto}/cliente/${idCliente}`).then(r => r.data);

export const desassociarCliente = (idProjeto, idCliente) =>
    api.delete(`/projetos/${idProjeto}/cliente/${idCliente}`).then(r => r.data);