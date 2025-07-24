import React, { useEffect } from 'react';
import { usePWA } from '../hooks/usePWA';

interface PWAWrapperProps {
  children: React.ReactNode;
}

export const PWAWrapper: React.FC<PWAWrapperProps> = ({ children }) => {
  const { isStandalone, isMobile } = usePWA();

  useEffect(() => {
    // Configurações específicas quando rodando como PWA
    if (isStandalone && isMobile) {
      // Remove a barra de endereço virtual no Android
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
        );
      }

      // Configura altura da tela considerando safe areas
      const setViewportHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };

      setViewportHeight();
      window.addEventListener('resize', setViewportHeight);
      window.addEventListener('orientationchange', setViewportHeight);

      return () => {
        window.removeEventListener('resize', setViewportHeight);
        window.removeEventListener('orientationchange', setViewportHeight);
      };
    }
  }, [isStandalone, isMobile]);

  return (
    <div 
      className={`app-container ${isStandalone ? 'pwa-mode' : ''}`}
      style={{
        height: isStandalone ? 'calc(var(--vh, 1vh) * 100)' : '100vh',
        width: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {children}
    </div>
  );
};