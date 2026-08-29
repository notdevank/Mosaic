import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { MosaicAmbientBG } from './MosaicAmbientBG';

interface PinLockScreenProps {
  onUnlocked: () => void;
}

export const PinLockScreen: React.FC<PinLockScreenProps> = ({ onUnlocked }) => {
  const { userSettings, updateUserSettings } = useStore();
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  const targetPin = userSettings.pinCode || '';

  useEffect(() => {
    if (userSettings.pinCode && userSettings.pinEnabled === false) {
      updateUserSettings({ pinEnabled: true });
    }
  }, []);

  const processPin = (nextPin: string) => {
    const cleaned = nextPin.replace(/\D/g, '').slice(0, 4);
    setErrorMsg(null);
    setPinInput(cleaned);

    if (cleaned.length === 4) {
      if (cleaned === targetPin) {
        onUnlocked();
      } else {
        setErrorMsg('Incorrect passcode');
        setIsShaking(true);
        setTimeout(() => {
          setIsShaking(false);
          setPinInput('');
        }, 400);
      }
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        if (pinInput.length < 4) {
          processPin(pinInput + e.key);
        }
      } else if (e.key === 'Backspace') {
        setErrorMsg(null);
        setPinInput(prev => prev.slice(0, -1));
      } else if (e.key === 'Escape') {
        setErrorMsg(null);
        setPinInput('');
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [pinInput, targetPin]);

  const handleKeyPress = (num: string) => {
    if (pinInput.length >= 4) return;
    processPin(pinInput + num);
  };

  const handleDelete = () => {
    setErrorMsg(null);
    setPinInput(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setErrorMsg(null);
    setPinInput('');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-warm-bg dark:bg-[#121214] text-primary-text dark:text-white flex items-center justify-center p-6 select-none overflow-hidden animate-in fade-in duration-200">
      <MosaicAmbientBG />

      <div className="relative z-10 w-full max-w-xs p-8 rounded-3xl bg-warm-card/90 dark:bg-[#1A1A1E]/90 border border-warm-border/80 dark:border-white/10 shadow-elevated backdrop-blur-xl flex flex-col items-center space-y-7">
        
        {/* Title */}
        <div className="text-center space-y-1">
          <h1 className="font-serif text-2xl font-medium tracking-tight text-primary-text dark:text-white">
            {userSettings.userName ? userSettings.userName : 'Mosaic'}
          </h1>
        </div>

        {/* Passcode Indicator Dots */}
        <div className={`flex items-center justify-center gap-3.5 py-1 ${isShaking ? 'animate-bounce text-red-500' : ''}`}>
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pinInput.length > idx;
            return (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-full border transition-all duration-150 ${
                  isFilled
                    ? 'bg-sage-500 border-sage-500 scale-110 shadow-xs'
                    : 'border-warm-border dark:border-zinc-700 bg-transparent'
                }`}
              />
            );
          })}
        </div>

        {/* Error Feedback */}
        <div className="h-4 flex items-center justify-center">
          {errorMsg && (
            <div className="flex items-center gap-1 text-xs text-red-500 font-mono animate-in fade-in">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Numpad Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[210px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(num)}
              className="w-14 h-14 mx-auto rounded-full bg-warm-subtle/60 dark:bg-zinc-800/50 hover:bg-sage-500/15 dark:hover:bg-sage-500/25 active:scale-95 text-base font-mono font-medium text-primary-text dark:text-white border border-warm-border/50 dark:border-white/10 transition-all duration-150 flex items-center justify-center"
            >
              {num}
            </button>
          ))}

          <button
            type="button"
            onClick={handleClear}
            className="w-14 h-14 mx-auto rounded-full text-xs font-mono text-primary-secondary hover:text-primary-text dark:hover:text-white transition-quiet flex items-center justify-center"
          >
            Clear
          </button>

          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="w-14 h-14 mx-auto rounded-full bg-warm-subtle/60 dark:bg-zinc-800/50 hover:bg-sage-500/15 dark:hover:bg-sage-500/25 active:scale-95 text-base font-mono font-medium text-primary-text dark:text-white border border-warm-border/50 dark:border-white/10 transition-all duration-150 flex items-center justify-center"
          >
            0
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="w-14 h-14 mx-auto rounded-full text-sm font-mono text-primary-secondary hover:text-primary-text dark:hover:text-white transition-quiet flex items-center justify-center"
            title="Backspace"
          >
            ⌫
          </button>
        </div>

      </div>
    </div>
  );
};
