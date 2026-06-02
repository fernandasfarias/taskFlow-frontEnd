import React from 'react';

export default function StatCard({ title, value, icon, colorClass }){
    return(
        
        <div className="bg-[#141b2d] border border-[#1e293b] p-5 rounded-2xl flex items-center gap-5 w-full"> 
            <div className={`p-3 rounded-xl text-white ${colorClass}`}>
                {icon}
            </div>
            <div>
                <p className="text-xs text-gray-400 font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
            </div>
        </div>
    )
}