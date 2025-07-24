import { useEffect, useState } from 'react';

interface PWAInfo {
  isInstalled: boolean;
  isStandalone: boolean;
  isMobile: boolean;
}

export const usePWA = (): PWAInfo => {
  const [pwaInfo, setPwaInfo] = useState<PWAInfo>({
    isInstalled: false,
    isStandalone: false,
    isMobile: false,
  });

  useEffect(() => {
    const checkPWAStatus = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          (window.navigator as any).standalone ||
                          document.referrer.includes('android-app://');
      
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      setPwaInfo({
        isInstalled: isStandalone,
        isStandalone,
        isMobile,
      });

      // Configurações específicas para PWA
      if (isStandalone) {
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        
        // Previne pull-to-refresh no Chrome mobile
        document.body.style.overscrollBehavior = 'none';
      }
    };

    checkPWAStatus();
    
    // Listener para mudanças no display mode
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addListener(checkPWAStatus);
    
    return () => mediaQuery.removeListener(checkPWAStatus);
  }, []);

  return pwaInfo;
};