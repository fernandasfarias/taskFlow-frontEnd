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

  const [tarefaSelecionada, setTarefaSelecionada] = useState<any | null>(null);
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);

  const [atividadeDetalhe, setAtividadeDetalhe] = useState<any>(null);
  const [tarefasAtividade, setTarefasAtividade] = useState<any[]>([]);
  const [milestoneAtividade, setMilestoneAtividade] = useState<any>(null);

  //--- ESTADOS PARA O MILESTONE
  const [criandoMilestone, setCriandoMilestone] = useState(false);
  const [formMilestone, setFormMilestone] = useState({
    nomeMilestone: "",
    dataPrevista: "",
    descricao: "",
  });

  const [etapasTemporarias, setEtapasTemporarias] = useState<string[]>([]);
  const [novaEtapaInput, setNovaEtapaInput] = useState("");
  const [mostrarInputEtapa, setMostrarInputEtapa] = useState(false);
  const [menuMilestoneAberto, setMenuMilestoneAberto] = useState(false);
  const [etapaSelecionadaIndex, setEtapaSelecionadaIndex] = useState<
    number | null
  >(null);

  // ESTADOS PARA OS MODAIS CUSTOMIZADOS
  const [modalEditarEtapaAberto, setModalEditarEtapaAberto] = useState(false);
  const [modalExcluirEtapaAberto, setModalExcluirEtapaAberto] = useState(false);
  const [modalExcluirMilestoneAberto, setModalExcluirMilestoneAberto] =
    useState(false);
  const [nomeEtapaEditada, setNomeEtapaEditada] = useState("");

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
    tarefald: string,
    colunaOrigemId: string,
  ) => {
    e.dataTransfer.setData("tarefald", tarefald);
    e.dataTransfer.setData("colunaOrigemId", colunaOrigemId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, colunaDestinoId: string) => {
    e.preventDefault();
    const tarefald = e.dataTransfer.getData("tarefald");
    const colunaOrigemId = e.dataTransfer.getData("colunaOrigemId");

    if (colunaOrigemId === colunaDestinoId || !idProjeto) return;

    let tarefaMovida: any;
    const novasColunas = colunas.map((coluna) => {
      if (coluna.id === colunaOrigemId) {
        tarefaMovida = coluna.tarefas.find((t: any) => t.id === tarefald);
        return {
          ...coluna,
          tarefas: coluna.tarefas.filter((t: any) => t.id !== tarefald),
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
      await alterarStatusAtividade(idProjeto, tarefald, colunaDestinoId);
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
      setCriandoMilestone(false);
      setMostrarInputEtapa(false);
      setMenuMilestoneAberto(false);
      setEtapaSelecionadaIndex(null);
      setModalEditarEtapaAberto(false);
      setModalExcluirEtapaAberto(false);
      setModalExcluirMilestoneAberto(false);
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

  //--- FUNÇÕES DO MILESTONE ---
  const handleMilestoneInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormMilestone((prev) => ({ ...prev, [name]: value }));
  };

  const adicionarEtapaTemporaria = () => {
    if (novaEtapaInput.trim()) {
      setEtapasTemporarias([...etapasTemporarias, novaEtapaInput.trim()]);
      setNovaEtapaInput("");
      setMostrarInputEtapa(false);
      setEtapaSelecionadaIndex(null);
    }
  };

  const abrirModalEditarEtapa = () => {
    if (etapaSelecionadaIndex !== null) {
      setNomeEtapaEditada(etapasTemporarias[etapaSelecionadaIndex]);
      setModalEditarEtapaAberto(true);
    }
  };

  const confirmarEdicaoEtapa = () => {
    if (etapaSelecionadaIndex !== null && nomeEtapaEditada.trim() !== "") {
      const novasEtapas = [...etapasTemporarias];
      novasEtapas[etapaSelecionadaIndex] = nomeEtapaEditada.trim();
      setEtapasTemporarias(novasEtapas);
      setModalEditarEtapaAberto(false);
      setEtapaSelecionadaIndex(null);
    }
  };

  const abrirModalExcluirEtapa = () => {
    if (etapaSelecionadaIndex !== null) {
      setModalExcluirEtapaAberto(true);
    }
  };

  const confirmarExclusaoEtapa = () => {
    if (etapaSelecionadaIndex !== null) {
      const novasEtapas = etapasTemporarias.filter(
        (_, i) => i !== etapaSelecionadaIndex,
      );
      setEtapasTemporarias(novasEtapas);
      setModalExcluirEtapaAberto(false);
      setEtapaSelecionadaIndex(null);
    }
  };

  // =============== INTEGRAÇÕES COM O BACK-END (MILESTONE) ===============

  const salvarNovoMilestone = async () => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        nomeMilestone: formMilestone.nomeMilestone,
        descricao: formMilestone.descricao,
        dataPrevista: formMilestone.dataPrevista,
        etapas: etapasTemporarias.map((nome) => ({
          nomeEtapa: nome,
          concluida: false,
        })),
      };

      let response;

      // Se já existir um ID, significa que estamos EDITANDO o milestone inteiro
      if (milestoneAtividade && milestoneAtividade.idMilestone) {
        response = await fetch(
          `http://localhost:8080/milestones/${milestoneAtividade.idMilestone}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          },
        );
      } else {
        // Se não tiver ID, é uma CRIAÇÃO nova vinculada à atividade
        response = await fetch(
          `http://localhost:8080/milestones/atividade/${atividadeDetalhe.idAtividade}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          },
        );
      }

      if (response.ok) {
        const milestoneSalvo = await response.json();
        setMilestoneAtividade(milestoneSalvo);
        setCriandoMilestone(false);
        setFormMilestone({
          nomeMilestone: "",
          dataPrevista: "",
          descricao: "",
        });
        setEtapasTemporarias([]);
      } else {
        alert("Erro ao salvar o Milestone");
      }
    } catch (error) {
      console.error("Falha na comunicação com o servidor:", error);
    }
  };

  const confirmarExclusaoMilestone = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/milestones/${milestoneAtividade.idMilestone}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        setMilestoneAtividade(null);
        setModalExcluirMilestoneAberto(false);
      }
    } catch (error) {
      console.error("Erro ao deletar milestone:", error);
    }
  };

  // NOVA FUNÇÃO: Alternar Status da Etapa (Checkbox)
  const alternarStatusEtapa = async (idEtapa: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/etapas/${idEtapa}/toggle`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const milestoneAtualizado = await response.json();
        setMilestoneAtividade(milestoneAtualizado); // A tela e a barrinha atualizam sozinhas!
      }
    } catch (error) {
      console.error("Erro ao alterar status da etapa:", error);
    }
  };

  // ======================================================================

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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {modalDetalhesAberto && atividadeDetalhe && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 md:p-8">
          <div className="w-full max-w-5xl bg-[#1B1F27] border border-[#30363D] rounded-3xl shadow-2xl overflow-hidden mt-10 mb-10">
            {/* Header */}
            <div className="flex items-start justify-between p-8 border-b border-[#30363D]">
              <div className="flex gap-5">
                <div className="w-16 h-16 rounded-2xl bg-purple-600/20 flex items-center justify-center text-3xl">
                  {" "}
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
                className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white px-6 py-3 rounded-xl font-medium transition hover:opacity-90 shadow-md shadow-[#6366f1]/20"
              >
                + Criar Tarefa
              </button>
              {!milestoneAtividade && (
                <button
                  onClick={() => setCriandoMilestone(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition"
                >
                  + Criar Milestone
                </button>
              )}
            </div>

            {/* Seção do Milestone */}
            <div className="px-8 pb-8">
              <h3 className="text-xl font-semibold text-white mb-4">
                Milestone
              </h3>
              {criandoMilestone ? (
                // TELA 1: FORMULÁRIO DE CRIAÇÃO/EDIÇÃO
                <div className="bg-[#161B22] rounded-2xl p-6 border border-[#30363D]">
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <input
                      type="text"
                      name="nomeMilestone"
                      value={formMilestone.nomeMilestone}
                      onChange={handleMilestoneInputChange}
                      placeholder="Nome do Milestone"
                      className="bg-transparent border border-[#30363D] rounded-xl p-4 flex-1 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                    <input
                      type="date"
                      name="dataPrevista"
                      value={formMilestone.dataPrevista}
                      onChange={handleMilestoneInputChange}
                      className="bg-transparent border border-[#30363D] rounded-xl p-4 w-full md:w-48 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <textarea
                    name="descricao"
                    value={formMilestone.descricao}
                    onChange={handleMilestoneInputChange}
                    placeholder="Descrição"
                    className="bg-transparent border border-[#30363D] rounded-xl p-4 w-full text-white placeholder-gray-500 h-28 mb-4 focus:outline-none focus:border-purple-500 resize-none"
                  ></textarea>

                  {/* Linha dos Botões de Ação das Etapas */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    {!mostrarInputEtapa ? (
                      <button
                        onClick={() => {
                          setMostrarInputEtapa(true);
                          setEtapaSelecionadaIndex(null);
                        }}
                        className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-6 py-3 rounded-xl font-medium transition shadow-md"
                      >
                        + Adicionar Etapa
                      </button>
                    ) : (
                      <input
                        type="text"
                        autoFocus
                        value={novaEtapaInput}
                        onChange={(e) => setNovaEtapaInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") adicionarEtapaTemporaria();
                          if (e.key === "Escape") setMostrarInputEtapa(false);
                        }}
                        onBlur={() => {
                          if (!novaEtapaInput.trim())
                            setMostrarInputEtapa(false);
                        }}
                        placeholder="Pressione enter para adicionar (ou Esc para cancelar)..."
                        className="bg-transparent border border-[#7C3AED] rounded-xl p-3 w-full md:w-1/3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#7C3AED] shadow-sm"
                      />
                    )}

                    {/* Botões (Editar e Excluir Etapa) AGORA COM O ROXO DO PROJETO */}
                    <button
                      onClick={abrirModalEditarEtapa}
                      disabled={etapaSelecionadaIndex === null}
                      className={`px-6 py-3 rounded-xl font-medium transition border ${
                        etapaSelecionadaIndex !== null
                          ? "border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white cursor-pointer"
                          : "border-[#30363D] text-gray-600 bg-transparent cursor-not-allowed"
                      }`}
                    >
                      Editar
                    </button>
                    <button
                      onClick={abrirModalExcluirEtapa}
                      disabled={etapaSelecionadaIndex === null}
                      className={`px-6 py-3 rounded-xl font-medium transition border ${
                        etapaSelecionadaIndex !== null
                          ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white cursor-pointer"
                          : "border-[#30363D] text-gray-600 bg-transparent cursor-not-allowed"
                      }`}
                    >
                      Excluir
                    </button>
                  </div>

                  {/* Lista de Etapas Temporárias (Clicáveis) */}
                  {etapasTemporarias.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-8">
                      {etapasTemporarias.map((etapa, idx) => (
                        <div
                          key={idx}
                          onClick={() =>
                            setEtapaSelecionadaIndex(
                              etapaSelecionadaIndex === idx ? null : idx,
                            )
                          }
                          className={`flex items-center gap-3 border rounded-full px-4 py-2 cursor-pointer transition-all ${
                            etapaSelecionadaIndex === idx
                              ? "border-[#7C3AED] bg-[#7C3AED]/10"
                              : "border-[#30363D] bg-[#1B1F27] hover:border-gray-500"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              etapaSelecionadaIndex === idx
                                ? "border-[#7C3AED]"
                                : "border-gray-500"
                            }`}
                          >
                            {etapaSelecionadaIndex === idx && (
                              <div className="w-2 h-2 bg-[#7C3AED] rounded-full"></div>
                            )}
                          </div>
                          <span
                            className={`text-sm ${etapaSelecionadaIndex === idx ? "text-white" : "text-gray-300"}`}
                          >
                            {etapa}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-4 border-t border-[#30363D]">
                    <button
                      onClick={() => {
                        setCriandoMilestone(false);
                        setMostrarInputEtapa(false);
                        setEtapaSelecionadaIndex(null);
                      }}
                      className="text-gray-400 hover:text-white px-6 py-3 rounded-xl transition"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={salvarNovoMilestone}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition"
                    >
                      Salvar Milestone
                    </button>
                  </div>
                </div>
              ) : milestoneAtividade ? (
                // TELA 2: MILESTONE CRIADO
                <div className="bg-[#161B22] rounded-2xl p-8 border border-[#30363D] relative shadow-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white text-3xl font-bold">
                      {milestoneAtividade.nomeMilestone}
                    </h4>
                    <div className="relative">
                      <button
                        onClick={() =>
                          setMenuMilestoneAberto(!menuMilestoneAberto)
                        }
                        className="text-gray-500 hover:text-white text-xl p-1"
                      >
                        <HiOutlineDotsVertical />
                      </button>
                      {menuMilestoneAberto && (
                        <div className="absolute right-0 top-8 w-40 bg-[#2D333B] border border-[#30363D] rounded-lg shadow-lg z-40 overflow-hidden">
                          <button
                            onClick={() => {
                              setFormMilestone({
                                nomeMilestone: milestoneAtividade.nomeMilestone,
                                dataPrevista: milestoneAtividade.dataPrevista,
                                descricao: milestoneAtividade.descricao,
                              });
                              setEtapasTemporarias(
                                milestoneAtividade.etapas
                                  ? milestoneAtividade.etapas.map(
                                      (e: any) => e.nomeEtapa,
                                    )
                                  : [],
                              );
                              setEtapaSelecionadaIndex(null);
                              setCriandoMilestone(true);
                              setMenuMilestoneAberto(false);
                            }}
                            className="w-full text-left px-4 py-3 text-white hover:bg-[#161B22] transition"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => {
                              setModalExcluirMilestoneAberto(true);
                              setMenuMilestoneAberto(false);
                            }}
                            className="w-full text-left px-4 py-3 text-red-400 hover:bg-[#161B22] transition"
                          >
                            Excluir
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-400 mb-8 max-w-3xl leading-relaxed">
                    {milestoneAtividade.descricao}
                  </p>

                  <div className="space-y-4 mb-8">
                    {(milestoneAtividade.etapas || [])
                      .slice() 
                      .sort((a: any, b: any) =>
                        a.idEtapa.localeCompare(b.idEtapa),
                      ) 
                      .map((etapa: any, index: number) => (
                        <div
                          key={index}
                          onClick={() => alternarStatusEtapa(etapa.idEtapa)}
                          className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${etapa.concluida ? "border-green-600/50 bg-[#122A20]" : "border-[#30363D] bg-transparent hover:border-gray-500"}`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${etapa.concluida ? "border-green-500" : "border-gray-500"}`}
                          >
                            {etapa.concluida && (
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            )}
                          </div>
                          <span
                            className={`text-base ${etapa.concluida ? "text-gray-200" : "text-gray-400"}`}
                          >
                            {etapa.nomeEtapa}
                          </span>
                        </div>
                      ))}
                    {(!milestoneAtividade.etapas ||
                      milestoneAtividade.etapas.length === 0) && (
                      <p className="text-gray-500 italic">
                        Nenhuma etapa cadastrada neste marco.
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between items-end mb-3">
                      <div>
                        <p className="text-gray-500 text-sm mb-1">Prazo</p>
                        <p className="text-gray-300 font-medium">
                          {milestoneAtividade.dataPrevista}
                        </p>
                      </div>
                      <p className="text-white font-bold text-lg">
                        {milestoneAtividade.progresso || 0}%
                      </p>
                    </div>
                    <div className="w-full bg-[#22272E] rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-green-500 h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${milestoneAtividade.progresso || 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                // TELA 3: ESTADO VAZIO
                <div className="bg-[#22272E] border border-dashed border-[#3A4049] rounded-2xl p-10 text-center">
                  <div className="text-5xl mb-4"></div>
                  <p className="text-gray-300 font-medium text-lg">
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
              <h3 className="text-xl font-semibold text-white mb-4">Tarefas</h3>
              {tarefasAtividade.length === 0 ? (
                <div className="bg-[#22272E] border border-dashed border-[#3A4049] rounded-2xl p-10 text-center">
                  <div className="text-5xl mb-4"></div>
                  <p className="text-gray-300 font-medium text-lg">
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
                        <h4 className="text-white font-semibold text-lg">
                          {tarefa.nomeTarefa}
                        </h4>
                        <p className="text-gray-400 mt-1">
                          {formatarStatus(tarefa.statusTarefa)}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            navigate(
                              `/projetos/${idProjeto}/atividade/${atividadeDetalhe.idAtividade}/tarefas/${tarefa.idTarefa}/editar`,
                            )
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleExcluir(tarefa.idTarefa)}
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

      {/* MODAIS CUSTOMIZADOS (EDITAR / EXCLUIR) */}

      {/* Modal de Editar Etapa AGORA EM ROXO */}
      {modalEditarEtapaAberto && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1B1F27] border border-[#30363D] rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Editar Etapa</h3>
            <input
              type="text"
              autoFocus
              value={nomeEtapaEditada}
              onChange={(e) => setNomeEtapaEditada(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && confirmarEdicaoEtapa()}
              className="bg-[#161B22] border border-[#30363D] rounded-xl p-4 w-full text-white focus:outline-none focus:border-[#7C3AED] mb-8"
              placeholder="Nome da etapa..."
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalEditarEtapaAberto(false)}
                className="text-gray-400 hover:text-white px-6 py-3 rounded-xl transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEdicaoEtapa}
                className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-6 py-3 rounded-xl font-medium transition"
              >
                Salvar Alteração
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Excluir Etapa */}
      {modalExcluirEtapaAberto && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1B1F27] border border-[#30363D] rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 text-3xl mb-4">
                !
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Excluir Etapa
              </h3>
              <p className="text-gray-400">
                Tem certeza que deseja excluir esta etapa? Essa ação removerá o
                item da lista e não poderá ser desfeita.
              </p>
            </div>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setModalExcluirEtapaAberto(false)}
                className="flex-1 bg-[#22272E] hover:bg-[#30363D] text-white px-6 py-3 rounded-xl transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarExclusaoEtapa}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition"
              >
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOVO MODAL: Excluir Milestone Completa */}
      {modalExcluirMilestoneAberto && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1B1F27] border border-[#30363D] rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 text-3xl mb-4">
                !
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Excluir Milestone
              </h3>
              <p className="text-gray-400">
                Tem certeza que deseja deletar a milestone{" "}
                <strong className="text-white">
                  "{milestoneAtividade?.nomeMilestone}"
                </strong>{" "}
                inteira? Isso removerá o marco e todas as suas etapas associadas
                permanentemente.
              </p>
            </div>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setModalExcluirMilestoneAberto(false)}
                className="flex-1 bg-[#22272E] hover:bg-[#30363D] text-white px-6 py-3 rounded-xl transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarExclusaoMilestone}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition shadow-md shadow-red-600/10"
              >
                Sim, excluir tudo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
