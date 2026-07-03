import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";
import { criarTarefa } from "../../services/tarefaService";

export default function CriarTarefa() {
  const navigate = useNavigate();

  const { idProjeto, idAtividade } = useParams();

  const [form, setForm] = useState({
    nomeTarefa: "",
    dataInicio: "",
    dataEntrega: "",
    statusTarefa: "PENDENTE",
  });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setErro("");

      await criarTarefa(idAtividade, form);

      navigate(`/projetos/${idProjeto}/kanban`);
    } catch (error) {
      console.error(error);
      setErro("Não foi possível criar a tarefa.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-[#101827] border-2 border-[#33415f] rounded-2xl p-10">

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 mb-8 text-slate-300 hover:text-white transition"
        >
          <HiArrowLeft size={22} />
          <span className="text-2xl font-semibold">Nova Tarefa</span>
        </button>

        {erro && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Nome da tarefa
            </label>

            <input
              type="text"
              name="nomeTarefa"
              value={form.nomeTarefa}
              onChange={handleChange}
              required
              placeholder="Digite o nome da tarefa"
              className="w-full h-12 rounded-xl bg-[#0f172a] border border-[#334155] px-4 outline-none focus:border-violet-500"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Data de início
              </label>

              <input
                type="date"
                name="dataInicio"
                value={form.dataInicio}
                onChange={handleChange}
                required
                className="w-full h-12 rounded-xl bg-[#0f172a] border border-[#334155] px-4 outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Data de entrega
              </label>

              <input
                type="date"
                name="dataEntrega"
                value={form.dataEntrega}
                onChange={handleChange}
                required
                className="w-full h-12 rounded-xl bg-[#0f172a] border border-[#334155] px-4 outline-none focus:border-violet-500"
              />
            </div>

          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Status
            </label>

            <select
              name="statusTarefa"
              value={form.statusTarefa}
              onChange={handleChange}
              className="w-full h-12 rounded-xl bg-[#0f172a] border border-[#334155] px-4 outline-none focus:border-violet-500"
            >
              <option value="PENDENTE">Pendente</option>
              <option value="EM_ANDAMENTO">Em andamento</option>
              <option value="CONCLUIDA">Concluída</option>
              <option value="CANCELADA">Cancelada</option>
            </select>
          </div>

          <div className="flex justify-end gap-4 pt-6">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3 rounded-xl border border-[#334155] hover:bg-[#1e293b]"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-60"
            >
              {loading ? "Salvando..." : "Proximo"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}