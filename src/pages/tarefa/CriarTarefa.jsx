import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiArrowLeft, HiPlus } from "react-icons/hi";
import api from "../../services/api";

const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export default function CriarTarefa() {
  const navigate = useNavigate();
  const { idProjeto } = useParams();

  const [form, setForm] = useState({
    nomeTarefa: "",
    dataInicio: "",
    dataEntrega: "",
    mesesExecucao: ["Mai", "Jun", "Jul"],
    contaTarefa: "",
    statusTarefa: "NAO_INICIADO",
    membro: "",
    tagFuncao: "",
  });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function toggleMes(mes) {
    setForm((prev) => ({
      ...prev,
      mesesExecucao: prev.mesesExecucao.includes(mes)
        ? prev.mesesExecucao.filter((m) => m !== mes)
        : [...prev.mesesExecucao, mes],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setErro("");

      await api.post("/tarefas", {
        nomeTarefa: form.nomeTarefa,
        dataInicio: form.dataInicio,
        dataEntrega: form.dataEntrega,
        mesesExecucao: form.mesesExecucao,
        contaTarefa: form.contaTarefa,
        statusTarefa: form.statusTarefa,
        membro: form.membro,
        tagFuncao: form.tagFuncao,
        idProjeto,
      });

      navigate(-1);
    } catch (error) {
      console.error(error);
      setErro("Não foi possível criar a tarefa.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-5xl min-h-[620px] bg-[#101827] border-[6px] border-[#33415f] rounded-2xl flex items-center justify-center">
        <div className="w-full max-w-xl">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 mb-6 text-slate-300 hover:text-white transition"
          >
            <HiArrowLeft size={22} />
            <span className="text-xl font-semibold">Nova Tarefa</span>
          </button>

          {erro && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="nomeTarefa"
              value={form.nomeTarefa}
              onChange={handleChange}
              placeholder="Digite o nome da tarefa"
              required
              className="w-full h-11 rounded-lg bg-[#0f172a] border border-[#334155] px-4 text-sm outline-none focus:border-[#8b5cf6]"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                name="dataInicio"
                value={form.dataInicio}
                onChange={handleChange}
                required
                className="h-11 rounded-lg bg-[#0f172a] border border-[#334155] px-4 text-sm outline-none focus:border-[#8b5cf6]"
              />

              <input
                type="date"
                name="dataEntrega"
                value={form.dataEntrega}
                onChange={handleChange}
                required
                className="h-11 rounded-lg bg-[#0f172a] border border-[#334155] px-4 text-sm outline-none focus:border-[#8b5cf6]"
              />
            </div>

            <div>
              <p className="text-xs text-slate-400 mb-2">Meses de execução</p>
              <div className="flex flex-wrap gap-2">
                {meses.map((mes) => {
                  const ativo = form.mesesExecucao.includes(mes);

                  return (
                    <button
                      key={mes}
                      type="button"
                      onClick={() => toggleMes(mes)}
                      className={`h-8 px-3 rounded-md border text-xs transition ${
                        ativo
                          ? "bg-[#8b5cf6] border-[#8b5cf6] text-white"
                          : "bg-[#0f172a] border-[#334155] text-slate-300 hover:border-[#8b5cf6]"
                      }`}
                    >
                      {mes}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                name="contaTarefa"
                value={form.contaTarefa}
                onChange={handleChange}
                placeholder="Conta da tarefa"
                className="h-11 rounded-lg bg-[#0f172a] border border-[#334155] px-4 text-sm outline-none focus:border-[#8b5cf6]"
              />

              <select
                name="statusTarefa"
                value={form.statusTarefa}
                onChange={handleChange}
                className="h-11 rounded-lg bg-[#0f172a] border border-[#334155] px-4 text-sm outline-none focus:border-[#8b5cf6]"
              >
                <option value="NAO_INICIADO">Não iniciado</option>
                <option value="EM_ANDAMENTO">Em andamento</option>
                <option value="CONCLUIDA">Concluída</option>
                <option value="CANCELADA">Cancelada</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                name="membro"
                value={form.membro}
                onChange={handleChange}
                placeholder="Buscar membro..."
                className="h-11 rounded-lg bg-[#0f172a] border border-[#334155] px-4 text-sm outline-none focus:border-[#8b5cf6]"
              />

              <div className="flex h-11 rounded-lg bg-[#0f172a] border border-[#334155] overflow-hidden focus-within:border-[#8b5cf6]">
                <input
                  name="tagFuncao"
                  value={form.tagFuncao}
                  onChange={handleChange}
                  placeholder="Tags / Função"
                  className="flex-1 bg-transparent px-4 text-sm outline-none"
                />

                <button
                  type="button"
                  className="w-12 flex items-center justify-center bg-[#33415f] hover:bg-[#475569]"
                >
                  <HiPlus size={18} />
                </button>
              </div>
            </div>

            <div className="flex gap-4 pt-10">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-40 h-12 rounded-lg border border-[#334155] text-slate-300 hover:bg-[#1e293b]"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-40 h-12 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#a855f7] font-semibold disabled:opacity-60"
              >
                {loading ? "Salvando..." : "Próximo"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}