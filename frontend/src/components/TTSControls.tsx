import React, { useState } from 'react';
import '../styles/tts-controls.css';
import { 
  Play, 
  Pause, 
  Square, 
  SkipForward, 
  SkipBack, 
  Settings,
  Volume2,
  Gauge,
  Clock,
  BookOpen
} from 'lucide-react';

interface TTSControlsProps {
  isSupported: boolean;
  isSpeaking: boolean;
  isPaused: boolean;
  progress: number;
  estimatedTimeLeft: number;
  readingSpeed: number;
  settings: any;
  voices: SpeechSynthesisVoice[];
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onSkip: (direction: 'forward' | 'backward') => void;
  onSeek: (percentage: number) => void;
  onSettingsChange: (settings: any) => void;
}

export const TTSControls: React.FC<TTSControlsProps> = ({
  isSupported,
  isSpeaking,
  isPaused,
  progress,
  estimatedTimeLeft,
  readingSpeed,
  settings,
  voices,
  onPlay,
  onPause,
  onStop,
  onSkip,
  onSeek,
  onSettingsChange
}) => {
  const [showSettings, setShowSettings] = useState(false);

  if (!isSupported) {
    return (
      <div className="tts-controls-unsupported">
        <p className="text-sm text-gray-500">
          🔇 Text-to-Speech não suportado neste navegador
        </p>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="tts-controls">
      {/* Barra de Progresso */}
      <div className="progress-section mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BookOpen size={16} />
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {readingSpeed > 0 && (
              <div className="flex items-center gap-1">
                <Gauge size={16} />
                <span>{readingSpeed} WPM</span>
              </div>
            )}
            {estimatedTimeLeft > 0 && (
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{formatTime(estimatedTimeLeft)}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Barra de progresso interativa */}
        <div 
          className="progress-bar"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percentage = ((e.clientX - rect.left) / rect.width) * 100;
            onSeek(percentage);
          }}
        >
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controles Principais */}
      <div className="controls-main flex justify-center items-center gap-4 mb-4">
        <button
          onClick={() => onSkip('backward')}
          className="btn-control"
          disabled={!isSpeaking}
          title="Voltar"
        >
          <SkipBack size={20} />
        </button>

        <button
          onClick={isSpeaking && !isPaused ? onPause : onPlay}
          className="btn-control-primary"
          title={isSpeaking && !isPaused ? "Pausar" : "Reproduzir"}
        >
          {isSpeaking && !isPaused ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <button
          onClick={onStop}
          className="btn-control"
          disabled={!isSpeaking}
          title="Parar"
        >
          <Square size={20} />
        </button>

        <button
          onClick={() => onSkip('forward')}
          className="btn-control"
          disabled={!isSpeaking}
          title="Avançar"
        >
          <SkipForward size={20} />
        </button>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="btn-control"
          title="Configurações"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Painel de Configurações */}
      {showSettings && (
        <div className="settings-panel">
          <div className="settings-header mb-4">
            <h3 className="text-lg font-semibold">Configurações de Leitura</h3>
          </div>

          <div className="settings-grid">
            {/* Velocidade */}
            <div className="setting-item">
              <label className="setting-label">
                <Gauge size={16} />
                Velocidade: {settings.rate.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.1"
                value={settings.rate}
                onChange={(e) => onSettingsChange({ rate: parseFloat(e.target.value) })}
                className="setting-slider"
              />
              <div className="setting-marks">
                <span>Lento</span>
                <span>Normal</span>
                <span>Rápido</span>
              </div>
            </div>

            {/* Volume */}
            <div className="setting-item">
              <label className="setting-label">
                <Volume2 size={16} />
                Volume: {Math.round(settings.volume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.volume}
                onChange={(e) => onSettingsChange({ volume: parseFloat(e.target.value) })}
                className="setting-slider"
              />
            </div>

            {/* Tom */}
            <div className="setting-item">
              <label className="setting-label">
                Tom: {settings.pitch.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={settings.pitch}
                onChange={(e) => onSettingsChange({ pitch: parseFloat(e.target.value) })}
                className="setting-slider"
              />
              <div className="setting-marks">
                <span>Grave</span>
                <span>Normal</span>
                <span>Agudo</span>
              </div>
            </div>

            {/* Seleção de Voz */}
            <div className="setting-item">
              <label className="setting-label">Voz</label>
              <select
                value={settings.voice}
                onChange={(e) => onSettingsChange({ voice: e.target.value })}
                className="setting-select"
              >
                <option value="">Voz padrão</option>
                {voices
                  .filter(voice => voice.lang.includes('pt') || voice.lang.includes('BR'))
                  .map(voice => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))
                }
              </select>
            </div>

            {/* Opções Avançadas */}
            <div className="setting-item">
              <label className="setting-checkbox">
                <input
                  type="checkbox"
                  checked={settings.autoScroll}
                  onChange={(e) => onSettingsChange({ autoScroll: e.target.checked })}
                />
                Auto-scroll durante leitura
              </label>
            </div>

            <div className="setting-item">
              <label className="setting-checkbox">
                <input
                  type="checkbox"
                  checked={settings.pauseOnEnd}
                  onChange={(e) => onSettingsChange({ pauseOnEnd: e.target.checked })}
                />
                Pausar no fim de parágrafos
              </label>
            </div>
          </div>

          {/* Presets de Velocidade */}
          <div className="speed-presets">
            <h4 className="text-sm font-medium mb-2">Presets</h4>
            <div className="preset-buttons">
              <button
                onClick={() => onSettingsChange({ rate: 0.7, pitch: 1.0 })}
                className="preset-btn"
              >
                📚 Estudo
              </button>
              <button
                onClick={() => onSettingsChange({ rate: 1.0, pitch: 1.0 })}
                className="preset-btn"
              >
                📖 Normal
              </button>
              <button
                onClick={() => onSettingsChange({ rate: 1.5, pitch: 1.1 })}
                className="preset-btn"
              >
                ⚡ Revisão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
