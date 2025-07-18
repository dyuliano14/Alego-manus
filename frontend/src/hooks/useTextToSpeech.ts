// Hook personalizado para Text-to-Speech otimizado para dispositivos móveis
import { useEffect, useState, useCallback } from 'react';

interface UseTextToSpeechOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  maxLength?: number;
}

export const useTextToSpeech = (options: UseTextToSpeechOptions = {}) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const {
    lang = 'pt-BR',
    rate = 0.9,
    pitch = 1.0,
    volume = 1.0,
    maxLength = 1000
  } = options;

  // Carrega vozes disponíveis
  useEffect(() => {
    const checkSupport = () => {
      const supported = 'speechSynthesis' in window;
      setIsSupported(supported);
      
      if (supported) {
        const loadVoices = () => {
          const availableVoices = window.speechSynthesis.getVoices();
          setVoices(availableVoices);
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

  // Função para falar texto
  const speak = useCallback(async (text: string) => {
    if (!isSupported || !text.trim()) {
      console.warn('Text-to-Speech não suportado ou texto vazio');
      return false;
    }

    try {
      // Cancela fala anterior
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      
      // Aguarda cancelamento
      await new Promise(resolve => setTimeout(resolve, 100));

      // Limita texto se necessário
      const limitedText = text.length > maxLength 
        ? text.substring(0, maxLength) + "..."
        : text;

      const utterance = new SpeechSynthesisUtterance(limitedText);
      
      // Configurações
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      // Seleciona voz em português se disponível
      const preferredVoice = voices.find(voice => 
        voice.lang.includes('pt') || voice.lang.includes('BR')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      // Eventos
      utterance.onstart = () => {
        setIsSpeaking(true);
        console.log('🔊 Text-to-Speech iniciado');
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        console.log('🔇 Text-to-Speech finalizado');
      };

      utterance.onerror = (event) => {
        setIsSpeaking(false);
        console.error('❌ Erro no Text-to-Speech:', event.error);
      };

      // Inicia reprodução
      window.speechSynthesis.speak(utterance);
      return true;

    } catch (error) {
      console.error('Erro ao executar Text-to-Speech:', error);
      setIsSpeaking(false);
      return false;
    }
  }, [isSupported, voices, lang, rate, pitch, volume, maxLength]);

  // Função para parar
  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      console.log('🔇 Text-to-Speech parado');
    }
  }, [isSupported]);

  return {
    isSupported,
    isSpeaking,
    voices,
    speak,
    stop
  };
};
