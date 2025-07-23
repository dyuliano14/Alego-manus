// 🔊 Text-to-Speech Avançado com Controles Profissionais
import { useEffect, useState, useCallback, useRef } from 'react';

interface AdvancedTTSOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  maxLength?: number;
  autoResume?: boolean;  // Retomar onde parou
  highlightWords?: boolean; // Destacar palavra atual
}

interface TTSSettings {
  rate: number;        // 0.1 - 10
  pitch: number;       // 0 - 2
  volume: number;      // 0 - 1
  voice: string;       // ID da voz selecionada
  autoScroll: boolean; // Auto scroll durante leitura
  pauseOnEnd: boolean; // Pausar no fim de parágrafos
}

interface ReadingPosition {
  paragraph: number;
  sentence: number;
  word: number;
  charStart: number;
  charEnd: number;
}

export const useAdvancedTextToSpeech = (options: AdvancedTTSOptions = {}) => {
  // Estados básicos
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  // Estados avançados
  const [currentPosition, setCurrentPosition] = useState<ReadingPosition>({
    paragraph: 0, sentence: 0, word: 0, charStart: 0, charEnd: 0
  });
  const [progress, setProgress] = useState(0); // 0-100%
  const [estimatedTimeLeft, setEstimatedTimeLeft] = useState(0); // em segundos
  const [readingSpeed, setReadingSpeed] = useState(0); // palavras por minuto
  
  // Configurações persistentes
  const [settings, setSettings] = useState<TTSSettings>({
    rate: options.rate || 1.0,
    pitch: options.pitch || 1.0,
    volume: options.volume || 1.0,
    voice: '',
    autoScroll: true,
    pauseOnEnd: false
  });

  // Refs para controle
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textSegmentsRef = useRef<string[]>([]);
  const currentSegmentRef = useRef(0);
  const startTimeRef = useRef(0);
  const totalWordsRef = useRef(0);

  // Configurações padrão
  const {
    lang = 'pt-BR',
    maxLength = 200, // Segmentos menores para melhor controle
    autoResume = true,
    highlightWords = true
  } = options;

  // Verificar suporte e carregar vozes
  useEffect(() => {
    const checkSupport = () => {
      const supported = 'speechSynthesis' in window;
      setIsSupported(supported);
      
      if (supported) {
        const loadVoices = () => {
          const availableVoices = window.speechSynthesis.getVoices();
          setVoices(availableVoices);
          
          // Definir voz padrão em português
          const defaultVoice = availableVoices.find(voice => 
            voice.lang.includes('pt') || voice.lang.includes('BR')
          );
          
          if (defaultVoice && !settings.voice) {
            setSettings(prev => ({ ...prev, voice: defaultVoice.name }));
          }
          
          console.log('📢 Vozes carregadas:', availableVoices.length);
        };

        loadVoices();
        window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
        
        return () => {
          window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
        };
      }
    };

    checkSupport();
  }, []);

  // Carregar configurações salvas
  useEffect(() => {
    const savedSettings = localStorage.getItem('tts-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn('Erro ao carregar configurações TTS:', error);
      }
    }
  }, []);

  // Salvar configurações
  const saveSettings = useCallback((newSettings: Partial<TTSSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('tts-settings', JSON.stringify(updated));
  }, [settings]);

  // Dividir texto em segmentos menores
  const segmentText = useCallback((text: string): string[] => {
    // Dividir por parágrafos primeiro
    const paragraphs = text.split(/\n\s*\n/);
    const segments: string[] = [];
    
    paragraphs.forEach(paragraph => {
      // Dividir por sentenças
      const sentences = paragraph.split(/[.!?]+/).filter(s => s.trim().length > 0);
      
      sentences.forEach(sentence => {
        const trimmed = sentence.trim();
        if (trimmed.length <= maxLength) {
          segments.push(trimmed);
        } else {
          // Dividir sentenças muito longas por vírgulas
          const parts = trimmed.split(',').filter(p => p.trim().length > 0);
          segments.push(...parts.map(p => p.trim()));
        }
      });
    });
    
    return segments.filter(s => s.length > 0);
  }, [maxLength]);

  // Calcular estatísticas
  const calculateStats = useCallback((segments: string[]) => {
    const totalWords = segments.join(' ').split(/\s+/).length;
    totalWordsRef.current = totalWords;
    
    // Estimar tempo baseado na velocidade (WPM = rate * 150)
    const estimatedWPM = settings.rate * 150;
    const estimatedTime = (totalWords / estimatedWPM) * 60;
    setEstimatedTimeLeft(Math.round(estimatedTime));
  }, [settings.rate]);

  // Função principal para falar
  const speak = useCallback(async (text: string, fromPosition?: ReadingPosition) => {
    if (!isSupported || !text.trim()) {
      console.warn('Text-to-Speech não suportado ou texto vazio');
      return false;
    }

    try {
      // Parar qualquer reprodução anterior
      window.speechSynthesis.cancel();
      await new Promise(resolve => setTimeout(resolve, 100));

      // Segmentar texto
      const segments = segmentText(text);
      textSegmentsRef.current = segments;
      calculateStats(segments);

      // Definir posição inicial
      const startIndex = fromPosition?.paragraph || 0;
      currentSegmentRef.current = startIndex;
      
      startTimeRef.current = Date.now();
      setProgress(0);
      
      // Iniciar reprodução do primeiro segmento
      await speakSegment(startIndex);
      
      return true;
    } catch (error) {
      console.error('Erro ao iniciar Text-to-Speech:', error);
      return false;
    }
  }, [isSupported, settings, segmentText, calculateStats]);

  // Falar um segmento específico
  const speakSegment = useCallback(async (index: number) => {
    const segments = textSegmentsRef.current;
    if (index >= segments.length) {
      // Fim da leitura
      setIsSpeaking(false);
      setProgress(100);
      console.log('🎯 Leitura completa');
      return;
    }

    const segment = segments[index];
    const utterance = new SpeechSynthesisUtterance(segment);
    utteranceRef.current = utterance;

    // Configurar voz
    const selectedVoice = voices.find(v => v.name === settings.voice);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Aplicar configurações
    utterance.lang = lang;
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;

    // Eventos
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      
      // Atualizar posição
      setCurrentPosition({
        paragraph: index,
        sentence: 0,
        word: 0,
        charStart: 0,
        charEnd: segment.length
      });
    };

    utterance.onboundary = (event) => {
      if (highlightWords && event.name === 'word') {
        // Destacar palavra atual
        setCurrentPosition(prev => ({
          ...prev,
          word: event.charIndex,
          charStart: event.charIndex,
          charEnd: event.charIndex + (event.charLength || 0)
        }));
      }
    };

    utterance.onend = () => {
      // Atualizar progresso
      const progressPercent = ((index + 1) / segments.length) * 100;
      setProgress(progressPercent);
      
      // Calcular velocidade de leitura
      const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60; // minutos
      const wordsRead = segments.slice(0, index + 1).join(' ').split(/\s+/).length;
      const currentWPM = Math.round(wordsRead / elapsed);
      setReadingSpeed(currentWPM);

      // Continuar para próximo segmento
      if (autoResume) {
        currentSegmentRef.current = index + 1;
        setTimeout(() => speakSegment(index + 1), settings.pauseOnEnd ? 1000 : 100);
      } else {
        setIsSpeaking(false);
      }
    };

    utterance.onerror = (event) => {
      console.error('❌ Erro TTS:', event.error);
      setIsSpeaking(false);
    };

    // Iniciar reprodução
    window.speechSynthesis.speak(utterance);
  }, [voices, settings, lang, highlightWords, autoResume]);

  // Pausar/Retomar
  const togglePause = useCallback(() => {
    if (!isSupported) return;

    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    } else if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [isSupported, isSpeaking, isPaused]);

  // Parar
  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setProgress(0);
      currentSegmentRef.current = 0;
    }
  }, [isSupported]);

  // Pular para frente/trás
  const skip = useCallback((direction: 'forward' | 'backward') => {
    const segments = textSegmentsRef.current;
    const current = currentSegmentRef.current;
    
    let newIndex;
    if (direction === 'forward') {
      newIndex = Math.min(current + 1, segments.length - 1);
    } else {
      newIndex = Math.max(current - 1, 0);
    }
    
    if (newIndex !== current) {
      window.speechSynthesis.cancel();
      currentSegmentRef.current = newIndex;
      speakSegment(newIndex);
    }
  }, [speakSegment]);

  // Ir para posição específica
  const seekTo = useCallback((percentage: number) => {
    const segments = textSegmentsRef.current;
    const targetIndex = Math.floor((percentage / 100) * segments.length);
    
    window.speechSynthesis.cancel();
    currentSegmentRef.current = targetIndex;
    speakSegment(targetIndex);
  }, [speakSegment]);

  return {
    // Estados básicos
    isSupported,
    isSpeaking,
    isPaused,
    voices,
    
    // Estados avançados
    currentPosition,
    progress,
    estimatedTimeLeft,
    readingSpeed,
    settings,
    
    // Funções de controle
    speak,
    togglePause,
    stop,
    skip,
    seekTo,
    saveSettings,
    
    // Informações úteis
    totalSegments: textSegmentsRef.current.length,
    currentSegment: currentSegmentRef.current
  };
};
