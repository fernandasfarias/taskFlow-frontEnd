import axios from "axios";

export async function listarEmpresa() {
    const token = localStorage.getItem("token");
    const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/profile/me/empresa`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data;
}