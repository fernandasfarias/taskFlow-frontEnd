import api from './api';

export async function login(email, senha) {
    const reponse = await api.post("/auth/login", {email, senha});
    return reponse.data;
}

export async function solicitarRecuperacaoSenha(email) {
    const response = await api.post('/auth/recuperar-senha', {
        email
    });

    return response.data;
}

export async function redefinirSenha(token, novaSenha) {
    const response = await api.post('/auth/redefinir-senha', {
        token,
        novaSenha
    });

    return response.data;
}
