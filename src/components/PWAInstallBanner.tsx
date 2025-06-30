import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Download, Smartphone } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

const PWAInstallBanner = () => {
  const { canInstall, showInstallPrompt, installPWA, hideInstallBanner } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has previously dismissed the banner
    const isDismissed = localStorage.getItem('pwa-install-dismissed');
    if (isDismissed) {
      setDismissed(true);
    }
  }, []);

  const handleInstall = async () => {
    const success = await installPWA();
    if (success) {
      setDismissed(true);
      localStorage.setItem('pwa-install-dismissed', 'true');
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    hideInstallBanner();
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!canInstall || !showInstallPrompt || dismissed) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 p-4 bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200 shadow-lg">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Install Sakura Sathi
          </h3>
          <p className="text-xs text-gray-600 mb-3">
            Get the full app experience with offline access and push notifications
          </p>
          
          <div className="flex gap-2">
            <Button
              onClick={handleInstall}
              size="sm"
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              <Download className="w-3 h-3 mr-1" />
              Install
            </Button>
            <Button
              onClick={handleDismiss}
              variant="outline"
              size="sm"
              className="text-gray-600 border-gray-300"
            >
              Later
            </Button>
          </div>
        </div>
        
        <Button
          onClick={handleDismiss}
          variant="ghost"
          size="sm"
          className="flex-shrink-0 h-auto p-1 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default PWAInstallBanner;
