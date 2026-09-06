import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

export default function VoiceInput({ value, onChange, onVoiceStart, onVoiceEnd }) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if browser supports Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
        if (onVoiceStart) onVoiceStart();
      };

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        // Append to existing value instead of replacing
        const newValue = value ? `${value} ${transcript}` : transcript;
        onChange(newValue);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (onVoiceEnd) onVoiceEnd();
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        if (onVoiceEnd) onVoiceEnd();
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  // Don't render if browser doesn't support speech recognition
  if (!isSupported) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={toggleListening}
      disabled={isListening}
      className={`p-2.5 rounded-xl border transition-all ${
        isListening
          ? 'bg-red-500 border-red-600 text-white animate-pulse'
          : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-green-500 hover:text-green-600'
      }`}
      title={isListening ? 'Listening...' : 'Click to speak'}
    >
      {isListening ? (
        <div className="relative">
          <MicOff className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping"></span>
        </div>
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </button>
  );
}
