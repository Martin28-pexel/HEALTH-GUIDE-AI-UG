import { 
  users, type User, type InsertUser,
  conversations, type Conversation, type InsertConversation,
  conversationMessages, type ConversationMessage, type InsertConversationMessage,
  healthFacilities, type HealthFacility,
  symptomCategories, type SymptomCategory
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversation(sessionId: string): Promise<Conversation | undefined>;
  addMessageToConversation(message: InsertConversationMessage): Promise<ConversationMessage>;
  getMessagesForConversation(conversationId: number): Promise<ConversationMessage[]>;
  
  getSymptomCategories(): Promise<SymptomCategory[]>;
  getHealthFacilities(): Promise<HealthFacility[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private conversations: Map<number, Conversation>;
  private messages: Map<number, ConversationMessage>;
  private symptomCats: SymptomCategory[];
  private facilities: HealthFacility[];
  private userIdCounter: number;
  private conversationIdCounter: number;
  private messageIdCounter: number;

  constructor() {
    this.users = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    this.userIdCounter = 1;
    this.conversationIdCounter = 1;
    this.messageIdCounter = 1;
    
    // Initialize with sample data
    this.symptomCats = this.initializeSymptomCategories();
    this.facilities = this.initializeHealthFacilities();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = this.conversationIdCounter++;
    const createdAt = new Date();
    const conversation: Conversation = { ...insertConversation, id, createdAt };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async getConversation(sessionId: string): Promise<Conversation | undefined> {
    return Array.from(this.conversations.values()).find(
      (conversation) => conversation.sessionId === sessionId,
    );
  }

  async addMessageToConversation(insertMessage: InsertConversationMessage): Promise<ConversationMessage> {
    const id = this.messageIdCounter++;
    const timestamp = new Date();
    const message: ConversationMessage = { ...insertMessage, id, timestamp };
    this.messages.set(id, message);
    
    // Also update the conversation messages array
    const conversation = this.conversations.get(insertMessage.conversationId);
    if (conversation) {
      const messagesArray = JSON.parse(JSON.stringify(conversation.messages)) || [];
      messagesArray.push({
        role: message.role,
        content: message.content,
        timestamp: message.timestamp
      });
      this.conversations.set(conversation.id, {
        ...conversation,
        messages: messagesArray
      });
    }
    
    return message;
  }

  async getMessagesForConversation(conversationId: number): Promise<ConversationMessage[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.conversationId === conversationId,
    ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async getSymptomCategories(): Promise<SymptomCategory[]> {
    return this.symptomCats;
  }

  async getHealthFacilities(): Promise<HealthFacility[]> {
    return this.facilities;
  }

  private initializeSymptomCategories(): SymptomCategory[] {
    return [
      {
        id: 1,
        key: "fever",
        translations: {
          en: "Fever or high temperature",
          lg: "Omusujja oba ebugumu bw'omubiri",
          sw: "Homa au joto la juu"
        },
        followUpQuestions: [
          { 
            id: "duration", 
            translations: { 
              en: "How long have you had the fever?", 
              lg: "Omaze bbanga ki n'omusujja?",
              sw: "Umeugua homa kwa muda gani?"
            }, 
            options: { 
              en: ["Less than 24 hours", "1-3 days", "More than 3 days"],
              lg: ["Okusinga essawa 24", "Ennaku 1-3", "Okusinga ennaku 3"],
              sw: ["Chini ya saa 24", "Siku 1-3", "Zaidi ya siku 3"]
            }
          },
          { 
            id: "temperature", 
            translations: { 
              en: "What is your temperature, if you know?", 
              lg: "Ebugumu bw'omubiri bwo buli ki, bw'oba okimanyi?",
              sw: "Joto lako ni kiasi gani, ikiwa unajua?"
            }, 
            options: { 
              en: ["Below 38°C", "38°C - 39°C", "Above 39°C", "I don't know"],
              lg: ["Wansi wa 38°C", "38°C - 39°C", "Waggulu wa 39°C", "Simanyi"],
              sw: ["Chini ya 38°C", "38°C - 39°C", "Zaidi ya 39°C", "Sijui"]
            }
          }
        ]
      },
      {
        id: 2,
        key: "breathing",
        translations: {
          en: "Breathing difficulty",
          lg: "Obuzibu bw'okussa",
          sw: "Ugumu wa kupumua"
        },
        followUpQuestions: [
          { 
            id: "duration", 
            translations: { 
              en: "How long have you had difficulty breathing?", 
              lg: "Omaze bbanga ki nga olina obuzibu mu kussa?",
              sw: "Umekuwa na ugumu wa kupumua kwa muda gani?"
            }, 
            options: { 
              en: ["Just started", "Several hours", "Days"],
              lg: ["Nakatandika", "Essaawa eziziddako", "Enaku"],
              sw: ["Nimeanza tu", "Saa kadhaa", "Siku"]
            }
          },
          { 
            id: "severity", 
            translations: { 
              en: "How severe is your breathing difficulty?", 
              lg: "Obuzibu bwo mu kussa bukali butya?",
              sw: "Ugumu wako wa kupumua ni mkali kiasi gani?"
            }, 
            options: { 
              en: ["Mild - can speak in full sentences", "Moderate - need to pause when speaking", "Severe - can only say a few words at a time"],
              lg: ["Kitono - osobola okwogera mu mboozi enzijjuvu", "Wakati - weetaaga okuwummulako nga oyogera", "Nyo - osobola okwogera ebigambo bitono mu kiseera"],
              sw: ["Kidogo - naweza kuongea sentensi kamili", "Wastani - nahitaji kupumzika ninapoongea", "Kali - naweza kusema maneno machache tu kwa wakati mmoja"]
            }
          }
        ]
      },
      {
        id: 3,
        key: "pain",
        translations: {
          en: "Pain (head, chest, abdomen)",
          lg: "Obulumi (omutwe, ekifuba, olubuto)",
          sw: "Maumivu (kichwa, kifua, tumbo)"
        },
        followUpQuestions: [
          { 
            id: "location", 
            translations: { 
              en: "Where is the pain located?", 
              lg: "Obulumi buli wa?",
              sw: "Maumivu yako ni wapi?"
            }, 
            options: { 
              en: ["Head", "Chest", "Abdomen/Stomach", "Other"],
              lg: ["Omutwe", "Ekifuba", "Olubuto", "Ewalala"],
              sw: ["Kichwa", "Kifua", "Tumbo", "Nyingine"]
            }
          },
          { 
            id: "severity", 
            translations: { 
              en: "How severe is the pain from 1 (mild) to 10 (severe)?", 
              lg: "Obulumi bukali butya okuva ku 1 (kitono) okutuuka ku 10 (bungi nnyo)?",
              sw: "Maumivu ni makali kiasi gani kutoka 1 (kidogo) hadi 10 (makali sana)?"
            }, 
            options: { 
              en: ["1-3 (Mild)", "4-6 (Moderate)", "7-10 (Severe)"],
              lg: ["1-3 (Kitono)", "4-6 (Wakati)", "7-10 (Bungi nnyo)"],
              sw: ["1-3 (Kidogo)", "4-6 (Wastani)", "7-10 (Makali sana)"]
            }
          }
        ]
      },
      {
        id: 4,
        key: "injury",
        translations: {
          en: "Injury or wound",
          lg: "Ebisago oba ekiwundu",
          sw: "Jeraha au kidonda" 
        },
        followUpQuestions: [
          { 
            id: "bleeding", 
            translations: { 
              en: "Is there bleeding?", 
              lg: "Waliwo okulukusa omusaayi?",
              sw: "Je, kuna kutokwa damu?"
            }, 
            options: { 
              en: ["Yes, heavy bleeding", "Yes, slight bleeding", "No bleeding"],
              lg: ["Yee, okulukusa omusaayi omungi", "Yee, okulukusa omusaayi mutono", "Tewali kulukusa musaayi"],
              sw: ["Ndio, kutokwa damu nyingi", "Ndio, kutokwa damu kidogo", "Hakuna kutokwa damu"]
            }
          },
          { 
            id: "cause", 
            translations: { 
              en: "What caused the injury?", 
              lg: "Kiki ekyaleeta ekisago?",
              sw: "Ni nini kilisababisha jeraha?"
            }, 
            options: { 
              en: ["Fall", "Cut", "Burn", "Traffic accident", "Other"],
              lg: ["Okugwa", "Okusala", "Okwokya", "Akabenje k'emotoka", "Ekirala"],
              sw: ["Kuanguka", "Kukatwa", "Kuchomwa", "Ajali ya barabarani", "Nyingine"]
            }
          }
        ]
      },
      {
        id: 5,
        key: "child",
        translations: {
          en: "Child illness",
          lg: "Obulwadde bw'abaana",
          sw: "Ugonjwa wa mtoto"
        },
        followUpQuestions: [
          { 
            id: "age", 
            translations: { 
              en: "How old is the child?", 
              lg: "Omwana alina emyaka emeka?",
              sw: "Mtoto ana umri gani?"
            }, 
            options: { 
              en: ["Under 1 year", "1-5 years", "6-12 years", "13-17 years"],
              lg: ["Wansi w'omwaka 1", "Emyaka 1-5", "Emyaka 6-12", "Emyaka 13-17"],
              sw: ["Chini ya mwaka 1", "Miaka 1-5", "Miaka 6-12", "Miaka 13-17"]
            }
          },
          { 
            id: "symptoms", 
            translations: { 
              en: "What symptoms does the child have?", 
              lg: "Omwana alina bubonero ki?",
              sw: "Mtoto ana dalili gani?"
            }, 
            options: { 
              en: ["Fever", "Vomiting", "Diarrhea", "Rash", "Cough", "Other"],
              lg: ["Omusujja", "Okusesema", "Ekudukudu", "Amabala", "Okukolola", "Ebirala"],
              sw: ["Homa", "Kutapika", "Kuhara", "Upele", "Kikohozi", "Nyingine"]
            }
          }
        ]
      },
      {
        id: 6,
        key: "other",
        translations: {
          en: "Other symptoms",
          lg: "Obubonero obulala",
          sw: "Dalili nyingine"
        },
        followUpQuestions: [
          { 
            id: "description", 
            translations: { 
              en: "Please describe your symptoms briefly", 
              lg: "Nsaba onnyonnyole mu bufunze obubonero bwo",
              sw: "Tafadhali eleza dalili zako kwa ufupi"
            }, 
            options: { 
              en: [],
              lg: [],
              sw: []
            }
          },
          { 
            id: "duration", 
            translations: { 
              en: "How long have you had these symptoms?", 
              lg: "Obubonero buno obumaze bbanga ki?",
              sw: "Umekuwa na dalili hizi kwa muda gani?"
            }, 
            options: { 
              en: ["Less than 24 hours", "1-3 days", "4-7 days", "More than a week"],
              lg: ["Wansi wa ssaawa 24", "Ennaku 1-3", "Ennaku 4-7", "Okusukka wiiki emu"],
              sw: ["Chini ya saa 24", "Siku 1-3", "Siku 4-7", "Zaidi ya wiki moja"]
            }
          }
        ]
      }
    ];
  }

  private initializeHealthFacilities(): HealthFacility[] {
    return [
      {
        id: 1,
        name: "Mulago National Referral Hospital",
        address: "Upper Mulago Hill, Kampala",
        phone: "+256-414-541-133",
        hours: "Open 24 hours",
        type: "Public Hospital",
        services: ["Emergency Services", "General Healthcare", "Specialized Care"],
        coordinates: { lat: 0.3476, lng: 32.5825 },
        emergency: true
      },
      {
        id: 2,
        name: "Kampala International Hospital",
        address: "Namuwongo, Kampala",
        phone: "+256-312-188-800",
        hours: "Open 24 hours",
        type: "Private Hospital",
        services: ["Emergency Services", "General Healthcare", "Specialized Care"],
        coordinates: { lat: 0.3157, lng: 32.6078 },
        emergency: true
      },
      {
        id: 3,
        name: "Kiswa Health Center",
        address: "Bugolobi, Kampala",
        phone: "+256-414-220-889",
        hours: "8:00 AM - 5:00 PM",
        type: "Public Clinic",
        services: ["Primary Care", "Maternal Health", "Vaccinations"],
        coordinates: { lat: 0.3198, lng: 32.6135 },
        emergency: false
      },
      {
        id: 4,
        name: "Naguru General Hospital",
        address: "Naguru, Kampala",
        phone: "+256-414-510-096",
        hours: "Open 24 hours",
        type: "Public Hospital",
        services: ["Emergency Services", "General Healthcare", "HIV/AIDS Treatment"],
        coordinates: { lat: 0.3341, lng: 32.6069 },
        emergency: true
      },
      {
        id: 5,
        name: "Case Medical Center",
        address: "Kampala Road, Kampala",
        phone: "+256-312-250-700",
        hours: "Open 24 hours",
        type: "Private Hospital",
        services: ["Emergency Services", "General Healthcare", "Specialized Care"],
        coordinates: { lat: 0.3172, lng: 32.5872 },
        emergency: true
      }
    ];
  }
}

export const storage = new MemStorage();
