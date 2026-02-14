import React, { useState } from 'react';
import { Tutor } from '../types.ts';
import { X, MessageSquare } from 'lucide-react';

interface DialogueSetupModalProps {
  tutors: Tutor[];
  isOpen: boolean;
  onClose: () => void;
  onStartDialogue: (selectedTutors: Tutor[]) => void;
}

const DialogueSetupModal: React.FC<DialogueSetupModalProps> = ({ tutors, isOpen, onClose, onStartDialogue }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSelectTutor = (tutorId: string) => {
    setSelectedIds(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(tutorId)) {
        newSelection.delete(tutorId);
      } else {
        if (newSelection.size < 2) {
          newSelection.add(tutorId);
        }
      }
      return newSelection;
    });
  };

  const handleStart = () => {
    if (selectedIds.size === 2) {
      const selectedTutors = tutors.filter(t => selectedIds.has(t.id));
      onStartDialogue(selectedTutors);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl flex flex-col animate-fade-in">
        <header className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/10">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Dialogue Mode</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500">
            <X size={20} />
          </button>
        </header>
        <div className="p-6 flex flex-col gap-6">
          <p className="text-slate-600 dark:text-gray-300">Select exactly two tutors to start a focused conversation.</p>
          <div className="space-y-3">
            {tutors.map(tutor => {
              const isSelected = selectedIds.has(tutor.id);
              const isDisabled = !isSelected && selectedIds.size === 2;
              return (
                <div
                  key={tutor.id}
                  onClick={() => !isDisabled && handleSelectTutor(tutor.id)}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 cursor-pointer ${
                    isSelected ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-600' : 
                    isDisabled ? 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 opacity-50 cursor-not-allowed' : 
                    'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-blue-400'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 dark:border-slate-600'}`}>
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <img src={tutor.avatarUrl} alt={tutor.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{tutor.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-gray-400">{tutor.role}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={handleStart}
            disabled={selectedIds.size !== 2}
            className="mt-2 w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3.5 px-6 rounded-full shadow hover:bg-blue-700 transition-all disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed"
          >
            <MessageSquare size={18} /> Start Conversation
          </button>
        </div>
      </div>
    </div>
  );
};

export default DialogueSetupModal;