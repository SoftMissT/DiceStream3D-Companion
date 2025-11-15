



import React, { useState, useCallback } from 'react';
// FIX: Updated import to use GoogleGenAI and Modality from @google/genai.
import { GoogleGenAI, Modality } from "@google/genai";
import { useCoreUI } from '../contexts/AppContext';
import { useCosmaker } from '../contexts/AppContext';
import { FiltersPanel } from './cosmaker/FiltersPanel';
import { ResultsPanel } from './cosmaker/ResultsPanel';
import type { SelectOption } from '../components/ui/Select';
import type { CosmakerItem } from '../types';
import { COSMAKER_CHARACTER_TYPES, COSMAKER_ART_STYLES } from '../constants';

export interface CosmakerFiltersState {
    prompt: string;
    characterType: SelectOption | null;
    artStyle: SelectOption | null;
    colors: SelectOption[];
    materials: SelectOption[];
}

const initialFiltersState: CosmakerFiltersState = {
    prompt: '',
    characterType: COSMAKER_CHARACTER_TYPES[0],
    artStyle: COSMAKER_ART_STYLES[0],
    colors: [],
    materials: [],
};

const CosmakerInterface: React.FC = () => {
    const { isLoading, setLoading, error, setError } = useCoreUI();
    const { history, setHistory, toggleFavorite } = useCosmaker();
    const [filters, setFilters] = useState<CosmakerFiltersState>(initialFiltersState);

    const handleGenerate = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            if (!process.env.API_KEY) {
                throw new Error("A chave de API do Google Gemini não foi configurada.");
            }
            if (!filters.prompt || !filters.artStyle) {
                throw new Error("Por favor, descreva o conceito do personagem e selecione um estilo de arte.");
            }

            const colorText = filters.colors.length > 0 ? `com uma paleta de cores principal de ${filters.colors.map(c => c.label).join(', ')}` : '';
            const materialText = filters.materials.length > 0 ? `usando materiais como ${filters.materials.map(m => m.label).join(', ')}` : '';

            const fullPrompt = `
                Crie um conceito de arte de um personagem do universo de Kimetsu no Yaiba no estilo "${filters.artStyle.label}".
                
                **Descrição do Personagem:** ${filters.prompt}
                **Tipo de Personagem:** ${filters.characterType?.label || 'Não especificado'}
                ${colorText}
                ${materialText}

                Foque nos detalhes do traje, acessórios e na aparência geral para criar uma imagem visualmente rica e coesa.
            `;

            // FIX: Updated API client initialization and usage for image generation.
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // FIX: Corrected the API call to use 'gemini-2.5-flash-image' and 'responseModalities' for proper image generation.
            const result = await ai.models.generateContent({
              model: 'gemini-2.5-flash-image',
              contents: {
                parts: [
                  {
                    text: fullPrompt,
                  },
                ],
              },
              config: {
                  responseModalities: [Modality.IMAGE],
              },
            });

            const imagePart = result.candidates?.[0]?.content?.parts?.find(
                (part: any) => part.inlineData && part.inlineData.mimeType.startsWith('image/')
            );

            if (imagePart && imagePart.inlineData) {
                const base64ImageBytes: string = imagePart.inlineData.data;
                const mimeType: string = imagePart.inlineData.mimeType;
                const imageUrl = `data:${mimeType};base64,${base64ImageBytes}`;
                
                const newItem: CosmakerItem = {
                    id: `cosmaker-${Date.now()}`,
                    prompt: fullPrompt,
                    imageUrl,
                    isFavorite: false,
                };
                setHistory(prev => [newItem, ...prev]);
            } else {
                console.error("API response did not contain a valid image part:", result);
                throw new Error("A IA não retornou uma imagem válida. Tente refinar seu prompt ou tente novamente mais tarde.");
            }

        } catch (e: any) {
            console.error("Erro durante a geração de imagem:", e);
            setError(e.message || 'Ocorreu um erro desconhecido ao se comunicar com a IA.');
        } finally {
            setLoading(false);
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
                error={error}
                onRetry={handleGenerate}
                onToggleFavorite={toggleFavorite}
            />
        </div>
    );
};

export default CosmakerInterface;