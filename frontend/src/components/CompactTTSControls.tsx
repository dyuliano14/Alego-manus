import React from 'react';
import { 
  Play, Pause, Square, SkipForward, Volume2, Settings, 
  Gauge, Users, VolumeX, Zap 
} from 'lucide-react';
import { FloatingMenu, MenuItem, MiniSlider, QuickAction } from './ui/FloatingMenu';

interface CompactTTSControlsProps {
  isSupported: boolean;
  isSpeaking: boolean;
  isPaused: boolean;
  progress: number;
  estimatedTimeLeft: number;
  readingSpeed: number;
  settings: {
    rate: number;
    pitch: number;
    volume: number;
    voice?: SpeechSynthesisVoice;
  };
  voices: SpeechSynthesisVoice[];
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onSkip: () => void;
  onSeek: (progress: number) => void;
  onSettingsChange: (settings: any) => void;
}

export const CompactTTSControls: React.FC<CompactTTSControlsProps> = ({
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
  if (!isSupported) return null;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMainIcon = () => {
    if (isSpeaking && !isPaused) return <Pause size={20} />;
    return <Play size={20} />;
  };

  const getStatus = () => {
    if (isSpeaking && !isPaused) return 'Lendo...';
    if (isPaused) return 'Pausado';
    return 'Áudio';
  };

  return (
    <FloatingMenu
      icon={getMainIcon()}
      label={getStatus()}
      position="bottom-center"
      className="tts-controls-fab"
    >
      {/* Status e Progresso */}
      <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-blue-800">
            {isSpeaking && !isPaused ? '🎵 Reproduzindo' : isPaused ? '⏸️ Pausado' : '🔊 Pronto'}
          </span>
          <span className="text-xs text-blue-600 font-mono">
            {estimatedTimeLeft > 0 ? formatTime(estimatedTimeLeft) : '--:--'}
          </span>
        </div>
        
        {/* Barra de Progresso */}
        <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between text-xs text-blue-600">
          <span>{Math.round(progress)}%</span>
          <span>{readingSpeed} ppm</span>
        </div>
      </div>

      {/* Controles Principais */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <QuickAction
          icon={isSpeaking && !isPaused ? <Pause size={16} /> : <Play size={16} />}
          label={isSpeaking && !isPaused ? 'Pausar' : 'Reproduzir'}
          onClick={isSpeaking && !isPaused ? onPause : onPlay}
          variant="primary"
          active={isSpeaking && !isPaused}
        />
        
        <QuickAction
          icon={<Square size={16} />}
          label="Parar"
          onClick={onStop}
          variant="danger"
          disabled={!isSpeaking}
        />
        
        <QuickAction
          icon={<SkipForward size={16} />}
          label="Pular"
          onClick={onSkip}
          variant="secondary"
          disabled={!isSpeaking}
        />
      </div>

      {/* Configurações Rápidas */}
      <MenuItem
        icon={<Gauge size={16} />}
        label="Velocidade"
      >
        <MiniSlider
          label="Taxa de Fala"
          value={settings.rate}
          min={0.5}
          max={2.0}
          step={0.1}
          onChange={(rate) => onSettingsChange({ ...settings, rate })}
          unit="x"
        />
        
        {/* Presets de Velocidade */}
        <div className="flex gap-1 mt-2">
          {[
            { label: '🐌 Lento', value: 0.7 },
            { label: '📖 Normal', value: 1.0 },
            { label: '⚡ Rápido', value: 1.3 },
            { label: '🚀 Muito Rápido', value: 1.6 }
          ].map((preset) => (
            <button
              key={preset.value}
              onClick={() => onSettingsChange({ ...settings, rate: preset.value })}
              className={`
                flex-1 px-2 py-1 text-xs rounded border transition-all
                ${Math.abs(settings.rate - preset.value) < 0.05 
                  ? 'bg-blue-500 text-white border-blue-500' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }
              `}
            >
              {preset.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </MenuItem>

      <MenuItem
        icon={<Volume2 size={16} />}
        label="Volume e Tom"
      >
        <MiniSlider
          label="Volume"
          value={settings.volume}
          min={0}
          max={1}
          step={0.1}
          onChange={(volume) => onSettingsChange({ ...settings, volume })}
          unit="%"
          icon={settings.volume === 0 ? <VolumeX size={12} /> : <Volume2 size={12} />}
        />
        
        <MiniSlider
          label="Tom de Voz"
          value={settings.pitch}
          min={0.5}
          max={2.0}
          step={0.1}
          onChange={(pitch) => onSettingsChange({ ...settings, pitch })}
          unit=""
        />
      </MenuItem>

      {/* Seleção de Voz */}
      {voices.length > 0 && (
        <MenuItem
          icon={<Users size={16} />}
          label="Voz"
        >
          <select
            value={settings.voice?.name || ''}
            onChange={(e) => {
              const selectedVoice = voices.find(v => v.name === e.target.value);
              onSettingsChange({ ...settings, voice: selectedVoice });
            }}
            className="w-full p-2 text-xs border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Voz padrão do sistema</option>
            {voices
              .filter(voice => voice.lang.startsWith('pt') || voice.lang.startsWith('en'))
              .map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang}) {voice.default ? '⭐' : ''}
                </option>
              ))
            }
          </select>
          
          {/* Botões de Teste de Voz */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              onClick={() => {
                const utterance = new SpeechSynthesisUtterance('Olá, esta é uma demonstração.');
                if (settings.voice) utterance.voice = settings.voice;
                utterance.rate = settings.rate;
                utterance.pitch = settings.pitch;
                utterance.volume = settings.volume;
                speechSynthesis.speak(utterance);
              }}
              className="px-2 py-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
            >
              🎤 Testar
            </button>
            
            <button
              onClick={() => speechSynthesis.cancel()}
              className="px-2 py-1 text-xs bg-red-50 text-red-700 border border-red-200 rounded hover:bg-red-100 transition-colors"
            >
              🔇 Parar Teste
            </button>
          </div>
        </MenuItem>
      )}

      {/* Controle de Progresso */}
      <MenuItem
        icon={<Zap size={16} />}
        label="Buscar Posição"
      >
        <div className="space-y-2">
          <MiniSlider
            label="Posição no texto"
            value={progress}
            min={0}
            max={100}
            step={1}
            onChange={onSeek}
            unit="%"
          />
          
          {/* Botões de Salto Rápido */}
          <div className="grid grid-cols-4 gap-1">
            {[
              { label: '⏮️', value: 0 },
              { label: '◀️', value: Math.max(0, progress - 10) },
              { label: '▶️', value: Math.min(100, progress + 10) },
              { label: '⏭️', value: 100 }
            ].map((jump, index) => (
              <button
                key={index}
                onClick={() => onSeek(jump.value)}
                className="px-2 py-1 text-xs bg-gray-50 text-gray-700 border border-gray-200 rounded hover:bg-gray-100 transition-colors"
                disabled={!isSpeaking}
              >
                {jump.label}
              </button>
            ))}
          </div>
        </div>
      </MenuItem>

      {/* Informações Adicionais */}
      <div className="mt-4 p-2 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>Velocidade de leitura:</span>
            <span className="font-mono">{readingSpeed} ppm</span>
          </div>
          <div className="flex justify-between">
            <span>Progresso:</span>
            <span className="font-mono">{Math.round(progress)}%</span>
          </div>
          {estimatedTimeLeft > 0 && (
            <div className="flex justify-between">
              <span>Tempo restante:</span>
              <span className="font-mono">{formatTime(estimatedTimeLeft)}</span>
            </div>
          )}
        </div>
      </div>
    </FloatingMenu>
  );
};
