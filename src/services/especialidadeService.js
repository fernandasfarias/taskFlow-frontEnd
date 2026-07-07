import axios from "axios";

export async function listarEspecialidade() {
    const token = localStorage.getItem("token");
    const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/profile/me/especialidades`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data;
}