import React, { useState, useCallback, useEffect } from 'react';
// FIX: Updated import to use GoogleGenAI from @google/genai.
import { GoogleGenAI } from "@google/genai";
import { useCoreUI, useFilmmaker } from '../contexts/AppContext';
import { FiltersPanel } from './filmmaker/FiltersPanel';
import { ResultsPanel } from './filmmaker/ResultsPanel';
import type { SelectOption } from '../components/ui/Select';
import type { FilmmakerItem } from '../types';
import { VIDEO_ASPECT_RATIOS, VIDEO_RESOLUTIONS } from '../constants';

export interface FilmmakerFiltersState {
    prompt: string;
    aspectRatio: SelectOption | null;
    resolution: SelectOption | null;
}

const initialFiltersState: FilmmakerFiltersState = {
    prompt: '',
    aspectRatio: VIDEO_ASPECT_RATIOS[0],
    resolution: VIDEO_RESOLUTIONS[0],
};

const FilmmakerInterface: React.FC = () => {
    const { isLoading, setLoading, error, setError } = useCoreUI();
    const { history, setHistory, toggleFavorite } = useFilmmaker();
    const [filters, setFilters] = useState<FilmmakerFiltersState>(initialFiltersState);
    const [loadingMessage, setLoadingMessage] = useState('');

    const handleGenerate = useCallback(async () => {
        setLoading(true);
        setError(null);
        setLoadingMessage('Escrevendo a cena...');

        try {
            if (!process.env.API_KEY) {
                throw new Error("Nenhuma chave de API foi configurada.");
            }
            if (!filters.prompt || !filters.aspectRatio || !filters.resolution) {
                throw new Error("Por favor, insira um prompt e selecione a proporção e resolução.");
            }

            const fullPrompt = `
                Você é um diretor de cinema e roteirista.
                Sua tarefa é criar uma descrição textual detalhada de uma cena de vídeo para o universo de Kimetsu no Yaiba.

                - **Prompt da Cena:** ${filters.prompt}
                - **Proporção:** ${filters.aspectRatio.label}
                - **Resolução (Qualidade Visual):** ${filters.resolution.label}

                Descreva a cena em um parágrafo vívido, incluindo detalhes sobre a cinematografia, ângulos de câmera, iluminação, ação e a atmosfera geral. Pinte um quadro com palavras.
            `;
            
            // FIX: Updated API client initialization and usage to follow current @google/genai guidelines.
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

            // FIX: Refactored generateContent call to use the modern SDK structure and a recommended model.
            const result = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: fullPrompt,
                config: {
                    temperature: 0.8,
                }
            });

            // FIX: Used the .text accessor for a direct response.
            const textResponse = result.text;
            if (!textResponse) {
                throw new Error("A IA não retornou uma descrição de cena.");
            }
            
            const newItem: FilmmakerItem = {
                id: `filmmaker-${Date.now()}`,
                prompt: filters.prompt,
                description: textResponse,
                isFavorite: false,
            };
            setHistory(prev => [newItem, ...prev]);

        } catch (e: any) {
            console.error("Erro durante a geração de cena:", e);
            setError(e.message || 'Ocorreu um erro desconhecido ao gerar a descrição da cena.');
        } finally {
            setLoading(false);
            setLoadingMessage('');
        }
    }, [filters, setHistory, setLoading, setError]);
    
    return (
        <div className='flex-grow flex flex-col md:flex-row h-full overflow-hidden'>
            <FiltersPanel
                filters={filters}
                setFilters={setFilters}
                onGenerate={handleGenerate}
                isLoading={isLoading}
                onClear={() => setFilters(initialFiltersState)}
            />
            <ResultsPanel
                results={history}
                isLoading={isLoading}
                loadingMessage={loadingMessage}
                error={error}
                onRetry={handleGenerate}
                onToggleFavorite={toggleFavorite}
            />
        </div>
    );
};

export default FilmmakerInterface;