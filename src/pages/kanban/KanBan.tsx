import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// DADOS TESTANDO
const dadosIniciais = [
  {
    id: "nao_iniciadas",
    titulo: "Não iniciadas",
    corHeader: "bg-[#2D333B]",
    corBody: "bg-[#161B22]",
    corCard: "bg-[#22272E]",
    corTexto: "text-white",
    corTag: "bg-[#30363D]",
    borda: "border-[#30363D]",
    editavel: false,
    tarefas: [
      { id: "1", titulo: "Demanda 2", data: "15/08 - 19/08", responsavel: "João Paulo", cliente: "Tech Corp", descricao: "Criar o fluxo de telas iniciais." },
      { id: "2", titulo: "Demanda 1", data: "15/08 - 19/08", responsavel: "Mariana Lima", cliente: "Agência X", descricao: "Ajustar o banco de dados principal." },
      { id: "3", titulo: "Demanda 3", data: "15/08 - 19/08", responsavel: "Pedro Costa", cliente: "Tech Corp", descricao: "Revisar os componentes do Figma." },
    ],
  },
  {
    id: "em_andamento",
    titulo: "Em andamento",
    corHeader: "bg-[#3E5C9A]",
    corBody: "bg-[#1E2D4E]",
    corCard: "bg-[#35518D]",
    corTexto: "text-white",
    corTag: "bg-[#1E2D4E]",
    borda: "border-[#3E5C9A]",
    editavel: false,
    tarefas: [
      { id: "4", titulo: "Demanda 4", data: "15/08 - 19/08", responsavel: "João Paulo", cliente: "Startup Y", descricao: "Implementar autenticação JWT." },
      { id: "5", titulo: "Demanda 5", data: "15/08 - 19/08", responsavel: "Pedro Costa", cliente: "Agência X", descricao: "Conectar API com o Front-end." },
    ],
  },
  {
    id: "concluidas",
    titulo: "Concluídas",
    corHeader: "bg-[#286455]",
    corBody: "bg-[#12332A]",
    corCard: "bg-[#286455]",
    corTexto: "text-white",
    corTag: "bg-[#12332A]",
    borda: "border-[#286455]",
    editavel: false,
    tarefas: [
      { id: "6", titulo: "Demanda 6", data: "15/08 - 19/08", responsavel: "Mariana Lima", cliente: "Startup Y", descricao: "Configurar deploy na Vercel." },
    ],
  },
];

export default function Kanban() {
  const navigate = useNavigate();
  
  const [colunas, setColunas] = useState(dadosIniciais);
  
  const [menuTarefaAbertoId, setMenuTarefaAbertoId] = useState<string | null>(null);
  const [menuColunaAbertoId, setMenuColunaAbertoId] = useState<string | null>(null);
  
  const [tarefaSelecionada, setTarefaSelecionada] = useState<any | null>(null);
  const [modalNovaTarefa, setModalNovaTarefa] = useState(false);
  const [colunaDestinoNovaTarefa, setColunaDestinoNovaTarefa] = useState<string | null>(null);
  
  const [formTarefa, setFormTarefa] = useState({
    titulo: "",
    data: "",
    responsavel: "",
    cliente: "",
    descricao: ""
  });
  
  const [modalNovaColuna, setModalNovaColuna] = useState(false);
  const [nomeNovaColuna, setNomeNovaColuna] = useState("");
  
  const [modalRenomearColuna, setModalRenomearColuna] = useState(false);
  const [colunaParaRenomear, setColunaParaRenomear] = useState<any | null>(null);
  const [novoNomeColunaAtual, setNovoNomeColunaAtual] = useState("");

  // EFEITO DE ARRASTAR E SOLTAR
  const handleDragStart = (e: React.DragEvent, tarefaId: string, colunaOrigemId: string) => {
    e.dataTransfer.setData("tarefaId", tarefaId);
    e.dataTransfer.setData("colunaOrigemId", colunaOrigemId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, colunaDestinoId: string) => {
    e.preventDefault();
    const tarefaId = e.dataTransfer.getData("tarefaId");
    const colunaOrigemId = e.dataTransfer.getData("colunaOrigemId");

    if (colunaOrigemId === colunaDestinoId) return;

    let tarefaMovida: any;
    const novasColunas = colunas.map((coluna) => {
      if (coluna.id === colunaOrigemId) {
        tarefaMovida = coluna.tarefas.find((t) => t.id === tarefaId);
        return { ...coluna, tarefas: coluna.tarefas.filter((t) => t.id !== tarefaId) };
      }
      return coluna;
    });

    const colunasAtualizadas = novasColunas.map((coluna) => {
      if (coluna.id === colunaDestinoId && tarefaMovida) {
        return { ...coluna, tarefas: [...coluna.tarefas, tarefaMovida] };
      }
      return coluna;
    });

    setColunas(colunasAtualizadas);
  };

  // --- FUNÇÕES DE TAREFAS ---
  const excluirTarefa = (tarefaId: string, colunaId: string) => {
    const novasColunas = colunas.map((coluna) => {
      if (coluna.id === colunaId) {
        return { ...coluna, tarefas: coluna.tarefas.filter((t) => t.id !== tarefaId) };
      }
      return coluna;
    });
    setColunas(novasColunas);
    setMenuTarefaAbertoId(null);
  };

  const abrirModalNovaTarefa = (colunaId: string) => {
    setColunaDestinoNovaTarefa(colunaId);
    setModalNovaTarefa(true);
  };

  const fecharModalNovaTarefa = () => {
    setModalNovaTarefa(false);
    setFormTarefa({ titulo: "", data: "", responsavel: "", cliente: "", descricao: "" });
  };

  const salvarNovaTarefa = () => {
    if (!formTarefa.titulo.trim()) return;

    const novaTarefa = {
      id: `tarefa_${Math.random().toString(36).substr(2, 9)}`,
      titulo: formTarefa.titulo,
      data: formTarefa.data || "Sem data",
      responsavel: formTarefa.responsavel || "Não atribuído",
      cliente: formTarefa.cliente || "Não informado",
      descricao: formTarefa.descricao || "Sem descrição",
    };

    const novasColunas = colunas.map((coluna) => {
      if (coluna.id === colunaDestinoNovaTarefa) {
        return { ...coluna, tarefas: [...coluna.tarefas, novaTarefa] };
      }
      return coluna;
    });

    setColunas(novasColunas);
    fecharModalNovaTarefa();
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormTarefa(prev => ({ ...prev, [name]: value }));
  };

  // --- FUNÇÕES DE EDIÇÃO DA TAREFA ---
  const handleEdicaoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTarefaSelecionada((prev: any) => ({ ...prev, [name]: value }));
  };

  const salvarEdicaoTarefa = () => {
    if (!tarefaSelecionada?.titulo.trim()) return;

    const novasColunas = colunas.map((coluna) => {
      if (coluna.tarefas.some(t => t.id === tarefaSelecionada.id)) {
        return {
          ...coluna,
          tarefas: coluna.tarefas.map(t => t.id === tarefaSelecionada.id ? tarefaSelecionada : t)
        };
      }
      return coluna;
    });

    setColunas(novasColunas);
    setTarefaSelecionada(null); 
  };

  // --- FUNÇÕES DAS COLUNAS ---
  const criarNovaColuna = () => {
    if (!nomeNovaColuna.trim()) return;

    const novaColuna = {
      id: `coluna_${Math.random().toString(36).substr(2, 9)}`,
      titulo: nomeNovaColuna,
      corHeader: "bg-[#2D333B]",
      corBody: "bg-[#161B22]",
      corCard: "bg-[#22272E]",
      corTexto: "text-white",
      corTag: "bg-[#30363D]",
      borda: "border-[#30363D]",
      editavel: true, 
      tarefas: []
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
          
          {/* CABEÇALHO */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="w-11 h-11 flex items-center justify-center bg-[#22272E] border border-[#30363D] rounded-2xl text-white/70 hover:text-white hover:border-[#7C3AED] hover:bg-[#2D333B] transition-colors shadow-sm"
                title="Voltar para a Home"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5M5 12L11 18M5 12L11 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Kanban</h1>
            </div>

            <button 
              onClick={() => abrirModalNovaTarefa(colunas[0].id)}
              className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold px-6 py-3 rounded-2xl transition-colors text-lg shadow-md flex items-center gap-2"
            >
              <span>+</span> Adicionar Tarefa
            </button>
          </div>

          {/* ÁREA DAS COLUNAS */}
          <div className="flex gap-6 w-full max-w-full pb-6 h-full scroll-horizontal items-start">
            
            {colunas.map((coluna) => (
              <div 
                key={coluna.id} 
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, coluna.id)}
                className="min-w-[320px] max-w-[350px] w-full rounded-2xl flex flex-col border border-[#30363D] overflow-hidden flex-shrink-0 h-full max-h-[100%]"
              >
                {/* Header da Coluna */}
                <div className={`${coluna.corHeader} p-5 flex justify-between items-center relative`}>
                  <h2 className="text-white text-xl font-medium">{coluna.titulo}</h2>
                  
                  {coluna.editavel && (
                    <div>
                      <button 
                        onClick={() => setMenuColunaAbertoId(menuColunaAbertoId === coluna.id ? null : coluna.id)}
                        className="text-white/60 hover:text-white transition-colors"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12H5.01M12 12H12.01M19 12H19.01M6 12C6 12.5523 5.55228 13 5 13C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11C5.55228 11 6 11.4477 6 12ZM13 12C13 12.5523 12.552 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.552 11 13 11.4477 13 12ZM20 12C20 12.5523 19.5523 13 19 13C18.4477 13 18 12.5523 18 12C18 11.4477 18.4477 11 19 11C19.5523 11 20 11.4477 20 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>

                      {menuColunaAbertoId === coluna.id && (
                        <div className="absolute right-4 top-12 w-32 bg-[#2D333B] border border-[#30363D] rounded-lg shadow-lg z-50 overflow-hidden">
                          <button 
                            onClick={() => abrirModalRenomear(coluna)}
                            className="w-full text-left px-4 py-2 text-white hover:bg-[#161B22] transition-colors"
                          >
                            Renomear
                          </button>
                          <button 
                            onClick={() => excluirColuna(coluna.id)}
                            className="w-full text-left px-4 py-2 text-red-400 hover:bg-[#161B22] transition-colors"
                          >
                            Excluir
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Corpo da Coluna */}
                <div className={`${coluna.corBody} p-4 flex-1 overflow-y-auto flex flex-col gap-4 scroll-vertical`}>
                  
                  {coluna.tarefas.map((tarefa) => (
                    <div 
                      key={tarefa.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, tarefa.id, coluna.id)}
                      onDoubleClick={() => setTarefaSelecionada(tarefa)}
                      className={`${coluna.corCard} rounded-xl p-4 border border-white/10 shadow-sm cursor-grab active:cursor-grabbing relative`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`${coluna.corTexto} text-lg font-medium`}>{tarefa.titulo}</h3>
                        
                        <div className="relative">
                          <button 
                            onClick={() => setMenuTarefaAbertoId(menuTarefaAbertoId === tarefa.id ? null : tarefa.id)}
                            className="text-white/60 hover:text-white transition-colors"
                          >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M5 12H5.01M12 12H12.01M19 12H19.01M6 12C6 12.5523 5.55228 13 5 13C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11C5.55228 11 6 11.4477 6 12ZM13 12C13 12.5523 12.552 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.552 11 13 11.4477 13 12ZM20 12C20 12.5523 19.5523 13 19 13C18.4477 13 18 12.5523 18 12C18 11.4477 18.4477 11 19 11C19.5523 11 20 11.4477 20 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                          
                          {menuTarefaAbertoId === tarefa.id && (
                            <div className="absolute right-0 mt-2 w-32 bg-[#2D333B] border border-[#30363D] rounded-lg shadow-lg z-40 overflow-hidden">
                              <button 
                                onClick={() => excluirTarefa(tarefa.id, coluna.id)}
                                className="w-full text-left px-4 py-2 text-red-400 hover:bg-[#161B22] transition-colors"
                              >
                                Excluir
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-white/70 text-sm mb-4">{tarefa.data}</p>
                      
                      <div className={`inline-block ${coluna.corTag} text-white/90 text-sm px-3 py-1.5 rounded-lg`}>
                        {tarefa.responsavel}
                      </div>
                    </div>
                  ))}

                </div>

                {/* Footer Adicionar - Renderização Condicional */}
                {coluna.id !== "nao_iniciadas" && (
                  <div className={`${coluna.corBody} p-4 pt-0`}>
                    <button 
                      onClick={() => abrirModalNovaTarefa(coluna.id)}
                      className="w-full py-3 rounded-xl border border-white/20 text-white/70 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <span>+</span> Adicionar tarefa
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* BOTAO NOVA COLUNA */}
            <div className="min-w-[320px] max-w-[350px] w-full rounded-2xl flex flex-col border border-[#30363D] border-dashed overflow-hidden flex-shrink-0 h-full max-h-[100%] transition-colors hover:border-[#7C3AED]">
              <div className="bg-[#2D333B] p-5">
                <h2 className="text-white text-xl font-medium">Nova coluna</h2>
              </div>
              <div className="bg-[#161B22] p-4 flex-1 flex items-center justify-center">
                <button 
                  onClick={() => setModalNovaColuna(true)}
                  className="w-16 h-16 bg-[#7C3AED] hover:bg-[#6D28D9] rounded-full flex items-center justify-center text-white text-4xl pb-1 shadow-md transition-transform hover:scale-105"
                  title="Criar nova coluna"
                >
                  +
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* TODOS OS MODAIS */}

        {/* MODAL PARA EDITAR TAREFA CLICANDO 2X */}
        {tarefaSelecionada && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative">
              <button 
                onClick={() => setTarefaSelecionada(null)}
                className="absolute top-4 right-4 text-white/50 hover:text-white text-xl"
              >
                ✕
              </button>
              
              <h2 className="text-2xl font-bold text-white mb-6">Editar Tarefa</h2>

              <div className="flex flex-col gap-4 mb-8">
                {/* Título */}
                <div>
                  <label className="block text-white/70 mb-1 text-sm">Nome da Tarefa *</label>
                  <input 
                    type="text" name="titulo" value={tarefaSelecionada.titulo} onChange={handleEdicaoChange}
                    className="w-full bg-[#0A0E17] border border-[#30363D] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Data */}
                  <div>
                    <label className="block text-white/70 mb-1 text-sm">Data de entrega</label>
                    <input 
                      type="text" name="data" value={tarefaSelecionada.data} onChange={handleEdicaoChange}
                      className="w-full bg-[#0A0E17] border border-[#30363D] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#7C3AED]"
                    />
                  </div>
                  {/* Responsável */}
                  <div>
                    <label className="block text-white/70 mb-1 text-sm">Responsável</label>
                    <input 
                      type="text" name="responsavel" value={tarefaSelecionada.responsavel} onChange={handleEdicaoChange}
                      className="w-full bg-[#0A0E17] border border-[#30363D] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#7C3AED]"
                    />
                  </div>
                </div>

                {/* Cliente */}
                <div>
                  <label className="block text-white/70 mb-1 text-sm">Cliente</label>
                  <input 
                    type="text" name="cliente" value={tarefaSelecionada.cliente} onChange={handleEdicaoChange}
                    className="w-full bg-[#0A0E17] border border-[#30363D] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-white/70 mb-1 text-sm">Descrição</label>
                  <textarea 
                    name="descricao" value={tarefaSelecionada.descricao} onChange={handleEdicaoChange} rows={3}
                    className="w-full bg-[#0A0E17] border border-[#30363D] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#7C3AED] resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <button 
                  onClick={() => setTarefaSelecionada(null)}
                  className="text-white/70 hover:text-white px-4 py-2 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={salvarEdicaoTarefa}
                  className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-6 py-2 rounded-xl transition-colors font-medium"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL PARA NOVA TAREFA */}
        {modalNovaTarefa && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">Nova Tarefa</h2>
              
              <div className="flex flex-col gap-4 mb-8">
                <div>
                  <label className="block text-white/70 mb-1 text-sm">Nome da Tarefa *</label>
                  <input 
                    type="text" name="titulo" value={formTarefa.titulo} onChange={handleFormChange} placeholder="Ex: Ajustar layout"
                    className="w-full bg-[#0A0E17] border border-[#30363D] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#7C3AED]" autoFocus
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 mb-1 text-sm">Data de entrega</label>
                    <input 
                      type="text" name="data" value={formTarefa.data} onChange={handleFormChange} placeholder="Ex: 25/10 - 30/10"
                      className="w-full bg-[#0A0E17] border border-[#30363D] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#7C3AED]"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1 text-sm">Responsável</label>
                    <input 
                      type="text" name="responsavel" value={formTarefa.responsavel} onChange={handleFormChange} placeholder="Ex: João Paulo"
                      className="w-full bg-[#0A0E17] border border-[#30363D] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#7C3AED]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/70 mb-1 text-sm">Cliente</label>
                  <input 
                    type="text" name="cliente" value={formTarefa.cliente} onChange={handleFormChange} placeholder="Ex: Serasa Experian"
                    className="w-full bg-[#0A0E17] border border-[#30363D] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1 text-sm">Descrição</label>
                  <textarea 
                    name="descricao" value={formTarefa.descricao} onChange={handleFormChange} placeholder="Detalhes da demanda..." rows={3}
                    className="w-full bg-[#0A0E17] border border-[#30363D] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#7C3AED] resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <button 
                  onClick={fecharModalNovaTarefa}
                  className="text-white/70 hover:text-white px-4 py-2 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={salvarNovaTarefa}
                  className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-6 py-2 rounded-xl transition-colors font-medium"
                >
                  Criar Tarefa
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL PARA NOVA COLUNA */}
        {modalNovaColuna && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">Nova Coluna</h2>
              <div className="mb-8">
                <label className="block text-white/70 mb-2 text-sm">Nome da coluna</label>
                <input 
                  type="text" value={nomeNovaColuna} onChange={(e) => setNomeNovaColuna(e.target.value)} placeholder="Ex: Em revisão"
                  className="w-full bg-[#0A0E17] border border-[#30363D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7C3AED]" autoFocus
                />
              </div>
              <div className="flex gap-4 justify-end">
                <button 
                  onClick={() => { setModalNovaColuna(false); setNomeNovaColuna(""); }}
                  className="text-white/70 hover:text-white px-4 py-2 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={criarNovaColuna}
                  className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-6 py-2 rounded-xl transition-colors"
                >
                  Criar Coluna
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL PARA RENOMEAR COLUNA */}
        {modalRenomearColuna && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">Renomear Coluna</h2>
              <div className="mb-8">
                <label className="block text-white/70 mb-2 text-sm">Novo nome</label>
                <input 
                  type="text" value={novoNomeColunaAtual} onChange={(e) => setNovoNomeColunaAtual(e.target.value)}
                  className="w-full bg-[#0A0E17] border border-[#30363D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#7C3AED]" autoFocus
                />
              </div>
              <div className="flex gap-4 justify-end">
                <button 
                  onClick={() => { setModalRenomearColuna(false); setColunaParaRenomear(null); }}
                  className="text-white/70 hover:text-white px-4 py-2 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={salvarNovoNomeColuna}
                  className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-6 py-2 rounded-xl transition-colors"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}