import React, { useState, useEffect, useRef } from 'react';
import { X, BookOpen } from 'lucide-react';
import { useAdvancedTextToSpeech } from '../hooks/useAdvancedTextToSpeech';
import { CompactTTSControls } from './CompactTTSControls';
import { CompactReadingControls } from './CompactReadingControls';
import '../styles/floating-menu.css';

interface ReadingModeProps {
  text: string;
  title?: string;
  onClose: () => void;
  isOpen: boolean;
}

interface ReadingSettings {
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  backgroundColor: string;
  textColor: string;
  theme: 'light' | 'dark' | 'sepia' | 'high-contrast';
  marginSize: number;
  columnsMode: boolean;
}

export const ReadingMode: React.FC<ReadingModeProps> = ({
  text,
  title,
  onClose,
  isOpen
}) => {
  const [settings, setSettings] = useState<ReadingSettings>({
    fontSize: 18,
    fontFamily: 'system-ui',
    lineHeight: 1.6,
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    theme: 'light',
    marginSize: 20,
    columnsMode: false
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Hook TTS avançado
  const tts = useAdvancedTextToSpeech({
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    highlightWords: true,
    autoResume: true
  });

  // Temas predefinidos
  const themes = {
    light: {
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
    },
    dark: {
      backgroundColor: '#1f2937',
      textColor: '#f9fafb',
    },
    sepia: {
      backgroundColor: '#f7f3e9',
      textColor: '#5d4e37',
    },
    'high-contrast': {
      backgroundColor: '#000000',
      textColor: '#ffffff',
    }
  };

  // Carregar configurações salvas
  useEffect(() => {
    const saved = localStorage.getItem('reading-mode-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn('Erro ao carregar configurações de leitura:', error);
      }
    }
  }, []);

  // Salvar configurações
  const saveSettings = (newSettings: Partial<ReadingSettings>) => {
    const updated = { ...settings, ...newSettings };
    
    // Aplicar tema automaticamente
    if (newSettings.theme) {
      const themeData = themes[newSettings.theme];
      updated.backgroundColor = themeData.backgroundColor;
      updated.textColor = themeData.textColor;
    }
    
    setSettings(updated);
    localStorage.setItem('reading-mode-settings', JSON.stringify(updated));
  };

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const element = contentRef.current;
        const scrollTop = element.scrollTop;
        const scrollHeight = element.scrollHeight - element.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        setScrollProgress(Math.min(progress, 100));
      }
    };

    const element = contentRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
      return () => element.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Formatação do texto
  const formatText = (text: string) => {
    return text
      .split('\n\n')
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0)
      .map((paragraph, index) => (
        <p key={index} style={{ marginBottom: '1.5em' }}>
          {paragraph}
        </p>
      ));
  };

  // Calcular tempo estimado de leitura
  const calculateReadingTime = (text: string): number => {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  if (!isOpen) return null;

  const readingTime = calculateReadingTime(text);

  return (
    <div 
      className="reading-mode-overlay"
      style={{ 
        backgroundColor: settings.backgroundColor,
        color: settings.textColor 
      }}
    >
      {/* Header minimalista */}
      <header 
        className="reading-header"
        style={{
          background: `${settings.backgroundColor}f0`,
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${settings.textColor}20`
        }}
      >
        <div className="header-content">
          <button 
            onClick={onClose} 
            className="close-btn"
            style={{ 
              background: `${settings.textColor}10`,
              color: settings.textColor 
            }}
          >
            <X size={20} />
          </button>
          
          <div className="reading-info">
            {title && (
              <h1 
                className="reading-title"
                style={{ color: settings.textColor }}
              >
                {title}
              </h1>
            )}
            <div 
              className="reading-meta"
              style={{ color: `${settings.textColor}80` }}
            >
              <BookOpen size={14} />
              <span>{readingTime} min</span>
              <span>•</span>
              <span>{Math.round(scrollProgress)}% lido</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div 
        className="progress-bar-reading"
        style={{ background: `${settings.textColor}20` }}
      >
        <div 
          className="progress-fill-reading"
          style={{ 
            width: `${scrollProgress}%`,
            background: settings.theme === 'dark' 
              ? 'linear-gradient(90deg, #60a5fa, #3b82f6)' 
              : 'linear-gradient(90deg, #3b82f6, #1d4ed8)'
          }}
        />
      </div>

      {/* Content */}
      <main
        ref={contentRef}
        className="reading-content"
        style={{
          fontSize: `${settings.fontSize}px`,
          fontFamily: settings.fontFamily,
          lineHeight: settings.lineHeight,
          backgroundColor: settings.backgroundColor,
          color: settings.textColor,
          padding: `80px ${settings.marginSize}px 100px`,
          columnCount: settings.columnsMode && window.innerWidth > 768 ? 2 : 1,
          columnGap: settings.columnsMode ? '40px' : 'normal'
        }}
      >
        {formatText(text)}
      </main>

      {/* Controles Compactos TTS */}
      <CompactTTSControls
        isSupported={tts.isSupported}
        isSpeaking={tts.isSpeaking}
        isPaused={tts.isPaused}
        progress={tts.progress}
        estimatedTimeLeft={tts.estimatedTimeLeft}
        readingSpeed={tts.readingSpeed}
        settings={{
          rate: tts.settings.rate,
          pitch: tts.settings.pitch,
          volume: tts.settings.volume,
          voice: tts.voices.find(v => v.name === tts.settings.voice)
        }}
        voices={tts.voices}
        onPlay={() => tts.speak(text)}
        onPause={tts.togglePause}
        onStop={tts.stop}
        onSkip={() => tts.skip('forward')}
        onSeek={tts.seekTo}
        onSettingsChange={tts.saveSettings}
      />

      {/* Controles de Leitura */}
      <CompactReadingControls
        settings={settings}
        onSettingsChange={saveSettings}
        scrollProgress={scrollProgress}
      />

      {/* CSS Inline */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .reading-mode-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1000;
            display: flex;
            flex-direction: column;
          }

          .reading-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            padding: 12px 20px;
            z-index: 10;
          }

          .header-content {
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .close-btn {
            width: 36px;
            height: 36px;
            border: none;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            flex-shrink: 0;
          }

          .close-btn:hover {
            opacity: 0.8;
            transform: scale(1.05);
          }

          .reading-title {
            font-size: 16px;
            font-weight: 600;
            margin: 0;
            line-height: 1.2;
          }

          .reading-meta {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            margin-top: 2px;
          }

          .progress-bar-reading {
            position: fixed;
            top: 60px;
            left: 0;
            right: 0;
            height: 2px;
            z-index: 10;
          }

          .progress-fill-reading {
            height: 100%;
            transition: width 0.3s ease;
          }

          .reading-content {
            flex: 1;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            text-align: justify;
            hyphens: auto;
            word-break: break-word;
          }

          @media (max-width: 768px) {
            .reading-header {
              padding: 10px 16px;
            }

            .reading-title {
              font-size: 14px;
            }

            .reading-meta {
              font-size: 11px;
            }

            .reading-content {
              padding: 70px 16px 120px;
            }
          }
        `
      }} />
    </div>
  );
};
