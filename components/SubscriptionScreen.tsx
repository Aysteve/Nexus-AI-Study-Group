import React from 'react';
import { UserProfile } from '../types.ts';
import { PREMIUM_SUBSCRIPTION_PRICE, FREE_TIER_FEATURES, PREMIUM_TIER_FEATURES } from '../constants.ts';
import { ArrowLeft, Check, Crown, Zap } from 'lucide-react';

interface SubscriptionScreenProps {
  userProfile: UserProfile;
  onUpgrade: () => void;
  onNavigateBack: () => void;
}

const SubscriptionScreen: React.FC<SubscriptionScreenProps> = ({ userProfile, onUpgrade, onNavigateBack }) => {
    const canAfford = userProfile.balance >= PREMIUM_SUBSCRIPTION_PRICE;

    return (
    <div className="w-full max-w-6xl flex flex-col gap-8 animate-fade-in px-4">
        <header className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center justify-center sm:justify-start gap-3">
                   <Crown className="text-amber-500" size={32} /> Nexus Plans
                </h1>
                <p className="text-slate-500 font-medium mt-1">Unlock professional-grade AI study tools.</p>
            </div>
            <button
                onClick={onNavigateBack}
                className="flex items-center gap-2 glass-pill hover:bg-white font-bold py-3 px-6 rounded-full transition-all text-sm shadow-md"
            >
                <ArrowLeft size={18} /> Back
            </button>
        </header>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">
            {/* Free Tier */}
            <div className={`glass-card p-10 rounded-[40px] flex flex-col relative overflow-hidden transition-all hover:scale-[1.01] ${userProfile.subscription === 'free' ? 'border-4 border-indigo-500 ring-8 ring-indigo-50' : 'opacity-80'}`}>
                {userProfile.subscription === 'free' && (
                     <div className="absolute top-6 right-6 bg-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Active</div>
                )}
                <h2 className="text-3xl font-black text-slate-900">Standard</h2>
                <p className="text-slate-500 font-medium mt-2">Essential AI assistance.</p>
                <div className="my-10 flex items-baseline gap-2">
                    <span className="text-6xl font-black text-slate-900">0</span>
                    <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">$STUDY / month</span>
                </div>
                <ul className="space-y-5 flex-grow mb-10">
                    {FREE_TIER_FEATURES.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-700 font-medium">
                            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
                 <button disabled className="w-full bg-slate-100 text-slate-400 font-black py-5 px-6 rounded-full cursor-default uppercase tracking-widest text-sm">
                    {userProfile.subscription === 'free' ? 'Current Plan' : 'Standard Tier'}
                </button>
            </div>

            {/* Premium Tier */}
            <div className={`glass-card p-10 rounded-[40px] flex flex-col relative overflow-hidden transition-all hover:scale-[1.02] shadow-2xl ${userProfile.subscription === 'premium' ? 'border-4 border-amber-400 ring-8 ring-amber-50' : 'bg-white/90 border-transparent ring-4 ring-white/50'}`}>
                 {userProfile.subscription !== 'premium' && (
                     <div className="absolute top-6 right-6 bg-amber-400 text-amber-950 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Most Popular</div>
                 )}
                 <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                    Professional <Zap className="text-amber-500 fill-amber-500" size={24}/>
                 </h2>
                <p className="text-slate-500 font-medium mt-2">Advanced clinical expertise.</p>
                 <div className="my-10 flex items-baseline gap-2">
                    <span className="text-6xl font-black text-slate-900">{PREMIUM_SUBSCRIPTION_PRICE}</span>
                    <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">$STUDY / month</span>
                </div>
                <ul className="space-y-5 flex-grow mb-10">
                     {PREMIUM_TIER_FEATURES.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-800 font-bold">
                            <Zap className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
                {userProfile.subscription === 'premium' ? (
                     <button disabled className="w-full bg-slate-100 text-slate-400 font-black py-5 px-6 rounded-full cursor-default uppercase tracking-widest text-sm">
                        Current Plan
                    </button>
                ) : (
                    <button 
                        onClick={onUpgrade}
                        disabled={!canAfford}
                        className="w-full bg-slate-900 text-white font-black py-5 px-6 rounded-full shadow-2xl hover:bg-slate-800 active:scale-95 transition-all uppercase tracking-widest text-sm disabled:bg-slate-200 disabled:text-slate-400 disabled:scale-100"
                    >
                        Upgrade Now
                    </button>
                )}
                {!canAfford && userProfile.subscription === 'free' && (
                    <p className="text-center text-xs font-black text-rose-500 mt-4 uppercase tracking-widest">Insufficient funds</p>
                )}
            </div>
        </div>
    </div>
    );
};

export default SubscriptionScreen;