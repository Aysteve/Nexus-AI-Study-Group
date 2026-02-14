import React, { useState } from 'react';
import { Loader2, Check, ArrowRight, X, Shield } from 'lucide-react';

interface CreateProfileNameScreenProps {
  onProfileCreated: (bns: string) => void;
}

const CreateProfileNameScreen: React.FC<CreateProfileNameScreenProps> = ({ onProfileCreated }) => {
  const [name, setName] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''));
  };

  const handleMint = () => {
    setIsMinting(true);
    setTimeout(() => {
      setIsMinting(false);
      setIsDone(true);
    }, 2000);
  };

  if (isDone) {
      return (
        <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl p-12 text-center border border-slate-200 dark:border-white/10 animate-fade-in">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-xl">
                <Check size={40} strokeWidth={4} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Identity Created</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 font-medium">Welcome to the medical nexus, <span className="text-blue-600 font-bold">{name}.base</span></p>
            <button onClick={() => onProfileCreated(name)} className="w-full bg-blue-600 text-white font-black py-5 rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-3 text-xl">
                Start Learning <ArrowRight size={22} />
            </button>
        </div>
      )
  }

  return (
    <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl p-12 text-center border border-slate-200 dark:border-white/10 animate-fade-in">
      <header className="mb-12">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6"><Shield size={32}/></div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Create Identity</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium">Set your onchain student name.</p>
      </header>

      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="e.g. neurosurgeon"
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-5 text-2xl font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-600/10 focus:outline-none transition-all placeholder:text-slate-300"
            />
          </div>
          <span className="text-2xl font-black text-slate-400">.base</span>
        </div>

        <button
          onClick={handleMint}
          disabled={name.length < 3 || isMinting}
          className="w-full bg-blue-600 text-white font-black py-5 rounded-full shadow-xl shadow-blue-600/10 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:bg-slate-300 dark:disabled:bg-slate-800 flex items-center justify-center gap-3 text-xl"
        >
          {isMinting ? <><Loader2 className="animate-spin" size={24}/> Minting Profile...</> : 'Claim & Continue'}
        </button>
      </div>
      <p className="text-sm text-slate-400 mt-10 font-bold uppercase tracking-widest">Powered by Base Name Service</p>
    </div>
  );
};

export default CreateProfileNameScreen;