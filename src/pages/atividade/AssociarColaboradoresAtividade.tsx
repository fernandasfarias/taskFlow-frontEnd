import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiSearch, HiPlus, HiCheck } from "react-icons/hi";
import {
  listarColaboradores,
  associarColaboradorAtividade,
} from "../../services/atividadeService";

const SEARCH_CLASS =
  "w-full bg-[#0a0e1a] border border-[#1e2a4a] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#3d4a63] focus:outline-none focus:border-[#6366f1]/60 transition-colors";

function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="relative mb-3">
      <HiSearch
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3d4a63]"
        size={15}
      />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={SEARCH_CLASS}
      />
    </div>
  );
}

function InitialAvatar({ nome }) {
  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center text-white font-bold text-sm shrink-0">
      {nome?.charAt(0)?.toUpperCase()}
    </div>
  );
}

function AddButton({ isAdded, isLoading, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || isAdded}
      className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 shrink-0 disabled:opacity-70
        ${
          isAdded
            ? "border-emerald-400 text-emerald-400 bg-emerald-400/10"
            : "border-[#22d3ee] text-[#22d3ee] hover:bg-[#22d3ee]/10"
        }`}
    >
      {isLoading ? (
        <span className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
      ) : isAdded ? (
        <HiCheck size={15} />
      ) : (
        <HiPlus size={15} />
      )}
    </button>
  );
}

function ColaboradorItem({ colaborador, isAdded, isLoading, onAdd }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0d1320] hover:bg-[#101628] transition-colors">
      <InitialAvatar nome={colaborador.nome} />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">
          {colaborador.nome}
        </p>

        <p className="text-xs text-[#64748b] truncate">
          {colaborador.especialidades?.[0]?.nomeEspecialidade ||
            colaborador.email ||
            "Sem e-mail"}
        </p>
      </div>

      <AddButton isAdded={isAdded} isLoading={isLoading} onClick={onAdd} />
    </div>
  );
}

export default function AssociarColaboradoresAtividade() {
  const { idAtividade } = useParams();
  const navigate = useNavigate();

  const [colaboradores, setColaboradores] = useState([]);
  const [busca, setBusca] = useState("");
  const [colaboradoresAdicionados, setColaboradoresAdicionados] = useState(
    new Set()
  );
  const [loadingColab, setLoadingColab] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarColaboradores() {
      try {
        setLoading(true);
        setErro("");

        const data = await listarColaboradores();

        console.log("COLABORADORES:", data);

        setColaboradores(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setErro("Erro ao carregar colaboradores.");
      } finally {
        setLoading(false);
      }
    }

    carregarColaboradores();
  }, []);

  async function handleAdicionarColaborador(idColaborador) {
    if (!idAtividade || !idColaborador) {
      setErro("ID da atividade ou do colaborador não encontrado.");
      return;
    }

    if (loadingColab.has(idColaborador)) return;

    setLoadingColab((prev) => new Set([...prev, idColaborador]));
    setErro("");

    try {
      await associarColaboradorAtividade(idAtividade, idColaborador);

      setColaboradoresAdicionados(
        (prev) => new Set([...prev, idColaborador])
      );
    } catch (e) {
      console.error(e);
      setErro("Erro ao associar colaborador à atividade.");
    } finally {
      setLoadingColab((prev) => {
        const novoSet = new Set(prev);
        novoSet.delete(idColaborador);
        return novoSet;
      });
    }
  }

  const filtradosColabs = colaboradores.filter((c) => {
    const termo = busca.toLowerCase();

    return (
      c.nome?.toLowerCase().includes(termo) ||
      c.email?.toLowerCase().includes(termo) ||
      c.especialidades?.[0]?.nomeEspecialidade?.toLowerCase().includes(termo)
    );
  });

  return (
    <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-6">
      <div className="w-full max-w-3xl border border-[#1e2a4a] rounded-2xl p-10">
        <div className="mb-7">
          <h2 className="text-xl font-bold text-white">
            Associar Colaboradores
          </h2>
          <p className="text-sm text-[#64748b] mt-1">
            Busque e adicione colaboradores para esta atividade
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <span className="w-8 h-8 border-2 border-[#6366f1]/30 border-t-[#6366f1] rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <SearchInput
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar Colaborador..."
            />

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {filtradosColabs.map((c) => (
                <ColaboradorItem
                  key={c.idColaborador}
                  colaborador={c}
                  isAdded={colaboradoresAdicionados.has(c.idColaborador)}
                  isLoading={loadingColab.has(c.idColaborador)}
                  onAdd={() => handleAdicionarColaborador(c.idColaborador)}
                />
              ))}

              {filtradosColabs.length === 0 && (
                <p className="text-xs text-[#475569] text-center py-6">
                  Nenhum colaborador encontrado.
                </p>
              )}
            </div>
          </>
        )}

        {erro && (
          <p className="text-xs text-red-400 mt-4 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {erro}
          </p>
        )}

        <div className="flex gap-4 mt-8">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-3 rounded-xl border border-[#1e2a4a] text-[#94a3b8] text-sm font-medium hover:bg-[#1e293b] hover:text-white transition-colors"
          >
            Voltar
          </button>

          <button
            onClick={() => navigate("/projetos")}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#6366f1] to-[#7c3aed] hover:opacity-90 transition-opacity"
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}