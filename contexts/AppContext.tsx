import React, { createContext, useContext, useState, useMemo, ReactNode, useCallback } from 'react';
import type { 
  View, 
  CharacterItem, 
  TechniqueItem, 
  LocationItem, 
  ConflictItem, 
  MasterToolItem, 
  AlchemistItem, 
  CosmakerItem, 
  FilmmakerItem, 
  User, 
  ForgeItem, 
  FilterState, 
  GuerraDeClasItem,
  BaseItem
} from '../types';
import { INITIAL_FILTER_STATE } from '../constants';

// --- CoreUI Context ---
interface CoreUIContextType {
  activeView: View;
  setActiveView: (view: View) => void;
  selectedItem: any | null;
  isDetailModalOpen: boolean;
  openDetailModal: (item: any) => void;
  closeDetailModal: () => void;
  isAboutModalOpen: boolean;
  openAboutModal: () => void;
  closeAboutModal: () => void;
  isApiKeysModalOpen: boolean;
  openApiKeysModal: () => void;
  closeApiKeysModal: () => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  themeClass: string;
}

const CoreUIContext = createContext<CoreUIContextType | undefined>(undefined);

export function CoreUIProvider({ children }: { children: ReactNode }) {
  const [activeView, setActiveView] = useState<View>('forge');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [isAboutModalOpen, setAboutModalOpen] = useState(false);
  const [isApiKeysModalOpen, setApiKeysModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openDetailModal = useCallback((item: any) => {
    setSelectedItem(item);
    setDetailModalOpen(true);
  }, []);
  
  const closeDetailModal = useCallback(() => {
    setDetailModalOpen(false);
    setSelectedItem(null);
  }, []);
  
  const openAboutModal = useCallback(() => setAboutModalOpen(true), []);
  const closeAboutModal = useCallback(() => setAboutModalOpen(false), []);
  const openApiKeysModal = useCallback(() => setApiKeysModalOpen(true), []);
  const closeApiKeysModal = useCallback(() => setApiKeysModalOpen(false), []);

  const value = useMemo(() => ({
    activeView,
    setActiveView,
    selectedItem,
    isDetailModalOpen,
    openDetailModal,
    closeDetailModal,
    isAboutModalOpen,
    openAboutModal,
    closeAboutModal,
    isApiKeysModalOpen,
    openApiKeysModal,
    closeApiKeysModal,
    isLoading,
    setLoading,
    error,
    setError,
    themeClass: `view-${activeView}`,
  }), [
    activeView, 
    selectedItem, 
    isDetailModalOpen, 
    isAboutModalOpen, 
    isApiKeysModalOpen, 
    isLoading, 
    error, 
    openDetailModal, 
    closeDetailModal, 
    openAboutModal, 
    closeAboutModal, 
    openApiKeysModal, 
    closeApiKeysModal
  ]);

  return <CoreUIContext.Provider value={value}>{children}</CoreUIContext.Provider>;
}

export function useCoreUI() {
  const context = useContext(CoreUIContext);
  if (!context) {
    throw new Error('useCoreUI must be used within a CoreUIProvider');
  }
  return context;
}

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  handleLoginClick: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: 'mockuser_123',
    username: 'Tanjiro Kamado',
    avatar: 'https://i.imgur.com/L5z2dgE.png'
  });
  const [authLoading] = useState(false);
  const isAuthenticated = !!user;

  const handleLoginClick = useCallback(() => {
    console.log('Login clicked - implement Discord OAuth here');
    // Implementar lógica de login Discord aqui
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    console.log('User logged out');
  }, []);

  const value = useMemo(() => ({ 
    user, 
    isAuthenticated, 
    authLoading, 
    handleLoginClick, 
    logout 
  }), [user, isAuthenticated, authLoading, handleLoginClick, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// --- ApiKeys Context ---
interface ApiKeysContextType {
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  openaiApiKey: string;
  setOpenaiApiKey: (key: string) => void;
  deepseekApiKey: string;
  setDeepseekApiKey: (key: string) => void;
  saveKeys: () => Promise<void>;
}

const ApiKeysContext = createContext<ApiKeysContextType | undefined>(undefined);

export function ApiKeysProvider({ children }: { children: ReactNode }) {
  // Carregar keys do localStorage
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('gemini_api_key') || '';
    }
    return '';
  });
  
  const [openaiApiKey, setOpenaiApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('openai_api_key') || '';
    }
    return '';
  });
  
  const [deepseekApiKey, setDeepseekApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('deepseek_api_key') || '';
    }
    return '';
  });

  const saveKeys = useCallback(async () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gemini_api_key', geminiApiKey);
      localStorage.setItem('openai_api_key', openaiApiKey);
      localStorage.setItem('deepseek_api_key', deepseekApiKey);
      console.log('API keys saved to localStorage');
    }
  }, [geminiApiKey, openaiApiKey, deepseekApiKey]);
  
  const value = useMemo(() => ({ 
    geminiApiKey, 
    setGeminiApiKey,
    openaiApiKey, 
    setOpenaiApiKey,
    deepseekApiKey, 
    setDeepseekApiKey,
    saveKeys,
  }), [geminiApiKey, openaiApiKey, deepseekApiKey, saveKeys]);

  return <ApiKeysContext.Provider value={value}>{children}</ApiKeysContext.Provider>;
}

export function useApiKeys() {
  const context = useContext(ApiKeysContext);
  if (!context) {
    throw new Error('useApiKeys must be used within an ApiKeysProvider');
  }
  return context;
}

// --- Generic Context Factory ---
function createItemContext<T extends BaseItem>(contextName: string) {
  interface ItemContextType {
    history: T[];
    setHistory: React.Dispatch<React.SetStateAction<T[]>>;
    favorites: T[];
    toggleFavorite: (item: T) => void;
  }

  const ItemContext = createContext<ItemContextType | undefined>(undefined);

  function Provider({ children }: { children: ReactNode }) {
    const [history, setHistory] = useState<T[]>([]);
    const [favorites, setFavorites] = useState<T[]>([]);

    const toggleFavorite = useCallback((itemToToggle: T) => {
      setFavorites(prev => {
        const isFavorite = prev.some(item => item.id === itemToToggle.id);
        if (isFavorite) {
          return prev.filter(item => item.id !== itemToToggle.id);
        } else {
          return [...prev, { ...itemToToggle, isFavorite: true }];
        }
      });
      setHistory(prev => prev.map(item => 
        item.id === itemToToggle.id ? { ...item, isFavorite: !item.isFavorite } : item
      ));
    }, []);

    const value = useMemo(() => ({ 
      history, 
      setHistory,
      favorites, 
      toggleFavorite,
    }), [history, favorites, toggleFavorite]);
    
    return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>;
  }

  function useItem() {
    const context = useContext(ItemContext);
    if (!context) {
      throw new Error(`useItem must be used within a ${contextName}Provider`);
    }
    return context;
  }

  return { Provider, useItem };
}

// --- Create all contexts ---
const ForgeContext = createItemContext<ForgeItem>('Forge');
export const ForgeProvider = ForgeContext.Provider;
export const useForge = ForgeContext.useItem;

const ConflictsContext = createItemContext<ConflictItem>('Conflicts');
export const ConflictsProvider = ConflictsContext.Provider;
export const useConflicts = ConflictsContext.useItem;

const GuerraDeClasContext = createItemContext<GuerraDeClasItem>('GuerraDeClas');
export const GuerraDeClasProvider = GuerraDeClasContext.Provider;
export const useGuerraDeClas = GuerraDeClasContext.useItem;

const CharactersContext = createItemContext<CharacterItem>('Characters');
export const CharactersProvider = CharactersContext.Provider;
export const useCharacters = CharactersContext.useItem;

const TechniquesContext = createItemContext<TechniqueItem>('Techniques');
export const TechniquesProvider = TechniquesContext.Provider;
export const useTechniques = TechniquesContext.useItem;

const LocationsContext = createItemContext<LocationItem>('Locations');
export const LocationsProvider = LocationsContext.Provider;
export const useLocations = LocationsContext.useItem;

const MasterToolsContext = createItemContext<MasterToolItem>('MasterTools');
export const MasterToolsProvider = MasterToolsContext.Provider;
export const useMasterTools = MasterToolsContext.useItem;

const AlchemyContext = createItemContext<AlchemistItem>('Alchemy');
export const AlchemyProvider = AlchemyContext.Provider;
export const useAlchemy = AlchemyContext.useItem;

const CosmakerContext = createItemContext<CosmakerItem>('Cosmaker');
export const CosmakerProvider = CosmakerContext.Provider;
export const useCosmaker = CosmakerContext.useItem;

const FilmmakerContext = createItemContext<FilmmakerItem>('Filmmaker');
export const FilmmakerProvider = FilmmakerContext.Provider;
export const useFilmmaker = FilmmakerContext.useItem;

// --- Usage Context ---
interface UsageContextType {
  dailyUsage: number;
  usageLimit: number;
  isLimitReached: boolean;
  incrementUsage: () => void;
}

const UsageContext = createContext<UsageContextType | undefined>(undefined);

export function UsageProvider({ children }: { children: ReactNode }) {
  const [dailyUsage, setDailyUsage] = useState(0);
  const usageLimit = 100;
  const isLimitReached = dailyUsage >= usageLimit;
  
  const incrementUsage = useCallback(() => setDailyUsage(c => c + 1), []);
  
  const value = useMemo(() => ({ 
    dailyUsage, 
    usageLimit, 
    isLimitReached, 
    incrementUsage 
  }), [dailyUsage, usageLimit, isLimitReached, incrementUsage]);
  
  return <UsageContext.Provider value={value}>{children}</UsageContext.Provider>;
}

export function useUsage() {
  const context = useContext(UsageContext);
  if (!context) {
    throw new Error('useUsage must be used within a UsageProvider');
  }
  return context;
}

// --- AppProvider (Composer) ---
export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <CoreUIProvider>
      <AuthProvider>
        <ApiKeysProvider>
          <ForgeProvider>
            <ConflictsProvider>
              <GuerraDeClasProvider>
                <CharactersProvider>
                  <TechniquesProvider>
                    <LocationsProvider>
                      <MasterToolsProvider>
                        <AlchemyProvider>
                          <CosmakerProvider>
                            <FilmmakerProvider>
                              <UsageProvider>
                                {children}
                              </UsageProvider>
                            </FilmmakerProvider>
                          </CosmakerProvider>
                        </AlchemyProvider>
                      </MasterToolsProvider>
                    </LocationsProvider>
                  </TechniquesProvider>
                </CharactersProvider>
              </GuerraDeClasProvider>
            </ConflictsProvider>
          </ForgeProvider>
        </ApiKeysProvider>
      </AuthProvider>
    </CoreUIProvider>
  );
}