export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  language?: string;
  translated?: boolean;
}

export interface ChatRequest {
  message: string;
  language: string;
  history?: Message[];
}

export interface ChatResponse {
  response: string;
  translatedResponse?: string;
  language: string;
}

export interface TranslationRequest {
  text: string;
  targetLanguage: string;
  isUserMessage?: boolean;
}

export interface TranslationResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export type Language = 'en' | 'hi' | 'te';

export interface QuickSuggestion {
  id: string;
  text: string;
  translations: {
    en: string;
    hi: string;
    te: string;
  };
}
