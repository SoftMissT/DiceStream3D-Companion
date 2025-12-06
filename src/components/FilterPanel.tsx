import React from 'react';
import { Button } from './ui/Button';
import { CollapsibleSection } from './ui/CollapsibleSection';
import { SearchableSelect } from './ui/SearchableSelect';
import { FilterIcon, RefreshIcon, AnvilIcon } from './icons';
import { CATEGORIES, RARITIES, WEAPON_OPTIONS } from '../constants';

export const FilterPanel = ({ filters, onFilterChange, onGenerate, onReset, isLoading }: any) => {
  return (
    <div className="bg-[#111] border-r border-white/10 h-full flex flex-col">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-2 text-white font-bold"><FilterIcon className="w-5 h-5"/> Configurar</div>
        <button onClick={onReset} className="text-gray-500 hover:text-white"><RefreshIcon className="w-4 h-4"/></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <CollapsibleSection title="Principal" defaultOpen>
           <SearchableSelect label="Categoria" options={CATEGORIES} value={filters.category} onChange={(v: any) => onFilterChange('category', v)} />
           <SearchableSelect label="Raridade" options={RARITIES.map(r => ({value: r, label: r}))} value={filters.rarity} onChange={(v: any) => onFilterChange('rarity', v)} />
        </CollapsibleSection>
        <CollapsibleSection title="Detalhes" defaultOpen>
           <div className="space-y-2">
             <label className="text-xs text-gray-400">Prompt Extra</label>
             <textarea 
                className="w-full bg-black/20 border border-white/10 rounded p-2 text-white text-sm" 
                rows={4} 
                placeholder="Ex: Detalhes dourados, aura sombria..."
                value={filters.promptModifier}
                onChange={(e) => onFilterChange('promptModifier', e.target.value)}
             />
           </div>
        </CollapsibleSection>
      </div>
      <div className="p-4 border-t border-white/10">
        <Button onClick={onGenerate} isLoading={isLoading} className="w-full btn-forge py-3">
          <AnvilIcon className="w-5 h-5"/> Forjar Lenda
        </Button>
      </div>
    </div>
  );
};
