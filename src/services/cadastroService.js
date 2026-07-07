import api from './api';

export async function cadastroService(dados) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/cadastro`, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(dados),
    });

    if (!response.ok) {
        throw new Error("erro ao cadastrar.");
    }
    return await response.json();
}