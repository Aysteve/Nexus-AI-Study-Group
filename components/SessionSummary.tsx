
import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
// Added CheckCircle and PlusCircle to the lucide-react imports
import { FileText, Download, RotateCcw, Loader2, Award, Star, LayoutDashboard, Play, Pause, Music, CheckCircle, PlusCircle } from 'lucide-react';

interface SessionSummaryProps {
  transcript: string;
  audioUrl?: string;
  onStartNewSession: () => void;
  onClaimRewards: (amount: number) => void;
  onMintNFT: () => void;
  onNavigateToDashboard: () => void;
  onSummaryGenerated: (summary: string) => void;
}

const SessionSummary: React.FC<SessionSummaryProps> = ({ transcript, audioUrl, onStartNewSession, onClaimRewards, onMintNFT, onNavigateToDashboard, onSummaryGenerated }) => {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rewardsClaimed, setRewardsClaimed] = useState(false);
  const [nftMinted, setNftMinted] = useState(false);
  const [isReading, setIsReading] = useState(false);

  const generateSummary = useCallback(async () => {
    if (!transcript) return;
    setIsLoading(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Summarize this medical study session concisely with key takeaways and definitions: \n\n ${transcript}`,
        });
        setSummary(response.text);
        onSummaryGenerated(response.text);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [transcript, onSummaryGenerated]);

  const toggleReadAloud = () => {
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(summary || transcript);
      utterance.onend = () => setIsReading(false);
      window.speechSynthesis.speak(utterance);
      setIsReading(true);
    }
  };

  return (
    <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl p-10 md:p-16 border border-slate-200 dark:border-white/10 flex flex-col gap-10 animate-fade-in overflow-hidden">
      <header className="text-center">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Session Complete</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold uppercase text-xs tracking-widest">Mastery Achieved</p>
      </header>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-slate-50 dark:bg-black/20 rounded-[32px] p-8 border border-slate-100 dark:border-white/5 flex flex-col">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3"><FileText size={20} className="text-blue-600"/> Summary</h2>
            <div className="flex-1 overflow-y-auto text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                {isLoading ? <div className="flex items-center gap-2 text-blue-600 font-bold"><Loader2 className="animate-spin" /> Analyzing session...</div> : summary || "Click generate to see insights."}
            </div>
            {!summary && !isLoading && (
                <button onClick={generateSummary} className="mt-8 bg-blue-600 text-white font-bold py-4 rounded-full hover:bg-blue-700 transition-all">Generate AI Analysis</button>
            )}
            {summary && (
                <button onClick={toggleReadAloud} className="mt-8 bg-slate-900 dark:bg-white dark:text-black text-white font-bold py-4 rounded-full hover:opacity-90 transition-all flex items-center justify-center gap-2">
                    {isReading ? <Pause size={18}/> : <Play size={18}/>} {isReading ? 'Stop Reading' : 'Listen to Summary'}
                </button>
            )}
        </div>

        <div className="flex flex-col gap-6">
            <div className="bg-blue-600 p-8 rounded-[32px] text-white flex flex-col items-center text-center shadow-lg shadow-blue-600/20">
                <Award size={48} className="mb-4" />
                <h3 className="text-2xl font-black mb-2">Rewards Ready</h3>
                <p className="text-blue-100 text-sm font-medium mb-8">You've earned tokens for this productive study session.</p>
                <button 
                    onClick={() => { onClaimRewards(100); setRewardsClaimed(true); }} 
                    disabled={rewardsClaimed}
                    className="w-full bg-white text-blue-600 font-black py-4 rounded-full shadow-lg disabled:opacity-50 disabled:bg-blue-100 transition-all active:scale-95"
                >
                    {rewardsClaimed ? 'Study Claimed' : 'Claim 100 $STUDY'}
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-[32px] border border-slate-200 dark:border-white/10 flex items-center justify-between group cursor-pointer" onClick={() => { onMintNFT(); setNftMinted(true); }}>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600">
                        <Star size={24} fill="currentColor" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">Mint Credential</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">Verifiable on Base</p>
                    </div>
                </div>
                {nftMinted ? <CheckCircle className="text-emerald-500" /> : <PlusCircle className="text-slate-300 group-hover:text-blue-600 transition-colors" />}
            </div>
        </div>
      </div>

      {audioUrl && (
        <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[24px] border border-slate-200 dark:border-white/5 flex items-center gap-6">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white"><Music size={24}/></div>
            <div className="flex-1"><audio controls src={audioUrl} className="w-full h-8" /></div>
        </div>
      )}

      <footer className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
        <button onClick={onStartNewSession} className="flex items-center gap-3 font-black text-blue-600 hover:text-blue-700 transition-colors">
            <RotateCcw size={20} /> Start New Session
        </button>
        <button onClick={onNavigateToDashboard} className="flex items-center gap-3 font-black text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            <LayoutDashboard size={20} /> Back to Dashboard
        </button>
      </footer>
    </div>
  );
};

export default SessionSummary;
