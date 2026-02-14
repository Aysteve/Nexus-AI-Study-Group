import React, { useState, useMemo } from 'react';
import { UserProfile } from '../types.ts';
import { MOCK_STUDENTS } from '../constants.ts';
import { Search, MessageSquare } from 'lucide-react';
import ChatModal from './ChatModal.tsx';

interface StudentCardProps {
  student: UserProfile;
  onMessage: (student: UserProfile) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onMessage }) => (
  <div className="glass-card p-6 rounded-[32px] flex flex-col items-center text-center gap-4 transition-all hover:scale-[1.02] hover:bg-white/90">
    <div className="relative">
        <img src={student.profilePictureUrl} alt={student.bns} className="w-24 h-24 rounded-full border-4 border-white shadow-sm object-cover" />
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
    </div>
    <div>
      <h3 className="font-bold text-lg text-slate-900">{student.bns}</h3>
      <p className="text-xs text-slate-500 font-medium mb-2">{student.school}</p>
      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{student.major}</span>
    </div>
    <button
      onClick={() => onMessage(student)}
      className="mt-2 w-full flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800 font-bold py-3 px-4 rounded-full transition-all text-sm shadow-lg shadow-slate-900/10"
    >
      <MessageSquare size={16} /> Message
    </button>
  </div>
);

interface CommunityScreenProps {
  currentUser: UserProfile;
}

const CommunityScreen: React.FC<CommunityScreenProps> = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [chattingWith, setChattingWith] = useState<UserProfile | null>(null);
  
  const otherStudents = useMemo(() => MOCK_STUDENTS.filter(s => s.address !== currentUser.address), [currentUser.address]);

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return otherStudents;
    return otherStudents.filter(student =>
      student.bns.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.major?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.school?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, otherStudents]);

  return (
    <>
      <div className="w-full max-w-6xl flex flex-col gap-8 animate-fade-in px-4">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Community Hub</h1>
            <p className="text-slate-500 font-medium mt-1">Connect with {otherStudents.length} other students on Base.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full glass-pill border-none rounded-full pl-12 pr-6 py-3.5 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition shadow-lg shadow-indigo-500/5 font-medium"
            />
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredStudents.map(student => (
            <StudentCard key={student.address} student={student} onMessage={setChattingWith} />
          ))}
        </div>
         {filteredStudents.length === 0 && (
            <div className="text-center py-20 glass-card rounded-[40px]">
                <p className="text-slate-400 font-bold">No students found matching your search.</p>
            </div>
        )}
      </div>

      {chattingWith && (
        <ChatModal 
          currentUser={currentUser}
          otherUser={chattingWith}
          onClose={() => setChattingWith(null)}
        />
      )}
    </>
  );
};

export default CommunityScreen;