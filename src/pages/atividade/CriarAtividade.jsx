import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";
import { criarAtividade } from "../../services/atividadeService";

export default function CriarAtividade() {
  const navigate = useNavigate();
  const { idProjeto } = useParams();

  const [form, setForm] = useState({
    nomeAtividade: "",
    descricaoAtividade: "",
    dataInicio: "",
    dataEntrega: "",
    statusAtividade: "PENDENTE",
    idMilestone: "",
  });

  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setErro("");

      await criarAtividade({
        nomeAtividade: form.nomeAtividade,
        descricaoAtividade: form.descricaoAtividade,
        dataInicio: form.dataInicio,
        dataEntrega: form.dataEntrega,
        statusAtividade: form.statusAtividade,
        idProjeto: idProjeto,
      });

      navigate(`/projetos/${idProjeto}`);
    } catch (error) {
      console.error(error);
      setErro("Não foi possível criar a atividade.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-[#101827] border-[6px] border-[#33415f] rounded-2xl p-14">
        <div className="max-w-xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 mb-6 text-slate-300 hover:text-white"
          >
            <HiArrowLeft size={22} />
            <span className="text-xl font-semibold">Nova Atividade</span>
          </button>

          {erro && (
            <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="nomeAtividade"
              value={form.nomeAtividade}
              onChange={handleChange}
              placeholder="Digite o nome da atividade"
              required
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#8b5cf6]"
            />

            <textarea
              name="descricaoAtividade"
              value={form.descricaoAtividade}
              onChange={handleChange}
              placeholder="Descrição da atividade"
              required
              rows={3}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-3 text-sm outline-none resize-none focus:border-[#8b5cf6]"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                name="dataInicio"
                value={form.dataInicio}
                onChange={handleChange}
                required
                className="bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#8b5cf6]"
              />

              <input
                type="date"
                name="dataEntrega"
                value={form.dataEntrega}
                onChange={handleChange}
                required
                className="bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#8b5cf6]"
              />
            </div>

            <select
              name="statusAtividade"
              value={form.statusAtividade}
              onChange={handleChange}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#8b5cf6]"
            >
              <option value="PENDENTE">Pendente</option>
              <option value="EM_ANDAMENTO">Em andamento</option>
              <option value="CONCLUIDA">Concluída</option>
              <option value="CANCELADA">Cancelada</option>
            </select>

            <div className="flex gap-3 pt-8">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-40 border border-[#334155] rounded-lg py-3 text-slate-300 hover:bg-[#1e293b]"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-44 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-lg py-3 font-semibold disabled:opacity-60"
              >
                {loading ? "Salvando..." : "Criar Atividade"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}