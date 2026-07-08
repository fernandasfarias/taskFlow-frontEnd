import axios from "axios";

export async function listarMilestone(idAtividade) {
    const token = localStorage.getItem("token");
    const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/milestones/atividade/${idAtividade}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data;
}