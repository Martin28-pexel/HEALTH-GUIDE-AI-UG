import React, { createContext, useContext, useState, useEffect } from 'react';
import { Conversation, Message, Language, HealthFacility } from '@/types';
import { apiRequest } from '@/lib/queryClient';
import { v4 as uuidv4 } from 'uuid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { performTriage } from '@/utils/triage-logic';

interface ChatContextType {
  conversation: Conversation | null;
  messages: Message[];
  language: Language;
  isLoading: boolean;
  typingIndicator: boolean;
  showFacilityModal: boolean;
  selectedSymptomCategory: string | null;
  sendMessage: (content: string) => void;
  changeLanguage: (language: Language) => void;
  resetChat: () => void;
  setSelectedSymptomCategory: (category: string | null) => void;
  toggleFacilityModal: () => void;
  facilities: HealthFacility[];
  isLoadingFacilities: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string>(() => {
    const saved = localStorage.getItem('chatSessionId');
    return saved || uuidv4();
  });
  
  const [language, setLanguage] = useState<Language>('en');
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [showFacilityModal, setShowFacilityModal] = useState(false);
  const [selectedSymptomCategory, setSelectedSymptomCategory] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  
  // Save sessionId to localStorage
  useEffect(() => {
    localStorage.setItem('chatSessionId', sessionId);
  }, [sessionId]);
  
  // Fetch conversation and messages
  const { 
    data: conversationData, 
    isLoading: isLoadingConversation, 
    error: conversationError,
    refetch: refetchConversation
  } = useQuery({ 
    queryKey: ['/api/conversations'], 
    queryFn: async () => {
      const res = await apiRequest('POST', '/api/conversations', {
        sessionId,
        language
      });
      return res.json();
    }
  });
  
  // Fetch health facilities
  const { 
    data: facilitiesData, 
    isLoading: isLoadingFacilities 
  } = useQuery({ 
    queryKey: ['/api/health-facilities'], 
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/health-facilities');
      return res.json();
    }
  });
  
  // Message mutation
  const { mutate: sendMessageMutation } = useMutation({
    mutationFn: async (messageContent: string) => {
      setTypingIndicator(true);
      
      const res = await apiRequest('POST', `/api/conversations/${conversationData?.conversation?.id}/messages`, {
        role: 'user',
        content: messageContent,
        sessionId
      });
      
      return res.json();
    },
    onSuccess: (data) => {
      setTimeout(() => {
        setTypingIndicator(false);
        queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
        
        // Handle yes/no for facility display
        const userContent = data?.userMessage?.content?.toLowerCase();
        if (
          userContent?.includes('yes') || 
          userContent?.includes('ye') || 
          userContent?.includes('ndio') ||
          userContent?.includes('facility') ||
          userContent?.includes('facilities') ||
          userContent?.includes('hospital') ||
          userContent?.includes('clinic')
        ) {
          setShowFacilityModal(true);
        }
      }, 1000);
    },
    onError: () => {
      setTypingIndicator(false);
    }
  });
  
  // Change language and restart conversation
  const changeLanguage = async (newLanguage: Language) => {
    setLanguage(newLanguage);
    
    // Create a new session for the new language
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    
    await queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
    refetchConversation();
  };
  
  // Reset chat
  const resetChat = () => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    setSelectedSymptomCategory(null);
    refetchConversation();
  };
  
  // Toggle facility modal
  const toggleFacilityModal = () => {
    setShowFacilityModal(!showFacilityModal);
  };
  
  return (
    <ChatContext.Provider
      value={{
        conversation: conversationData?.conversation || null,
        messages: conversationData?.messages || [],
        language,
        isLoading: isLoadingConversation,
        typingIndicator,
        showFacilityModal,
        selectedSymptomCategory,
        sendMessage: (content) => sendMessageMutation(content),
        changeLanguage,
        resetChat,
        setSelectedSymptomCategory,
        toggleFacilityModal,
        facilities: facilitiesData || [],
        isLoadingFacilities
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
