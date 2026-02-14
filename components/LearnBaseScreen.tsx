import React, { useState, useMemo, useCallback } from 'react';
import { BaseLearningModule, Tutor, VoiceName } from '../types.ts';
import { BASE_LEARNING_MODULES, AVAILABLE_TUTORS } from '../constants.ts';
import TutorCard from './TutorCard.tsx';
import { GraduationCap, CheckCircle, Award, ArrowRight } from 'lucide-react';

interface LearnBaseScreenProps {
  completedModules: Set<string>;
  isRewardClaimed: boolean;
  onClaimReward: () => void;
  onStartSession: (tutors: Tutor[], material: { name: string; content: string }, voice: VoiceName, moduleId: string) => void;
}

const LearnBaseScreen: React.FC<LearnBaseScreenProps> = ({ completedModules, isRewardClaimed, onClaimReward, onStartSession }) => {
  const [selectedModule, setSelectedModule] = useState<BaseLearningModule | null>(null);
  const [selectedTutorIds, setSelectedTutorIds] = useState<Set<string>>(new Set());

  const progress = useMemo(() => completedModules.size, [completedModules]);
  const requiredCompletions = 5;
  const canClaimReward = progress >= requiredCompletions;

  const toggleTutorSelection = useCallback((tutorId: string) => {
    setSelectedTutorIds(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(tutorId)) {
        newSelection.delete(tutorId);
      } else {
        if (newSelection.size < 4) {
          newSelection.add(tutorId);
        }
      }
      return newSelection;
    });
  }, []);

  const handleStartSession = () => {
    if (!selectedModule || selectedTutorIds.size < 3) return;
    const selectedTutors = AVAILABLE_TUTORS.filter(t => selectedTutorIds.has(t.id));
    onStartSession(selectedTutors, { name: selectedModule.title, content: selectedModule.content }, 'Zephyr', selectedModule.id);
  };
  
  const handleSelectModule = (module: BaseLearningModule) => {
      setSelectedModule(module);
      setSelectedTutorIds(new Set());
  }

  return (
    <div className="w-full max-w-6xl flex flex-col gap-8 animate-fade-in px-4">
      <header className="text-center">
        <div className="w-20 h-20 bg-indigo-600 rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-600/20 transform rotate-3">
            <GraduationCap className="text-white w-10 h-10" />
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">Learn Base</h1>
        <p className="text-slate-500 font-medium mt-3">Level up your onchain knowledge with AI specialists.</p>
      </header>

      <div className="glass-card rounded-[40px] p-10 text-center relative overflow-hidden">
        <div className="relative z-10">
            <h2 className="text-2xl font-black text-slate-900">Learning Progress</h2>
            <p className="text-slate-500 font-medium mb-6">Complete {requiredCompletions} modules to unlock 500 $STUDY</p>
            <div className="w-full max-w-md mx-auto bg-slate-100 rounded-full h-4 mb-3 overflow-hidden shadow-inner">
                <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-700 shadow-lg" 
                style={{ width: `${Math.min((progress / requiredCompletions) * 100, 100)}%` }}
                ></div>
            </div>
            <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">{progress} / {requiredCompletions} Completed</p>
            
            {canClaimReward && (
            <button
                onClick={onClaimReward}
                disabled={isRewardClaimed}
                className="mt-8 bg-slate-900 text-white font-black py-4 px-10 rounded-full shadow-2xl hover:bg-slate-800 transition-all active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:scale-100 flex items-center gap-3 mx-auto"
            >
                <Award size={22} />
                {isRewardClaimed ? 'Reward Claimed' : `Claim 500 $STUDY`}
            </button>
            )}
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full -mr-20 -mt-20" />
      </div>
      
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-4">
           {BASE_LEARNING_MODULES.map(module => {
               const isCompleted = completedModules.has(module.id);
               return (
                   <div 
                     key={module.id} 
                     onClick={() => handleSelectModule(module)}
                     className={`glass-card p-6 rounded-[32px] transition-all duration-300 cursor-pointer border-2 ${selectedModule?.id === module.id ? 'border-indigo-500 bg-white/90 ring-4 ring-indigo-50 shadow-2xl' : 'border-transparent hover:border-white/80'}`}
                   >
                       <div className="flex justify-between items-start">
                           <h3 className="font-bold text-lg text-slate-900 pr-4">{module.title}</h3>
                           {isCompleted && <div className="bg-emerald-100 p-1.5 rounded-full"><CheckCircle className="text-emerald-600" size={18} /></div>}
                       </div>
                       <p className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">{module.description}</p>
                   </div>
               )
           })}
        </div>

        <div className="lg:col-span-7 glass-card rounded-[40px] p-10 flex flex-col min-h-[500px]">
            {selectedModule ? (
                <>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Configure Room</h2>
                    <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-8">{selectedModule.title}</p>
                    
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Select 3-4 Specialist Tutors</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                         {AVAILABLE_TUTORS.map(tutor => (
                            <TutorCard 
                              key={tutor.id} 
                              tutor={tutor} 
                              isSelected={selectedTutorIds.has(tutor.id)} 
                              onSelect={() => toggleTutorSelection(tutor.id)}
                              isDisabled={selectedTutorIds.size >= 4 && !selectedTutorIds.has(tutor.id)}
                            />
                        ))}
                    </div>
                    <button
                        onClick={handleStartSession}
                        disabled={selectedTutorIds.size < 3}
                        className="w-full mt-auto bg-indigo-600 text-white font-black py-5 px-8 rounded-full shadow-2xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all disabled:bg-slate-200 disabled:text-slate-400 flex items-center justify-center gap-3 text-xl"
                    >
                        Launch Course Session <ArrowRight size={22} />
                    </button>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                    <div className="w-24 h-24 bg-slate-100 rounded-[32px] flex items-center justify-center mb-8 text-slate-300">
                        <GraduationCap size={48} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Select a Module</h3>
                    <p className="text-slate-500 font-medium max-w-xs">Pick a topic from the curriculum to assemble your AI tutor team.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default LearnBaseScreen;