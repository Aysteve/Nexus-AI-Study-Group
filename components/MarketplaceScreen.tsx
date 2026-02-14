import React, { useState } from 'react';
import { UserProfile, MarketplaceItem } from '../types.ts';
import { MOCK_MARKETPLACE_ITEMS, MARKETPLACE_PLATFORM_FEE } from '../constants.ts';
import { ShoppingCart, CheckCircle, XCircle, X as IconX, Info } from 'lucide-react';

interface PurchaseConfirmationModalProps {
    item: MarketplaceItem;
    onConfirm: () => void;
    onCancel: () => void;
}

const PurchaseConfirmationModal: React.FC<PurchaseConfirmationModalProps> = ({ item, onConfirm, onCancel }) => {
    const platformFee = item.price * MARKETPLACE_PLATFORM_FEE;
    const creatorPayout = item.price - platformFee;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col animate-fade-in">
                <header className="flex items-center justify-between p-4 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900">Confirm Purchase</h2>
                    <button onClick={onCancel} className="p-2 rounded-full hover:bg-slate-100"><IconX size={20} /></button>
                </header>
                <div className="p-6 flex flex-col gap-4">
                    <p className="text-slate-700">You are about to purchase <strong className="text-indigo-600">{item.name}</strong> from <strong className="font-mono text-slate-900">{item.creatorBns}</strong>.</p>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-sm">
                        <div className="flex justify-between text-slate-600"><span>Item Price:</span> <span className="font-semibold">{item.price.toLocaleString()} $STUDY</span></div>
                        <div className="flex justify-between text-slate-400"><span>Platform Fee ({MARKETPLACE_PLATFORM_FEE * 100}%):</span> <span>{platformFee.toLocaleString()} $STUDY</span></div>
                        <hr className="border-slate-200 my-2"/>
                        <div className="flex justify-between font-bold text-slate-900"><span>Total Cost:</span> <span>{item.price.toLocaleString()} $STUDY</span></div>
                    </div>
                     <p className="text-xs text-slate-500 flex items-start gap-2">
                        <Info size={16} className="flex-shrink-0 mt-0.5 text-indigo-500"/>
                        <span>Upon confirmation, <strong className="text-slate-700">{creatorPayout.toLocaleString()} $STUDY</strong> will be sent to the creator. This transaction is final.</span>
                    </p>
                    <button onClick={onConfirm} className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-full shadow hover:bg-indigo-700 transition-colors">
                        Confirm & Pay
                    </button>
                </div>
            </div>
        </div>
    );
};


interface MarketplaceItemCardProps {
    item: MarketplaceItem;
    onBuy: (item: MarketplaceItem) => void;
    userBalance: number;
}

const MarketplaceItemCard: React.FC<MarketplaceItemCardProps> = ({ item, onBuy, userBalance }) => {
    const canAfford = userBalance >= item.price;
    return (
        <div className="glass-card rounded-2xl overflow-hidden border border-white/50 flex flex-col hover:shadow-lg transition-shadow">
            <img src={item.imageUrl} alt={item.name} className="w-full h-40 object-cover"/>
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-lg text-slate-900">{item.name}</h3>
                <p className="text-xs font-medium text-indigo-600 mb-2">by {item.creatorBns}</p>
                <p className="text-sm text-slate-600 mb-4 flex-grow leading-relaxed">{item.description}</p>
                 <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded w-fit mb-4">
                    Creator Royalty: {item.creatorRoyaltyPercent}%
                </div>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100">
                    <span className="font-bold text-xl text-slate-900">{item.price} <span className="text-sm text-slate-500 font-normal">$STUDY</span></span>
                    <button 
                        onClick={() => onBuy(item)} 
                        disabled={!canAfford}
                        className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-full shadow-sm hover:bg-indigo-700 transition-colors disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                    >
                        <ShoppingCart size={16} /> Buy
                    </button>
                </div>
            </div>
        </div>
    );
};


interface MarketplaceScreenProps {
  userProfile: UserProfile;
  onUpdateBalance: (newBalance: number) => void;
}

const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({ userProfile, onUpdateBalance }) => {
    const [items] = useState<MarketplaceItem[]>(MOCK_MARKETPLACE_ITEMS);
    const [purchaseStatus, setPurchaseStatus] = useState<{ status: 'success' | 'fail' | null, message: string }>({ status: null, message: '' });
    const [itemToConfirm, setItemToConfirm] = useState<MarketplaceItem | null>(null);

    const handleBuyRequest = (item: MarketplaceItem) => {
        if (userProfile.balance >= item.price) {
            setItemToConfirm(item);
        } else {
             setPurchaseStatus({ status: 'fail', message: 'Insufficient funds.' });
             setTimeout(() => setPurchaseStatus({ status: null, message: '' }), 3000);
        }
    };

    const handleConfirmPurchase = () => {
        if (!itemToConfirm) return;
        
        onUpdateBalance(userProfile.balance - itemToConfirm.price);
        setPurchaseStatus({ status: 'success', message: `Successfully purchased "${itemToConfirm.name}"!` });
        setItemToConfirm(null);
        setTimeout(() => setPurchaseStatus({ status: null, message: '' }), 3000);
    }

    return (
        <>
        <div className="w-full max-w-7xl glass-card rounded-3xl p-8 border border-white/50 flex flex-col gap-8 animate-fade-in">
            <header className="text-center">
                <h1 className="text-3xl font-bold text-slate-900">Student Marketplace</h1>
                <p className="text-slate-500 mt-2">Trade study materials and tools using your $STUDY tokens.</p>
            </header>

            {purchaseStatus.status && (
                <div className={`p-4 rounded-xl flex items-center justify-center gap-2 text-white font-medium ${purchaseStatus.status === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
                    {purchaseStatus.status === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    {purchaseStatus.message}
                </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => (
                    <MarketplaceItemCard key={item.id} item={item} onBuy={handleBuyRequest} userBalance={userProfile.balance} />
                ))}
            </div>
        </div>
        {itemToConfirm && (
            <PurchaseConfirmationModal 
                item={itemToConfirm}
                onConfirm={handleConfirmPurchase}
                onCancel={() => setItemToConfirm(null)}
            />
        )}
        </>
    );
};

export default MarketplaceScreen;