import React from 'react';
import { AnvilIcon, StarIcon, TrashIcon } from './icons';

export const ResultsPanel = ({ history, favorites, onToggleFavorite, isLoading }: any) => {
  if (isLoading) return <div className="flex-1 flex items-center justify-center text-white animate-pulse">Forjando...</div>;
  
  if (history.length === 0) return (
    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
      <AnvilIcon className="w-16 h-16 mb-4 opacity-20"/>
      <p>A forja aguarda seu comando.</p>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 content-start">
      {history.map((item: any) => (
        <div key={item.id} className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 hover:border-blue-500/50 transition-colors group relative">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] uppercase text-blue-400 font-bold tracking-wider">{item.categoria}</span>
            <button onClick={() => onToggleFavorite(item)} className={item.is_favorite ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400'}>
              <StarIcon className="w-4 h-4" filled={item.is_favorite}/>
            </button>
          </div>
          <h3 className="text-white font-bold text-lg mb-2">{item.nome}</h3>
          <p className="text-gray-400 text-sm line-clamp-3">{item.descricao}</p>
        </div>
      ))}
    </div>
  );
};
