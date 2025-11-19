export interface VocabularyItem {
  id: string;
  english: string;
  definition: string; // Simple English definition
  emoji: string;
  isPlural: boolean; // Critical for Apple vs Apples visualization
  simpleSentence: string;
  audioBase64?: string; // Cached audio
}

export type GameMode = 'DASHBOARD' | 'MENU' | 'FLASHCARDS' | 'QUIZ' | 'MEMORY' | 'BUBBLE_POP' | 'SHADOW_MATCH' | 'STICKER_WORLD' | 'FEED_MONSTER';

export interface LessonPlan {
  topic: string;
  items: VocabularyItem[];
}

export enum LoadingState {
  IDLE,
  GENERATING_PLAN,
  GENERATING_AUDIO,
  READY,
  ERROR
}