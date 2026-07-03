import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiOutlineDotsVertical } from "react-icons/hi";
import {
  listarKanban,
  alterarStatusAtividade,
  excluir,
  buscarDetalhesAtividade,
} from "../../services/atividadeService";
import { excluirTarefa } from "../../services/tarefaService";

const colunasBase = [
  {
    id: "PENDENTE",
    titulo: "Pendentes",
    corHeader: "bg-[#2D333B]",
    corBody: "bg-[#161B22]",
    corCard: "bg-[#22272E]",
    corTexto: "text-white",
    corTag: "bg-[#30363D]",
    borda: "border-[#30363D]",
    editavel: false,
    tarefas: [],
  },
  {
    id: "EM_ANDAMENTO",
    titulo: "Em andamento",
    corHeader: "bg-[#3E5C9A]",
    corBody: "bg-[#1E2D4E]",
    corCard: "bg-[#35518D]",
    corTexto: "text-white",
    corTag: "bg-[#1E2D4E]",
    borda: "border-[#3E5C9A]",
    editavel: false,
    tarefas: [],
  },
  {
    id: "CONCLUIDA",
    titulo: "Concluídas",
    corHeader: "bg-[#286455]",
    corBody: "bg-[#12332A]",
    corCard: "bg-[#286455]",
    corTexto: "text-white",
    corTag: "bg-[#12332A]",
    borda: "border-[#286455]",
    editavel: false,
    tarefas: [],
  },
];

export default function Kanban() {
  const navigate = useNavigate();
  const { idProjeto } = useParams();

  const [colunas, setColunas] = useState<any[]>(colunasBase);
  const [loading, setLoading] = useState(false);

  const [menuTarefaAbertoId, setMenuTarefaAbertoId] = useState<string | null>(
    null,
  );
  const [menuColunaAbertoId, setMenuColunaAbertoId] = useState<string | null>(
    null,
  );

  const [tarefaSelecionada, setTarefaSelecionada] = useState<any | null>(null);
  const [modalNovaTarefa, setModalNovaTarefa] = useState(false);
  const [colunaDestinoNovaTarefa, setColunaDestinoNovaTarefa] = useState<
    string | null
  >(null);

  const [formTarefa, setFormTarefa] = useState({
    titulo: "",
    data: "",
    responsavel: "",
    cliente: "",
    descricao: "",
  });

  const [modalNovaColuna, setModalNovaColuna] = useState(false);
  const [nomeNovaColuna, setNomeNovaColuna] = useState("");

  const [modalRenomearColuna, setModalRenomearColuna] = useState(false);
  const [colunaParaRenomear, setColunaParaRenomear] = useState<any | null>(
    null,
  );
  const [novoNomeColunaAtual, setNovoNomeColunaAtual] = useState("");

  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  const [atividadeDetalhe, setAtividadeDetalhe] = useState(null);
  const [tarefasAtividade, setTarefasAtividade] = useState([]);
  const [milestoneAtividade, setMilestoneAtividade] = useState<any>(null);

  useEffect(() => {
    carregarKanban();
  }, [idProjeto]);

  async function carregarKanban() {
    if (!idProjeto) return;

    try {
      setLoading(true);

      const atividades = await listarKanban(idProjeto);

      const novasColunas = colunasBase.map((coluna) => ({
        ...coluna,
        tarefas: atividades
          .filter((a: any) => a.status === coluna.id)
          .map((a: any) => ({
            id: a.id,
            titulo: a.titulo,
            descricao: a.descricao,
            data: `${formatarData(a.dataInicio)} - ${formatarData(a.dataEntrega)}`,
            responsavel: a.responsaveis?.length
              ? a.responsaveis.join(", ")
              : "Não atribuído",
            cliente: "Não informado",
            status: a.status,
          })),
      }));

      setColunas(novasColunas);
    } catch (error) {
      console.error("Erro ao carregar kanban:", error);
    } finally {
      setLoading(false);
    }
  }

  function formatarData(data: string) {
    if (!data) return "Sem data";

    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}`;
  }

  const handleDragStart = (
    e: React.DragEvent,
    tarefaId: string,
    colunaOrigemId: string,
  ) => {
    e.dataTransfer.setData("tarefaId", tarefaId);
    e.dataTransfer.setData("colunaOrigemId", colunaOrigemId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, colunaDestinoId: string) => {
    e.preventDefault();

    const tarefaId = e.dataTransfer.getData("tarefaId");
    const colunaOrigemId = e.dataTransfer.getData("colunaOrigemId");

    if (colunaOrigemId === colunaDestinoId || !idProjeto) return;

    let tarefaMovida: any;

    const novasColunas = colunas.map((coluna) => {
      if (coluna.id === colunaOrigemId) {
        tarefaMovida = coluna.tarefas.find((t: any) => t.id === tarefaId);

        return {
          ...coluna,
          tarefas: coluna.tarefas.filter((t: any) => t.id !== tarefaId),
        };
      }

      return coluna;
    });

    const colunasAtualizadas = novasColunas.map((coluna) => {
      if (coluna.id === colunaDestinoId && tarefaMovida) {
        return {
          ...coluna,
          tarefas: [
            ...coluna.tarefas,
            { ...tarefaMovida, status: colunaDestinoId },
          ],
        };
      }

      return coluna;
    });

    setColunas(colunasAtualizadas);

    try {
      await alterarStatusAtividade(idProjeto, tarefaId, colunaDestinoId);
    } catch (error) {
      console.error("Erro ao alterar status da atividade:", error);
      carregarKanban();
    }
  };

  const excluirAtividade = async (idAtividade: string, colunaId: string) => {
    await excluir(idProjeto, idAtividade);
    const novasColunas = colunas.map((coluna) => {
      if (coluna.id === colunaId) {
        return {
          ...coluna,
          tarefas: coluna.tarefas.filter((t: any) => t.id !== idAtividade),
        };
      }

      return coluna;
    });

    setColunas(novasColunas);
    setMenuTarefaAbertoId(null);
  };

  async function abrirDetalhesAtividade(tarefa: any) {
    try {
      const response = await buscarDetalhesAtividade(idProjeto, tarefa.id);

      setAtividadeDetalhe(response.atividade);
      setTarefasAtividade(response.tarefas);
      setMilestoneAtividade(response.milestone);

      setModalDetalhesAberto(true);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleExcluir(idTarefa: any) {
    const confirmar = window.confirm("Deseja realmente excluir esta tarefa?");

    if (!confirmar) return;

    try {
      await excluirTarefa(idTarefa);

      setModalDetalhesAberto(false);
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir tarefa.");
    }
  }

  const abrirModalNovaTarefa = (colunaId: string) => {
    setColunaDestinoNovaTarefa(colunaId);
    setModalNovaTarefa(true);
  };

  const fecharModalNovaTarefa = () => {
    setModalNovaTarefa(false);
    setFormTarefa({
      titulo: "",
      data: "",
      responsavel: "",
      cliente: "",
      descricao: "",
    });
  };

  const salvarNovaTarefa = () => {
    alert("Agora precisa ligar essa ação no endpoint de criar atividade.");
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormTarefa((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdicaoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setTarefaSelecionada((prev: any) => ({ ...prev, [name]: value }));
  };

  const salvarEdicaoTarefa = () => {
    alert("Agora precisa ligar essa ação no endpoint de editar atividade.");
  };

  const criarNovaColuna = () => {
    if (!nomeNovaColuna.trim()) return;

    const novaColuna = {
      id: `coluna_${Math.random().toString(36).substring(2, 9)}`,
      titulo: nomeNovaColuna,
      corHeader: "bg-[#2D333B]",
      corBody: "bg-[#161B22]",
      corCard: "bg-[#22272E]",
      corTexto: "text-white",
      corTag: "bg-[#30363D]",
      borda: "border-[#30363D]",
      editavel: true,
      tarefas: [],
    };

    setColunas([...colunas, novaColuna]);
    setModalNovaColuna(false);
    setNomeNovaColuna("");
  };

  const excluirColuna = (colunaId: string) => {
    setColunas(colunas.filter((coluna) => coluna.id !== colunaId));
    setMenuColunaAbertoId(null);
  };

  const abrirModalRenomear = (coluna: any) => {
    setColunaParaRenomear(coluna);
    setNovoNomeColunaAtual(coluna.titulo);
    setModalRenomearColuna(true);
    setMenuColunaAbertoId(null);
  };

  const salvarNovoNomeColuna = () => {
    if (!novoNomeColunaAtual.trim() || !colunaParaRenomear) return;

    const novasColunas = colunas.map((coluna) => {
      if (coluna.id === colunaParaRenomear.id) {
        return { ...coluna, titulo: novoNomeColunaAtual };
      }

      return coluna;
    });

    setColunas(novasColunas);
    setModalRenomearColuna(false);
    setColunaParaRenomear(null);
  };

  function formatarStatus(status: any) {
  switch (status) {
    case "PENDENTE":
      return "Pendente";
    case "EM_ANDAMENTO":
      return "Em andamento";
    case "CONCLUIDA":
      return "Concluída";
    case "CANCELADA":
      return "Cancelada";
    default:
      return status;
  }
}

  return (
    <>
      <style>
        {`
        .scroll-vertical::-webkit-scrollbar { width: 6px; }
        .scroll-vertical::-webkit-scrollbar-track { background: transparent; }
        .scroll-vertical::-webkit-scrollbar-thumb { background: #30363D; border-radius: 10px; }
        .scroll-vertical::-webkit-scrollbar-thumb:hover { background: #7C3AED; }

        .scroll-horizontal { overflow-x: auto; }
        .scroll-horizontal::-webkit-scrollbar { height: 12px; }
        .scroll-horizontal::-webkit-scrollbar-track { background: #0A0E17; border-radius: 10px; }
        .scroll-horizontal::-webkit-scrollbar-thumb { background: #30363D; border-radius: 10px; border: 2px solid #0A0E17; }
        .scroll-horizontal::-webkit-scrollbar-thumb:hover { background: #7C3AED; }
      `}
      </style>

      <div className="min-h-screen bg-[#0A0E17] flex justify-center p-4 md:p-8 font-sans">
        <div className="w-full max-w-[1440px] bg-[#161B22] border border-[#30363D] rounded-[40px] p-6 md:p-10 flex flex-col h-[90vh]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="w-11 h-11 flex items-center justify-center bg-[#22272E] border border-[#30363D] rounded-2xl text-white/70 hover:text-white hover:border-[#7C3AED] hover:bg-[#2D333B] transition-colors shadow-sm"
              >
                ←
              </button>

              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Kanban
              </h1>
            </div>

            {/*<button
              onClick={() => navigate(`/projetos/${idProjeto}/nova-atividade`)}
              className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold px-6 py-3 rounded-2xl transition-colors text-lg shadow-md flex items-center gap-2"
            >
              + Adicionar Atividade
            </button>*/}
          </div>

          {loading ? (
            <p className="text-white">Carregando kanban...</p>
          ) : (
            <div className="flex gap-6 w-full max-w-full pb-6 h-full scroll-horizontal items-start">
              {colunas.map((coluna) => (
                <div
                  key={coluna.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, coluna.id)}
                  className="flex-1 min-w-[280px] max-w-[420px] rounded-2xl flex flex-col border border-[#30363D] overflow-hidden h-full"
                >
                  <div className={`${coluna.corHeader} p-5`}>
                    <h2 className="text-white text-xl font-medium">
                      {coluna.titulo}
                    </h2>
                  </div>

                  <div
                    className={`${coluna.corBody} p-4 flex-1 overflow-y-auto flex flex-col gap-4 scroll-vertical`}
                  >
                    {coluna.tarefas.map((tarefa: any) => (
                      <div
                        key={tarefa.id}
                        draggable
                        onDragStart={(e) =>
                          handleDragStart(e, tarefa.id, coluna.id)
                        }
                        onDoubleClick={() => setTarefaSelecionada(tarefa)}
                        className={`${coluna.corCard} rounded-xl p-4 border border-white/10 shadow-sm cursor-grab active:cursor-grabbing relative`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3
                            className={`${coluna.corTexto} text-lg font-medium`}
                          >
                            {tarefa.titulo}
                          </h3>

                          <button
                            onClick={() =>
                              setMenuTarefaAbertoId(
                                menuTarefaAbertoId === tarefa.id
                                  ? null
                                  : tarefa.id,
                              )
                            }
                            className="text-white/60 hover:text-white"
                          >
                            <HiOutlineDotsVertical />
                          </button>

                          {menuTarefaAbertoId === tarefa.id && (
                            <div className="absolute right-4 top-10 w-40 bg-[#2D333B] border border-[#30363D] rounded-lg shadow-lg z-40 overflow-hidden">
                              <button
                                onClick={() => {
                                  abrirDetalhesAtividade(tarefa);
                                  setMenuTarefaAbertoId(null);
                                }}
                                className="w-full text-left px-4 py-3 text-white hover:bg-[#161B22]"
                              >
                                Detalhes
                              </button>

                              <button
                                onClick={() => {
                                  navigate(
                                    `/projetos/${idProjeto}/atividades/${tarefa.id}/editar`,
                                  );
                                }}
                                className="w-full text-left px-4 py-3 text-yellow-400 hover:bg-[#161B22]"
                              >
                                Alterar
                              </button>

                              <button
                                onClick={() => {
                                  excluirAtividade(tarefa.id, coluna.id);
                                  setMenuTarefaAbertoId(null);
                                }}
                                className="w-full text-left px-4 py-3 text-red-400 hover:bg-[#161B22]"
                              >
                                Excluir
                              </button>
                            </div>
                          )}
                        </div>

                        <p className="text-white/70 text-sm mb-4">
                          {tarefa.data}
                        </p>

                        <div
                          className={`inline-block ${coluna.corTag} text-white/90 text-sm px-3 py-1.5 rounded-lg`}
                        >
                          {tarefa.responsavel}
                        </div>
                      </div>
                    ))}
                  </div>

                  {coluna.id !== "PENDENTE" && (
                    <div className={`${coluna.corBody} p-4 pt-0`}>
                      {/*<button
                        onClick={() => navigate(`/projetos/${idProjeto}/nova-atividade`)}
                        className="w-full py-3 rounded-xl border border-white/20 text-white/70 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center gap-2"
                      >
                        + Adicionar Atividade
                      </button>*/}
                    </div>
                  )}
                </div>
              ))}

              {/* Nova coluna 
              <div className="min-w-[320px] max-w-[350px] w-full rounded-2xl flex flex-col border border-[#30363D] border-dashed overflow-hidden flex-shrink-0 h-full max-h-[100%] transition-colors hover:border-[#7C3AED]">
                <div className="bg-[#2D333B] p-5">
                  <h2 className="text-white text-xl font-medium">
                    Nova coluna
                  </h2>
                </div>

                <div className="bg-[#161B22] p-4 flex-1 flex items-center justify-center">
                  <button
                    onClick={() => setModalNovaColuna(true)}
                    className="w-16 h-16 bg-[#7C3AED] hover:bg-[#6D28D9] rounded-full flex items-center justify-center text-white text-4xl pb-1 shadow-md transition-transform hover:scale-105"
                  >
                    +
                  </button>
                </div>
              </div>
              */}
            </div>
          )}
        </div>
      </div>
      {modalDetalhesAberto && atividadeDetalhe && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 md:p-8">
          <div className="w-full max-w-5xl bg-[#1B1F27] border border-[#30363D] rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between p-8 border-b border-[#30363D]">
              <div className="flex gap-5">
                <div className="w-16 h-16 rounded-2xl bg-purple-600/20 flex items-center justify-center text-3xl">
                  📄
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-white">
                    {atividadeDetalhe.nomeAtividade}
                  </h2>

                  <p className="text-gray-400 mt-2 max-w-3xl">
                    {atividadeDetalhe.descricaoAtividade}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalDetalhesAberto(false)}
                className="text-3xl text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            {/* Informações */}
            <div className="grid grid-cols-3 gap-4 p-8">
              <div className="bg-[#22272E] rounded-xl p-5">
                <p className="text-gray-400 text-sm">Status</p>

                <span className="inline-flex mt-2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm">
                  {formatarStatus(atividadeDetalhe.statusAtividade)}
                </span>
              </div>

              <div className="bg-[#22272E] rounded-xl p-5">
                <p className="text-gray-400 text-sm">Início</p>

                <p className="text-white text-lg mt-2">
                  {atividadeDetalhe.dataInicio}
                </p>
              </div>

              <div className="bg-[#22272E] rounded-xl p-5">
                <p className="text-gray-400 text-sm">Entrega</p>

                <p className="text-white text-lg mt-2">
                  {atividadeDetalhe.dataEntrega}
                </p>
              </div>
            </div>

            {/* Botões */}
            <div className="px-8 pb-8 flex gap-4">
              <button
                onClick={() =>
                  navigate(
                    `/projetos/${idProjeto}/atividade/${atividadeDetalhe.idAtividade}/nova-tarefa`,
                  )
                }
                className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white px-6 py-3 rounded-xl font-medium transition hover:opacity-90 transition-all shadow-md shadow-[#6366f1]/20"
              >
                + Criar Tarefa
              </button>

              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition">
                + Criar Milestone
              </button>
            </div>

            {/* Milestone */}
            <div className="px-8 pb-8">
              <h3 className="text-xl font-semibold text-white mb-4">
                🚩 Milestone
              </h3>

              {milestoneAtividade ? (
                <div className="bg-[#22272E] rounded-xl p-5">
                  <h4 className="text-white font-semibold">
                    {milestoneAtividade.nomeMilestone}
                  </h4>

                  <p className="text-gray-400 mt-2">
                    {milestoneAtividade.descricao}
                  </p>

                  <p className="text-sm text-gray-500 mt-3">
                    Prevista para {milestoneAtividade.dataPrevista}
                  </p>
                </div>
              ) : (
                <div className="bg-[#22272E] border border-dashed border-[#3A4049] rounded-xl p-8 text-center">
                  <div className="text-5xl mb-4">🚩</div>

                  <p className="text-gray-300 font-medium">
                    Nenhuma milestone cadastrada.
                  </p>

                  <p className="text-gray-500 mt-2">
                    Crie uma milestone para acompanhar os marcos desta
                    atividade.
                  </p>
                </div>
              )}
            </div>

            {/* Tarefas */}
            <div className="px-8 pb-8">
              <h3 className="text-xl font-semibold text-white mb-4">
                📋 Tarefas
              </h3>

              {tarefasAtividade.length === 0 ? (
                <div className="bg-[#22272E] border border-dashed border-[#3A4049] rounded-xl p-8 text-center">
                  <div className="text-5xl mb-4">📋</div>

                  <p className="text-gray-300 font-medium">
                    Nenhuma tarefa cadastrada.
                  </p>

                  <p className="text-gray-500 mt-2">
                    Utilize o botão "Criar Tarefa" para começar.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tarefasAtividade.map((tarefa: any) => (
                    <div
                      key={tarefa.idTarefa}
                      className="bg-[#22272E] rounded-xl p-5 flex justify-between items-center border border-[#30363D]"
                    >
                      <div>
                        <h4 className="text-white font-semibold">
                          {tarefa.nomeTarefa}
                        </h4>

                        <p className="text-gray-400 mt-1">
                          {formatarStatus(tarefa.statusTarefa)}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            navigate(`/projetos/${idProjeto}/atividade/${atividadeDetalhe.idAtividade}/tarefas/${tarefa.idTarefa}/editar`)
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() =>
                            handleExcluir(tarefa.idTarefa)
                          }
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                        >
                          Excluir tarefa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
