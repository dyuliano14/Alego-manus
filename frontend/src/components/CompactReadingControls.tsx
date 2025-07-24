import React from 'react';
import { 
  Palette, Type, Sun, Moon, BookOpen, Settings2, 
  Columns, Maximize, Eye, Contrast 
} from 'lucide-react';
import { FloatingMenu, MenuItem, MiniSlider, QuickAction } from './ui/FloatingMenu';

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

interface CompactReadingControlsProps {
  settings: ReadingSettings;
  onSettingsChange: (settings: Partial<ReadingSettings>) => void;
  scrollProgress: number;
}

export const CompactReadingControls: React.FC<CompactReadingControlsProps> = ({
  settings,
  onSettingsChange,
  scrollProgress
}) => {
  const themes = {
    light: { name: '☀️ Claro', icon: <Sun size={16} /> },
    dark: { name: '🌙 Escuro', icon: <Moon size={16} /> },
    sepia: { name: '📜 Sépia', icon: <BookOpen size={16} /> },
    'high-contrast': { name: '⚡ Contraste', icon: <Contrast size={16} /> }
  };

  const fonts = [
    { value: 'system-ui', name: '🖥️ Sistema' },
    { value: 'Georgia, serif', name: '📖 Georgia' },
    { value: "'Times New Roman', serif", name: '📰 Times' },
    { value: 'Arial, sans-serif', name: '🅰️ Arial' },
    { value: "'Courier New', monospace", name: '💻 Courier' }
  ];

  return (
    <FloatingMenu
      icon={<Settings2 size={20} />}
      label="Configurações"
      position="bottom-right"
    >
      {/* Progresso de Leitura */}
      <div className="mb-4 p-3 bg-green-50 rounded-xl border border-green-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-green-800">
            📖 Progresso de Leitura
          </span>
          <span className="text-xs text-green-600 font-mono">
            {Math.round(scrollProgress)}%
          </span>
        </div>
        
        <div className="w-full bg-green-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>

      {/* Temas Rápidos */}
      <MenuItem
        icon={<Palette size={16} />}
        label="Aparência"
      >
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(themes).map(([key, theme]) => (
            <QuickAction
              key={key}
              icon={theme.icon}
              label={theme.name}
              onClick={() => onSettingsChange({ theme: key as any })}
              active={settings.theme === key}
              variant="secondary"
            />
          ))}
        </div>
      </MenuItem>

      {/* Tipografia */}
      <MenuItem
        icon={<Type size={16} />}
        label="Tipografia"
      >
        <MiniSlider
          label="Tamanho da Fonte"
          value={settings.fontSize}
          min={12}
          max={32}
          step={1}
          onChange={(fontSize) => onSettingsChange({ fontSize })}
          unit="px"
          icon={<Type size={12} />}
        />
        
        <MiniSlider
          label="Espaçamento entre Linhas"
          value={settings.lineHeight}
          min={1.2}
          max={2.5}
          step={0.1}
          onChange={(lineHeight) => onSettingsChange({ lineHeight })}
          unit=""
        />
        
        <MiniSlider
          label="Margens"
          value={settings.marginSize}
          min={10}
          max={50}
          step={5}
          onChange={(marginSize) => onSettingsChange({ marginSize })}
          unit="px"
        />

        {/* Presets de Tamanho */}
        <div className="grid grid-cols-3 gap-1 mt-2">
          {[
            { label: '🔍 Pequeno', size: 14 },
            { label: '📱 Médio', size: 18 },
            { label: '🔍+ Grande', size: 24 }
          ].map((preset) => (
            <button
              key={preset.size}
              onClick={() => onSettingsChange({ fontSize: preset.size })}
              className={`
                px-2 py-1 text-xs rounded border transition-all
                ${settings.fontSize === preset.size 
                  ? 'bg-blue-500 text-white border-blue-500' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }
              `}
            >
              {preset.label.split(' ')[1]}
            </button>
          ))}
        </div>
      </MenuItem>

      {/* Fonte */}
      <MenuItem
        icon={<BookOpen size={16} />}
        label="Família da Fonte"
      >
        <div className="grid grid-cols-1 gap-1">
          {fonts.map((font) => (
            <button
              key={font.value}
              onClick={() => onSettingsChange({ fontFamily: font.value })}
              className={`
                px-3 py-2 text-xs rounded border transition-all text-left
                ${settings.fontFamily === font.value 
                  ? 'bg-blue-500 text-white border-blue-500' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }
              `}
              style={{ fontFamily: font.value }}
            >
              {font.name}
            </button>
          ))}
        </div>
      </MenuItem>

      {/* Layout */}
      <MenuItem
        icon={<Maximize size={16} />}
        label="Layout"
      >
        <QuickAction
          icon={<Columns size={16} />}
          label={settings.columnsMode ? 'Uma Coluna' : 'Duas Colunas'}
          onClick={() => onSettingsChange({ columnsMode: !settings.columnsMode })}
          active={settings.columnsMode}
          variant="secondary"
        />
        
        <div className="mt-2 text-xs text-gray-500">
          {settings.columnsMode 
            ? '📱 Melhor para tablet/desktop' 
            : '📱 Otimizado para mobile'
          }
        </div>
      </MenuItem>

      {/* Configurações Avançadas */}
      <MenuItem
        icon={<Eye size={16} />}
        label="Conforto Visual"
      >
        {/* Presets de Conforto */}
        <div className="space-y-2">
          <button
            onClick={() => onSettingsChange({
              fontSize: 16,
              lineHeight: 1.5,
              marginSize: 20
            })}
            className="w-full px-3 py-2 text-xs bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100 transition-colors"
          >
            👀 Leitura Confortável
          </button>
          
          <button
            onClick={() => onSettingsChange({
              fontSize: 20,
              lineHeight: 1.8,
              marginSize: 30
            })}
            className="w-full px-3 py-2 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
          >
            🔍 Leitura Ampliada
          </button>
          
          <button
            onClick={() => onSettingsChange({
              theme: 'high-contrast',
              fontSize: 18,
              lineHeight: 1.6
            })}
            className="w-full px-3 py-2 text-xs bg-purple-50 text-purple-700 border border-purple-200 rounded hover:bg-purple-100 transition-colors"
          >
            ♿ Acessibilidade
          </button>
        </div>
      </MenuItem>

      {/* Informações */}
      <div className="mt-4 p-2 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>Tema atual:</span>
            <span className="font-mono">{themes[settings.theme].name}</span>
          </div>
          <div className="flex justify-between">
            <span>Fonte:</span>
            <span className="font-mono">{settings.fontSize}px</span>
          </div>
          <div className="flex justify-between">
            <span>Progresso:</span>
            <span className="font-mono">{Math.round(scrollProgress)}%</span>
          </div>
        </div>
      </div>
    </FloatingMenu>
  );
};
