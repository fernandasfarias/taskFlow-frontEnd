import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { Link } from 'react-router-dom';

import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { cadastroService } from "../../services/cadastroService";

const IMG_FUNDO = "/gradiente.png";
const IMG_LOGO_COMPLETA = "/Frame1.svg"; 
const IMG_LOGO_ROXA = "/Frame2.png"; 
const IMG_LOGO_BRANCA = "/Frame3.svg";

export default function Autenticacao() {
  const [ehCadastro, setEhCadastro] = useState(false);
  const [introMobile, setIntroMobile] = useState(true);

  const molaSuave = { type: "spring" as const, stiffness: 200, damping: 30 };

  return (
    <div className="min-h-screen bg-[#0A0E17] flex items-end md:items-center justify-center md:p-6 font-sans overflow-hidden relative">
      
      {/* INJETOR DAS NOTIFICAÇÕES (TOAST) */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* FUNDO (Apenas Mobile) */}
      <div 
        className="absolute inset-0 bg-cover bg-center md:hidden"
        style={{ backgroundImage: `url('${IMG_FUNDO}')` }}
      />

      {/* TELA 1: INTRO MOBILE */}
      <div className={`absolute inset-0 flex flex-col justify-between p-8 pt-20 pb-12 z-0 md:hidden transition-opacity duration-300 ${introMobile ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <img src={IMG_LOGO_BRANCA} className="w-12" alt="Logo" />
        
        <div className="text-white">
          <p className="text-[40px] font-normal mb-6">Eai!</p>
          <h1 className="text-3xl font-normal leading-snug mb-10">
            Bem-vindo ao <strong className="font-bold">TaskFlow</strong> seu espaço de gestão.
          </h1>
          <button 
            onClick={() => { setEhCadastro(false); setIntroMobile(false); }}
            className="w-full bg-[#161B22] hover:bg-[#1f2630] text-white text-xl font-bold py-4 rounded-2xl transition duration-300 shadow-md"
          >
            Já faço parte
          </button>
          <div className="w-full text-center mt-6">
            <span className="text-base font-normal">
              Não tem uma conta?{" "}
              <button onClick={() => { setEhCadastro(true); setIntroMobile(false); }} className="font-bold hover:underline">
                Cadastre-se.
              </button>
            </span>
          </div>
        </div>
      </div>

      {/* CONTAINER PAI DOS FORMULÁRIOS */}
      <div className={`w-full max-w-[1280px] bg-[#161B22] border border-gray-800 relative overflow-hidden flex text-white z-20 
        transition-transform duration-500 ease-in-out
        rounded-t-[40px] md:rounded-[56px] lg:rounded-[64px]
        h-[88vh] md:h-[90vh] md:min-h-[650px] md:max-h-[850px]
        ${introMobile ? 'translate-y-[150%] md:translate-y-0' : 'translate-y-0'}`
      }>
        
        {/* PAINEL MÓVEL (Apenas DESKTOP) */}
        <motion.div 
          className="hidden md:flex absolute inset-y-4 md:inset-y-5 left-4 md:left-5 w-[calc(50%-16px)] md:w-[calc(50%-20px)] bg-cover bg-center rounded-[44px] lg:rounded-[52px] z-10 flex-col p-8 lg:p-12 overflow-hidden"
          style={{ backgroundImage: `url('${IMG_FUNDO}')` }}
          animate={{ x: ehCadastro ? "100%" : "0%" }}
          transition={molaSuave}
        >
          <AnimatePresence mode="wait">
            {ehCadastro ? (
              <motion.div key="textoCadastro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="text-white flex flex-col justify-center h-full">
                <h1 className="text-4xl lg:text-5xl font-normal leading-tight max-w-[450px]">
                  Gerencie <strong className="font-bold">projetos</strong>.<br/>Alcance <strong className="font-bold">Resultados</strong>.
                </h1>
              </motion.div>
            ) : (
              <motion.div key="textoLogin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="text-white flex flex-col items-center justify-center h-full w-full">
                <img src={IMG_LOGO_COMPLETA} className="w-[300px] lg:w-[400px] mb-4" alt="TaskFlow" />
              </motion.div>
            )}
          </AnimatePresence>
          <motion.img src={IMG_LOGO_BRANCA} className="absolute bottom-8 left-8 lg:bottom-12 lg:left-12 w-16 lg:w-20 h-auto object-contain z-10" alt="Ícone" animate={{ x: ehCadastro ? "-10%" : "0%" }} transition={molaSuave} />
        </motion.div>

        {/* CAMADA DOS FORMULÁRIOS */}
        <div className="flex-1 flex w-full h-full">
          
          <div className={`flex-1 flex-col justify-start md:justify-center px-6 md:px-10 lg:px-20 py-10 md:py-8 h-full overflow-y-auto custom-scrollbar ${!ehCadastro ? 'hidden md:flex' : 'flex'}`}>
            <FormularioCadastro aoClicarLogin={() => setEhCadastro(false)} />
          </div>

          <div className={`flex-1 flex-col justify-start md:justify-center px-6 md:px-10 lg:px-20 py-10 md:py-8 h-full overflow-y-auto custom-scrollbar ${ehCadastro ? 'hidden md:flex' : 'flex'}`}>
            <FormularioLogin aoClicarCadastrar={() => setEhCadastro(true)} />
          </div>

        </div>

      </div>
    </div>
  );
}

//SUB-COMPONENTES

interface FormProps { aoClicarCadastrar?: () => void; aoClicarLogin?: () => void; }

function FormularioLogin({ aoClicarCadastrar }: FormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const navigate = useNavigate();

  const enviarFormulario = async (dados:any) => {
    try {
      const response = await login(dados.email, dados.senha);

      console.log("RESPONSE COMPLETO:", response);
      console.log("RESPONSE DATA:", response.data);

      localStorage.setItem('token', response.token);
      toast.success("Login realizado com sucesso!");

      navigate('/dashboard');
    } catch (error) {

      console.log("ERRO COMPLETO:", error);
      console.log("RESPONSE COMPLETO:", error);

      toast.error("Email ou senha inválidos");}
  };

  return (
    <>
      <img src={IMG_LOGO_ROXA} className="w-10 lg:w-12 mb-6 object-contain" alt="Logo" />
      <h2 className="text-4xl lg:text-5xl font-bold mb-2 md:mb-3 text-white">Bem vindo de volta!</h2>
      <p className="text-[#98928A] text-base md:text-lg lg:text-xl mb-8 md:mb-10 font-normal">Faça login para continuar.</p>

      <form onSubmit={handleSubmit(enviarFormulario)} className="w-full flex flex-col gap-4 text-white">
        <Input placeholder="Seu email" type="email" name="email" register={register} errors={errors} />
        <Input placeholder="Sua senha" type="password" name="senha" register={register} errors={errors} />
        
        <div className="flex justify-end w-full">
          <Link
            to="/recuperar-senha" className="text-sm text-[#98928A] hover:text-[#A78BFA] transition-colors mt-1"
          >
            Esqueci minha senha
          </Link>
        </div>

        <button 
          type="submit" 
          className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xl font-bold py-4 mt-2 rounded-2xl md:rounded-3xl transition duration-300 shadow-md"
        >
          Entrar
        </button>

        <div className="w-full text-center mt-4">
          <span className="text-sm md:text-base font-normal text-[#98928A]">
            Não tem uma conta?{" "}
            <button type="button" onClick={aoClicarCadastrar} className="text-white hover:underline font-bold hover:text-[#A78BFA] transition-colors mt-1">
              Cadastre-se.
            </button>
          </span>
        </div>
      </form>
    </>
  );
}

function FormularioCadastro({ aoClicarLogin }: FormProps) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const senhaDigitada = watch("senha");
  const navigate = useNavigate();

  const enviarFormulario = async (dados: any) => {
    try {
      const response = await cadastroService(dados);

      toast.success("Cadastrado com sucesso!");

      const tipo = response.tipo;

      switch(tipo){
        case "PROJECT_MANAGER":
          navigate("/onboarding/certificacoes?id=" + response.id);
          break;

        case "CLIENTE":
          navigate("/onboarding/empresa?id=" + response.id);
          break

        case "COLABORADOR":
          navigate("/onboarding/especialidades?id=" + response.id);
          break;

          default:
            navigate("/login");
      }
    } catch (error) {
      toast.error("Erro ao cadastrar");
    }
  };

  return (
    <>
      <img src={IMG_LOGO_ROXA} className="w-10 lg:w-12 mb-6 object-contain" alt="Logo" />
      <h2 className="text-4xl lg:text-5xl font-bold mb-6 md:mb-10 text-white">Cadastre-se</h2>
      
      <form onSubmit={handleSubmit(enviarFormulario)} className="w-full flex flex-col gap-4 text-white">
        <Input placeholder="Seu nome completo" type="text" name="nome" register={register} errors={errors} />
        <Input placeholder="Seu email" type="email" name="email" register={register} errors={errors} />
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input placeholder="Sua senha" type="password" name="senha" register={register} errors={errors} />
          </div>
          <div className="flex-1">
            <Input 
              placeholder="Confirma sua senha" 
              type="password" 
              name="confirmarSenha" 
              register={register} 
              errors={errors} 
              regras={{
                required: "Obrigatório!",
                validate: (valor: string) => valor === senhaDigitada || "As senhas não batem!"
              }}
            />
          </div>
        </div>

        <div>
          <div className="relative">
            <select 
              {...register("tipo", { required: "Selecione um tipo!" })}
              defaultValue=""
              className="w-full placeholder-[#98928A] bg-transparent text-base md:text-lg py-4 md:py-4 px-6 rounded-2xl md:rounded-3xl border-[2px] border-solid border-[#30363D] focus:border-[#7C3AED] focus:outline-none transition-colors font-normal text-[#98928A] appearance-none cursor-pointer"
            >
              <option value="" disabled hidden>Selecione o tipo da sua conta</option>
              <option value="CLIENTE" className="bg-[#161B22] text-white">Cliente</option>
              <option value="COLABORADOR" className="bg-[#161B22] text-white">Colaborador</option>
              <option value="PROJECT_MANAGER" className="bg-[#161B22] text-white">Project Manager</option>
            </select>
            {/* Setinha SVG embutida */}
            <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9L12 15L18 9" stroke="#98928A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          {errors.tipoConta && (
            <span className="text-red-500 text-xs mt-1 ml-4 block font-normal">{String(errors.tipoConta.message)}</span>
          )}
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xl font-bold py-4 mt-2 rounded-2xl md:rounded-3xl transition duration-300 shadow-md"
        >
          Cria a sua conta
        </button>

        <div className="w-full text-center mt-4">
          <span className="text-sm md:text-base font-normal text-[#98928A]">
            Já tem uma conta?{" "}
            <button type="button" onClick={aoClicarLogin} className="text-white hover:underline font-bold hover:text-[#A78BFA] transition-colors mt-1">
              Entre nela.
            </button>
          </span>
        </div>
      </form>
    </>
  );
}

function Input({ placeholder, type, name, register, errors, regras }: any) {
  return (
    <div>
      <input
        placeholder={placeholder}
        type={type}
        {...register(name, regras || { required: `Obrigatório!` })}
        className="w-full placeholder-[#98928A] bg-transparent text-base md:text-lg py-4 md:py-4 px-6 rounded-2xl md:rounded-3xl border-[2px] border-solid border-[#30363D] focus:border-[#7C3AED] focus:outline-none transition-colors font-normal text-white"
      />
      {errors[name] && (
        <span className="text-red-500 text-xs mt-1 ml-4 block font-normal">
          {String(errors[name].message)}
        </span>
      )}
    </div>
  );
}