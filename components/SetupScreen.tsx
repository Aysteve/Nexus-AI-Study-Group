import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Tutor, VoiceName, UserSubscription } from '../types.ts';
import { AVAILABLE_TUTORS, AVAILABLE_VOICES, VOICE_SAMPLES } from '../constants.ts';
import { GoogleGenAI } from '@google/genai';
import { UploadCloud, Users, Book, ArrowRight, Volume2, Loader2, Play, Pause, Lock } from 'lucide-react';
import TutorCard from './TutorCard.tsx';

interface SetupScreenProps {
  onStartSession: (tutors: Tutor[], material: { name: string; content: string }, voice: VoiceName) => void;
  userSubscription: UserSubscription;
}

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (reader.result) {
                resolve((reader.result as string).split(',')[1]);
            } else {
                reject(new Error("Failed to read file."));
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

const SetupScreen: React.FC<SetupScreenProps> = ({ onStartSession, userSubscription }) => {
  const [selectedTutorIds, setSelectedTutorIds] = useState<Set<string>>(new Set());
  const [studyFile, setStudyFile] = useState<File | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<VoiceName>('Zephyr');
  const [error, setError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingState, setProcessingState] = useState({ step: '', progress: 0 });

  const [audioPreview, setAudioPreview] = useState<HTMLAudioElement | null>(null);
  const [playingVoice, setPlayingVoice] = useState<VoiceName | null>(null);

  const maxTutors = userSubscription === 'premium' ? 6 : 3;
  const minTutors = 2;

  useEffect(() => {
    const audio = new Audio();
    const handleAudioEnd = () => setPlayingVoice(null);
    audio.addEventListener('ended', handleAudioEnd);
    audio.addEventListener('pause', handleAudioEnd);
    setAudioPreview(audio);
    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleAudioEnd);
      audio.removeEventListener('pause', handleAudioEnd);
    };
  }, []);

  const handlePlayPreview = useCallback((voice: VoiceName) => {
    if (!audioPreview) return;
    if (playingVoice === voice) {
      audioPreview.pause();
      setPlayingVoice(null);
    } else {
      audioPreview.src = VOICE_SAMPLES[voice];
      audioPreview.play().catch(e => console.error("Audio preview failed:", e));
      setPlayingVoice(voice);
    }
  }, [audioPreview, playingVoice]);

  const toggleTutorSelection = useCallback((tutorId: string) => {
    setSelectedTutorIds(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(tutorId)) {
        newSelection.delete(tutorId);
      } else {
        if (newSelection.size < maxTutors) newSelection.add(tutorId);
      }
      return newSelection;
    });
  }, [maxTutors]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      if (['.txt', '.md', '.pdf'].some(ext => fileName.endsWith(ext))) {
          setStudyFile(file);
          setError('');
      } else {
          setStudyFile(null);
          setError('Please upload a TXT, MD, or PDF file.');
      }
    }
  };

  const selectedTutors = useMemo(() => AVAILABLE_TUTORS.filter(t => selectedTutorIds.has(t.id)), [selectedTutorIds]);

  const handleStart = async () => {
    if (selectedTutors.length < minTutors) {
      setError(`Please select at least ${minTutors} tutors.`);
      return;
    }
    if (!studyFile) {
      setError('Please upload your study material.');
      return;
    }
    
    setIsProcessing(true);
    setError('');

    try {
        const file = studyFile!;
        const fileName = file.name.toLowerCase();
        let materialContent = '';

        setProcessingState({ step: 'Reading file...', progress: 20 });
        
        if (fileName.endsWith('.txt') || fileName.endsWith('.md')) {
            materialContent = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve((e.target?.result as string) || '');
                reader.onerror = (error) => reject(error);
                reader.readAsText(file);
            });
        } else {
            setProcessingState({ step: 'Processing document...', progress: 50 });
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const filePart = await fileToGenerativePart(file);
            const response = await ai.models.generateContent({
                model: 'gemini-flash-lite-latest',
                contents: { parts: [
                    filePart,
                    { text: 'Extract all study material from this document as raw text.' }
                ]},
            });
            materialContent = response.text || '';
        }

        setProcessingState({ step: 'Launching room...', progress: 100 });
        onStartSession(selectedTutors, { name: file.name, content: materialContent }, selectedVoice);
    } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to process file.");
        setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl p-10 md:p-16 border border-slate-200 dark:border-white/10 flex flex-col gap-12 animate-fade-in">
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Setup Study Group</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg font-medium">Select your specialist AI team and upload your material.</p>
      </header>

      <div className="space-y-8">
        <h2 className="flex items-center gap-3 text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white"><Users size={18}/></div>
          Select Specialists ({selectedTutorIds.size}/{maxTutors})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AVAILABLE_TUTORS.map(tutor => (
            <TutorCard 
              key={tutor.id} 
              tutor={tutor} 
              isSelected={selectedTutorIds.has(tutor.id)} 
              onSelect={() => toggleTutorSelection(tutor.id)}
              isDisabled={(selectedTutorIds.size >= maxTutors && !selectedTutorIds.has(tutor.id)) || isProcessing}
            />
          ))}
           {userSubscription === 'free' && (
             <div className="p-6 rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex flex-col items-center justify-center text-center gap-3">
                 <Lock className="text-slate-400" size={24}/>
                <h3 className="font-bold text-slate-900 dark:text-white">Premium Tutors</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Unlock more specialized advisors by upgrading your subscription.</p>
             </div>
           )}
        </div>
      </div>
      
       <div className="space-y-8">
        <h2 className="flex items-center gap-3 text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white"><Volume2 size={18}/></div>
            Session Voice
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {AVAILABLE_VOICES.map(voice => (
              <div key={voice} className={`flex items-center gap-3 border rounded-2xl p-4 transition-all cursor-pointer ${selectedVoice === voice ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900'}`} onClick={() => !isProcessing && setSelectedVoice(voice)}>
                  <label htmlFor={`voice-${voice}`} className="flex-1 text-sm font-bold cursor-pointer">{voice}</label>
                  <button onClick={(e) => { e.stopPropagation(); handlePlayPreview(voice); }} disabled={isProcessing} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors">
                    {playingVoice === voice ? <Pause size={14} className="text-blue-600"/> : <Play size={14} className="text-slate-500" />}
                  </button>
              </div>
            ))}
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="flex items-center gap-3 text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white"><Book size={18}/></div>
            Study Material
        </h2>
        <div className={`cursor-pointer bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[32px] p-12 flex flex-col items-center justify-center text-center transition-all ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500 hover:bg-slate-100/50 dark:hover:bg-white/10'}`}>
          <input id="file-upload" type="file" className="hidden" accept=".txt,.md,.pdf" onChange={handleFileChange} disabled={isProcessing} />
          <label htmlFor="file-upload" className="w-full cursor-pointer">
              <UploadCloud className="w-12 h-12 text-blue-600 mb-6 mx-auto" />
              {studyFile ? (
                <p className="font-bold text-xl text-blue-600">{studyFile.name}</p>
              ) : (
                <>
                  <p className="font-bold text-xl text-slate-900 dark:text-white">Upload your notes</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">Supports PDF, TXT, or Markdown</p>
                </>
              )}
          </label>
        </div>
      </div>

      {error && <p className="text-red-500 font-bold text-center bg-red-50 dark:bg-red-900/20 py-4 rounded-2xl">{error}</p>}
      
      <div className="pt-4">
        <button onClick={handleStart} disabled={selectedTutors.length < minTutors || !studyFile || isProcessing} className="w-full max-w-md mx-auto bg-blue-600 text-white font-black py-5 px-10 rounded-full shadow-xl shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-xl">
          {isProcessing ? (
             <div className="flex items-center gap-3">
                <Loader2 className="animate-spin" size={24} />
                <span>{processingState.step}</span>
            </div>
          ) : (
            <>
              Launch Session <ArrowRight size={22} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SetupScreen;