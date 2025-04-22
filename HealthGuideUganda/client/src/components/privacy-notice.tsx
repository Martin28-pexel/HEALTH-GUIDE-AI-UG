import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface PrivacyNoticeProps {
  className?: string;
}

const PrivacyNotice: React.FC<PrivacyNoticeProps> = ({ className }) => {
  const { t } = useTranslation();
  
  return (
    <Alert variant="destructive" className={`bg-amber-50 border-amber-200 text-amber-800 ${className}`}>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="text-center text-sm">
        {t('privacyNotice')}
      </AlertDescription>
    </Alert>
  );
};

export default PrivacyNotice;
