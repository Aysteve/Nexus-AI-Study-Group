import React, { useState, useCallback, useEffect } from 'react';
import SetupScreen from './components/SetupScreen.tsx';
import StudyRoom from './components/StudyRoom.tsx';
import SessionSummary from './components/SessionSummary.tsx';
import ConnectWalletScreen from './components/ConnectWalletScreen.tsx';
import CreateProfileNameScreen from './components/CreateProfileNameScreen.tsx';
import DashboardScreen from './components/DashboardScreen.tsx';
import MarketplaceScreen from './components/MarketplaceScreen.tsx';
import ProfileScreen from './components/ProfileScreen.tsx';
import CommunityScreen from './components/CommunityScreen.tsx';
import SessionHistoryScreen from './components/SessionHistoryScreen.tsx';
import LearnBaseScreen from './components/LearnBaseScreen.tsx';
import SubscriptionScreen from './components/SubscriptionScreen.tsx';
import StakingScreen from './components/StakingScreen.tsx';
import Header from './components/Header.tsx';
import OnboardingModal from './components/OnboardingModal.tsx';
import P2PModal from './components/P2PModal.tsx';
import { AppState, Tutor, VoiceName, UserProfile, NFTCredential, PastSession, Reminder } from './types.ts';
import { BookOpen, BrainCircuit } from 'lucide-react';
import { MOCK_NFTS, PREMIUM_SUBSCRIPTION_PRICE } from './constants.ts';

const NexusApp: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.CONNECT_WALLET);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userNFTs, setUserNFTs] = useState<NFTCredential[]>([]);
  const [totalStudyTimeInSeconds, setTotalStudyTimeInSeconds] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isP2PModalOpen, setIsP2PModalOpen] = useState(false);

  const [selectedTutors, setSelectedTutors] = useState<Tutor[]>([]);
  const [studyMaterial, setStudyMaterial] = useState<{ name: string; content: string } | null>(null);
  const [sessionTranscript, setSessionTranscript] = useState<string>("");
  const [sessionVoice, setSessionVoice] = useState<VoiceName>('Zephyr');
  const [currentSessionAudioUrl, setCurrentSessionAudioUrl] = useState<string | undefined>();

  const [pastSessions, setPastSessions] = useState<PastSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);
  const [completedBaseModules, setCompletedBaseModules] = useState<Set<string>>(new Set());
  const [isBaseRewardClaimed, setIsBaseRewardClaimed] = useState(false);

  const [stakedAmount, setStakedAmount] = useState(0);
  const [stakingRewards, setStakingRewards] = useState(0);

  const handleConnect = async () => {
    const mockAddress = `0x${Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const hasConnectedBefore = localStorage.getItem('hasConnectedBefore');

    if (!hasConnectedBefore) {
        setUserProfile({
            address: mockAddress,
            bns: '', 
            balance: 500, 
            subscription: 'free',
            profilePictureUrl: `https://i.pravatar.cc/150?u=${mockAddress}`,
            school: '',
            major: '',
            year: 1,
        });
        setAppState(AppState.CREATE_PROFILE_NAME);
    } else {
        setUserProfile({
            address: mockAddress,
            bns: 'medstudent.base',
            balance: 1250,
            subscription: 'free',
            profilePictureUrl: 'https://i.pravatar.cc/150?u=studentbase',
            school: 'Nexus Medical Academy',
            major: 'Pharmaceutical Science',
            year: 3,
        });
        setUserNFTs(MOCK_NFTS.slice(0, 1));
        setAppState(AppState.DASHBOARD);
    }
  };

  const handleCreateProfileName = useCallback((bns: string) => {
    const bnsFullName = `${bns}.base`;
    setUserProfile(prev => prev ? { ...prev, bns: bnsFullName } : null);

    const newNameNFT: NFTCredential = {
        id: 'nft-bns',
        name: `${bnsFullName}`,
        description: `Your unique identity on the AI Study Nexus.`,
        imageUrl: `https://placehold.co/400x400/0052ff/ffffff?text=${bns}.base`,
        date: new Date().toISOString().split('T')[0],
        transactionHash: `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`
    };
    setUserNFTs(prev => [newNameNFT, ...prev]);

    localStorage.setItem('hasConnectedBefore', 'true');
    setShowOnboarding(true); 
  }, []);
  
  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    setAppState(AppState.DASHBOARD);
  };

  const handleDisconnect = useCallback(() => {
    setAppState(AppState.CONNECT_WALLET);
    setUserProfile(null);
    setUserNFTs([]);
  }, []);
  
  const handleUpdateProfile = useCallback((updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    setAppState(AppState.DASHBOARD);
  }, []);

  const handleStartSession = useCallback((tutors: Tutor[], material: { name: string; content: string }, voice: VoiceName, moduleId?: string) => {
    setSelectedTutors(tutors);
    setStudyMaterial(material);
    setSessionVoice(voice);
    if (moduleId) {
      setCurrentModuleId(moduleId);
    }
    setAppState(AppState.STUDYING);
  }, []);

  const handleEndSession = useCallback((transcript: string, durationInSeconds: number, audioUrl?: string) => {
    setSessionTranscript(transcript);
    setTotalStudyTimeInSeconds(prev => prev + durationInSeconds);
    setCurrentSessionAudioUrl(audioUrl);
    
    if (currentModuleId) {
        setCompletedBaseModules(prev => new Set(prev).add(currentModuleId));
    }

    const sessionId = new Date().toISOString();
    setCurrentSessionId(sessionId);
    
    const newSession: PastSession = {
        id: sessionId,
        topic: studyMaterial!.name,
        date: new Date().toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        durationInSeconds: durationInSeconds,
        transcript: transcript,
        audioRecordingUrl: audioUrl,
    };
    setPastSessions(prev => [newSession, ...prev]);
    setAppState(AppState.SUMMARY);
    setCurrentModuleId(null);
  }, [studyMaterial, currentModuleId]);
  
  const handleStartNewSessionSetup = useCallback(() => {
    setSelectedTutors([]);
    setStudyMaterial(null);
    setSessionTranscript("");
    setAppState(AppState.SETUP);
  }, []);

  const handleClaimRewards = useCallback((amount: number) => {
    setUserProfile(prev => prev ? { ...prev, balance: prev.balance + amount } : null);
  }, []);

  const handleMintNFT = useCallback((nft: NFTCredential, fee: number = 0) => {
    if (userProfile && userProfile.balance >= fee) {
       if (!userNFTs.find(existingNft => existingNft.id === nft.id)) {
            setUserProfile(p => p ? {...p, balance: p.balance - fee} : null);
            setUserNFTs(prev => [...prev, nft]);
            return true;
        }
    }
    return false;
  }, [userNFTs, userProfile]);

  const handleMintSessionNFT = useCallback(() => {
      const sessionNFT: NFTCredential = {
          id: `nft-session-${Date.now()}`,
          name: `${studyMaterial?.name || 'Session'} Mastery`,
          description: `Certified completion of ${studyMaterial?.name || 'study session'}.`,
          imageUrl: `https://placehold.co/400x400/0052ff/ffffff?text=Certified`,
          date: new Date().toISOString().split('T')[0],
          transactionHash: `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`
      };
      handleMintNFT(sessionNFT);
  }, [handleMintNFT, studyMaterial]);

  const handleUpdateSessionSummary = useCallback((sessionId: string, summary: string) => {
    setPastSessions(prev => 
        prev.map(session => 
            session.id === sessionId ? { ...session, summary } : session
        )
    );
  }, []);

  const handleAddReminder = useCallback((title: string, dateTime: string) => {
    setReminders(prev => [...prev, {
      id: Math.random().toString(),
      title,
      dateTime,
      notified: false,
    }].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()));
  }, []);

  const handleP2PConversion = useCallback((amount: number) => {
    setUserProfile(prev => {
      if (!prev || prev.balance < amount) return prev;
      return { ...prev, balance: prev.balance - amount };
    });
  }, []);

  const handleUpgradeSubscription = useCallback(() => {
    if (userProfile && userProfile.balance >= PREMIUM_SUBSCRIPTION_PRICE) {
        setUserProfile(prev => prev ? {
            ...prev,
            balance: prev.balance - PREMIUM_SUBSCRIPTION_PRICE,
            subscription: 'premium',
        } : null);
        setAppState(AppState.DASHBOARD);
    }
  }, [userProfile]);
  
  const handleStake = useCallback((amount: number) => {
    if (userProfile && userProfile.balance >= amount && amount > 0) {
      setUserProfile(prev => prev ? { ...prev, balance: prev.balance - amount } : null);
      setStakedAmount(prev => prev + amount);
    }
  }, [userProfile]);

  const handleUnstake = useCallback((amount: number) => {
    if (stakedAmount >= amount && amount > 0) {
      setUserProfile(prev => prev ? { ...prev, balance: prev.balance + amount } : null);
      setStakedAmount(prev => prev - amount);
    }
  }, [stakedAmount]);
  
  const handleClaimStakingRewards = useCallback(() => {
    if (stakingRewards > 0) {
        setUserProfile(prev => prev ? { ...prev, balance: prev.balance + Math.floor(stakingRewards) } : null);
        setStakingRewards(0);
    }
  }, [stakingRewards]);

  useEffect(() => {
    const interval = setInterval(() => {
        if (stakedAmount > 0) {
            setStakingRewards(prev => prev + (stakedAmount * 0.12) / 365 / 24 / 60);
        }
    }, 60000);
    return () => clearInterval(interval);
  }, [stakedAmount]);

  const renderContent = () => {
    if (showOnboarding) {
        return <OnboardingModal onClose={handleCloseOnboarding} />;
    }
    switch (appState) {
      case AppState.CONNECT_WALLET:
        return <ConnectWalletScreen onConnect={handleConnect} />;
      case AppState.CREATE_PROFILE_NAME:
        return <CreateProfileNameScreen onProfileCreated={handleCreateProfileName} />;
      case AppState.DASHBOARD:
        return <DashboardScreen 
                 userProfile={userProfile!} 
                 onStartNewSession={() => setAppState(AppState.SETUP)}
                 onNavigate={(state) => setAppState(state)}
                 pastSessions={pastSessions}
                 reminders={reminders}
                 onAddReminder={handleAddReminder}
               />;
      case AppState.MARKETPLACE:
        return <MarketplaceScreen userProfile={userProfile!} onUpdateBalance={(newBalance) => setUserProfile(p => p ? {...p, balance: newBalance} : null)}/>
      case AppState.PROFILE:
        return <ProfileScreen userProfile={userProfile!} nfts={userNFTs} onSave={handleUpdateProfile} onCancel={() => setAppState(AppState.DASHBOARD)} onMintNFT={handleMintNFT} />;
      case AppState.COMMUNITY:
        return <CommunityScreen currentUser={userProfile!} />;
      case AppState.HISTORY:
        return <SessionHistoryScreen 
                  sessions={pastSessions}
                  onUpdateSessionSummary={handleUpdateSessionSummary}
                  onNavigateBack={() => setAppState(AppState.DASHBOARD)}
               />;
      case AppState.LEARN_BASE:
        return <LearnBaseScreen 
                  completedModules={completedBaseModules}
                  isRewardClaimed={isBaseRewardClaimed}
                  onClaimReward={() => {
                      setUserProfile(prev => prev ? { ...prev, balance: prev.balance + 500 } : null);
                      setIsBaseRewardClaimed(true);
                  }}
                  onStartSession={handleStartSession}
               />;
      case AppState.SUBSCRIPTION:
        return <SubscriptionScreen
                 userProfile={userProfile!}
                 onUpgrade={handleUpgradeSubscription}
                 onNavigateBack={() => setAppState(AppState.DASHBOARD)}
               />;
      case AppState.STAKING:
        return <StakingScreen
                  userProfile={userProfile!}
                  stakedAmount={stakedAmount}
                  stakingRewards={stakingRewards}
                  onStake={handleStake}
                  onUnstake={handleUnstake}
                  onClaimRewards={handleClaimStakingRewards}
                  onNavigateBack={() => setAppState(AppState.DASHBOARD)}
               />;
      case AppState.STUDYING:
        return <StudyRoom tutors={selectedTutors} studyMaterial={studyMaterial!} onEndSession={handleEndSession} sessionVoice={sessionVoice} />;
      case AppState.SUMMARY:
        return <SessionSummary 
                 transcript={sessionTranscript} 
                 audioUrl={currentSessionAudioUrl}
                 onStartNewSession={handleStartNewSessionSetup}
                 onClaimRewards={handleClaimRewards}
                 onMintNFT={handleMintSessionNFT}
                 onNavigateToDashboard={() => setAppState(AppState.DASHBOARD)}
                 onSummaryGenerated={(summary) => handleUpdateSessionSummary(currentSessionId!, summary)}
               />;
      case AppState.SETUP:
      default:
        return <SetupScreen onStartSession={handleStartSession} userSubscription={userProfile?.subscription || 'free'} />;
    }
  };

  const showHeader = userProfile && appState !== AppState.CONNECT_WALLET && appState !== AppState.CREATE_PROFILE_NAME && appState !== AppState.STUDYING && !showOnboarding;

  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] text-slate-900 dark:text-white font-sans relative transition-colors duration-300">
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-[0.03] dark:opacity-[0.07]">
          <BrainCircuit className="absolute top-[10%] left-[5%] w-96 h-96 text-slate-500" strokeWidth={0.5} />
          <BookOpen className="absolute bottom-[10%] right-[5%] w-80 h-80 text-slate-500" strokeWidth={0.5} />
      </div>
       {showHeader && userProfile && (
        <Header 
          userProfile={userProfile} 
          onDisconnect={handleDisconnect} 
          onNavigate={(state) => setAppState(state)}
          onOpenP2PModal={() => setIsP2PModalOpen(true)}
        />
       )}
       {isP2PModalOpen && userProfile && (
        <P2PModal 
            isOpen={isP2PModalOpen}
            onClose={() => setIsP2PModalOpen(false)}
            userBalance={userProfile.balance}
            onConvert={handleP2PConversion}
        />
       )}
      <main className={`relative z-10 flex flex-col items-center justify-center min-h-screen p-4 ${showHeader ? 'pt-24' : ''}`}>
        {renderContent()}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return <NexusApp />;
}

export default App;