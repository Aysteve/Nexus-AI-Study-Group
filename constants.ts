import { Tutor, TutorRole, VoiceName, NFTCredential, MarketplaceItem, GovernanceProposal, UserProfile, BaseLearningModule } from './types.ts';

export const AVAILABLE_TUTORS: Tutor[] = [
  {
    id: 'clara-explainer',
    name: 'Clara',
    gender: 'female',
    role: TutorRole.EXPLAINER,
    description: 'Breaks down complex topics into simple, understandable concepts.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    voiceColor: 'text-sky-400'
  },
  {
    id: 'ben-quizzer',
    name: 'Ben',
    gender: 'male',
    role: TutorRole.QUIZ_MASTER,
    description: 'Asks challenging questions to test understanding and recall.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    voiceColor: 'text-amber-400'
  },
  {
    id: 'aria-skeptic',
    name: 'Aria',
    gender: 'female',
    role: TutorRole.SKEPTIC,
    description: 'Challenges assumptions and encourages critical thinking.',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    voiceColor: 'text-rose-400'
  },
  {
    id: 'leo-summarizer',
    name: 'Leo',
    gender: 'male',
    role: TutorRole.SUMMARIZER,
    description: 'Synthesizes information and provides clear, concise summaries.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    voiceColor: 'text-emerald-400'
  }
];

export const AVAILABLE_VOICES: VoiceName[] = ['Zephyr', 'Puck', 'Charon', 'Kore', 'Fenrir'];

export const VOICE_SAMPLES: Record<VoiceName, string> = {
  Zephyr: 'https://cdn.pixabay.com/audio/2022/11/17/audio_8332b60b73.mp3',
  Puck: 'https://cdn.pixabay.com/audio/2023/09/23/audio_735a242137.mp3',
  Charon: 'https://cdn.pixabay.com/audio/2021/08/25/audio_5539560f1c.mp3',
  Kore: 'https://cdn.pixabay.com/audio/2022/03/15/audio_339db722a8.mp3',
  Fenrir: 'https://cdn.pixabay.com/audio/2022/03/15/audio_b292d308b0.mp3',
};

export const MOCK_NFTS: NFTCredential[] = [
  {
    id: 'nft-1',
    name: 'First Session Completion',
    description: 'Awarded for successfully completing your first AI study session.',
    imageUrl: 'https://placehold.co/400x400/7c3aed/ffffff?text=1st+Session',
    date: '2024-07-28',
    transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd'
  },
  {
    id: 'nft-official-1',
    name: 'Official Course Completion: Cardiology 101',
    description: 'Verified by Nexus University of Medicine.',
    imageUrl: 'https://placehold.co/400x400/0ea5e9/ffffff?text=Cardiology+101',
    date: '2024-08-01',
    transactionHash: '0xabc1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    isOfficial: true,
  }
];

export const MOCK_MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    id: 'item-1',
    name: 'Cardiology Mnemonics',
    description: 'A comprehensive PDF with mnemonics for common cardiology drugs.',
    creatorBns: 'cardiogod.base',
    price: 50,
    imageUrl: 'https://placehold.co/400x300/be185d/ffffff?text=PDF',
    creatorRoyaltyPercent: 95,
  }
];

export const MOCK_GOVERNANCE_PROPOSALS: GovernanceProposal[] = [];

export const MOCK_STUDENTS: UserProfile[] = [
    {
        address: '0x1',
        bns: 'emily.base',
        balance: 1200,
        subscription: 'premium',
        profilePictureUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
        school: 'Nexus Medical Academy',
        major: 'Pharmacology'
    },
    {
        address: '0x2',
        bns: 'anna.base',
        balance: 850,
        subscription: 'free',
        profilePictureUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
        school: 'Base University',
        major: 'Cardiology'
    },
    {
        address: '0x3',
        bns: 'jake.base',
        balance: 2100,
        subscription: 'premium',
        profilePictureUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
        school: 'Global Health Institute',
        major: 'Surgery'
    }
];

export const BASE_LEARNING_MODULES: BaseLearningModule[] = [
  {
    id: 'what-is-base',
    title: 'Module 1: What is Base?',
    description: 'Understand the fundamentals of Base as a secure, low-cost Ethereum L2.',
    content: `Base is a secure, low-cost, builder-friendly Ethereum Layer 2 (L2) built to bring the next billion users onchain.`
  }
];

export const PREMIUM_SUBSCRIPTION_PRICE = 250;
export const FREE_TIER_FEATURES = ['Access modules', '3 Tutors', 'Standard voice', 'Community'];
export const PREMIUM_TIER_FEATURES = ['Everything in Free', '6 Tutors', 'Specialty Tutors', 'Unlimited history', 'Detailed analytics', 'Premium badge'];
export const MARKETPLACE_PLATFORM_FEE = 0.025;
export const STAKING_APY = 0.12;
export const OFFICIAL_NFT_MINT_FEE = 50;