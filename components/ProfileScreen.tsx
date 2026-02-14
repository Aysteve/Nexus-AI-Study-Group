import React, { useState } from 'react';
import { UserProfile, NFTCredential } from '../types.ts';
import { OFFICIAL_NFT_MINT_FEE, MOCK_NFTS } from '../constants.ts';
import { Save, X, Camera, ShieldCheck, CheckCircle, Layers } from 'lucide-react';

interface NFTCardProps {
  nft: NFTCredential;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft }) => (
  <div className={`bg-white rounded-xl overflow-hidden border ${nft.isOfficial ? 'border-indigo-500' : 'border-slate-200'} group hover:shadow-lg transition-all`}>
    {nft.isOfficial && (
        <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10 flex items-center gap-1">
            <CheckCircle size={12}/> Official
        </div>
    )}
    <img src={nft.imageUrl} alt={nft.name} className="w-full h-32 object-cover" />
    <div className="p-4">
      <h3 className="font-bold text-sm truncate text-slate-900">{nft.name}</h3>
      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{nft.description}</p>
    </div>
  </div>
);

interface ProfileScreenProps {
  userProfile: UserProfile;
  nfts: NFTCredential[];
  onSave: (updatedProfile: UserProfile) => void;
  onCancel: () => void;
  onMintNFT: (nft: NFTCredential, fee: number) => boolean;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ userProfile, nfts, onSave, onCancel, onMintNFT }) => {
  const [editedProfile, setEditedProfile] = useState<UserProfile>(userProfile);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const officialNFTId = 'nft-official-1';
  const hasMintedOfficialNFT = nfts.some(nft => nft.id === officialNFTId);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({ ...prev, [name]: name === 'year' ? parseInt(value) || 0 : value }));
  };
  
  const handlePictureChange = () => {
    const newId = Math.random().toString(36).substring(7);
    setEditedProfile(prev => ({
      ...prev,
      profilePictureUrl: `https://i.pravatar.cc/150?u=${newId}`
    }));
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }

  const handleSave = () => {
    onSave(editedProfile);
    showNotification('success', 'Profile saved successfully!');
  };
  
  const handleMintOfficialNFT = () => {
    const officialNFT = MOCK_NFTS.find(nft => nft.id === officialNFTId);
    if(officialNFT) {
        const success = onMintNFT(officialNFT, OFFICIAL_NFT_MINT_FEE);
        if (success) {
            showNotification('success', 'Official credential minted successfully!');
        } else {
            showNotification('error', 'Minting failed. Check your $STUDY balance.');
        }
    }
  };

  return (
    <div className="w-full max-w-4xl glass-card rounded-3xl p-8 border border-white/50 flex flex-col gap-8 animate-fade-in">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">Edit Your Profile</h1>
        <p className="text-slate-500 mt-1">Personalize your student identity.</p>
      </header>

      <div className="flex flex-col md:flex-row items-center gap-8 bg-white/40 p-6 rounded-2xl border border-white/50">
        <div className="relative group flex-shrink-0">
          <img src={editedProfile.profilePictureUrl} alt="Profile" className="w-32 h-32 rounded-full border-4 border-white shadow-sm"/>
          <button 
            onClick={handlePictureChange}
            className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Camera className="text-white" size={32}/>
          </button>
        </div>
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="school" className="block text-sm font-semibold text-slate-700 mb-1">School</label>
              <input type="text" id="school" name="school" value={editedProfile.school || ''} onChange={handleInputChange} className="w-full bg-white/50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-600 transition" />
            </div>
            <div>
              <label htmlFor="major" className="block text-sm font-semibold text-slate-700 mb-1">Major</label>
              <input type="text" id="major" name="major" value={editedProfile.major || ''} onChange={handleInputChange} className="w-full bg-white/50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-600 transition" />
            </div>
        </div>
      </div>

       <div className="flex justify-center items-center gap-4">
        <button onClick={onCancel} className="flex items-center gap-2 text-slate-600 hover:bg-white/50 font-bold py-2.5 px-6 rounded-full transition-colors">
            <X size={18}/> Cancel
        </button>
        <button onClick={handleSave} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-full transition-colors shadow-sm">
            <Save size={18}/> Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProfileScreen;