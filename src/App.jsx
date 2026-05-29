import React from 'react';
import Sidebar from './features/dashboard/components/Sidebar';

export default function App() {
  return (
    
    <div className="flex h-screen w-screen bg-[#090d16] overflow-hidden">
      
      
      <Sidebar />

      {/* Espaço em branco temporário */}
      <div className="flex-1 p-8 text-gray-500 font-sans">
        O conteúdo do Dashboard vai aparecer aqui depois.
      </div>

    </div>
  );
}
