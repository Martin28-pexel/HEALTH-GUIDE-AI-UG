import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Language } from '@/types';
import { useTranslation } from 'react-i18next';
import { useChat } from '@/context/chat-context';

interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
}

const languages: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'Continue in English' },
  { code: 'lg', label: 'Luganda', nativeLabel: 'Weyongere mu Luganda' },
  { code: 'sw', label: 'Swahili', nativeLabel: 'Endelea kwa Kiswahili' }
];

interface LanguageSelectorProps {
  onSelectLanguage: (language: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelectLanguage }) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col h-full">
      <header className="bg-primary text-white p-4 shadow-md">
        <h1 className="text-xl font-medium text-center">
          {t('title')}
        </h1>
        <p className="text-sm text-center mt-1">
          {t('languageSelector')}
        </p>
      </header>
      
      <div className="flex-1 p-6 flex flex-col items-center justify-center space-y-6">
        {languages.map((language) => (
          <Card 
            key={language.code} 
            className="w-full max-w-sm p-1 cursor-pointer hover:bg-gray-50 transition"
            onClick={() => onSelectLanguage(language.code)}
          >
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" x2="22" y1="12" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="font-medium text-lg text-gray-800">{language.label}</h2>
                  <p className="text-sm text-gray-600">{language.nativeLabel}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="bg-gray-200 p-4 text-center text-sm text-gray-700">
        <p>{t('privacyNotice')}</p>
      </div>
    </div>
  );
};

export default LanguageSelector;
