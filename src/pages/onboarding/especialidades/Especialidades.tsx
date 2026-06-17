import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const IMG_LOGO_ROXA = "/Frame2.png";

export default function Especialidades() {
  const navigate = useNavigate();

  const [mostrarDev, setMostrarDev] = useState(false);
  const [mostrarDados, setMostrarDados] = useState(false);
  const [mostrarDesign, setMostrarDesign] = useState(false);

  const [especialidadesSelecionadas, setEspecialidadesSelecionadas] =
    useState<string[]>([]);

  

  const desenvolvimento = [
    "Desenvolvimento Front-End",
    "Desenvolvimento Back-End",
    "Desenvolvimento Full Stack",
    "Desenvolvimento Mobile",
    "Desenvolvimento Desktop",
    "Desenvolvimento de APIs",
    "Arquitetura de Software",
    "DevOps",
    "Cloud Computing",
    "Banco de Dados",
    "Qualidade de Software (QA/Testes)",
    "Segurança da Informação",
  ];

  const dadosIA = [
    "Ciência de Dados",
    "Engenharia de Dados",
    "Business Intelligence (BI)",
    "Machine Learning",
    "Inteligência Artificial",
    "Análise de Dados",
  ];

  const design = [
    "UX Design",
    "UI Design",
    "UX Research",
    "Design de Produto",
    "Design Gráfico",
    "Motion Design",
  ];

  const alternarEspecialidade = (especialidade: string) => {
    if (especialidadesSelecionadas.includes(especialidade)) {
      setEspecialidadesSelecionadas(
        especialidadesSelecionadas.filter(
          (item) => item !== especialidade
        )
      );
    } else {
      setEspecialidadesSelecionadas([
        ...especialidadesSelecionadas,
        especialidade,
      ]);
    }
  };

  const finalizarCadastro = () => {
    const possuiEspecialidade =
      especialidadesSelecionadas.length > 0;
     

    if (!possuiEspecialidade) {
      toast.error("Selecione ou informe uma especialidade");
      return;
    }

    console.log({
      especialidadesSelecionadas,
    
    });

    toast.success("Especialidades cadastradas!");
    navigate("/dashboard");
  };

  const renderizarLista = (lista: string[]) => (
    <div className="mt-4 mb-6 flex flex-col gap-3">
      {lista.map((item) => (
        <label
          key={item}
          className="flex items-center gap-3 text-white cursor-pointer"
        >
          <input
            type="checkbox"
            checked={especialidadesSelecionadas.includes(item)}
            onChange={() => alternarEspecialidade(item)}
            className="w-5 h-5  appearance-none
    rounded-full
    border-2
    border-[#7C3AED]
    checked:bg-[#7C3AED]
    cursor-pointer"
          />
          <span>{item}</span>
        </label>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0E17] flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-[#161B22] border border-[#30363D] rounded-[40px] p-8 md:p-12 text-white">

        <img
          src={IMG_LOGO_ROXA}
          alt="Logo"
          className="w-12 mb-8"
        />

        <h1 className="text-4xl font-bold mb-3">
          Especialidades
        </h1>

        <p className="text-[#98928A] text-lg mb-8">
          Selecione uma ou mais especialidades.
        </p>

        
        <button
          type="button"
          onClick={() => setMostrarDev(!mostrarDev)}
          className={`w-full text-left px-6 py-4 rounded-3xl border-2 transition mb-3 ${
            mostrarDev
              ? "border-[#7C3AED] text-[#7C3AED]"
              : "border-[#30363D] text-white"
          }`}
        >
          Desenvolvimento {mostrarDev ? "▾" : "▸"}
        </button>

        {mostrarDev && renderizarLista(desenvolvimento)}

        
        <button
          type="button"
          onClick={() => setMostrarDados(!mostrarDados)}
          className={`w-full text-left px-6 py-4 rounded-3xl border-2 transition mb-3 ${
            mostrarDados
              ? "border-[#7C3AED] text-[#7C3AED]"
              : "border-[#30363D] text-white"
          }`}
        >
          Dados e IA {mostrarDados ? "▾" : "▸"}
        </button>

        {mostrarDados && renderizarLista(dadosIA)}

        
        <button
          type="button"
          onClick={() => setMostrarDesign(!mostrarDesign)}
          className={`w-full text-left px-6 py-4 rounded-3xl border-2 transition mb-6 ${
            mostrarDesign
              ? "border-[#7C3AED] text-[#7C3AED]"
              : "border-[#30363D] text-white"
          }`}
        >
          Design {mostrarDesign ? "▾" : "▸"}
        </button>

        {mostrarDesign && renderizarLista(design)}

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