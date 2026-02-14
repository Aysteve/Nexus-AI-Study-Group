import React from 'react';
import { UserProfile, PastSession, AppState, Reminder } from '../types.ts';
import { ArrowRight, Clock, PlusCircle, Bell, History, TrendingUp, ChevronRight, FileText, Check } from 'lucide-react';

interface DashboardScreenProps {
  userProfile: UserProfile;
  onStartNewSession: () => void;
  onNavigate: (state: AppState) => void;
  pastSessions: PastSession[];
  reminders: Reminder[];
  onAddReminder: (title: string, dateTime: string) => void;
}

const AnalyticsChart = () => (
  <div className="relative h-48 w-full mt-6">
    <svg viewBox="0 0 400 150" className="w-full h-full">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#818cf8', stopOpacity: 0.2 }} />
          <stop offset="100%" style={{ stopColor: '#818cf8', stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      <path d="M0,120 Q50,110 80,80 T160,60 T240,100 T320,40 T400,30" fill="none" stroke="#6366f1" strokeWidth="3" />
      <path d="M0,120 Q50,110 80,80 T160,60 T240,100 T320,40 T400,30 V150 H0 Z" fill="url(#grad1)" />
      <path d="M0,130 Q60,120 100,100 T180,90 T260,110 T340,70 T400,60" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="4 2" />
      <circle cx="280" cy="85" r="5" fill="#6366f1" />
      <rect x="250" y="45" width="60" height="30" rx="15" fill="#1e293b" />
      <text x="262" y="65" fill="white" fontSize="10" fontWeight="bold">+12%</text>
    </svg>
    <div className="flex justify-between text-[10px] text-slate-400 font-medium uppercase mt-2">
      <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
    </div>
  </div>
);

const HomeworkTask = ({ title, progress, icon: Icon }: { title: string, progress: number, icon: any }) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/40 transition-all cursor-pointer group">
    <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white">
      <Icon size={20} />
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
        <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
      </div>
    </div>
    <span className="text-lg font-black text-slate-900">{progress}%</span>
  </div>
);

const DashboardScreen: React.FC<DashboardScreenProps> = ({ userProfile, onStartNewSession, onNavigate, pastSessions }) => {
  return (
    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in pb-20 px-4">
      {/* Analytics Column */}
      <div className="lg:col-span-5 space-y-8">
        <div className="glass-card rounded-[40px] p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold tracking-tight">Performance Chart</h2>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer">
              <Bell size={16} />
            </div>
          </div>
          <p className="text-slate-400 text-xs font-medium uppercase mb-4">Track results and watch your progress rise</p>
          <div className="flex gap-4 text-[10px] font-bold mb-8">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500"/> Theory</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-pink-400"/> Practice</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-300"/> Lexicon</span>
          </div>
          <AnalyticsChart />
        </div>

        <div className="glass-card rounded-[40px] p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold tracking-tight">Homework</h2>
            <div className="bg-slate-100 px-4 py-1 rounded-full text-[10px] font-bold text-slate-500 flex items-center gap-2 cursor-pointer">
              Day <ChevronRight size={12} />
            </div>
          </div>
          <div className="space-y-2">
            <HomeworkTask title="Master 10 clinical terms" progress={57} icon={FileText} />
            <HomeworkTask title="Pharmacology quiz 2.1" progress={42} icon={Check} />
          </div>
        </div>
      </div>

      {/* Hero & Navigation Column */}
      <div className="lg:col-span-7 space-y-8">
        <div className="bg-slate-900 rounded-[40px] p-12 text-white shadow-2xl relative overflow-hidden h-[400px] flex flex-col justify-end group">
          <div className="absolute top-12 left-12">
            <TrendingUp size={48} className="text-indigo-400 opacity-50 mb-4" />
            <h1 className="text-5xl font-black leading-tight tracking-tighter">AI Study<br/>Nexus</h1>
          </div>
          <div className="relative z-10 max-w-sm">
            <p className="text-slate-400 text-lg mb-8 font-medium">Ready to master your medical exams today, {userProfile.bns.split('.')[0]}?</p>
            <button onClick={onStartNewSession} className="bg-white text-slate-900 font-black py-4 px-10 rounded-full shadow-lg hover:bg-indigo-50 active:scale-95 transition-all flex items-center gap-3 text-lg">
              <PlusCircle size={22} /> Start Session
            </button>
          </div>
          <div className="absolute -right-20 -bottom-20 w-[400px] h-[400px] bg-indigo-500/20 blur-[100px] rounded-full" />
        </div>

        <div className="grid grid-cols-2 gap-6">
           <div onClick={() => onNavigate(AppState.HISTORY)} className="glass-card p-6 rounded-[32px] cursor-pointer hover:bg-white/80 transition-all flex flex-col gap-4 group">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                <History size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Session History</h3>
                <p className="text-xs text-slate-400 mt-1">{pastSessions.length} sessions completed</p>
              </div>
           </div>
           <div onClick={() => onNavigate(AppState.LEARN_BASE)} className="glass-card p-6 rounded-[32px] cursor-pointer hover:bg-white/80 transition-all flex flex-col gap-4 group">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                <TrendingUp size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Learn Base</h3>
                <p className="text-xs text-slate-400 mt-1">Earn rewards</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;