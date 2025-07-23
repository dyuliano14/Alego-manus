import React, { useState, useEffect, useRef } from 'react';
import { X, Type, Palette, BookOpen, Settings2, Sun, Moon } from 'lucide-react';
import { useAdvancedTextToSpeech } from '../hooks/useAdvancedTextToSpeech';
import { TTSControls } from './TTSControls';

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
  const [showSettings, setShowSettings] = useState(false);
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
      name: '☀️ Claro'
    },
    dark: {
      backgroundColor: '#1f2937',
      textColor: '#f9fafb',
      name: '🌙 Escuro'
    },
    sepia: {
      backgroundColor: '#f7f3e9',
      textColor: '#5d4e37',
      name: '📜 Sépia'
    },
    'high-contrast': {
      backgroundColor: '#000000',
      textColor: '#ffffff',
      name: '⚡ Alto Contraste'
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
    setSettings(updated);
    localStorage.setItem('reading-mode-settings', JSON.stringify(updated));
  };

  // Aplicar tema
  const applyTheme = (theme: keyof typeof themes) => {
    const themeData = themes[theme];
    saveSettings({
      theme,
      backgroundColor: themeData.backgroundColor,
      textColor: themeData.textColor
    });
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
    const wordsPerMinute = 200; // Velocidade média de leitura
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  if (!isOpen) return null;

  const readingTime = calculateReadingTime(text);

  return (
    <div className="reading-mode-overlay">
      {/* Header */}
      <header className="reading-header">
        <div className="header-left">
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
          <div className="reading-info">
            {title && <h1 className="reading-title">{title}</h1>}
            <div className="reading-meta">
              <span>{readingTime} min de leitura</span>
              <span>•</span>
              <span>{Math.round(scrollProgress)}% lido</span>
            </div>
          </div>
        </div>
        
        <div className="header-actions">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="action-btn"
            title="Configurações"
          >
            <Settings2 size={20} />
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="progress-bar-reading">
        <div 
          className="progress-fill-reading"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="settings-overlay">
          <div className="settings-panel-reading">
            <h3>Configurações de Leitura</h3>
            
            {/* Temas */}
            <div className="setting-section">
              <h4>Tema</h4>
              <div className="theme-buttons">
                {Object.entries(themes).map(([key, theme]) => (
                  <button
                    key={key}
                    onClick={() => applyTheme(key as keyof typeof themes)}
                    className={`theme-btn ${settings.theme === key ? 'active' : ''}`}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tamanho da Fonte */}
            <div className="setting-section">
              <h4>
                <Type size={16} />
                Tamanho da Fonte: {settings.fontSize}px
              </h4>
              <input
                type="range"
                min="12"
                max="32"
                value={settings.fontSize}
                onChange={(e) => saveSettings({ fontSize: parseInt(e.target.value) })}
                className="range-slider"
              />
            </div>

            {/* Espaçamento entre Linhas */}
            <div className="setting-section">
              <h4>Espaçamento: {settings.lineHeight}</h4>
              <input
                type="range"
                min="1.2"
                max="2.5"
                step="0.1"
                value={settings.lineHeight}
                onChange={(e) => saveSettings({ lineHeight: parseFloat(e.target.value) })}
                className="range-slider"
              />
            </div>

            {/* Margens */}
            <div className="setting-section">
              <h4>Margens: {settings.marginSize}px</h4>
              <input
                type="range"
                min="10"
                max="50"
                value={settings.marginSize}
                onChange={(e) => saveSettings({ marginSize: parseInt(e.target.value) })}
                className="range-slider"
              />
            </div>

            {/* Família da Fonte */}
            <div className="setting-section">
              <h4>Fonte</h4>
              <select
                value={settings.fontFamily}
                onChange={(e) => saveSettings({ fontFamily: e.target.value })}
                className="font-select"
              >
                <option value="system-ui">Sistema</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="'Times New Roman', serif">Times New Roman</option>
                <option value="Arial, sans-serif">Arial</option>
                <option value="'Courier New', monospace">Courier New</option>
                <option value="'Comic Sans MS', cursive">Comic Sans</option>
              </select>
            </div>

            {/* Modo Colunas (tablet/desktop) */}
            <div className="setting-section">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.columnsMode}
                  onChange={(e) => saveSettings({ columnsMode: e.target.checked })}
                />
                Modo duas colunas (tablet/desktop)
              </label>
            </div>
          </div>
        </div>
      )}

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
          padding: `80px ${settings.marginSize}px 160px`,
          columnCount: settings.columnsMode && window.innerWidth > 768 ? 2 : 1,
          columnGap: settings.columnsMode ? '40px' : 'normal'
        }}
      >
        {formatText(text)}
      </main>

      {/* TTS Controls */}
      <div className="tts-reading-controls">
        <TTSControls
          isSupported={tts.isSupported}
          isSpeaking={tts.isSpeaking}
          isPaused={tts.isPaused}
          progress={tts.progress}
          estimatedTimeLeft={tts.estimatedTimeLeft}
          readingSpeed={tts.readingSpeed}
          settings={tts.settings}
          voices={tts.voices}
          onPlay={() => tts.speak(text)}
          onPause={tts.togglePause}
          onStop={tts.stop}
          onSkip={tts.skip}
          onSeek={tts.seekTo}
          onSettingsChange={tts.saveSettings}
        />
      </div>

      <style jsx>{`
        .reading-mode-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: ${settings.backgroundColor};
          z-index: 1000;
          display: flex;
          flex-direction: column;
        }

        .reading-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 10;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .close-btn, .action-btn {
          width: 40px;
          height: 40px;
          border: none;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .close-btn:hover, .action-btn:hover {
          background: rgba(0, 0, 0, 0.1);
        }

        .reading-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
          color: #1f2937;
        }

        .reading-meta {
          display: flex;
          gap: 8px;
          font-size: 14px;
          color: #6b7280;
          margin-top: 4px;
        }

        .progress-bar-reading {
          position: fixed;
          top: 73px;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(0, 0, 0, 0.1);
          z-index: 10;
        }

        .progress-fill-reading {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #1d4ed8);
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

        .settings-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 20;
          padding: 20px;
        }

        .settings-panel-reading {
          background: white;
          border-radius: 16px;
          padding: 24px;
          max-width: 400px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
        }

        .setting-section {
          margin-bottom: 24px;
        }

        .setting-section h4 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .range-slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: #e5e7eb;
          outline: none;
          cursor: pointer;
          appearance: none;
        }

        .range-slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }

        .theme-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .theme-btn {
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .theme-btn.active {
          border-color: #3b82f6;
          background: #eff6ff;
          color: #3b82f6;
        }

        .font-select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          font-size: 14px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          cursor: pointer;
        }

        .tts-reading-controls {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          padding: 16px;
          z-index: 10;
        }

        @media (max-width: 768px) {
          .reading-header {
            padding: 12px 16px;
          }

          .reading-title {
            font-size: 16px;
          }

          .reading-meta {
            font-size: 12px;
          }

          .reading-content {
            padding: 70px 16px 180px;
          }

          .settings-panel-reading {
            margin: 0;
            border-radius: 16px 16px 0 0;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            max-height: 70vh;
          }
        }
      `}</style>
    </div>
  );
};
