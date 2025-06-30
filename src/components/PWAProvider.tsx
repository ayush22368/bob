import { useEffect, useState } from 'react';
import { usePWA } from '@/hooks/usePWA';
import PWAInstallBanner from './PWAInstallBanner';
import OfflineIndicator from './OfflineIndicator';

interface PWAProviderProps {
  children: React.ReactNode;
}

const PWAProvider = ({ children }: PWAProviderProps) => {
  const { canInstall, showInstallBanner, requestNotificationPermission } = usePWA();
  const [hasPromptedNotifications, setHasPromptedNotifications] = useState(false);

  useEffect(() => {
    // Auto-show install banner after 30 seconds if installable
    const timer = setTimeout(() => {
      if (canInstall) {
        showInstallBanner();
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [canInstall, showInstallBanner]);

  useEffect(() => {
    // Request notification permission after user interacts with the app
    const handleUserInteraction = async () => {
      if (!hasPromptedNotifications && 'Notification' in window) {
        const permission = Notification.permission;
        if (permission === 'default') {
          // Wait a bit before asking for notifications
          setTimeout(async () => {
            await requestNotificationPermission();
            setHasPromptedNotifications(true);
          }, 10000);
        }
      }
    };

    // Listen for user interactions
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [hasPromptedNotifications, requestNotificationPermission]);

  return (
    <>
      {children}
      <PWAInstallBanner />
      <OfflineIndicator />
    </>
  );
};

export default PWAProvider;
