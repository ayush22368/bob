import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  showInstallPrompt: boolean;
  canInstall: boolean;
}

export const usePWA = () => {
  const [pwaState, setPWAState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOffline: !navigator.onLine,
    showInstallPrompt: false,
    canInstall: false,
  });

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  // Check if app is installed
  const checkIfInstalled = useCallback(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isNavigatorStandalone = (window.navigator as any).standalone === true;
    const isInstalled = isStandalone || isNavigatorStandalone;
    
    setPWAState(prev => ({
      ...prev,
      isInstalled,
      canInstall: !isInstalled && !!deferredPrompt,
    }));
  }, [deferredPrompt]);

  // Install PWA
  const installPWA = useCallback(async () => {
    if (!deferredPrompt) {
      console.log('Install prompt not available');
      return false;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA installed successfully');
        setDeferredPrompt(null);
        setPWAState(prev => ({
          ...prev,
          showInstallPrompt: false,
          canInstall: false,
          isInstalled: true,
        }));
        return true;
      } else {
        console.log('PWA installation dismissed');
        return false;
      }
    } catch (error) {
      console.error('Error installing PWA:', error);
      return false;
    }
  }, [deferredPrompt]);

  // Show install prompt
  const showInstallBanner = useCallback(() => {
    setPWAState(prev => ({
      ...prev,
      showInstallPrompt: true,
    }));
  }, []);

  // Hide install prompt
  const hideInstallBanner = useCallback(() => {
    setPWAState(prev => ({
      ...prev,
      showInstallPrompt: false,
    }));
  }, []);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  // Send notification
  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        ...options,
      });
    }
  }, []);

  // Share content
  const shareContent = useCallback(async (shareData: ShareData) => {
    if ('share' in navigator) {
      try {
        await navigator.share(shareData);
        return true;
      } catch (error) {
        console.error('Error sharing:', error);
        return false;
      }
    }
    return false;
  }, []);

  useEffect(() => {
    // Register service worker
    const registerSW = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('SW registered: ', registration);
          
          setPWAState(prev => ({
            ...prev,
            isInstallable: true,
          }));
        } catch (error) {
          console.log('SW registration failed: ', error);
        }
      }
    };

    registerSW();

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      setDeferredPrompt(event);
      
      setPWAState(prev => ({
        ...prev,
        canInstall: true,
      }));
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setPWAState(prev => ({
        ...prev,
        isInstalled: true,
        canInstall: false,
        showInstallPrompt: false,
      }));
      setDeferredPrompt(null);
    };

    // Listen for online/offline status
    const handleOnline = () => {
      setPWAState(prev => ({
        ...prev,
        isOffline: false,
      }));
    };

    const handleOffline = () => {
      setPWAState(prev => ({
        ...prev,
        isOffline: true,
      }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial installation state
    checkIfInstalled();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkIfInstalled]);

  return {
    ...pwaState,
    installPWA,
    showInstallBanner,
    hideInstallBanner,
    requestNotificationPermission,
    sendNotification,
    shareContent,
  };
};
