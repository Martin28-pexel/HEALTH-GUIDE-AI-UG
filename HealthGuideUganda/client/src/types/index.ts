export interface Message {
  id?: number;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface Conversation {
  id: number;
  sessionId: string;
  language: Language;
  messages: Message[];
  createdAt?: Date;
}

export type Language = 'en' | 'lg' | 'sw';

export interface SymptomCategory {
  id: number;
  key: string;
  translations: {
    [key in Language]: string;
  };
  followUpQuestions: FollowUpQuestion[];
}

export interface FollowUpQuestion {
  id: string;
  translations: {
    [key in Language]: string;
  };
  options: {
    [key in Language]: string[];
  };
}

export interface HealthFacility {
  id: number;
  name: string;
  address: string;
  phone?: string;
  hours?: string;
  type: string;
  services: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  emergency: boolean;
}

export interface TriageResult {
  level: 'emergency' | 'urgent' | 'nonUrgent';
  recommendation: string;
}

export interface TranslationObject {
  title: string;
  welcome: string;
  typing: string;
  privacyNotice: string;
  symptomPrompt: string;
  nearbyFacilities: string;
  categories: {
    fever: string;
    breathing: string;
    pain: string;
    injury: string;
    child: string;
    other: string;
  };
  triage: {
    emergency: string;
    urgent: string;
    nonUrgent: string;
    followUp: string;
  };
  yes: string;
  no: string;
  showMore: string;
  askAnother: string;
  goodbye: string;
  languageSelector: string;
  continueIn: string;
  backButton: string;
  typePlaceholder: string;
  sendButton: string;
  facilityType: {
    public: string;
    private: string;
    clinic: string;
    emergency: string;
  };
  close: string;
}
