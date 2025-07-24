import React, { useState, useEffect, useRef } from 'react';
import { X, Type, Palette, BookOpen, Settings2, Sun, Moon } from 'lucide-react';
import { useAdvancedTextToSpeech } from '../hooks/useAdvancedTextToSpeech';
import { TTSControls } from './TTSControls';
import '../styles/reading-mode.css';

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

  const progressBarStyle = {
    '--progress-width': `${scrollProgress}%`
  } as React.CSSProperties;

  return (
    <div 
      className={`reading-mode-overlay theme-${settings.theme}`}
      style={{
        '--font-size': `${settings.fontSize}px`,
        '--font-family': settings.fontFamily,
        '--line-height': settings.lineHeight,
        '--margin-size': `${settings.marginSize}px`,
        ...progressBarStyle
      } as React.CSSProperties}
    >
      {/* Header */}
      <header className="reading-header">
        <div className="header-left">
          <button 
            onClick={onClose} 
            className="close-btn"
            title="Fechar modo de leitura"
            aria-label="Fechar modo de leitura"
          >
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
      <div 
        className="progress-bar-reading"
        data-progress={scrollProgress}
      >
        <div className="progress-fill-reading" />
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="settings-overlay" onClick={() => setShowSettings(false)}>
          <div className="settings-panel-reading" onClick={(e) => e.stopPropagation()}>
            <div className="settings-header">
              <h3>Configurações de Leitura</h3>
              <button 
                onClick={() => setShowSettings(false)} 
                className="close-settings-btn"
                title="Fechar configurações"
              >
                <X size={18} />
              </button>
            </div>
            
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
                aria-label={`Tamanho da fonte: ${settings.fontSize}px`}
                title={`Tamanho da fonte: ${settings.fontSize}px`}
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
                aria-label={`Espaçamento entre linhas: ${settings.lineHeight}`}
                title={`Espaçamento entre linhas: ${settings.lineHeight}`}
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
                aria-label={`Margens: ${settings.marginSize}px`}
                title={`Margens: ${settings.marginSize}px`}
              />
            </div>

            {/* Família da Fonte */}
            <div className="setting-section">
              <h4>Fonte</h4>
              <select
                value={settings.fontFamily}
                onChange={(e) => saveSettings({ fontFamily: e.target.value })}
                className="font-select"
                aria-label="Escolher família da fonte"
                title="Escolher família da fonte"
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
        className={`reading-content ${settings.columnsMode ? 'columns-mode' : ''}`}
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
    </div>
  );
};
