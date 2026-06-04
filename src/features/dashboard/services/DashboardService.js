import axios from "axios"; 

const API = axios.create({
    baseURL:'https://localhost8080/api/dashboard',
    headers:{
        'Content-Type':'application/json'
    }
});


export const DashboardService = {
    // buscar os dados do dashboard 
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
    
},

getUserProfile: async () => {
  try {
    const response = await API.get('/user');
    return response.data; // objeto: { name: 'Alice Silva', role: 'Project Manager', avatarUrl: '...' }
  } catch (error) {
    console.error("Erro ao buscar perfil do usuário:", error);
    throw error;
  }
}

}