import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';

export const useVoice = ({ onTranscript } = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(() => {
    return localStorage.getItem('astra_auto_speak') === 'true';
  });

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setVoiceSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        if (onTranscript) {
          onTranscript(transcript, event.results[current].isFinal);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          toast.error('Microphone permission denied.');
        } else if (event.error !== 'no-speech') {
          toast.error(`Voice error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    if ('speechSynthesis' in window) {
      setSpeechSupported(true);
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [onTranscript]);

  const toggleListening = useCallback(() => {
    if (!voiceSupported) {
      toast.error('Speech recognition is not supported in this browser. Try Chrome/Edge.');
      return;
    }

    if (synthRef.current && synthRef.current.speaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start recognition:', err);
      }
    }
  }, [voiceSupported, isListening]);

  const stopListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const cleanMarkdownForSpeech = (text) => {
    if (!text) return '';
    return text
      .replace(/```[\s\S]*?```/g, 'Code snippet omitted for speech.')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/#+\s+/g, '')
      .replace(/[*_~[\]]/g, '')
      .replace(/\(https?:\/\/[^\s)]+\)/g, '')
      .replace(/https?:\/\/[^\s]+/g, 'link')
      .trim();
  };

  const speak = useCallback((text) => {
    if (!speechSupported || !text) return;

    synthRef.current.cancel();

    const cleanText = cleanMarkdownForSpeech(text);
    if (!cleanText) return;

    const speechSnippet = cleanText.length > 600 ? cleanText.substring(0, 600) + '... and more written below.' : cleanText;

    const utterance = new SpeechSynthesisUtterance(speechSnippet);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    const voices = synthRef.current.getVoices();
    const naturalVoice = voices.find(
      (v) => (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Daniel') || v.lang.startsWith('en'))
    );
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  }, [speechSupported]);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const toggleAutoSpeak = useCallback(() => {
    setAutoSpeak((prev) => {
      const next = !prev;
      localStorage.setItem('astra_auto_speak', String(next));
      if (next) {
        toast.success('🔊 Voice responses enabled');
      } else {
        toast('🔇 Voice responses muted', { icon: '🔇' });
        stopSpeaking();
      }
      return next;
    });
  }, [stopSpeaking]);

  return {
    isListening,
    isSpeaking,
    voiceSupported,
    speechSupported,
    autoSpeak,
    toggleListening,
    stopListening,
    speak,
    stopSpeaking,
    toggleAutoSpeak,
  };
};
