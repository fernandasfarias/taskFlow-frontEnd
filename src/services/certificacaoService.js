export async function removerCertificacao(idCertificacao) {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/certificacoes/${idCertificacao}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Erro ao remover certificação");
    }
}

export async function listarMinhasCertificacoes() {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/onboarding/certificacoes/me`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Erro ao buscar certificações");
    }

    return await response.json();
}