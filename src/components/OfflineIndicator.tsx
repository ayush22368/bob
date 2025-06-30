import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePWA } from '@/hooks/usePWA';

const OfflineIndicator = () => {
  const { isOffline } = usePWA();

  if (!isOffline) {
    return null;
  }

  return (
    <Alert className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 bg-amber-50 border-amber-200">
      <WifiOff className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800">
        You're currently offline. Some features may be limited.
      </AlertDescription>
    </Alert>
  );
};

export default OfflineIndicator;
