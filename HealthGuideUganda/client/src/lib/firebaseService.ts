import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  Timestamp, 
  getDoc,
  doc,
  setDoc
} from "firebase/firestore";
import { db } from "./firebase";
import { Conversation, Message, HealthFacility, Language } from "@/types";

// Collection names
const CONVERSATIONS_COLLECTION = "conversations";
const MESSAGES_COLLECTION = "messages";
const FACILITIES_COLLECTION = "healthFacilities";

// Create a new conversation or get existing one
export async function getOrCreateConversation(sessionId: string, language: Language) {
  try {
    // Check if conversation exists
    const conversationsRef = collection(db, CONVERSATIONS_COLLECTION);
    const q = query(conversationsRef, where("sessionId", "==", sessionId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Return existing conversation
      const conversationDoc = querySnapshot.docs[0];
      return {
        id: conversationDoc.id,
        ...conversationDoc.data()
      } as Conversation;
    }
    
    // Create new conversation
    const newConversation = {
      sessionId,
      language,
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(conversationsRef, newConversation);
    
    // Add welcome message
    const welcomeMessageContent = language === 'en'
      ? "Hello! I'm your health companion. I can help assess your symptoms and guide you on what to do next. What symptoms are you experiencing today?"
      : language === 'lg'
        ? "Oli otya! Nze mubeezi wo ow'obulamu. Nsobola okukuyamba okulamula obubonero bwo era nkuwe amagezi ku ki ekigwanidde okukolebwa. Obubonero ki b'olina leero?"
        : "Habari! Mimi ni msaidizi wako wa afya. Naweza kukusaidia kutathmini dalili zako na kukuelekeza kufanya nini kifuatacho. Unazoumwa dalili gani leo?";
    
    await addMessageToConversation(docRef.id, {
      role: 'assistant',
      content: welcomeMessageContent,
      timestamp: Timestamp.now()
    });
    
    return {
      id: docRef.id,
      sessionId,
      language,
      createdAt: newConversation.createdAt.toDate()
    } as Conversation;
  } catch (error) {
    console.error("Error getting/creating conversation:", error);
    throw error;
  }
}

// Add a message to a conversation
export async function addMessageToConversation(conversationId: string, message: Partial<Message>) {
  try {
    const messagesRef = collection(db, CONVERSATIONS_COLLECTION, conversationId, MESSAGES_COLLECTION);
    const docRef = await addDoc(messagesRef, {
      ...message,
      timestamp: message.timestamp || Timestamp.now()
    });
    
    return {
      id: docRef.id,
      ...message,
      timestamp: message.timestamp?.toDate() || new Date()
    } as Message;
  } catch (error) {
    console.error("Error adding message:", error);
    throw error;
  }
}

// Get messages for a conversation
export async function getMessagesForConversation(conversationId: string) {
  try {
    const messagesRef = collection(db, CONVERSATIONS_COLLECTION, conversationId, MESSAGES_COLLECTION);
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    })) as Message[];
  } catch (error) {
    console.error("Error getting messages:", error);
    throw error;
  }
}

// Initialize health facilities in Firestore
export async function initializeHealthFacilities(facilities: HealthFacility[]) {
  try {
    // Check if facilities already exist
    const facilitiesRef = collection(db, FACILITIES_COLLECTION);
    const snapshot = await getDocs(facilitiesRef);
    
    if (snapshot.empty) {
      // Add each facility
      const batch = [];
      for (const facility of facilities) {
        batch.push(addDoc(facilitiesRef, facility));
      }
      await Promise.all(batch);
      console.log("Health facilities initialized in Firestore");
    }
  } catch (error) {
    console.error("Error initializing health facilities:", error);
  }
}

// Get all health facilities
export async function getHealthFacilities() {
  try {
    const facilitiesRef = collection(db, FACILITIES_COLLECTION);
    const querySnapshot = await getDocs(facilitiesRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as HealthFacility[];
  } catch (error) {
    console.error("Error getting health facilities:", error);
    // Return an empty array as fallback
    return [];
  }
}