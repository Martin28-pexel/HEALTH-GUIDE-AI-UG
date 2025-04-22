import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { useChat } from '@/context/chat-context';
import FacilityModal from './facility-modal';

interface ChatInterfaceProps {
  onChangeLanguage: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onChangeLanguage }) => {
  const { t } = useTranslation();
  const { 
    messages, 
    typingIndicator, 
    language, 
    sendMessage, 
    showFacilityModal,
    toggleFacilityModal,
    facilities,
    changeLanguage
  } = useChat();
  
  const [messageInput, setMessageInput] = useState('');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingIndicator]);
  
  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  const toggleLanguageMenu = () => {
    setShowLanguageMenu(!showLanguageMenu);
  };
  
  const switchLanguage = (newLanguage: 'en' | 'lg' | 'sw') => {
    changeLanguage(newLanguage);
    setShowLanguageMenu(false);
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-primary text-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center">
          <button className="mr-2" onClick={onChangeLanguage}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
          </button>
          <h1 className="text-xl font-medium">{t('title')}</h1>
        </div>
        <div className="language-switcher relative">
          <Button 
            className="bg-primary-dark rounded-full w-8 h-8 p-0 flex items-center justify-center" 
            onClick={toggleLanguageMenu}
            variant="ghost"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-languages">
              <path d="m5 8 6 6"/>
              <path d="m4 14 6-6 2-3"/>
              <path d="M2 5h12"/>
              <path d="M7 2h1"/>
              <path d="m22 22-5-10-5 10"/>
              <path d="M14 18h6"/>
            </svg>
          </Button>
          {showLanguageMenu && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md overflow-hidden z-10 w-32">
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => switchLanguage('en')}>English</div>
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => switchLanguage('lg')}>Luganda</div>
              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => switchLanguage('sw')}>Swahili</div>
            </div>
          )}
        </div>
      </header>
      
      {/* Chat Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 p-4 flex flex-col overflow-y-auto bg-gray-50" 
        id="chat-messages"
      >
        {messages.map((message, index) => (
          <div 
            key={index}
            className={`max-w-[80%] mb-3 ${
              message.role === 'user' 
                ? 'self-end bg-primary text-white rounded-t-xl rounded-bl-xl' 
                : 'self-start bg-gray-100 text-gray-800 rounded-t-xl rounded-br-xl'
            } p-3 shadow-sm`}
          >
            {message.content}
          </div>
        ))}
        
        {typingIndicator && (
          <div className="self-start bg-gray-100 text-gray-800 rounded-t-xl rounded-br-xl p-3 max-w-[80%] mb-3 shadow-sm">
            <div className="flex space-x-1">
              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-3">
        <div className="flex flex-col gap-2">
          <div className="flex rounded-full bg-gray-100 p-2">
            <Input
              type="text"
              placeholder={t('typePlaceholder')}
              className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button 
              onClick={handleSendMessage}
              className="bg-primary rounded-full w-8 h-8 p-0 flex items-center justify-center text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send">
                <path d="m22 2-7 20-4-9-9-4Z"/>
                <path d="M22 2 11 13"/>
              </svg>
            </Button>
          </div>
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs" 
              onClick={() => toggleFacilityModal()}>
              {t('showMore')}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Privacy Notice */}
      <div className="bg-gray-200 p-2 text-center text-xs text-gray-700">
        <p>{t('privacyNotice')}</p>
      </div>
      
      {/* Facility Modal */}
      {showFacilityModal && (
        <FacilityModal 
          isOpen={showFacilityModal} 
          onClose={toggleFacilityModal} 
          facilities={facilities}
        />
      )}
    </div>
  );
};

export default ChatInterface;
