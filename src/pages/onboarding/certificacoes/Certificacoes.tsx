import { useForm } from "react-hook-form"; 
import toast, { Toaster } from "react-hot-toast"; 
import { useNavigate } from "react-router-dom"; 
// Importando o ícone de seta do react-icons
import { FiArrowLeft } from "react-icons/fi";

const IMG_LOGO_ROXA = "/Frame2.png"; 

import { useLocation } from "react-router-dom";

export default function CadastroCertificacoes() {
  const navigate = useNavigate();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const location = useLocation();
  const origem = location.state?.origem;

  const adicionarCertificacao = async (dados: any) => {
    const token = localStorage.getItem("token");
  
    if (!token || token === "null") {
        toast.error("Usuário não autenticado. Faça login novamente.");
        return;
    }

    try {
      const payload = [{
        certificacao: dados.nomeCertificacao,
        instituicao: dados.nomeInstituicao,
        codCertificacao: dados.codigoCertificacao || null, 
        urlComprovante: dados.urlComprovante
      }];

      const response = await fetch("http://localhost:8080/onboarding/certificacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Erro ao cadastrar certificação");

      toast.success("Certificação adicionada com sucesso!");
      reset(); 

    } catch (error) {
      console.error("ERRO:", error);
      toast.error("Erro ao adicionar certificação. Verifique os dados.");
    }
  };

  const irParaDashboard = () => {
    navigate('/dashboard');
  };

  const voltarParaCadastro = () => {
    navigate(-1); 
  };

  const inputEstilo = "w-full placeholder-[#98928A] bg-transparent text-base md:text-xl py-6 px-8 rounded-2xl border-[2px] border-solid border-[#30363D] focus:border-[#7C3AED] focus:outline-none transition-colors font-normal text-white";

  const irParaProximaTela = () => {
    if(origem === "profile"){
      navigate("/profile");
    }else{
      navigate("/dashboard");
    }
  };

  const voltarTelaAnterior = () => {
    if(origem === "profile"){
      navigate("/profile");
    }else{
      navigate("/")
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0E17] flex items-end md:items-center justify-center md:p-6 font-sans overflow-hidden relative">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full max-w-[1280px] bg-[#161B22] border border-gray-800 relative overflow-hidden flex text-white z-20 
        rounded-t-[40px] md:rounded-[56px] lg:rounded-[64px]
        h-[88vh] md:h-[90vh] md:min-h-[600px] md:max-h-[800px]"
      >
        
        {/* BOTÃO DE VOLTAR */}
        <button 
          onClick={voltarTelaAnterior}
          className="absolute top-6 left-6 md:top-10 md:left-10 p-3 text-[#98928A] hover:text-white hover:bg-gray-800 rounded-full transition-all duration-300 z-50 flex items-center justify-center"
          title="Voltar"
        >
          <FiArrowLeft size={28} />
        </button>

        <div className="flex-1 md:flex-[2] flex flex-col justify-center items-center px-6 md:px-10 lg:px-20 py-12 md:py-8 h-full overflow-y-auto custom-scrollbar">
          
          <div className="w-full max-w-[650px]">
            <img src={IMG_LOGO_ROXA} className="w-10 lg:w-12 mb-8 object-contain" alt="Logo" />
            
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white">Certificações</h2>
            <p className="text-[#98928A] text-lg lg:text-xl mb-8 font-normal">Adicione as suas certificações.</p>

            <form onSubmit={handleSubmit(adicionarCertificacao)} className="w-full flex flex-col gap-5 text-white">
              
              <div>
                <input
                  placeholder="Nome da Certificação (Ex: AWS Cloud Practitioner)"
                  type="text"
                  {...register("nomeCertificacao", { required: "O nome da certificação é obrigatório!" })}
                  className={inputEstilo}
                />
                {errors.nomeCertificacao && <span className="text-red-500 text-xs mt-1.5 ml-4 block font-normal">{String(errors.nomeCertificacao.message)}</span>}
              </div>

              <div>
                <input
                  placeholder="Nome da instituição"
                  type="text"
                  {...register("nomeInstituicao", { required: "O nome da instituição é obrigatório!" })}
                  className={inputEstilo}
                />
                {errors.nomeInstituicao && <span className="text-red-500 text-xs mt-1.5 ml-4 block font-normal">{String(errors.nomeInstituicao.message)}</span>}
              </div>
              
              <div>
                <input
                  placeholder="Código da certificação (Opcional)"
                  type="text"
                  {...register("codigoCertificacao")}
                  className={inputEstilo}
                />
              </div>

              <div>
                <input
                  placeholder="URL do Comprovante (Link)"
                  type="text"
                  {...register("urlComprovante", { required: "A URL do comprovante é obrigatória!" })}
                  className={inputEstilo}
                />
                {errors.urlComprovante && <span className="text-red-500 text-xs mt-1.5 ml-4 block font-normal">{String(errors.urlComprovante.message)}</span>}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <button type="submit" className="flex-1 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-lg font-bold py-4 rounded-2xl md:rounded-3xl transition duration-300 shadow-md">
                  Adicionar
                </button>

                <button type="button" onClick={irParaProximaTela} className="flex-1 bg-transparent hover:bg-gray-800 text-white border border-gray-700 text-lg font-bold py-4 rounded-2xl md:rounded-3xl transition duration-300">
                  Finalizar
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}