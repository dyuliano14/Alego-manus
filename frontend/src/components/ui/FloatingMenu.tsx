import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface FloatingMenuProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  className?: string;
}

export const FloatingMenu: React.FC<FloatingMenuProps> = ({
  icon,
  label,
  children,
  position = 'bottom-right',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fechar quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const getPositionClass = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'bottom-4 right-4';
    }
  };

  const getMenuPositionClass = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-full left-0 mb-2 origin-bottom-left';
      case 'bottom-center':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2 origin-bottom';
      default:
        return 'bottom-full right-0 mb-2 origin-bottom-right';
    }
  };

  return (
    <div 
      ref={menuRef}
      className={`fixed z-50 ${getPositionClass()} ${className}`}
    >
      {/* Menu expandido */}
      {isOpen && (
        <div 
          className={`absolute ${getMenuPositionClass()} bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 min-w-[280px] max-w-[350px] backdrop-blur-lg bg-white/95`}
          style={{
            transform: isOpen ? 'scale(1)' : 'scale(0.8)',
            opacity: isOpen ? 1 : 0,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {/* Header do menu */}
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 text-sm">{label}</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronDown size={16} className="text-gray-500" />
            </button>
          </div>
          
          {/* Conteúdo do menu */}
          <div className="space-y-2">
            {children}
          </div>
        </div>
      )}
      
      {/* Botão FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-center w-14 h-14 bg-blue-500 hover:bg-blue-600 
          text-white rounded-full shadow-lg hover:shadow-xl 
          transition-all duration-200 hover:scale-105 active:scale-95
          ${isOpen ? 'bg-blue-600' : ''}
        `}
        title={label}
      >
        {icon}
      </button>
    </div>
  );
};

// Componente para itens do menu
interface MenuItemProps {
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  children?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  onClick,
  children,
  active = false,
  disabled = false
}) => {
  return (
    <div 
      className={`
        flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
        ${active ? 'bg-blue-50 border border-blue-200' : ''}
      `}
      onClick={disabled ? undefined : onClick}
    >
      {icon && (
        <div className={`
          flex-shrink-0 
          ${active ? 'text-blue-600' : 'text-gray-500'}
        `}>
          {icon}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className={`
          font-medium text-sm
          ${active ? 'text-blue-700' : 'text-gray-700'}
          ${disabled ? 'text-gray-400' : ''}
        `}>
          {label}
        </div>
        {children && (
          <div className="mt-2">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente para sliders compactos
interface MiniSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  unit?: string;
  icon?: React.ReactNode;
}

export const MiniSlider: React.FC<MiniSliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  unit = '',
  icon
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <div className="text-gray-500">{icon}</div>}
          <span className="text-xs font-medium text-gray-600">{label}</span>
        </div>
        <span className="text-xs font-mono text-gray-800 bg-gray-100 px-2 py-1 rounded">
          {value}{unit}
        </span>
      </div>
      
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mini-slider"
        style={{
          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((value - min) / (max - min)) * 100}%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`
        }}
      />
    </div>
  );
};

// Componente para botões de ação rápida
interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

export const QuickAction: React.FC<QuickActionProps> = ({
  icon,
  label,
  onClick,
  active = false,
  disabled = false,
  variant = 'secondary'
}) => {
  const getVariantClass = () => {
    if (disabled) return 'bg-gray-100 text-gray-400';
    if (active) {
      switch (variant) {
        case 'primary': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'success': return 'bg-green-100 text-green-700 border-green-200';
        case 'warning': return 'bg-orange-100 text-orange-700 border-orange-200';
        case 'danger': return 'bg-red-100 text-red-700 border-red-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
      }
    }
    return 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200';
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium
        transition-all duration-150 hover:scale-105 active:scale-95
        ${getVariantClass()}
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}
      title={label}
    >
      <div className="flex-shrink-0">
        {icon}
      </div>
      <span className="truncate">{label}</span>
    </button>
  );
};
