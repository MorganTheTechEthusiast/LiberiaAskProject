
export interface SearchSource {
  title: string;
  uri: string;
}

export interface SearchResult {
  text: string;
  sources: SearchSource[];
  relatedQuestions?: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  promptPrefix: string;
}

export enum ViewState {
  HOME = 'HOME',
  RESULTS = 'RESULTS',
  CHAT = 'CHAT',
  ABOUT = 'ABOUT',
  BUSINESS = 'BUSINESS'
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export type Language = 'English' | 'Koloqua';

export const COUNTIES = [
  "All Liberia",
  "Bomi",
  "Bong",
  "Gbarpolu",
  "Grand Bassa",
  "Grand Cape Mount",
  "Grand Gedeh",
  "Grand Kru",
  "Lofa",
  "Margibi",
  "Maryland",
  "Montserrado",
  "Nimba",
  "River Cess",
  "River Gee",
  "Sinoe"
] as const;

export type County = typeof COUNTIES[number];
