// 🔊 HOOK PERSONALIZADO para Text-to-Speech
// 
// 🎯 OBJETIVO: Transformar texto em fala (como Siri/Google Assistant)
// 💡 CONCEITO: Um hook é uma função que "engancha" funcionalidades do React
// 📱 MOBILE: Otimizado especialmente para celulares (iOS/Android)

import { useEffect, useState, useCallback } from 'react';

// 📋 TYPESCRIPT: Interface define que opções podemos passar para o hook
interface UseTextToSpeechOptions {
  lang?: string;        // Idioma (pt-BR, en-US, etc.)
  rate?: number;        // Velocidade da fala (0.5 = lento, 2.0 = rápido)
  pitch?: number;       // Tom da voz (0.5 = grave, 2.0 = agudo)
  volume?: number;      // Volume (0.0 = mudo, 1.0 = máximo)
  maxLength?: number;   // Máximo de caracteres (evita travamentos)
}

// 🎯 HOOK PRINCIPAL: Retorna funções e estados para usar Text-to-Speech
export const useTextToSpeech = (options: UseTextToSpeechOptions = {}) => {
  
  // 📊 ESTADOS: Informações que o hook compartilha com componentes
  const [isSupported, setIsSupported] = useState(false);              // Browser suporta TTS?
  const [isSpeaking, setIsSpeaking] = useState(false);                // Está falando agora?
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);   // Lista de vozes disponíveis

  // 🛠️ CONFIGURAÇÕES: Valores padrão com destructuring (ES6)
  const {
    lang = 'pt-BR',        // Português brasileiro por padrão
    rate = 0.9,            // Velocidade um pouco mais lenta (melhor p/ estudo)
    pitch = 1.0,           // Tom normal
    volume = 1.0,          // Volume máximo
    maxLength = 1000       // Máximo 1000 caracteres por vez
  } = options;

  // 🔄 useEffect: Verifica suporte e carrega vozes quando hook monta
  useEffect(() => {
    const checkSupport = () => {
      // 🔍 Verifica se o browser tem speechSynthesis (API nativa)
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
