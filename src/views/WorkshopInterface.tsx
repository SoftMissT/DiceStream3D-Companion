import React, { useState, useCallback, useEffect } from 'react';
import { useForge, useAppCore, useAuth } from '../contexts/AppContext';
import { orchestrateGeneration } from '../lib/client/orchestrationService';
import { FilterPanel } from '../components/FilterPanel';
import { ResultsPanel } from '../components/ResultsPanel';
import { INITIAL_FILTER_STATE } from '../constants';

export const WorkshopInterface = ({ initialCategory = 'Arma' }: any) => {
  const { filters, handleFilterChange, history, addHistoryItem, favorites, toggleFavorite, setFavorites } = useForge();
  const [loading, setLoading] = useState(false);
  
  // Estado local para filtros se não estiver usando contexto global complexo ainda
  const [localFilters, setLocalFilters] = useState({ ...INITIAL_FILTER_STATE, category: initialCategory });

  const onFilterChange = (key: string, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const newItem = await orchestrateGeneration(localFilters, localFilters.promptModifier);
      // Adiciona ao histórico (simulação de contexto)
      if (addHistoryItem) addHistoryItem(newItem); 
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Fallback para usar estado local se o contexto estiver vazio
  const displayHistory = history || [];

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      <aside className="w-80 flex-shrink-0 z-10">
        <FilterPanel 
          filters={localFilters} 
          onFilterChange={onFilterChange}
          onGenerate={handleGenerate}
          isLoading={loading}
          onReset={() => setLocalFilters({ ...INITIAL_FILTER_STATE, category: initialCategory })}
        />
      </aside>
      <main className="flex-1 bg-[#050505] relative">
        <ResultsPanel 
          history={displayHistory}
          favorites={favorites || []}
          onToggleFavorite={toggleFavorite}
          isLoading={loading}
        />
      </main>
    </div>
  );
};
