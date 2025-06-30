import { Button } from '@/components/ui/button';
import { usePWA } from '@/hooks/usePWA';
import { Download } from 'lucide-react';

const PWATestButton = () => {
  const { canInstall, installPWA, showInstallBanner } = usePWA();

  const handleTestInstall = async () => {
    // Clear the dismissed flag and show banner
    localStorage.removeItem('pwa-install-dismissed');
    showInstallBanner();
    
    // Or directly install
    // await installPWA();
  };

  if (!canInstall) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          PWA install not available. Make sure you're using Chrome/Edge and serving over HTTPS.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <p className="text-sm text-green-800 mb-2">
        PWA install is available!
      </p>
      <Button 
        onClick={handleTestInstall}
        className="bg-pink-500 hover:bg-pink-600"
      >
        <Download className="w-4 h-4 mr-2" />
        Show Install Banner
      </Button>
    </div>
  );
};

export default PWATestButton;
