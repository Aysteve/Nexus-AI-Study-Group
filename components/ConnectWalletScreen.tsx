
import React, { useState } from 'react';
import { ShieldCheck, Zap, Award, GraduationCap, Mail, Chrome, Loader2 } from 'lucide-react';

interface ConnectWalletScreenProps {
  onConnect: () => void;
}

const ConnectWalletScreen: React.FC<ConnectWalletScreenProps> = ({ onConnect }) => {
  const [email, setEmail] = useState('');
  const [isSigningIn, setIsSigningIn] = useState<'google' | 'email' | null>(null);

  const handleSignIn = (method: 'google' | 'email') => {
    setIsSigningIn(method);
    // Simulate a brief auth delay before proceeding to the app logic
    setTimeout(() => {
      setIsSigningIn(null);
      onConnect();
    }, 1200);
  };

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl p-8 md:p-16 border border-slate-200 dark:border-white/10 flex flex-col items-center text-center gap-10 animate-fade-in">
      <header>
        <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 transform rotate-3 shadow-xl">
            <GraduationCap className="text-white w-10 h-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          AI Study <span className="text-blue-600">Nexus</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg max-w-md mx-auto">
          The collaborative learning hub for the next generation of medical students.
        </p>
      </header>
      
      <div className="w-full max-w-sm flex flex-col gap-4">
        {/* Google Sign In */}
        <button 
          onClick={() => handleSignIn('google')}
          disabled={!!isSigningIn}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-bold py-4 px-8 rounded-full shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-[0.98] transition-all duration-200"
        >
          {isSigningIn === 'google' ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Chrome size={20} className="text-blue-500" />
              Sign in with Google
            </>
          )}
        </button>

        <div className="flex items-center gap-4 my-2">
            <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800"></div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">or</span>
            <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800"></div>
        </div>

        {/* Email Sign In */}
        <div className="flex flex-col gap-3">
            <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="email" 
                    placeholder="name@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full py-4 pl-12 pr-6 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all text-sm font-medium"
                />
            </div>
            <button 
                onClick={() => handleSignIn('email')}
                disabled={!!isSigningIn || !email.includes('@')}
                className="w-full bg-blue-600 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:bg-slate-300 dark:disabled:bg-slate-800"
            >
                {isSigningIn === 'email' ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Continue with Email'}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-4">
        <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
          <Award className="w-6 h-6 text-blue-600 mb-2 mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-white text-xs">Earn Study</h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Get rewarded for every session.</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
          <ShieldCheck className="w-6 h-6 text-blue-600 mb-2 mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-white text-xs">Onchain IDs</h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Verifiable study credentials.</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
          <Zap className="w-6 h-6 text-blue-600 mb-2 mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-white text-xs">AI Tutors</h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">24/7 personalized feedback.</p>
        </div>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
        Secure medical workspace for students.
      </p>
    </div>
  );
};

export default ConnectWalletScreen;
