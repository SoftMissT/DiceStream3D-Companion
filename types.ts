// FIX: Import FC type from 'react' to resolve "Cannot find namespace 'JSX'" error.
import type { FC } from 'react';

// NEW: Base interface for all generated items.
export interface BaseItem {
  id: string;
  isFavorite?: boolean;
}

export type View =
  | 'forge'
  | 'conflicts'
  | 'characters'
  | 'techniques'
  | 'locations'
  | 'master_tools'
  | 'alchemist'
  | 'cosmaker'
  | 'filmmaker';

export interface ViewItem {
  id: View;
  label: string;
  icon: FC<{ className?: string }>;
}

export type ConflictItem = BaseItem & {
  name: string;
  synopsis: string;
  scale: string;
  missionType: string;
  factionsInvolved: string;
};

export type CharacterItem = BaseItem & {
  name: string;
  affiliation: string;
  rank: string;
  appearance: string;
  personality: string;
  backstory: string;
  abilities: string;
};

export type TechniqueItem = BaseItem & {
  name: string;
  type: string;
  baseElement: string;
  description: string;
};

export type LocationItem = BaseItem & {
  name: string;
  biome: string;
  atmosphere: string;
  description: string;
  pointsOfInterest: string;
};

export type MasterToolItem = BaseItem & {
  content: string;
  toolType: string;
};

export type AlchemistItem = BaseItem & {
  response: string;
  prompt: string;
  parameters: { [key: string]: any };
};

export type CosmakerItem = BaseItem & {
  prompt: string;
  imageUrl: string; // Base64 data URL
};

export type FilmmakerItem = BaseItem & {
  prompt: string;
  description: string;
};

// NEW: Type for Guerra de Clãs
export type GuerraDeClasItem = BaseItem & {
  title: string;
  summary: string;
  outcome: string;
  keyEvents: string;
};


// Types for Auth and API Keys
export type User = {
  id: string;
  username: string; // Changed from 'name' for consistency with session
  avatar: string;
};

export type ApiKey = {
  id: string;
  key: string;
  name: string;
};

// Type for the main "Forge" view
export type ForgeItem = BaseItem & {
  name: string;
  content: string;
};

// NEW: Unified types for the new FilterPanel
export type Category =
  | 'Arma'
  | 'Acessório'
  | 'Caçador'
  | 'Inimigo/Oni'
  | 'Kekkijutsu'
  | 'Respiração'
  | 'Missões'
  | 'NPC'
  | 'Evento'
  | 'Local/Cenário'
  | 'Mitologia'
  | 'História Antiga'
  | 'Guerra de Clãs';

export type Rarity = 'Comum' | 'Incomum' | 'Rara' | 'Épica' | 'Lendária';
export type Tematica = string;

export interface FilterState {
  category: Category;
  rarity: Rarity | 'Aleatória';
  level: number;
  quantity: number;
  promptModifier: string;
  thematics: Tematica[];
  country: string;
  era: string;
  tonalidade: string;
  weaponType?: string;
  metal?: string;
  bladeColor?: string;
  hunterClass?: string;
  hunterOrigin?: string;
  breathingStyle?: string;
  specialAbility?: string;
  fightingStyle?: string;
  profession?: string;
  kekkijutsuInspiration?: string;
  oniOrigin?: string;
  oniClass?: string;
  missionType?: string;
  terrainType?: string;
  eventType?: string;
  attackingClan?: string;
  defendingClan?: string;
  armySize?: number;
  battleTerrain?: string;
  battleStrategy?: string;
}