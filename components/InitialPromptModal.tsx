import React, { useState } from 'react';
import { X, Mic, Send } from 'lucide-react';

interface InitialPromptModalProps {
  onStart: (initialPrompt: string) => void;
  onClose: () => void;
  studyMaterialName: string;
}

const InitialPromptModal: React.FC<InitialPromptModalProps> = ({ onStart, onClose, studyMaterialName }) => {
  const [initialPrompt, setInitialPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialPrompt.trim()) {
      onStart(initialPrompt.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-card rounded-[40px] p-10 text-center animate-fade-in relative shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-all"><X size={20}/></button>
        
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-8 shadow-indigo-600/20 shadow-xl">
          <Mic size={32} />
        </div>
        
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Set Focus</h2>
        <p className="text-slate-500 text-sm mb-10 leading-relaxed font-medium">
          Your AI tutors are waiting. What should we focus on for <span className="text-indigo-600 font-bold">{studyMaterialName}</span>?
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <textarea
            autoFocus
            rows={3}
            value={initialPrompt}
            onChange={(e) => setInitialPrompt(e.target.value)}
            placeholder="e.g. Master cardiac drug interactions..."
            className="w-full bg-slate-50 border-none rounded-[24px] p-6 text-sm font-medium focus:ring-4 focus:ring-indigo-100 transition-all resize-none shadow-inner"
            required
          />
          <button
            type="submit"
            disabled={!initialPrompt.trim()}
            className="w-full bg-slate-900 text-white font-black py-5 rounded-full shadow-xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
          >
            Start Session <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default InitialPromptModal;