import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types.ts';
import { X, Send, Users, Lock } from 'lucide-react';

interface ChatModalProps {
  currentUser: UserProfile;
  otherUser: UserProfile;
  onClose: () => void;
}

interface Message {
  senderBns: string;
  text: string;
}

// Basic XOR cipher for demonstration purposes
const XOR_KEY = 'NexusSecretKeyForDemo';

const xorCipher = (str: string, key: string): string => {
  let output = '';
  for (let i = 0; i < str.length; i++) {
    output += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return output;
};


const ChatModal: React.FC<ChatModalProps> = ({ currentUser, otherUser, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { senderBns: otherUser.bns, text: xorCipher(`Hey! I saw we're both studying ${otherUser.major}.`, XOR_KEY) },
    { senderBns: otherUser.bns, text: xorCipher("How are you finding it?", XOR_KEY) },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [inviteSent, setInviteSent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    const userMessage: Message = { senderBns: currentUser.bns, text: xorCipher(newMessage, XOR_KEY) };
    const botReply: Message = { senderBns: otherUser.bns, text: xorCipher("That sounds interesting! We should definitely study together sometime.", XOR_KEY) };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    setTimeout(() => {
        setMessages(prev => [...prev, botReply]);
    }, 1000);
  };
  
  const handlePlanSession = () => {
    const inviteMessage: Message = { senderBns: currentUser.bns, text: xorCipher(`I'm planning a study session on ${currentUser.major}. Are you interested in joining?`, XOR_KEY) };
     setMessages(prev => [...prev, inviteMessage]);
     setInviteSent(true);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl flex flex-col h-[80vh] animate-fade-in">
        <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <img src={otherUser.profilePictureUrl} alt={otherUser.bns} className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10" />
            <div>
              <h2 className="font-bold text-lg text-slate-900 dark:text-white">{otherUser.bns}</h2>
              <p className="text-xs text-slate-500 dark:text-gray-400">{otherUser.major}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500">
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 dark:bg-black/20">
          <div className="text-center text-xs text-gray-400 dark:text-gray-500 flex items-center justify-center gap-2 my-2 bg-white dark:bg-white/5 py-1 px-3 rounded-full w-fit mx-auto border border-slate-100 dark:border-white/5">
            <Lock size={10} />
            <span>Messages are end-to-end encrypted.</span>
          </div>
          {messages.map((msg, index) => {
            const isCurrentUser = msg.senderBns === currentUser.bns;
            const senderProfile = isCurrentUser ? currentUser : otherUser;
            return (
              <div key={index} className={`flex gap-3 items-end ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                {!isCurrentUser && (
                  <img src={senderProfile.profilePictureUrl} alt={senderProfile.bns} className="w-8 h-8 rounded-full self-start" />
                )}
                <div className={`max-w-xs md:max-w-sm p-3 rounded-2xl shadow-sm ${isCurrentUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-800 dark:text-gray-200 rounded-bl-none'}`}>
                  <p className="text-sm leading-relaxed">{xorCipher(msg.text, XOR_KEY)}</p>
                </div>
              </div>
            );
          })}
           <div ref={messagesEndRef} />
        </div>

        <footer className="p-4 border-t border-slate-200 dark:border-white/10 flex-shrink-0 bg-white dark:bg-gray-900">
           {!inviteSent ? (
              <button 
                onClick={handlePlanSession}
                className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 font-semibold py-2 px-4 rounded-xl transition-colors mb-3"
              >
                  <Users size={18} /> Plan a Study Session
              </button>
           ) : (
                <div className="text-center text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 py-2 rounded-xl mb-3 border border-emerald-100 dark:border-emerald-900/30">
                    Invitation Sent
                </div>
           )}
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled={!newMessage.trim()}>
              <Send size={20} />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default ChatModal;