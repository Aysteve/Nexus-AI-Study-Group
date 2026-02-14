import React, { useState } from 'react';
import { UserProfile } from '../types.ts';
import { STAKING_APY } from '../constants.ts';
import { ArrowLeft, BarChartHorizontal, CheckCircle, TrendingUp, Download, Plus, Minus } from 'lucide-react';

interface StakingScreenProps {
  userProfile: UserProfile;
  stakedAmount: number;
  stakingRewards: number;
  onStake: (amount: number) => void;
  onUnstake: (amount: number) => void;
  onClaimRewards: () => void;
  onNavigateBack: () => void;
}

const StakingScreen: React.FC<StakingScreenProps> = ({ userProfile, stakedAmount, stakingRewards, onStake, onUnstake, onClaimRewards, onNavigateBack }) => {
    const [amount, setAmount] = useState('');
    const [activeTab, setActiveTab] = useState<'stake' | 'unstake'>('stake');
    const [notification, setNotification] = useState('');

    const numericAmount = parseFloat(amount) || 0;
    const isStake = activeTab === 'stake';

    const maxAmount = isStake ? userProfile.balance : stakedAmount;

    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(''), 3000);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (numericAmount <= 0 || numericAmount > maxAmount) return;

        if (isStake) {
            onStake(numericAmount);
            showNotification(`Staked ${numericAmount} $STUDY`);
        } else {
            onUnstake(numericAmount);
            showNotification(`Unstaked ${numericAmount} $STUDY`);
        }
        setAmount('');
    };
    
    const handleClaim = () => {
        onClaimRewards();
        showNotification('Rewards claimed!');
    }

    return (
        <div className="w-full max-w-6xl flex flex-col gap-8 animate-fade-in px-4">
            <header className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center justify-center sm:justify-start gap-3">
                        <BarChartHorizontal className="text-indigo-600" /> Staking
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Passive growth for active learners.</p>
                </div>
                 <button
                    onClick={onNavigateBack}
                    className="flex items-center gap-2 glass-pill hover:bg-white font-bold py-3 px-6 rounded-full transition-all text-sm shadow-md"
                >
                    <ArrowLeft size={18} /> Back
                </button>
            </header>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="glass-card p-10 rounded-[40px] text-center border-b-8 border-b-indigo-500">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Total Staked</h3>
                    <p className="text-5xl font-black text-slate-900">{stakedAmount.toLocaleString()}</p>
                    <p className="text-xs font-bold text-slate-400 mt-2">$STUDY tokens</p>
                </div>
                <div className="glass-card p-10 rounded-[40px] text-center border-b-8 border-b-amber-500">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Pending Rewards</h3>
                    <p className="text-5xl font-black text-amber-500">{stakingRewards.toFixed(2)}</p>
                    <p className="text-xs font-bold text-slate-400 mt-2">Available to claim</p>
                </div>
                 <div className="glass-card p-10 rounded-[40px] text-center border-b-8 border-b-emerald-500">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Annual Yield</h3>
                    <div className="flex items-center justify-center gap-3">
                        <TrendingUp size={32} className="text-emerald-500"/>
                        <p className="text-5xl font-black text-emerald-600">{(STAKING_APY * 100).toFixed(0)}%</p>
                    </div>
                    <p className="text-xs font-bold text-slate-400 mt-2">Estimated APY</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start max-w-5xl mx-auto w-full">
                <div className="glass-card p-10 rounded-[40px] shadow-xl">
                    <div className="flex glass-pill p-1.5 rounded-full mb-10 overflow-hidden shadow-inner">
                        <button onClick={() => { setActiveTab('stake'); setAmount(''); }} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-full transition-all ${activeTab === 'stake' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Stake</button>
                        <button onClick={() => { setActiveTab('unstake'); setAmount(''); }} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-full transition-all ${activeTab === 'unstake' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Unstake</button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <div className="flex justify-between items-baseline mb-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</label>
                                <span className="text-[10px] font-black text-indigo-600">Max: {maxAmount.toLocaleString()}</span>
                            </div>
                             <div className="relative">
                                <input type="text" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))} placeholder="0.0" className="w-full bg-slate-50 border-none rounded-[24px] px-6 py-5 text-3xl font-black focus:ring-4 focus:ring-indigo-100 transition shadow-inner placeholder:text-slate-200"/>
                                <button type="button" onClick={() => setAmount(String(maxAmount))} className="absolute inset-y-0 right-4 my-auto h-8 px-4 text-[10px] font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full uppercase tracking-widest transition-all">MAX</button>
                            </div>
                        </div>
                        <button type="submit" disabled={numericAmount <= 0 || numericAmount > maxAmount} className={`w-full flex items-center justify-center gap-3 text-white font-black py-5 px-6 rounded-full shadow-2xl transition-all active:scale-95 disabled:opacity-30 disabled:scale-100 uppercase tracking-widest text-sm ${isStake ? 'bg-indigo-600 shadow-indigo-600/20 hover:bg-indigo-700' : 'bg-slate-900 shadow-slate-900/20 hover:bg-slate-800'}`}>
                            {isStake ? <><Plus size={20}/>Stake tokens</> : <><Minus size={20}/>Unstake tokens</>}
                        </button>
                    </form>
                </div>
                 <div className="glass-card p-10 rounded-[40px] flex flex-col items-center justify-center text-center h-full relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-amber-100 rounded-[32px] flex items-center justify-center text-amber-500 mx-auto mb-8 shadow-xl shadow-amber-500/10 group-hover:scale-110 transition-all duration-500">
                            <Download size={40}/>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 mb-2">Claim Rewards</h3>
                        <p className="text-slate-500 font-medium mb-8 max-w-xs mx-auto text-sm leading-relaxed">Collect your accrued $STUDY tokens from the pool.</p>
                        <button 
                            onClick={handleClaim}
                            disabled={stakingRewards <= 0}
                            className="w-full bg-amber-500 text-white font-black py-5 px-10 rounded-full shadow-2xl shadow-amber-500/20 hover:bg-amber-600 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 uppercase tracking-widest text-sm"
                        >
                            Collect {stakingRewards.toFixed(2)} $STUDY
                        </button>
                    </div>
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-amber-400/5 blur-[80px] rounded-full" />
                </div>
            </div>
             {notification && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-full shadow-2xl animate-fade-in flex items-center gap-3 font-bold text-sm tracking-wide z-50">
                    <CheckCircle size={20} className="text-emerald-400"/> {notification}
                </div>
            )}
        </div>
    );
};

export default StakingScreen;