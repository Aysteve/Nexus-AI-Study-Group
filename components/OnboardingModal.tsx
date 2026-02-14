import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, PlusCircle, History, Store, Users } from 'lucide-react';

interface OnboardingModalProps {
  onClose: () => void;
}

const steps = [
  {
    title: 'Welcome to Nexus',
    description: "Your new Web3-powered AI study hub. Let's take a quick tour of the key features to get you started.",
    content: <span className="text-6xl">👋</span>,
  },
  {
    title: 'Start a New Session',
    description: 'Click here in the header to assemble your AI tutor team, upload study materials, and begin an interactive voice session.',
    content: (
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl w-full max-w-xs mx-auto border border-slate-200 dark:border-slate-700">
            <div className="bg-white dark:bg-slate-900 rounded-lg p-3 flex justify-between items-center shadow-sm">
                <span className="font-bold text-blue-600 text-sm">Nexus</span>
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-blue-600 text-white flex items-center gap-1 shadow-sm ring-4 ring-blue-100 dark:ring-blue-900/30">
                       <PlusCircle size={14} />
                       <span className="font-bold text-xs pr-1">New Session</span>
                    </div>
                </div>
            </div>
        </div>
    )
  },
  {
    title: 'Review Your History',
    description: 'All your completed sessions, transcripts, and AI-generated summaries are saved here. Never lose your notes again!',
    content: (
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl w-full max-w-xs mx-auto border border-slate-200 dark:border-slate-700">
            <div className="bg-white dark:bg-slate-900 rounded-lg p-3 flex items-center shadow-sm gap-2">
                <div className="p-2 rounded-lg flex items-center gap-1 text-slate-400 bg-slate-50 dark:bg-slate-800">
                    <History size={16} />
                </div>
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center gap-2 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
                    <History size={16} />
                    <span className="font-bold text-xs">History</span>
                </div>
            </div>
        </div>
    )
  },
    {
    title: 'Explore the Marketplace',
    description: 'Use the $STUDY tokens you earn to buy and sell notes, mnemonics, and other study aids from the community.',
    content: (
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl w-full max-w-xs mx-auto border border-slate-200 dark:border-slate-700">
             <div className="bg-white dark:bg-slate-900 rounded-lg p-3 flex items-center shadow-sm gap-2">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center gap-2 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
                    <Store size={16} />
                    <span className="font-bold text-xs">Marketplace</span>
                </div>
            </div>
        </div>
    )
  },
  {
    title: "You're All Set!",
    description: 'You have everything you need to start your journey. Happy studying!',
    content: <span className="text-6xl">🚀</span>,
  },
];

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl flex flex-col animate-fade-in transition-all duration-300">
        <header className="flex items-center justify-between p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Quick Tour</h2>
           <div className="flex items-center gap-1.5">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentStep === index ? 'bg-blue-600 w-6' : 'bg-slate-300 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400">
            <X size={20} />
          </button>
        </header>
        <div className="p-8 pt-0 text-center flex flex-col items-center gap-6">
            <div className="w-full min-h-[120px] flex items-center justify-center">
               {step.content}
            </div>
            <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 min-h-[60px] text-sm leading-relaxed">{step.description}</p>
            </div>
        </div>
        <footer className="p-6 pt-0 flex justify-between items-center">
            <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="flex items-center gap-2 py-2.5 px-5 rounded-full font-bold text-sm transition hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
                <ArrowLeft size={16} /> Back
            </button>
            <button
                onClick={handleNext}
                className="flex items-center gap-2 py-2.5 px-6 rounded-full font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
            >
                {currentStep === steps.length - 1 ? "Let's Go!" : "Next"} <ArrowRight size={16} />
            </button>
        </footer>
      </div>
    </div>
  );
};

export default OnboardingModal;