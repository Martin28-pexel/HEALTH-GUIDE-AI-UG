import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { HealthFacility } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface FacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  facilities: HealthFacility[];
}

const FacilityModal: React.FC<FacilityModalProps> = ({ isOpen, onClose, facilities }) => {
  const { t } = useTranslation();
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('nearbyFacilities')}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[400px] pr-4">
          {facilities.map((facility) => (
            <Card key={facility.id} className="mb-4">
              <CardContent className="p-4">
                <h3 className="font-medium text-primary text-lg">{facility.name}</h3>
                <div className="text-sm mt-2 space-y-1">
                  <p className="flex items-center text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin mr-1">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {facility.address}
                  </p>
                  
                  {facility.phone && (
                    <p className="flex items-center text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone mr-1">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      {facility.phone}
                    </p>
                  )}
                  
                  {facility.hours && (
                    <p className="flex items-center text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock mr-1">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {facility.hours}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {facility.emergency && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                        {t('facilityType.emergency')}
                      </Badge>
                    )}
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                      {facility.type}
                    </Badge>
                    {facility.services.slice(0, 2).map((service, i) => (
                      <Badge key={i} className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
        
        <DialogFooter>
          <Button onClick={onClose}>
            {t('close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FacilityModal;
