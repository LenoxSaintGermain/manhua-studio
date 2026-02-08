
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export type Role = 'Protagonist' | 'Ally' | 'Rival' | 'Antagonist' | 'Supporting';
export type ArcTemplate = "Hero's Journey" | "Rivalry Ladder" | "Tournament Arc" | "Heist Arc" | "Mystery Arc" | "Romance Arc";
export type Pace = 'Slow Burn' | 'Balanced' | 'Hypercut';
export type CutPack = 'Manhua Modern' | 'Wuxia Ink' | 'Neon Cyber' | 'Grit Realism' | 'Soft Romance';

export type IssueStatus = 'Blueprint' | 'Scripted' | 'Boarded' | 'Shot' | 'Published';

export interface CastMember {
  id: string;
  name: string;
  role: Role;
  archetype: string;
  appearance: string;
  base64?: string;
  isGenerating?: boolean;
  canonLocked: boolean;
  outfitCount: number;
  expressionCount: number;
  traits: string[];
}

export interface StyleBible {
  cutPack: CutPack;
  mood: string;
  canonLock: 'Strict' | 'Flexible';
}

export interface Frame {
  id: string;
  camera: string;
  dialogue?: string;
  caption?: string;
  beatDescription: string;
  plateUrl?: string;
  isLoading: boolean;
  emphasis?: 'Face' | 'Hands' | 'Environment' | 'Impact';
  motion?: 'Still' | 'Kinetic';
}

export interface Beat {
  id: string;
  summary: string;
  frames: Frame[];
  stakes: 'Personal' | 'Local' | 'World';
  energy: 'Calm' | 'Tense' | 'Explosive';
}

export interface Issue {
  id: string;
  title: string;
  summary: string;
  beats: Beat[];
  status: IssueStatus;
}

export interface ShowrunnerSeries {
  title: string;
  cast: CastMember[];
  style: StyleBible;
  story: {
    arc: ArcTemplate;
    pace: Pace;
    issues: Issue[];
  };
  language: string;
}

// Added ComicFace interface for Book and Panel components to fix import errors
export interface ComicFace {
  pageIndex?: number;
  type: 'cover' | 'story' | 'back_cover';
  imageUrl?: string;
  isLoading: boolean;
  isDecisionPage?: boolean;
  choices: string[];
  resolvedChoice?: string;
}

// Added Persona interface for character data in Setup component to fix import error
export interface Persona {
  base64: string;
}

// Pagination and configuration constants required by Book, Panel and Setup components
export const TOTAL_PAGES = 10;
export const INITIAL_PAGES = 6;
export const GATE_PAGE = 1;
export const GENRES = ['Superhero', 'Sci-Fi', 'Fantasy', 'Noir', 'Horror', 'Custom'];

export const LANGUAGES = [
    { code: 'en-US', name: 'English' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'zh-CN', name: 'Chinese' },
    { code: 'ko-KR', name: 'Korean' },
    { code: 'fr-FR', name: 'French' },
    { code: 'es-MX', name: 'Spanish' }
];

export const CUT_PACKS: CutPack[] = ['Manhua Modern', 'Wuxia Ink', 'Neon Cyber', 'Grit Realism', 'Soft Romance'];
export const ARCS: ArcTemplate[] = ["Hero's Journey", "Rivalry Ladder", "Tournament Arc", "Heist Arc", "Mystery Arc", "Romance Arc"];
