import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const IMG_LOGO_ROXA = "/Frame2.png";

export default function Especialidades() {
  const navigate = useNavigate();

  const [especialidades, setEspecialidades] = useState("");

  const finalizarCadastro = () => {
    if (!especialidades.trim()) {
      toast.error("Descreva suas especialidades");
      return;
    }

   

    toast.success("Cadastro concluído!");

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0A0E17] flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-[#161B22] border border-[#30363D] rounded-[40px] p-8 md:p-12 text-white">

        <img
          src={IMG_LOGO_ROXA}
          alt="Logo"
          className="w-12 mb-8"
        />

        <h1 className="text-4xl font-bold mb-3">
          Especialidades
        </h1>

        <p className="text-[#98928A] text-lg mb-8">
          Conte um pouco sobre sua área de atuação e suas especialidades.
        </p>

        <div className="mb-8">
          <textarea
            value={especialidades}
            onChange={(e) => setEspecialidades(e.target.value)}
            placeholder="Ex: Desenvolvimento Front-End, React, UX/UI Design e Mobile."
            rows={6}
            className="
              w-full
              bg-transparent
              text-white
              placeholder-[#98928A]
              border-[2px]
              border-[#30363D]
              focus:border-[#7C3AED]
              focus:outline-none
              rounded-3xl
              px-6
              py-4
              resize-none
            "
          />
        </div>

        <button
          onClick={finalizarCadastro}
          className="
            w-full
            bg-[#7C3AED]
            hover:bg-[#6D28D9]
            text-white
            text-xl
            font-bold
            py-4
            rounded-3xl
            transition
          "
        >
          Concluir Cadastro
        </button>

      </div>
    </div>
  );
}