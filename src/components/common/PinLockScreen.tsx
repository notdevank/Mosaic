import React, { useState, useEffect, useRef } from 'react';
import { Lock, KeyRound, AlertCircle, ShieldOff } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface PinLockScreenProps {
  onUnlocked: () => void;
}

export const PinLockScreen: React.FC<PinLockScreenProps> = ({ onUnlocked }) => {
  const { userSettings, updateUserSettings } = useStore();
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const targetPin = userSettings.pinCode || '';

  // Always keep pinEnabled active if pinCode is present
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
        setErrorMsg('Incorrect PIN. Please try again.');
        setTimeout(() => setPinInput(''), 400);
      }
    }
  };

  // Listen to physical keyboard events globally
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

  const handleDisableLock = () => {
    updateUserSettings({ pinEnabled: false });
    onUnlocked();
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="fixed inset-0 z-[100] bg-[#0D0D0D] text-white flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
    >
      <div className="w-full max-w-sm p-8 rounded-3xl bg-[#161616] border border-[#2A2A2A] flex flex-col items-center space-y-6">
        {/* Header Icon */}
        <div className="w-16 h-16 rounded-2xl bg-sage-500/10 border border-sage-500/30 flex items-center justify-center text-sage-300">
          <Lock className="w-8 h-8" />
        </div>

        {/* Title */}
        <div className="text-center space-y-1">
          <h2 className="font-serif text-2xl font-medium tracking-wide">
            Welcome Back, {userSettings.userName || 'User'}
          </h2>
          <p className="text-xs text-zinc-400 font-mono">
            Type your 4-digit PIN on keyboard or click numpad below
          </p>
        </div>

        {/* 4 PIN Box Inputs / Dots */}
        <div className="flex items-center gap-3 py-2 cursor-pointer">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pinInput.length > idx;
            const digit = isFilled ? '•' : '';
            return (
              <div
                key={idx}
                className={`w-12 h-14 rounded-2xl border flex items-center justify-center text-xl font-mono font-bold transition-all duration-150 ${
                  isFilled
                    ? 'bg-sage-500/20 border-sage-500 text-sage-300'
                    : 'bg-[#222222] border-[#333333] text-zinc-600'
                }`}
              >
                {digit}
              </div>
            );
          })}
        </div>

        {/* Error Message */}
        {errorMsg ? (
          <div className="flex items-center gap-1.5 text-xs text-red-400 font-medium">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMsg}</span>
          </div>
        ) : (
          <div className="h-4" />
        )}

        {/* Numeric Keypad Grid */}
        <div className="grid grid-cols-3 gap-2.5 w-full max-w-[240px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(num)}
              className="h-12 rounded-2xl bg-[#222222] hover:bg-[#2A2A2A] active:scale-95 text-base font-mono font-semibold text-white transition-quiet flex items-center justify-center border border-[#2A2A2A]"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="h-12 rounded-2xl bg-[#1A1A1A] hover:bg-[#222222] active:scale-95 text-xs font-mono text-zinc-400 transition-quiet flex items-center justify-center border border-[#2A2A2A]"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="h-12 rounded-2xl bg-[#222222] hover:bg-[#2A2A2A] active:scale-95 text-base font-mono font-semibold text-white transition-quiet flex items-center justify-center border border-[#2A2A2A]"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="h-12 rounded-2xl bg-[#1A1A1A] hover:bg-[#222222] active:scale-95 text-xs font-mono text-zinc-400 transition-quiet flex items-center justify-center border border-[#2A2A2A]"
            title="Backspace"
          >
            ⌫
          </button>
        </div>

        {/* One-Click Disable PIN Option */}
        <div className="pt-2 border-t border-[#2A2A2A] w-full text-center">
          <button
            type="button"
            onClick={handleDisableLock}
            className="flex items-center justify-center gap-1.5 mx-auto text-xs text-zinc-500 hover:text-zinc-300 font-mono transition-quiet"
          >
            <ShieldOff className="w-3.5 h-3.5" />
            <span>Disable PIN Lock</span>
          </button>
        </div>
      </div>
    </div>
  );
};
