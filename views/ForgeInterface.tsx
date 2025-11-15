import React, { useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useCoreUI, useForge } from '../contexts/AppContext';
import type { ForgeItem, FilterState } from '../types';
import { FilterPanel } from '../../components/FilterPanel';
import { ResultsPanel } from './forge/ResultsPanel';
import { INITIAL_FILTER_STATE } from '../../constants';
// FIX: Added interface export to fix error in unused views/forge/FiltersPanel.tsx
import type { SelectOption } from '../../components/ui/Select';

export interface ForgeState {
  prompt: string;
  category: SelectOption | null;
  detailLevel: SelectOption | null;
  creativity: number;
  keywords: string;
  styles: SelectOption[];
  includeCanon: boolean;
}

const ForgeInterface: React.FC = () => {
    const { isLoading, setLoading, error, setError, openDetailModal } = useCoreUI();
    const { history, setHistory, toggleFavorite, filters, setFilters } = useForge();

    const handleFilterChange = useCallback(<K extends keyof FilterState>(field: K, value: FilterState[K]) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    }, [setFilters]);
    
    const handleForge = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            if (!process.env.API_KEY) {
                throw new Error("A chave de API do Google Gemini não foi configurada.");
            }
            if (!filters.promptModifier) {
                 throw new Error("Por favor, descreva sua ideia no Modificador de Prompt.");
            }

            const fullPrompt = `
              Você é um mestre contador de histórias e especialista no universo de Kimetsu no Yaiba.
              Sua tarefa é gerar uma nova ideia criativa com base nos seguintes parâmetros:
    
              - **Categoria:** ${filters.category}
              - **Raridade:** ${filters.rarity}
              - **Nível Sugerido:** ${filters.level}
              - **Temática(s):** ${filters.thematics.join(', ') || 'Nenhuma'}
              - **Inspiração Cultural:** ${filters.country} / ${filters.era}
              - **Tonalidade:** ${filters.tonalidade}
              - **Instrução Adicional:** ${filters.promptModifier}
    
              Gere uma resposta criativa e bem estruturada em formato JSON com um título ("title") e uma descrição ("description").
            `;
            
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
            
            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: 'Um título criativo e curto para a ideia gerada, em português.' },
                    description: { type: Type.STRING, description: `Uma descrição detalhada da ideia gerada em português.` }
                },
                required: ['title', 'description']
            };

            const result = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: fullPrompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                    temperature: 0.8,
                }
            });

            const textResponse = result.text;
            let parsedResponse: { title: string; description: string; };

            try {
                parsedResponse = JSON.parse(textResponse);
            } catch (jsonError) {
                 console.error("Falha ao analisar a resposta JSON:", textResponse);
                 throw new Error("A IA retornou uma resposta em um formato inesperado. Tente refinar seu prompt.");
            }

            if (!parsedResponse.title || !parsedResponse.description) {
                throw new Error("A resposta da IA está incompleta. Faltam o título ou a descrição.");
            }

            const newItem: ForgeItem = {
                id: `item-${Date.now()}`,
                name: parsedResponse.title,
                content: parsedResponse.description,
                isFavorite: false,
            };
            setHistory(prev => [newItem, ...prev]);

        } catch (e: any) {
            console.error("Erro durante a forja:", e);
            setError(e.message || 'Ocorreu um erro desconhecido ao se comunicar com a IA.');
        } finally {
            setLoading(false);
        }
    }, [filters, setHistory, setLoading, setError]);

    const handleViewDetails = (item: ForgeItem) => {
        openDetailModal(item);
    };
    
    return (
        <div className='flex-grow flex flex-col md:flex-row h-full overflow-hidden'>
            <aside className="w-full md:w-1/3 lg:w-1/4 h-full flex flex-col bg-bg-secondary border-r border-border-color overflow-y-auto">
                <FilterPanel 
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onGenerate={handleForge}
                    isLoading={isLoading}
                    onReset={() => setFilters(INITIAL_FILTER_STATE)}
                    allowedCategories={['Arma', 'Acessório', 'Caçador', 'Inimigo/Oni', 'Kekkijutsu', 'Respiração', 'Missões', 'NPC', 'Evento', 'Local/Cenário', 'Mitologia', 'História Antiga', 'Guerra de Clãs']}
                />
            </aside>
            <ResultsPanel
                results={history}
                isLoading={isLoading}
                error={error}
                onRetry={handleForge}
                onViewDetails={handleViewDetails}
                onToggleFavorite={toggleFavorite}
            />
        </div>
    );
};

export default ForgeInterface;
