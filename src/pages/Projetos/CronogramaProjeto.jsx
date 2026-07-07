import React, { useEffect, useRef, useState } from "react";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import "../../styles/gantt-theme.css";
import gantt from "dhtmlx-gantt";

import { listarAtividadesProjeto } from "../../services/atividadeService";
import { listarTarefasAtividade } from "../../services/tarefaService";

import { ArrowLeft, CalendarDays } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function CronogramaProjeto() {
    const ganttRef = useRef(null);
    const navigate = useNavigate();

    const { id } = useParams();
    console.log("id do projeto:", id);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                if (!id) return;

                setLoading(true);

                const atividades = await listarAtividadesProjeto(id);

                const tasks = [];

                const isMobile = window.innerWidth < 768;

                if (isMobile){
                    gantt.config.show_grid = false;
                }

                gantt.config.bar_height = isMobile ? 18 : 28;
                gantt.config.row_height = isMobile ? 30 : 40;
                gantt.config.scale_height = 50;
                gantt.config.start_date = null;
                gantt.config.end_date = null;

                for (const atividade of atividades) {
                    const tarefas = await listarTarefasAtividade(
                        atividade.idAtividade
                    );

                    const atividadeId = `atividade-${atividade.idAtividade}`;

                    // atividade pai
                    tasks.push({
                        id: atividadeId,
                        text: `${atividade.nomeAtividade}`,
                        start_date:
                            atividade.dataInicio || new Date(),
                        duration: 1,
                        type: "project",
                        open: true,
                    });

                    // tarefas filhas
                    tarefas.forEach((tarefa) => {
                        tasks.push({
                            id: tarefa.idTarefa,
                            text: `└─ ${tarefa.nomeTarefa}`,
                            start_date: tarefa.dataInicio,
                            duration: calcularDuracao(
                                tarefa.dataInicio,
                                tarefa.dataEntrega
                            ),
                            parent: atividadeId,
                            progress:
                                tarefa.statusTarefa === "CONCLUIDA"
                                    ? 1
                                    : tarefa.statusTarefa === "EM_ANDAMENTO"
                                    ? 0.5
                                    : 0,
                        });
                    });
                }

                gantt.config.date_format = "%Y-%m-%d";

                gantt.clearAll();
                gantt.init(ganttRef.current);
                gantt.parse({ data: tasks });

            } catch (err) {
                console.error("Erro ao carregar cronograma:", err);
            } finally {
                setLoading(false);
            }
        }

        load();

        return () => {
            gantt.clearAll();
        };
    }, [id]);

    function calcularDuracao(start, end) {
        const diff = new Date(end) - new Date(start);
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    return (
        <div className="min-h-screen bg-[#0E1525] px-10 py-8 text-white">

            {/* HEADER */}
            <div className="flex items-center gap-4 mb-8">

                {/* botão voltar */}
                <button
                    onClick={() => navigate(`/projetos/${id}`)}
                    className="w-11 h-11 rounded-xl bg-[#141B2D] hover:bg-[#1B2436] transition flex items-center justify-center"
                >
                    <ArrowLeft size={22} />
                </button>

                {/* título */}
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <CalendarDays className="text-[#7B3FF2]" />
                        Cronograma
                    </h1>

                    <p className="text-slate-400 mt-1">
                        Planejamento das atividades, tarefas e milestones do projeto.
                    </p>
                </div>
            </div>

            {/* card do gantt */}
            <div className="bg-[#0B1220] rounded-2xl sm:rounded-[28px] border border-[#1F2937]/60 p-3 sm:p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] min-h-[500px] sm:min-h-[650px]">

                {loading ? (
                    <div className="text-slate-400 text-center py-20">
                        Carregando o cronograma...
                    </div>
                ) : (
                    <div
                        ref={ganttRef}
                        className="w-full overflow-x-auto h-[400px] sm:h-[600px] touch-pan-x"
                    />
                )}

            </div>
        </div>
    );
}