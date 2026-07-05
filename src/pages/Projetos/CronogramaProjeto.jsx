import React, { useEffect, useRef } from "react";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import gantt from "dhtmlx-gantt";

export default function Cronograma() {
    const ganttRef = useRef(null);

    useEffect(() => {
        if (!ganttRef.current) return;

        gantt.config.date_format = "%Y-%m-%d";

        gantt.init(ganttRef.current);

        gantt.parse({
        data: [
            {
            id: 1,
            text: "Atividade 1",
            start_date: "2026-07-05",
            duration: 5,
            progress: 0.6,
            },
            {
            id: 2,
            text: "Tarefa 1",
            start_date: "2026-07-06",
            duration: 3,
            progress: 0.2,
            },
        ],
        });

        return () => {
        gantt.clearAll();
        };
    }, []);

    return (
        <div
        ref={ganttRef}
        style={{ width: "100%", height: "600px" }}
        />
    );
}