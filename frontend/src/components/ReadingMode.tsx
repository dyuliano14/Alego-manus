import React, { useState, useEffect, useRef } from 'react';
import { X, BookOpen, Settings, Volume2 } from 'lucide-react';
import { useAdvancedTextToSpeech } from '../hooks/useAdvancedTextToSpeech';
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
    theme: 'light',
    marginSize: 20,
    columnsMode: false
  });

  const [showSettings, setShowSettings] = useState(false);
  const [showTTSControls, setShowTTSControls] = useState(false);
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
        <p key={index}>
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

  // Aplicar configurações via CSS custom properties
  const cssVariables = {
    '--reading-font-size': `${settings.fontSize}px`,
    '--reading-font-family': settings.fontFamily,
    '--reading-line-height': settings.lineHeight.toString(),
    '--reading-padding': `80px ${settings.marginSize}px 100px`,
    '--reading-columns': settings.columnsMode && window.innerWidth > 768 ? '2' : '1',
    '--reading-column-gap': settings.columnsMode ? '40px' : 'normal'
  } as React.CSSProperties;

  return (
    <div 
      className={`reading-mode-overlay theme-${settings.theme}`}
      style={cssVariables}
    >
      {/* Header */}
      <header className="reading-header">
        <div className="header-content">
          <button 
            onClick={onClose} 
            className="close-btn"
            title="Fechar modo de leitura"
            aria-label="Fechar modo de leitura"
          >
            <X size={20} />
          </button>
          
          <div className="reading-info">
            {title && (
              <h1 className="reading-title">
                {title}
              </h1>
            )}
            <div className="reading-meta">
              <BookOpen size={14} />
              <span>{readingTime} min</span>
              <span>•</span>
              <span>{Math.round(scrollProgress)}% lido</span>
            </div>
          </div>

          <div className="header-actions">
            <button
              onClick={() => setShowTTSControls(!showTTSControls)}
              className="action-btn"
              title="Controles de áudio"
              aria-label="Controles de áudio"
            >
              <Volume2 size={18} />
            </button>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="action-btn"
              title="Configurações de leitura"
              aria-label="Configurações de leitura"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="progress-bar-reading">
        <div 
          className="progress-fill-reading"
          ref={(el) => {
            if (el) {
              el.style.setProperty('width', `${scrollProgress}%`);
            }
          }}
        />
      </div>

      {/* Content */}
      <main
        ref={contentRef}
        className="reading-content"
      >
        {formatText(text)}
      </main>

      {/* Settings Panel */}
      {showSettings && (
        <div className="settings-overlay">
          <div className="settings-panel">
            <h3>Configurações de Leitura</h3>
            
            {/* Tema */}
            <div className="setting-group">
              <label>Tema:</label>
              <div className="theme-buttons">
                {[
                  { key: 'light', name: '☀️ Claro' },
                  { key: 'dark', name: '🌙 Escuro' },
                  { key: 'sepia', name: '📜 Sépia' },
                  { key: 'high-contrast', name: '⚡ Contraste' }
                ].map(theme => (
                  <button
                    key={theme.key}
                    onClick={() => saveSettings({ theme: theme.key as any })}
                    className={`theme-btn ${settings.theme === theme.key ? 'active' : ''}`}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tamanho da Fonte */}
            <div className="setting-group">
              <label htmlFor="font-size">Tamanho da Fonte: {settings.fontSize}px</label>
              <input
                id="font-size"
                type="range"
                min="12"
                max="32"
                value={settings.fontSize}
                onChange={(e) => saveSettings({ fontSize: parseInt(e.target.value) })}
                className="range-slider"
              />
            </div>

            {/* Espaçamento */}
            <div className="setting-group">
              <label htmlFor="line-height">Espaçamento: {settings.lineHeight}</label>
              <input
                id="line-height"
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
            <div className="setting-group">
              <label htmlFor="margins">Margens: {settings.marginSize}px</label>
              <input
                id="margins"
                type="range"
                min="10"
                max="50"
                value={settings.marginSize}
                onChange={(e) => saveSettings({ marginSize: parseInt(e.target.value) })}
                className="range-slider"
              />
            </div>

            <button 
              onClick={() => setShowSettings(false)}
              className="close-settings-btn"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* TTS Controls */}
      {showTTSControls && (
        <div className="tts-overlay">
          <div className="tts-panel">
            <h3>Controles de Áudio</h3>
            
            <div className="tts-controls">
              <button
                onClick={() => tts.speak(text)}
                disabled={!tts.isSupported || tts.isSpeaking}
                className="tts-btn primary"
              >
                {tts.isSpeaking ? '🔊 Falando...' : '▶️ Reproduzir'}
              </button>
              
              <button
                onClick={tts.togglePause}
                disabled={!tts.isSpeaking}
                className="tts-btn"
              >
                {tts.isPaused ? '▶️ Continuar' : '⏸️ Pausar'}
              </button>
              
              <button
                onClick={tts.stop}
                disabled={!tts.isSpeaking}
                className="tts-btn"
              >
                ⏹️ Parar
              </button>
            </div>

            {tts.isSpeaking && (
              <div className="tts-progress">
                <div className="progress-info">
                  <span>Progresso: {Math.round(tts.progress)}%</span>
                  <span>Velocidade: {tts.readingSpeed} ppm</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    ref={(el) => {
                      if (el) {
                        el.style.setProperty('--progress-width', `${tts.progress}%`);
                      }
                    }}
                  />
                </div>
              </div>
            )}

            <button 
              onClick={() => setShowTTSControls(false)}
              className="close-settings-btn"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
