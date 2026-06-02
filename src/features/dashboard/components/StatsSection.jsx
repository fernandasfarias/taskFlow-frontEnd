import React from "react";
import StatCard from "./StatCard";
import { HiChartPie, HiCheckCircle, HiFlag } from 'react-icons/hi';
import { FaRocket } from 'react-icons/fa';

export default function StatsSection({stats}){

    const data = stats || {total: 0, emAndamento: 0, concluidos: 0, aFazer: 0};
    
    const cards = [
      { title: 'Total de Projetos', value: data.total, icon: <FaRocket size={24} />, colorClass: 'bg-[#6366f1]' },
      { title: 'Em Andamento', value: data.emAndamento, icon: <HiChartPie size={24} />, colorClass: 'bg-[#2563eb]' },
      { title: 'Concluídos', value: data.concluidos, icon: <HiCheckCircle size={24} />, colorClass: 'bg-[#10b981]' },
      { title: 'A Fazer', value: data.aFazer, icon: <HiFlag size={24} />, colorClass: 'bg-[#d97706]' },
    ];

    return(
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {cards.map((card, index) => (
              <StatCard key={index} {...card} />
          ))}
      </div>
    );
}