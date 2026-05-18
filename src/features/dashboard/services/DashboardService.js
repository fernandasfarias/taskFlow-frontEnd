import axios from "axios"; 

const API = axios.create({
    baseURL:'https://localhost8080/api/dashboard',
    headers:{
        'Content-Type':'application/json'
    }
});


export const DashboardService = {
    // Função para buscar os dados do dashboard (estados do projeto)
getStats : async() => { 
    try{
        const response = await API.get('/stats');
        return response.data;
    } catch(error){
        console.error('Erro ao buscar dados do dashboard:', error);
        throw error;
    }
},

getProjects: async() =>{
    try{
        const response = await API.get('/projects');
        return response.data;
    }catch(error){
        console.error('Erro ao buscar projetos:', error);
        throw error;
    }
    
}

}