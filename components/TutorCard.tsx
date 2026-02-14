import React from 'react';
import { Tutor } from '../types.ts';

interface TutorCardProps {
  tutor: Tutor;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: () => void;
}

const TutorCard: React.FC<TutorCardProps> = ({ tutor, isSelected, isDisabled, onSelect }) => {
  return (
    <div 
      onClick={isDisabled ? undefined : onSelect}
      className={`p-5 rounded-3xl border-2 transition-all duration-300 flex items-center gap-5 ${
        isSelected
          ? 'bg-slate-900 text-white border-slate-900 shadow-xl'
          : isDisabled
          ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-white/5 opacity-40 cursor-not-allowed'
          : 'bg-white/70 backdrop-blur-md border-white/50 hover:border-indigo-400 cursor-pointer shadow-sm'
      }`}
      aria-disabled={isDisabled}
    >
      <img src={tutor.avatarUrl} alt={tutor.name} className={`w-14 h-14 rounded-2xl border-2 object-cover ${isSelected ? 'border-white/50' : 'border-slate-100'}`} />
      <div className="overflow-hidden">
        <h3 className={`font-bold text-base tracking-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
            {tutor.name}
        </h3>
        <p className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${isSelected ? 'text-slate-300' : 'text-indigo-600'}`}>{tutor.role}</p>
        <p className={`text-xs leading-relaxed line-clamp-2 ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>{tutor.description}</p>
      </div>
    </div>
  );
};

export default TutorCard;