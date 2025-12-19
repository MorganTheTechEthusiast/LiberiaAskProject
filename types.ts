
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
  AUTH = 'AUTH',
  HOME = 'HOME',
  RESULTS = 'RESULTS',
  CHAT = 'CHAT',
  ABOUT = 'ABOUT',
  BUSINESS = 'BUSINESS',
  ADMIN = 'ADMIN',
  PROFILE = 'PROFILE'
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

// --- Auth & API Types ---

export type ApiPlan = 'free' | 'pro' | 'partner';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: number;
  apiKey?: string;
  apiSecret?: string;
  apiPlan: ApiPlan;
  apiUsage: {
    used: number;
    limit: number;
  };
}

// --- Admin & Backend Types ---

export interface SearchLog {
  id: string;
  query: string;
  timestamp: number;
  location: string; // County
  language: Language;
}

export interface ApiRequest {
  id: string;
  email: string;
  organization?: string;
  type: ApiPlan;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: number;
  apiKey?: string;
}

export interface DonationLog {
  id: string;
  amount: string;
  method: 'local' | 'international';
  timestamp: number;
  status: 'completed';
}

export interface SponsoredItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tag: string; // e.g., 'TOURISM', 'SPONSORED', 'EDUCATION'
  linkUrl?: string;
  buttonText?: string;
}
