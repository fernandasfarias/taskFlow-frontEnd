import axios from "axios";

export async function removerCertificacao(idCertificacao) {
    const token = localStorage.getItem("token");

    await axios.delete(
        `${import.meta.env.VITE_API_URL}/profile/me/certificacoes/${idCertificacao}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
}

export async function listarMinhasCertificacoes() {
    const token = localStorage.getItem("token");
    const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/profile/me/certificacoes`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data;
}