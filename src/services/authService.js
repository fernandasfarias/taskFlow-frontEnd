import api from './api';

export async function login(email, senha) {
    const reponse = await api.post("/auth/login", {email, senha});
    return reponse.data;
}