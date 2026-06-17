import api from "../services/api.js";

// get dados do perfil
export async function getPerfil(){
    const response = await api.get("/profile/me");
    return response.data;
}

// put -> editando os dados do perfil
export async function putEditandoDados(dados){
    const token = localStorage.getItem("token");
    const reponse = await api.put("/profile/me", dados, {
        headers: {Authorization: `Bearer ${token}`}
    });
    return reponse.data;
}

// delete -> excluir conta
export async function excluirConta(){
    const token = localStorage.getItem("token");
    const response = await api.delete("/profile/me", {
        headers: {Authorization: `Bearer ${token}`}
    });
    return response.data
}