import React, { useState } from 'react';
import { PastSession } from '../types.ts';
import { History, ArrowLeft, Clock, BookOpen, ChevronRight } from 'lucide-react';
import SessionDetailModal from './SessionDetailModal.tsx';

interface SessionHistoryScreenProps {
  sessions: PastSession[];
  onUpdateSessionSummary: (sessionId: string, summary: string) => void;
  onNavigateBack: () => void;
}

const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    let parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 && hours === 0) parts.push(`${seconds}s`);
    
    return parts.join(' ') || '0s';
};

const SessionHistoryScreen: React.FC<SessionHistoryScreenProps> = ({ sessions, onUpdateSessionSummary, onNavigateBack }) => {
  const [selectedSession, setSelectedSession] = useState<PastSession | null>(null);

  return (
    <>
      <div className="w-full max-w-5xl flex flex-col gap-8 animate-fade-in px-4">
        <header className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center justify-center sm:justify-start gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg"><History size={24}/></div>
                    History
                </h1>
                <p className="text-slate-500 font-medium mt-1">Review your path to medical mastery.</p>
            </div>
            <button
                onClick={onNavigateBack}
                className="flex items-center gap-2 glass-pill hover:bg-white font-bold py-3 px-6 rounded-full transition-all text-sm shadow-md"
            >
                <ArrowLeft size={18} /> Dashboard
            </button>
        </header>

        <div className="space-y-4">
          {sessions.length > 0 ? (
            sessions.map(session => (
              <div 
                key={session.id} 
                onClick={() => setSelectedSession(session)}
                className="glass-card p-6 rounded-[32px] flex flex-col sm:flex-row justify-between sm:items-center gap-4 cursor-pointer hover:bg-white/90 transition-all border-l-8 border-l-indigo-500"
              >
                <div>
                  <h3 className="font-bold text-xl text-slate-900">{session.topic}</h3>
                  <div className="flex items-center flex-wrap gap-x-6 gap-y-1 text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">
                      <span>{session.date}</span>
                      <span className="flex items-center gap-1.5"><Clock size={14} className="text-indigo-500"/> {formatTime(session.durationInSeconds)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full hidden md:block">VIEW DETAILS</span>
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg">
                        <ChevronRight size={20}/>
                    </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-24 glass-card rounded-[40px] flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                <History size={40} />
              </div>
              <div>
                <p className="text-slate-900 font-black text-xl">No sessions yet</p>
                <p className="text-slate-400 font-medium text-sm mt-1">Start your first study session to see it here!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedSession && (
        <SessionDetailModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onUpdateSummary={onUpdateSessionSummary}
        />
      )}
    </>
  );
};

export default SessionHistoryScreen;