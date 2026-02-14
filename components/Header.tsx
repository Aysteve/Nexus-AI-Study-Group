import React from 'react';
import { UserProfile, AppState } from '../types.ts';
import { GraduationCap, LayoutDashboard, History, PlusCircle } from 'lucide-react';

interface HeaderProps {
  userProfile: UserProfile;
  onDisconnect: () => void;
  onNavigate: (state: AppState) => void;
  onOpenP2PModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ userProfile, onNavigate }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between glass-pill p-3 rounded-full shadow-lg">
        <div onClick={() => onNavigate(AppState.DASHBOARD)} className="flex items-center gap-3 cursor-pointer pl-2">
          <div className="bg-slate-900 rounded-full w-10 h-10 flex items-center justify-center text-white">
            <GraduationCap size={20} />
          </div>
          <span className="font-black tracking-tighter text-xl hidden sm:block">NEXUS</span>
        </div>

        <nav className="flex items-center gap-1">
          <button onClick={() => onNavigate(AppState.DASHBOARD)} className="px-4 py-2 rounded-full text-sm font-bold hover:bg-white/50 transition-all flex items-center gap-2">
            <LayoutDashboard size={16} /> <span className="hidden md:inline">Dashboard</span>
          </button>
          <button onClick={() => onNavigate(AppState.HISTORY)} className="px-4 py-2 rounded-full text-sm font-bold hover:bg-white/50 transition-all flex items-center gap-2">
            <History size={16} /> <span className="hidden md:inline">History</span>
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end pr-1">
            <span className="text-[10px] font-black text-slate-400 uppercase leading-none">Balance</span>
            <span className="text-sm font-black text-slate-900 tracking-tight">{userProfile.balance} STUDY</span>
          </div>
          <button onClick={() => onNavigate(AppState.PROFILE)} className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden">
            <img src={userProfile.profilePictureUrl} className="w-full h-full object-cover" alt="Profile" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;