import React, { useState, useMemo } from 'react';
import { X, Repeat, Loader2, CheckCircle } from 'lucide-react';

interface P2PModalProps {
    isOpen: boolean;
    onClose: () => void;
    userBalance: number;
    onConvert: (amount: number) => void;
}

const CONVERSION_RATE = 0.05; // 1 $STUDY = $0.05 USD

const P2PModal: React.FC<P2PModalProps> = ({ isOpen, onClose, userBalance, onConvert }) => {
    const [amount, setAmount] = useState('');
    const [withdrawalDetails, setWithdrawalDetails] = useState('');
    const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
    const [error, setError] = useState('');

    const numericAmount = parseFloat(amount) || 0;
    const usdValue = useMemo(() => (numericAmount * CONVERSION_RATE).toFixed(2), [numericAmount]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setAmount(value);
            if (parseFloat(value) > userBalance) {
                setError('Amount exceeds your balance.');
            } else {
                setError('');
            }
        }
    };

    const handleSetMax = () => {
        setAmount(String(userBalance));
        setError('');
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (numericAmount <= 0 || numericAmount > userBalance || !withdrawalDetails.trim()) {
            setError('Please fill all fields correctly.');
            return;
        }
        setStatus('processing');
        setError('');
        // Simulate API call
        setTimeout(() => {
            onConvert(numericAmount);
            setStatus('success');
            setTimeout(() => {
                handleClose();
            }, 2500);
        }, 1500);
    };
    
    const handleClose = () => {
        setAmount('');
        setWithdrawalDetails('');
        setStatus('idle');
        setError('');
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl flex flex-col animate-fade-in">
                <header className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/10">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">P2P Conversion</h2>
                    <button onClick={handleClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500">
                        <X size={20} />
                    </button>
                </header>

                {status === 'success' ? (
                    <div className="p-8 flex flex-col items-center justify-center text-center gap-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Success!</h3>
                        <p className="text-slate-600 dark:text-gray-300">
                            Converted {numericAmount.toLocaleString()} $STUDY to ${usdValue} USD.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
                        <div>
                            <div className="flex justify-between items-baseline mb-2">
                                <label htmlFor="amount" className="block text-sm font-semibold text-slate-700 dark:text-gray-300">
                                    Amount to Convert
                                </label>
                                <span className="text-xs font-medium text-slate-500">
                                    Bal: {userBalance.toLocaleString()}
                                </span>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="amount"
                                    value={amount}
                                    onChange={handleAmountChange}
                                    placeholder="0.0"
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/20 rounded-xl px-4 py-3 text-lg font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none transition pr-16"
                                />
                                <button
                                    type="button"
                                    onClick={handleSetMax}
                                    className="absolute inset-y-0 right-2 my-auto h-8 px-3 text-xs font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 rounded-lg"
                                >
                                    MAX
                                </button>
                            </div>
                            <p className="text-sm text-slate-500 mt-2">
                                Receive: <span className="font-bold text-emerald-600 dark:text-emerald-400">${usdValue} USD</span>
                            </p>
                        </div>
                        <div>
                            <label htmlFor="withdrawal-details" className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">
                                Withdrawal Destination
                            </label>
                            <input
                                type="text"
                                id="withdrawal-details"
                                value={withdrawalDetails}
                                onChange={(e) => setWithdrawalDetails(e.target.value)}
                                placeholder="e.g. PayPal email or Bank IBAN"
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm font-medium text-center bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">{error}</p>}
                        
                        <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-lg text-center">
                            <p className="text-xs text-slate-500 dark:text-gray-400">
                                Rate: 1 $STUDY = ${CONVERSION_RATE} USD.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'processing' || !!error || numericAmount <= 0 || !withdrawalDetails.trim()}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3.5 px-6 rounded-full shadow hover:bg-blue-700 transition-all disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
                        >
                            {status === 'processing' ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} /> Processing...
                                </>
                            ) : (
                                <>
                                    <Repeat size={18} /> Confirm Conversion
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default P2PModal;