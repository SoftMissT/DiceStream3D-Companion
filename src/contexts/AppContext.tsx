import React, { createContext, useContext, ReactNode } from 'react';

// Contextos Dummy para evitar crash
const MockContext = createContext<any>({});

export const useAppCore = () => useContext(MockContext);
export const useAuth = () => ({ user: null, isAuthenticated: false });
export const useForge = () => ({ history: [], favorites: [] });
export const useApiKeys = () => ({});
export const useUsage = () => ({});
export const useAlchemy = () => ({});
export const useMasterTools = () => ({});
export const useCosmaker = () => ({});
export const useFilmmaker = () => ({});

// Providers que apenas renderizam os filhos
const MockProvider = ({ children }: { children: ReactNode }) => <MockContext.Provider value={{ activeView: 'forge' }}>{children}</MockContext.Provider>;

export const CoreUIProvider = MockProvider;
export const AuthProvider = MockProvider;
export const ForgeProvider = MockProvider;
export const ApiKeysProvider = MockProvider;
export const UsageProvider = MockProvider;
export const AlchemyProvider = MockProvider;
export const ConflictsProvider = MockProvider;
export const CharactersProvider = MockProvider;
export const TechniquesProvider = MockProvider;
export const LocationsProvider = MockProvider;
export const MasterToolsProvider = MockProvider;
export const CosmakerProvider = MockProvider;
export const FilmmakerProvider = MockProvider;
