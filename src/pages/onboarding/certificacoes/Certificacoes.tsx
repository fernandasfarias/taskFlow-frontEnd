import { useForm } from "react-hook-form"; 
import toast, { Toaster } from "react-hot-toast"; 
import { useNavigate } from "react-router-dom"; 

const IMG_LOGO_ROXA = "/Frame2.png"; 

export default function CadastroCertificacoes() {
  const navigate = useNavigate();

  // O reset serve para limpar os inputs depois que o usuário adiciona uma certificação
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // 1. Função que apenas ADICIONA a certificação e mantém o usuário na página
  const adicionarCertificacao = async (dados: any) => {
    try {
      console.log("ENVIANDO CERTIFICAÇÃO:", dados);
      
      // AQUI ENTRA A SUA CHAMADA DA API 
  
      toast.success("Certificação adicionada com sucesso!");
      
      // Limpa os campos do formulário para o usuario digitar a proxima
      reset(); 

    } catch (error) {
      console.error("ERRO AO CADASTRAR CERTIFICAÇÃO:", error);
      toast.error("Erro ao adicionar certificação. Verifique os dados.");
    }
  };

  // 2. Função do botão FINALIZAR (apenas leva para o dashboard)
  const irParaDashboard = () => {
    navigate('/dashboard');
  };


  const inputEstilo = "w-full placeholder-[#98928A] bg-transparent text-base md:text-2xl py-8 unded-2xl md:rounded-3xl border-[2px] border-solid border-[#30363D] focus:border-[#7C3AED] focus:outline-none transition-colors font-normal text-white";

  return (
    <div className="min-h-screen bg-[#0A0E17] flex items-end md:items-center justify-center md:p-6 font-sans overflow-hidden relative">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full max-w-[1280px] bg-[#161B22] border border-gray-800 relative overflow-hidden flex text-white z-20 
        rounded-t-[40px] md:rounded-[56px] lg:rounded-[64px]
        h-[88vh] md:h-[90vh] md:min-h-[600px] md:max-h-[800px]"
      >
        {/* COLUNA DO FORMULÁRIO */}
        <div className="flex-1 md:flex-[2] flex flex-col justify-center items-center px-6 md:px-10 lg:px-20 py-12 md:py-8 h-full overflow-y-auto custom-scrollbar">
          
          <div className="w-full max-w-[650px]">
            <img src={IMG_LOGO_ROXA} className="w-10 lg:w-12 mb-8 object-contain" alt="Logo" />
            
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white">Certificações</h2>
            <p className="text-[#98928A] text-lg lg:text-xl mb-12 font-normal">Adicione as suas certificações.</p>

            {/* O formulário chama a função de ADICIONAR */}
            <form onSubmit={handleSubmit(adicionarCertificacao)} className="w-full flex flex-col gap-7 text-white">
              
              {/* NOME DA INSTITUICAO */}
              <div>
                <input
                  placeholder="  Nome da instituição "
                  type="text"
                  {...register("nomeInstituicao", { required: "O nome da instituição é obrigatório!" })}
                  className={inputEstilo}
                />
                {errors.nomeInstituicao && (
                  <span className="text-red-500 text-xs mt-1.5 ml-4 block font-normal">
                    {String(errors.nomeInstituicao.message)}
                  </span>
                )}
              </div>
              
              {/* ID DA CERTIFICAÇÃO */}
              <div>
                <input
                  placeholder="  ID da certificação "
                  type="text"
                  {...register("idCertificacao", { required: "O ID da certificação é obrigatório!" })}
                  className={inputEstilo}
                />
                {errors.idCertificacao && (
                  <span className="text-red-500 text-xs mt-1.5 ml-4 block font-normal">
                    {String(errors.idCertificacao.message)}
                  </span>
                )}
              </div>
              
              {/* BOTÕES */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                
                {/* Botão de Submit */}
                <button 
                  type="submit" 
                  className="flex-1 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-lg font-bold py-4 rounded-2xl md:rounded-3xl transition duration-300 shadow-md"
                >
                  Adicionar
                </button>

                {/* Botão comum */}
                <button 
                  type="button" 
                  onClick={irParaDashboard}
                  className="flex-1 bg-transparent hover:bg-gray-800 text-white border border-gray-700 text-lg font-bold py-4 rounded-2xl md:rounded-3xl transition duration-300"
                >
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