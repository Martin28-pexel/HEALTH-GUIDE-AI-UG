import React, { useState } from 'react';
import LanguageSelector from '@/components/language-selector';
import ChatInterface from '@/components/chat-interface';
import { Language } from '@/types';
import { useChat } from '@/context/chat-context';

export default function Home() {
  const [showLanguageSelector, setShowLanguageSelector] = useState(true);
  const { changeLanguage } = useChat();
  
  const handleSelectLanguage = (language: Language) => {
    changeLanguage(language);
    setShowLanguageSelector(false);
  };
  
  const handleChangeLanguage = () => {
    setShowLanguageSelector(true);
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {showLanguageSelector ? (
        <LanguageSelector onSelectLanguage={handleSelectLanguage} />
      ) : (
        <ChatInterface onChangeLanguage={handleChangeLanguage} />
      )}
    </div>
  );
}
