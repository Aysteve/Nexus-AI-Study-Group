
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Tutor, VoiceName, SessionStatus, TutorRole } from '../types.ts';
import useGeminiLive from '../hooks/useGeminiLive.ts';
import Timer from './Timer.tsx';
import InitialPromptModal from './InitialPromptModal.tsx';
// Added missing Bell import
import { Mic, MicOff, PhoneOff, MessageSquare, Radio, Hand, Camera, Headphones, X, Send, Bell } from 'lucide-react';

interface StudyRoomProps {
  tutors: Tutor[];
  studyMaterial: { name: string; content: string };
  sessionVoice: VoiceName;
  onEndSession: (transcript: string, durationInSeconds: number, audioUrl?: string) => void;
}

const StudyRoom: React.FC<StudyRoomProps> = ({ tutors, studyMaterial, sessionVoice, onEndSession }) => {
  const [isInitialPromptModalOpen, setIsInitialPromptModalOpen] = useState(true);
  const [activeSpeaker, setActiveSpeaker] = useState('User');
  const [seconds, setSeconds] = useState(0);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [micVolume, setMicVolume] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

  const transcriptEndRef = useRef<HTMLDivElement>(null);

  const sessionLead = useMemo(() => tutors.find(t => t.role === TutorRole.EXPLAINER) || tutors[0], [tutors]);
  
  const systemInstruction = useMemo(() => {
    const tutorDescriptions = tutors.map(t => `- ${t.name} (${t.role}): ${t.description}`).join('\n');
    return `You are a panel of expert AI tutors in a medical/pharmacy study session. Panel:\n${tutorDescriptions}\nMaterial Content:\n${studyMaterial.content}\nRules: 1. Keep responses short (1-3 sentences). 2. Always prefix your response with your name like 'Clara:'. 3. Turn-taking is key.`;
  }, [tutors, studyMaterial]);

  const { status, transcript, startSession, endSession, sendTextMessage, isMuted, toggleMute, isRecording, toggleRecording, getRecordingAsWavBlob } = useGeminiLive(systemInstruction, sessionVoice, (v) => setMicVolume(v));

  useEffect(() => {
    let interval: any = null;
    if (status === SessionStatus.Connected) interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (transcript.length > 0) {
      setActiveSpeaker(transcript[transcript.length - 1].speaker);
      transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcript]);

  const handleStartConversation = (initialFocus: string) => {
    startSession();
    setTimeout(() => sendTextMessage(`Start session. User focus: "${initialFocus}". ${sessionLead.name}, begin.`), 1000);
    setIsInitialPromptModalOpen(false);
  };
  
  const handleEndSessionInternal = async () => {
    const fullTranscript = transcript.map(entry => `${entry.speaker}: ${entry.text}`).join('\n');
    let audioUrl: string | undefined = undefined;
    if (isRecording) {
        const blob = await getRecordingAsWavBlob();
        if (blob) audioUrl = URL.createObjectURL(blob);
    }
    onEndSession(fullTranscript, seconds, audioUrl);
    endSession();
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    sendTextMessage(chatMessage);
    setChatMessage("");
  };

  // Added handleToggleHandRaise to fix missing name error
  const handleToggleHandRaise = () => {
    setIsHandRaised(prev => !prev);
  };

  return (
    <div className="fixed inset-0 bg-slate-100 flex items-center justify-center p-0 md:p-8 animate-fade-in overflow-hidden">
       {isInitialPromptModalOpen && <InitialPromptModal onStart={handleStartConversation} onClose={handleEndSessionInternal} studyMaterialName={studyMaterial.name} />}
      
      <div className="relative w-full max-w-lg h-full md:max-h-[850px] bg-slate-900 md:rounded-[60px] shadow-2xl overflow-hidden flex flex-col">
        {/* Main Background Image (Tutor) */}
        <div className="absolute inset-0">
          <img 
            src={sessionLead.avatarUrl} 
            alt={sessionLead.name} 
            className="w-full h-full object-cover brightness-90 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        </div>

        {/* Top Header */}
        <header className="relative z-10 flex justify-between items-start p-6">
          <button onClick={handleEndSessionInternal} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all">
            <X size={20} />
          </button>
          <div className="flex flex-col items-center">
             <h2 className="text-white font-bold text-lg">{studyMaterial.name.split('.')[0]}</h2>
             <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">{status === SessionStatus.Connected ? 'Live' : 'Connecting'}</span>
                <span className="text-[10px] text-white/50 font-bold ml-2"><Timer seconds={seconds} /></span>
             </div>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Bell size={18} />
            </button>
            <button onClick={() => setIsChatOpen(!isChatOpen)} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <MessageSquare size={18} />
            </button>
          </div>
        </header>

        {/* Floating Participants */}
        <div className="relative z-10 flex-1 flex flex-col justify-center gap-4 p-6 overflow-hidden">
          <div className="space-y-4">
             {tutors.filter(t => t.id !== sessionLead.id).map((tutor) => (
                <div key={tutor.id} className="relative w-20 h-24 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg group">
                    <img src={tutor.avatarUrl} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md p-1">
                        <p className="text-[10px] text-white font-bold text-center truncate">{tutor.name}</p>
                    </div>
                    {activeSpeaker === tutor.name && (
                       <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-white animate-pulse" />
                    )}
                </div>
             ))}
          </div>
        </div>

        {/* Transcript Overlay (if chat closed) */}
        {!isChatOpen && transcript.length > 0 && (
          <div className="relative z-10 px-8 pb-32">
             <div className="max-w-xs animate-fade-in">
                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">{transcript[transcript.length-1].speaker}</p>
                <p className="text-white text-lg font-medium leading-tight">{transcript[transcript.length-1].text}</p>
             </div>
          </div>
        )}

        {/* Chat Drawer */}
        {isChatOpen && (
          <div className="absolute inset-0 z-20 bg-white flex flex-col animate-slide-in-bottom">
            <header className="flex justify-between items-center p-6 border-b border-slate-100">
               <div>
                  <h3 className="font-bold text-lg">Room Chat</h3>
                  <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-emerald-500"/> {tutors.length} AI Tutors active</p>
               </div>
               <button onClick={() => setIsChatOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><X size={18}/></button>
            </header>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {transcript.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.speaker === 'User' ? 'flex-row-reverse' : ''}`}>
                   <div className={`flex flex-col ${msg.speaker === 'User' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                      <span className="text-[10px] text-slate-400 font-bold uppercase mb-1">{msg.speaker}</span>
                      <div className={`p-4 rounded-3xl text-sm leading-relaxed ${msg.speaker === 'User' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'}`}>
                        {msg.text}
                      </div>
                   </div>
                </div>
              ))}
              <div ref={transcriptEndRef} />
            </div>
            <form onSubmit={handleSendChat} className="p-6 bg-white border-t border-slate-100">
              <div className="relative">
                <input 
                  value={chatMessage} 
                  onChange={(e) => setChatMessage(e.target.value)} 
                  placeholder="Type message..." 
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-4 pr-12 focus:ring-0 text-sm" 
                />
                <button type="submit" className="absolute right-2 top-1.5 w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"><Send size={18}/></button>
              </div>
            </form>
          </div>
        )}

        {/* Fixed Control Bar */}
        <div className="absolute bottom-10 left-6 right-6 z-10">
          <div className="glass-pill rounded-full p-2 flex justify-between items-center shadow-xl">
             <div className="flex gap-2">
                <button className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-all"><Camera size={20}/></button>
                <button className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-all"><Headphones size={20}/></button>
             </div>
             
             <button onClick={toggleMute} className={`w-14 h-14 rounded-full flex items-center justify-center text-white transition-all transform active:scale-90 ${isMuted ? 'bg-slate-400' : 'bg-indigo-600 shadow-indigo-600/40 shadow-lg'}`}>
                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
             </button>

             <div className="flex gap-2">
                <button onClick={handleToggleHandRaise} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isHandRaised ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}><Hand size={20}/></button>
                <button onClick={handleEndSessionInternal} className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-rose-500/40 shadow-lg hover:bg-rose-600 transition-all"><PhoneOff size={20}/></button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyRoom;
