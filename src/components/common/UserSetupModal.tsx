import React, { useState } from 'react';
import { User, KeyRound, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface UserSetupModalProps {
  onCompleted: () => void;
}

export const UserSetupModal: React.FC<UserSetupModalProps> = ({ onCompleted }) => {
  const { updateUserSettings } = useStore();
  const [userName, setUserName] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!userName.trim()) {
      setErrorMsg('Please enter your name or username.');
      return;
    }

    if (pinCode.length !== 4 || !/^\d{4}$/.exec(pinCode)) {
      setErrorMsg('Please enter a 4-digit numeric passcode.');
      return;
    }

    if (pinCode !== confirmPin) {
      setErrorMsg('Passcodes do not match. Please verify.');
      return;
    }

    updateUserSettings({
      userName: userName.trim(),
      pinEnabled: true,
      pinCode,
      hasCompletedTutorial: true
    });

    onCompleted();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0D0D0D] text-white flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-md p-8 rounded-3xl bg-[#161616] border border-[#2A2A2A] shadow-2xl space-y-6">
        {/* Header Icon */}
        <div className="flex items-center gap-3 border-b border-[#2A2A2A] pb-5">
          <div className="w-12 h-12 rounded-2xl bg-sage-500/10 border border-sage-500/30 flex items-center justify-center text-sage-300">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-medium">Create Your Account</h2>
            <p className="text-xs text-zinc-400 font-mono">Set up your profile & security passcode</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
              What should you be called?
            </label>
            <div className="relative">
              <input
                type="text"
                autoFocus
                placeholder="e.g. Devank, Alex..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-[#222222] border border-[#333333] rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sage-400"
              />
            </div>
          </div>

          {/* Passcode / PIN Setup */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                4-Digit Passcode
              </label>
              <input
                type="password"
                maxLength={4}
                placeholder="****"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-[#222222] border border-[#333333] rounded-2xl px-4 py-3 text-center text-sm font-mono tracking-widest text-white focus:outline-none focus:border-sage-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                Confirm Passcode
              </label>
              <input
                type="password"
                maxLength={4}
                placeholder="****"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-[#222222] border border-[#333333] rounded-2xl px-4 py-3 text-center text-sm font-mono tracking-widest text-white focus:outline-none focus:border-sage-400"
              />
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 text-center font-medium">
              {errorMsg}
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-sage-500 hover:bg-sage-600 active:scale-98 text-white font-medium text-xs tracking-wider uppercase transition-quiet shadow-subtle"
            >
              <span>Create Account & Start Mosaic</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
