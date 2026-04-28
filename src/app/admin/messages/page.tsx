"use client";

import React, { useState } from 'react';
import { Search, Send } from 'lucide-react';

const conversations = [
  { id: 1, name: 'Ali Raza',     avatar: 'AR', time: '10:42',    preview: 'Thanks, I will reach the hospital b...', unread: 2 },
  { id: 2, name: 'Fatima Noor',  avatar: 'FN', time: '09:15',    preview: 'Is the request still active?',           unread: 0 },
  { id: 3, name: 'Hamza Tariq',  avatar: 'HT', time: 'Yesterday', preview: 'Donation scheduled for tomorrow.',      unread: 1 },
  { id: 4, name: 'Omar Sheikh',  avatar: 'OS', time: 'Apr 21',   preview: 'Sent my updated report.',                unread: 0 },
];

const chatMessages = [
  { id: 1, text: 'Assalam o Alaikum, I saw the request for O+ blood.', time: '10:30', isMe: false },
  { id: 2, text: 'Wa Alaikum Assalam. Yes, the patient is at Aga Khan. Can you donate today?', time: '10:34', isMe: true },
  { id: 3, text: 'Thanks, I will reach the hospital by 6pm.', time: '10:42', isMe: false },
];

export default function MessagesPage() {
  const [selected, setSelected] = useState(conversations[0]);
  const [input, setInput] = useState('');

  return (
    <div className="flex flex-col h-full gap-0 transition-colors">
      {/* Page Header */}
      <div className="mb-5">
        <h1 className="text-[24px] font-bold text-[var(--adm-fg)] mb-1">Messages</h1>
        <p className="text-[14px] text-[var(--adm-fg-faint)]">Conversations with donors and requesters</p>
      </div>

      {/* Chat Layout */}
      <div className="flex flex-1 gap-0 overflow-hidden rounded-xl border border-[color:var(--adm-border)] bg-[var(--adm-surface)] min-h-[480px] h-[calc(100vh-230px)] shadow-sm">

        {/* Left: Conversation List */}
        <div className="w-[280px] md:w-[300px] shrink-0 flex flex-col border-r border-[color:var(--adm-border)]">
          <div className="p-4 border-b border-[color:var(--adm-border)]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--adm-fg-faint)]" size={14} />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full bg-[var(--adm-surface-2)] border border-[color:var(--adm-border)] rounded-lg pl-8 pr-3 py-2 text-[13px] text-[var(--adm-fg)] placeholder:text-[var(--adm-fg-faint)] focus:outline-none focus:border-[var(--adm-accent)] transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-[color:var(--adm-border)]">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelected(conv)}
                className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-all hover:bg-[var(--adm-hover)] ${selected.id === conv.id ? 'bg-[var(--adm-hover)]' : ''}`}
              >
                <div className="h-10 w-10 shrink-0 rounded-full bg-[var(--adm-accent-soft-bg)] border border-[var(--adm-accent-soft-border)] text-[var(--adm-accent)] flex items-center justify-center text-[12px] font-bold shadow-sm">
                  {conv.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-[13px] font-bold transition-colors ${selected.id === conv.id ? 'text-[var(--adm-accent)]' : 'text-[var(--adm-fg)]'}`}>{conv.name}</span>
                    <span className="text-[10px] text-[var(--adm-fg-dim)] shrink-0 ml-2">{conv.time}</span>
                  </div>
                  <p className="text-[12px] text-[var(--adm-fg-dim)] truncate font-medium">{conv.preview}</p>
                </div>
                {conv.unread > 0 && (
                  <div className="h-4 w-4 rounded-full bg-[var(--adm-accent)] text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-1 shadow-sm shadow-red-500/20">
                    {conv.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Chat Window */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[color:var(--adm-border)] bg-[var(--adm-surface-2)]/30">
            <div className="h-9 w-9 rounded-full bg-[var(--adm-accent-soft-bg)] border border-[var(--adm-accent-soft-border)] text-[var(--adm-accent)] flex items-center justify-center text-[11px] font-bold shadow-sm">
              {selected.avatar}
            </div>
            <div>
              <p className="text-[14px] font-bold text-[var(--adm-fg)] leading-none">{selected.name}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                <p className="text-[11px] text-[#22c55e] font-bold">Online</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 flex flex-col gap-4 bg-[var(--adm-bg)]/30">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-sm transition-all ${
                  msg.isMe
                    ? 'bg-[var(--adm-accent)] text-white rounded-tr-sm'
                    : 'bg-[var(--adm-surface)] border border-[color:var(--adm-border)] text-[var(--adm-fg)] rounded-tl-sm'
                }`}>
                  <p className="font-medium">{msg.text}</p>
                  <p className={`text-[9px] mt-1.5 font-medium ${msg.isMe ? 'text-white/70' : 'text-[var(--adm-fg-dim)]'}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <div className="px-4 py-3 border-t border-[color:var(--adm-border)] flex items-center gap-3 bg-[var(--adm-surface)]">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-[var(--adm-surface-2)] border border-[color:var(--adm-border)] rounded-xl px-4 py-2.5 text-[14px] text-[var(--adm-fg)] placeholder:text-[var(--adm-fg-faint)] focus:outline-none focus:border-[var(--adm-accent)] transition-all"
            />
            <button className="h-10 w-10 bg-[var(--adm-accent)] hover:bg-red-700 active:scale-95 rounded-xl flex items-center justify-center transition-all shrink-0 shadow-lg shadow-red-500/20">
              <Send size={16} className="text-white ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
