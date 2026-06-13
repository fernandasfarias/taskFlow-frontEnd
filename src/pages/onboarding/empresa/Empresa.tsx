import { useForm } from "react-hook-form"; 
import toast, { Toaster } from "react-hot-toast"; 
import { useNavigate } from "react-router-dom"; 

const IMG_LOGO_ROXA = "/Frame2.png"; 

// função para aplicar a máscara do CNPJ
const aplicarMascaraCnpj = (valor: string) => {
  let v = valor.replace(/\D/g, ""); // Remove tudo o que não for número
  
  // Aplica a máscara
  v = v.replace(/^(\d{2})(\d)/, "$1.$2");
  v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
  v = v.replace(/(\d{4})(\d)/, "$1-$2");
  
  return v.substring(0, 18); // Impede que o usuário digite mais do que 18 caracteres
};

export default function CadastroEmpresa() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const enviarFormulario = async (dados: any) => {
    const token = localStorage.getItem("token");
  
    if (!token || token === "null") {
        toast.error("Usuário não autenticado. Faça login novamente.");
        return;
    }

    try {
      // O CNPJ já vai chegar formatado aqui
      const dadosEnviar = { nome: dados.nomeEmpresa, cnpj: dados.cnpj };

      const response = await fetch("http://localhost:8080/onboarding/empresa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dadosEnviar)
      });

      if (!response.ok) throw new Error("Erro ao vincular empresa");

      toast.success("Empresa cadastrada com sucesso!");
      navigate('/dashboard');

    } catch (error) {
      toast.error("Erro ao cadastrar empresa. Verifique os dados.");
    }
  };

  const inputEstilo = "w-full placeholder-[#98928A] bg-transparent text-lg md:text-2xl py-8 px-10 rounded-2xl md:rounded-3xl border-[2px] border-solid border-[#30363D] focus:border-[#7C3AED] focus:outline-none transition-colors font-normal text-white";
   
  return (
    <div className="min-h-screen bg-[#0A0E17] flex items-end md:items-center justify-center md:p-6 font-sans overflow-hidden relative">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full max-w-[1280px] bg-[#161B22] border border-gray-800 relative overflow-hidden flex text-white z-20 rounded-t-[40px] md:rounded-[56px] lg:rounded-[64px] h-[88vh] md:h-[90vh] md:min-h-[600px] md:max-h-[800px]">
        <div className="flex-1 md:flex-[2] w-full flex flex-col justify-center items-center mx-auto px-6 md:px-10 lg:px-20 py-12 md:py-8 h-full overflow-y-auto custom-scrollbar">
          <div className="w-full max-w-[650px]">
            
            <img src={IMG_LOGO_ROXA} className="w-10 lg:w-12 mb-8 object-contain self-start" alt="Logo" />
            
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white">Dados da Empresa</h2>
            <p className="text-[#98928A] text-lg lg:text-xl mb-12 font-normal">Por favor, preencha as informações abaixo.</p>

            <form onSubmit={handleSubmit(enviarFormulario)} className="w-full flex flex-col gap-7 text-white">
              <div>
                <input 
                  placeholder="Nome da empresa" 
                  type="text" 
                  {...register("nomeEmpresa", { required: "O nome da empresa é obrigatório!" })} 
                  className={inputEstilo} 
                />
                {errors.nomeEmpresa && <span className="text-red-500 text-xs mt-1.5 ml-4 block font-normal">{String(errors.nomeEmpresa.message)}</span>}
              </div>
              
              <div>
                <input 
                  placeholder="CNPJ" 
                  type="text" 
                  className={inputEstilo}
                  maxLength={18}
                  {...register("cnpj", { 
                    required: "O CNPJ é obrigatório!", 
                    pattern: { 
                      value: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 
                      message: "Formato de CNPJ inválido" 
                    }
                  })}
                  onChange={(e) => {
                    // Aplica a máscara no valor digitado antes de passar pro react-hook-form
                    e.target.value = aplicarMascaraCnpj(e.target.value);
                    register("cnpj").onChange(e);
                  }}
                />
                {errors.cnpj && <span className="text-red-500 text-xs mt-1.5 ml-4 block font-normal">{String(errors.cnpj.message)}</span>}
              </div>
              
              <button type="submit" className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xl font-bold py-5 mt-6 rounded-2xl md:rounded-3xl transition duration-300 shadow-md">
                Finalizar Cadastro
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}