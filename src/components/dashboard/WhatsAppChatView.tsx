import React, { useState } from 'react';
import { 
  Search, Filter, Send, Paperclip, Smile, FileText, 
  Check, CheckCheck, MoreVertical, Phone, Video, 
  User, Tag, Plus, StickyNote, Clock, ShieldCheck, 
  ChevronRight, AlertCircle, ArrowLeft
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext.js';

interface ChatMessage {
  id: string;
  sender: 'customer' | 'agent' | 'internal_note';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  mediaUrl?: string;
  mediaType?: 'image' | 'document';
}

interface Conversation {
  id: string;
  contactName: string;
  phone: string;
  email: string;
  avatar?: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  tags: string[];
  assignedAgent: string;
  customFields: Record<string, string>;
  notes: { id: string; author: string; text: string; time: string }[];
  messages: ChatMessage[];
}

export const WhatsAppChatView: React.FC = () => {
  const { currentOrg } = useTenant();

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv-1',
      contactName: 'Elena Rostova',
      phone: '+1 (555) 382-9901',
      email: 'elena@novacorp.com',
      unreadCount: 2,
      lastMessage: 'Can you verify if our WABA limit increase was approved?',
      lastMessageTime: '10:14 AM',
      tags: ['Enterprise', 'High-Priority', 'Lead: WABA'],
      assignedAgent: 'Alex Rivera',
      customFields: {
        'Company Size': '250+ employees',
        'Current Tier': 'Growth Plan',
        'Industry': 'Fintech & Payments',
      },
      notes: [
        {
          id: 'note-1',
          author: 'Alex Rivera',
          text: 'Spoke with CFO on Tuesday. They want to upgrade to Enterprise 100K tier before month end.',
          time: 'Yesterday 3:45 PM',
        },
      ],
      messages: [
        {
          id: 'm-1',
          sender: 'agent',
          text: 'Hi Elena! Welcome to ADSCALE ZEN. Your dedicated WABA instance is fully connected.',
          timestamp: '10:00 AM',
          status: 'read',
        },
        {
          id: 'm-2',
          sender: 'customer',
          text: 'Thank you Alex! Can you verify if our WABA limit increase was approved?',
          timestamp: '10:14 AM',
        },
      ],
    },
    {
      id: 'conv-2',
      contactName: 'Marcus Vance',
      phone: '+1 (555) 234-8891',
      email: 'marcus@aerovance.io',
      unreadCount: 0,
      lastMessage: 'Thank you, the flash sale broadcast was a huge success!',
      lastMessageTime: '09:30 AM',
      tags: ['E-Commerce', 'Active Client'],
      assignedAgent: 'Sarah Jenkins',
      customFields: {
        'Store Platform': 'Shopify Plus',
        'Monthly Volume': '45,000 orders',
      },
      notes: [],
      messages: [
        {
          id: 'm-3',
          sender: 'customer',
          text: 'Thank you, the flash sale broadcast was a huge success!',
          timestamp: '09:30 AM',
        },
      ],
    },
    {
      id: 'conv-3',
      contactName: 'Devon Lee',
      phone: '+1 (555) 890-4321',
      email: 'devon@symphony.dev',
      unreadCount: 0,
      lastMessage: 'What is the webhook signature header key?',
      lastMessageTime: 'Yesterday',
      tags: ['Developer', 'API Key'],
      assignedAgent: 'Tech Support',
      customFields: {
        'API Usage': 'Tier 1 Developer',
      },
      notes: [],
      messages: [
        {
          id: 'm-4',
          sender: 'customer',
          text: 'What is the webhook signature header key?',
          timestamp: 'Yesterday 4:10 PM',
        },
        {
          id: 'm-5',
          sender: 'agent',
          text: 'It is X-Hub-Signature-256 containing the HMAC-SHA256 digest of the raw body payload.',
          timestamp: 'Yesterday 4:12 PM',
          status: 'read',
        },
      ],
    },
  ]);

  const [selectedConvId, setSelectedConvId] = useState<string>('conv-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTagFilter, setActiveTagFilter] = useState('ALL');
  const [messageInput, setMessageInput] = useState('');
  const [isInternalNoteMode, setIsInternalNoteMode] = useState(false);
  const [newInternalNote, setNewInternalNote] = useState('');
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false);

  const currentConv = conversations.find((c) => c.id === selectedConvId) || conversations[0];

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch = 
      c.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag = activeTagFilter === 'ALL' || c.tags.includes(activeTagFilter);
    return matchesSearch && matchesTag;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: isInternalNoteMode ? 'internal_note' : 'agent',
      text: messageInput,
      timestamp: 'Just now',
      status: 'sent',
    };

    const updated = conversations.map((c) => {
      if (c.id === currentConv.id) {
        return {
          ...c,
          lastMessage: isInternalNoteMode ? `[Internal Note]: ${messageInput}` : messageInput,
          lastMessageTime: 'Just now',
          messages: [...c.messages, newMsg],
        };
      }
      return c;
    });

    setConversations(updated);
    setMessageInput('');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInternalNote.trim()) return;

    const noteItem = {
      id: `note-${Date.now()}`,
      author: 'Alex Rivera (You)',
      text: newInternalNote,
      time: 'Just now',
    };

    const updated = conversations.map((c) => {
      if (c.id === currentConv.id) {
        return {
          ...c,
          notes: [noteItem, ...c.notes],
        };
      }
      return c;
    });

    setConversations(updated);
    setNewInternalNote('');
  };

  const handleInsertTemplate = (text: string) => {
    setMessageInput(text);
    setIsTemplatePickerOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* Top Meta Connection Strip */}
      <div className="flex items-center justify-between bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-800">WhatsApp Shared Inbox</span>
          <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">&bull; Meta Cloud API WABA Active</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
            24-hr Service Window Open
          </span>
        </div>
      </div>

      {/* 3-Column Chat Inbox Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 h-[calc(100vh-12rem)] min-h-[600px] rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        
        {/* COLUMN 1: Conversation List (Left) */}
        <div className="md:col-span-4 lg:col-span-3 border-r border-slate-200 flex flex-col h-full bg-slate-50/40">
          {/* Search and Filters */}
          <div className="p-3 border-b border-slate-200 space-y-2 bg-white">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats or phone..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            {/* Quick Tag Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-[10px] font-bold">
              {['ALL', 'Enterprise', 'E-Commerce', 'Developer'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTagFilter(tag)}
                  className={`px-2 py-0.5 rounded-md shrink-0 transition-colors ${
                    activeTagFilter === tag
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation Cards */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === currentConv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`p-3 transition-all cursor-pointer flex gap-3 ${
                    isSelected
                      ? 'bg-emerald-50/70 border-l-4 border-emerald-600'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                      {conv.contactName.slice(0, 2).toUpperCase()}
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-600 text-white font-bold text-[9px] flex items-center justify-center shadow-xs">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 truncate">{conv.contactName}</p>
                      <span className="text-[10px] text-slate-400">{conv.lastMessageTime}</span>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{conv.lastMessage}</p>

                    <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                      {conv.tags.slice(0, 2).map((t) => (
                        <span key={t} className="rounded bg-slate-100 px-1.5 py-0.2 text-[9px] font-semibold text-slate-600">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMN 2: Active Chat Messages (Center) */}
        <div className={`flex flex-col h-full ${showRightPanel ? 'md:col-span-8 lg:col-span-6' : 'md:col-span-8 lg:col-span-9'}`}>
          {/* Chat Header */}
          <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                {currentConv.contactName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">{currentConv.contactName}</h3>
                <p className="font-mono text-[10px] text-slate-400">{currentConv.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowRightPanel(!showRightPanel)}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors text-xs font-semibold flex items-center gap-1"
                title="Toggle Contact Profile"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Details</span>
              </button>
            </div>
          </div>

          {/* Messages Feed Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {/* WhatsApp 24-hr Security Notice */}
            <div className="mx-auto max-w-sm rounded-xl bg-amber-50/80 border border-amber-200 p-2 text-center text-[11px] text-amber-800">
              WhatsApp Cloud API 24-hour service window active. You can send free-form session messages.
            </div>

            {currentConv.messages.map((msg) => {
              if (msg.sender === 'internal_note') {
                return (
                  <div key={msg.id} className="mx-auto max-w-md rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 shadow-2xs">
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      <StickyNote className="h-3.5 w-3.5 text-amber-600" />
                      <span>Internal Team Note</span>
                      <span className="text-[10px] text-amber-600 font-normal">&bull; {msg.timestamp}</span>
                    </div>
                    <p>{msg.text}</p>
                  </div>
                );
              }

              const isAgent = msg.sender === 'agent';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl p-3 shadow-2xs text-xs ${
                      isAgent
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                    <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                      isAgent ? 'text-emerald-100' : 'text-slate-400'
                    }`}>
                      <span>{msg.timestamp}</span>
                      {isAgent && (
                        <span>
                          {msg.status === 'read' ? (
                            <CheckCheck className="h-3 w-3 text-cyan-200" />
                          ) : (
                            <Check className="h-3 w-3 text-emerald-200" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Message Input Bar */}
          <div className="p-3 border-t border-slate-200 bg-white">
            {/* Mode switch: Message vs Internal Note */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsInternalNoteMode(false)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                    !isInternalNoteMode ? 'bg-emerald-100 text-emerald-800' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  WhatsApp Reply
                </button>
                <button
                  type="button"
                  onClick={() => setIsInternalNoteMode(true)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                    isInternalNoteMode ? 'bg-amber-100 text-amber-900' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <StickyNote className="h-3 w-3" />
                  <span>Internal Note</span>
                </button>
              </div>

              {/* Template Picker Button */}
              <button
                type="button"
                onClick={() => setIsTemplatePickerOpen(!isTemplatePickerOpen)}
                className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Insert Template</span>
              </button>
            </div>

            {/* Template Popover */}
            {isTemplatePickerOpen && (
              <div className="mb-2 p-2 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5 text-xs">
                <p className="font-bold text-slate-700 text-[11px]">Choose Approved Template:</p>
                {[
                  'Hi {{1}}, your order #{{2}} has shipped! Track here: {{3}}',
                  'Welcome to ADSCALE ZEN! Your dedicated account manager is ready.',
                  'Your appointment is scheduled for tomorrow at {{1}}.',
                ].map((tpl) => (
                  <button
                    key={tpl}
                    type="button"
                    onClick={() => handleInsertTemplate(tpl)}
                    className="w-full text-left p-2 rounded-lg bg-white border border-slate-200 text-slate-800 hover:border-emerald-500 hover:bg-emerald-50/50 text-[11px]"
                  >
                    {tpl}
                  </button>
                ))}
              </div>
            )}

            {/* Input form */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={isInternalNoteMode ? 'Type internal note visible only to your team...' : 'Type WhatsApp message...'}
                className={`flex-1 rounded-xl border p-2.5 text-xs focus:outline-hidden ${
                  isInternalNoteMode
                    ? 'border-amber-300 bg-amber-50/50 text-amber-950 focus:border-amber-500'
                    : 'border-slate-200 bg-white text-slate-900 focus:border-emerald-600'
                }`}
              />

              <button
                type="submit"
                className={`rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-colors flex items-center gap-1.5 ${
                  isInternalNoteMode
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-xs'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-xs'
                }`}
              >
                <span>{isInternalNoteMode ? 'Save Note' : 'Send'}</span>
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* COLUMN 3: Contact Details & CRM Info (Right) */}
        {showRightPanel && (
          <div className="hidden lg:flex lg:col-span-3 border-l border-slate-200 flex-col h-full bg-slate-50/40 overflow-y-auto p-4 space-y-4">
            <div className="text-center pb-3 border-b border-slate-200">
              <div className="mx-auto h-14 w-14 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-base mb-2">
                {currentConv.contactName.slice(0, 2).toUpperCase()}
              </div>
              <h3 className="text-sm font-bold text-slate-900">{currentConv.contactName}</h3>
              <p className="font-mono text-xs text-slate-500 mt-0.5">{currentConv.phone}</p>
              <p className="text-xs text-slate-400 truncate">{currentConv.email}</p>
            </div>

            {/* Assigned Agent */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Agent</span>
              <div className="rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-800 flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-emerald-600" />
                <span>{currentConv.assignedAgent}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Labels &amp; Tags</span>
                <Tag className="h-3 w-3 text-slate-400" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentConv.tags.map((t) => (
                  <span key={t} className="rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Custom Attributes */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Custom Attributes</span>
              <div className="rounded-xl border border-slate-200 bg-white p-2.5 space-y-1.5 text-xs">
                {Object.entries(currentConv.customFields).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">{key}:</span>
                    <strong className="text-slate-800 font-semibold">{val}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Internal Team Notes */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Team Notes</span>
                <StickyNote className="h-3 w-3 text-slate-400" />
              </div>

              {currentConv.notes.map((n) => (
                <div key={n.id} className="rounded-xl bg-amber-50/70 border border-amber-200/80 p-2.5 text-xs space-y-1">
                  <div className="flex justify-between text-[10px] text-amber-800 font-bold">
                    <span>{n.author}</span>
                    <span className="text-slate-400">{n.time}</span>
                  </div>
                  <p className="text-slate-700 text-[11px] leading-relaxed">{n.text}</p>
                </div>
              ))}

              <form onSubmit={handleAddNote} className="space-y-1.5">
                <input
                  type="text"
                  value={newInternalNote}
                  onChange={(e) => setNewInternalNote(e.target.value)}
                  placeholder="Add a quick internal note..."
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="w-full rounded-lg bg-slate-900 py-1.5 text-xs font-bold text-white hover:bg-slate-800"
                >
                  Save Note
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
