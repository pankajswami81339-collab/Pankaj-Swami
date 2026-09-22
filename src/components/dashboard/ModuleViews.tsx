import React, { useState } from 'react';
import { 
  Inbox, Users, Megaphone, FileText, Workflow, Bot, 
  UserCheck, Layers, Code2, BarChart3, CreditCard, Settings, 
  ShieldAlert, Send, Plus, Search, Filter, CheckCircle2, 
  AlertCircle, Download, Upload, Clock, Phone, Tag, 
  ExternalLink, Copy, Check, Eye, Trash2, Edit3, Key, Play
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { Role, PlanTier, Contact } from '../../types.js';
import { formatNumber } from '../../lib/utils.js';
import { SEED_PLANS } from '../../constants/plans.js';
import { IntegrationsManagerView } from './IntegrationsManagerView.js';

// 1. SHARED INBOX VIEW
export const SharedInboxView: React.FC = () => {
  const { currentOrg, contacts } = useTenant();
  const [selectedContact, setSelectedContact] = useState(contacts[0] || null);
  const [inputText, setInputText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [messages, setMessages] = useState<{ id: string; sender: 'customer' | 'agent' | 'note'; text: string; time: string }[]>([
    { id: '1', sender: 'customer', text: 'Hello, I was checking out your Enterprise plan. Does it support custom webhooks and dedicated Meta WABA?', time: '10:14 AM' },
    { id: '2', sender: 'note', text: 'Internal Note (@alex): Customer is VP of Tech at Fortune 500 company. High priority!', time: '10:15 AM' },
    { id: '3', sender: 'agent', text: 'Hi Elena! Yes absolutely. We provide dedicated WABA onboarding with custom HMAC webhook signatures and up to Unlimited message throughput.', time: '10:16 AM' },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      sender: isInternalNote ? ('note' as const) : ('agent' as const),
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    if (!isInternalNote) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'customer' as const,
            text: 'Thank you for the fast response! Sending this over to our procurement team.',
            time: 'Just now',
          },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden flex flex-col md:flex-row">
      {/* Col 1: Conversation List */}
      <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
        <div className="p-3 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {contacts.map((c: Contact) => {
            const isSelected = selectedContact?.id === c.id;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedContact(c)}
                className={`p-3 cursor-pointer transition-colors ${isSelected ? 'bg-emerald-50/80 border-l-4 border-emerald-600' : 'hover:bg-slate-100/70'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900">{c.name}</span>
                  <span className="text-[10px] text-slate-400">10:16 AM</span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">{c.phoneNumber}</p>
                <div className="mt-1 flex gap-1">
                  {c.labels.map((l: string) => (
                    <span key={l} className="rounded bg-slate-200/80 px-1.5 py-0.2 text-[9px] font-medium text-slate-700">
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Col 2: Active Chat Area */}
      <div className="flex-1 flex flex-col justify-between bg-white border-r border-slate-200">
        {/* Chat Header */}
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              {(selectedContact?.name || 'Contact').split(' ').filter(Boolean).map((n: string) => n[0]).join('').slice(0, 2) || 'C'}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{selectedContact?.name}</p>
              <p className="text-[10px] text-emerald-600 font-mono font-medium">{selectedContact?.phoneNumber} &bull; Active via Meta Cloud API</p>
            </div>
          </div>
          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
            Assigned: Alex (You)
          </span>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
          {messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.sender === 'customer' ? 'items-start' : 'items-end'}`}>
              <div
                className={`max-w-[80%] rounded-xl p-3 text-xs leading-relaxed shadow-xs ${
                  m.sender === 'customer'
                    ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                    : m.sender === 'note'
                    ? 'bg-amber-50 border border-amber-200 text-amber-900 rounded-lg font-mono text-[11px]'
                    : 'bg-emerald-600 text-white rounded-tr-none'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[9px] text-slate-400 mt-1 px-1">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white">
          <div className="flex items-center gap-2 mb-2 text-xs">
            <button
              type="button"
              onClick={() => setIsInternalNote(false)}
              className={`px-2 py-1 rounded font-semibold transition-colors ${!isInternalNote ? 'bg-emerald-100 text-emerald-800' : 'text-slate-500'}`}
            >
              WhatsApp Reply
            </button>
            <button
              type="button"
              onClick={() => setIsInternalNote(true)}
              className={`px-2 py-1 rounded font-semibold transition-colors ${isInternalNote ? 'bg-amber-100 text-amber-800' : 'text-slate-500'}`}
            >
              Internal Team Note
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isInternalNote ? 'Write private internal note...' : 'Type message to customer...'}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500"
            />
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg text-xs font-bold text-white transition-colors flex items-center gap-1.5 ${
                isInternalNote ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <span>{isInternalNote ? 'Add Note' : 'Send'}</span>
              <Send className="h-3 w-3" />
            </button>
          </div>
        </form>
      </div>

      {/* Col 3: Customer Info Sidebar */}
      <div className="hidden lg:block w-72 p-4 bg-slate-50/70 overflow-y-auto space-y-4 text-xs">
        <div>
          <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-slate-500">Contact Details</h4>
          <p className="mt-2 text-sm font-semibold text-slate-900">{selectedContact?.name}</p>
          <p className="text-slate-500 font-mono">{selectedContact?.phoneNumber}</p>
        </div>

        <div className="border-t border-slate-200 pt-3">
          <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-slate-500">Labels</h4>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {selectedContact?.labels.map((lbl: string) => (
              <span key={lbl} className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded text-[10px]">
                {lbl}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 pt-3">
          <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider text-slate-500">Custom Attributes</h4>
          <div className="mt-2 space-y-1.5 font-mono text-[11px] text-slate-600">
            <p><span className="text-slate-400">Order ID:</span> NX-8921</p>
            <p><span className="text-slate-400">Lifetime Value:</span> $1,420</p>
            <p><span className="text-slate-400">Preferred Lang:</span> en_US</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. CONTACTS CRM VIEW
export const ContactsView: React.FC = () => {
  const { contacts } = useTenant();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = contacts.filter(
    (c: Contact) => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phoneNumber.includes(searchTerm)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Contact CRM & Segmentation</h2>
          <p className="text-xs text-slate-500">Manage WhatsApp subscribers, import CSV audiences, and assign custom labels.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs">
            <Upload className="h-3.5 w-3.5" />
            <span>Import CSV</span>
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs">
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs">
            <Plus className="h-3.5 w-3.5" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="p-3 border-b border-slate-200">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by contact name or phone number..."
            className="w-full max-w-sm rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500"
          />
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Phone Number</th>
              <th className="p-3">Labels</th>
              <th className="p-3">Opt-In Status</th>
              <th className="p-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.map((c: Contact) => (
              <tr key={c.id} className="hover:bg-slate-50/50">
                <td className="p-3 font-semibold text-slate-900">{c.name}</td>
                <td className="p-3 font-mono text-slate-700">{c.phoneNumber}</td>
                <td className="p-3">
                  <div className="flex gap-1">
                    {c.labels.map((l: string) => (
                      <span key={l} className="bg-slate-100 text-slate-700 rounded px-1.5 py-0.5 text-[10px] font-medium">
                        {l}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-3">
                  <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                    OPTED_IN
                  </span>
                </td>
                <td className="p-3 text-slate-500 font-mono">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 3. CAMPAIGNS VIEW
export const CampaignsView: React.FC = () => {
  const { stats } = useTenant();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Broadcast Campaigns</h2>
          <p className="text-xs text-slate-500">Trigger asynchronous high-volume WhatsApp broadcasts powered by Redis queue workers.</p>
        </div>
        <button className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs flex items-center gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          <span>New Broadcast Campaign</span>
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
            <tr>
              <th className="p-3">Campaign Name</th>
              <th className="p-3">Audience Size</th>
              <th className="p-3">Status</th>
              <th className="p-3">Sent Count</th>
              <th className="p-3">Read Rate</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {stats.campaignsList.map((cmp) => (
              <tr key={cmp.id} className="hover:bg-slate-50/50">
                <td className="p-3 font-semibold text-slate-900">{cmp.name}</td>
                <td className="p-3 font-mono">{formatNumber(cmp.audienceCount)}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    cmp.status === 'ACTIVE' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {cmp.status}
                  </span>
                </td>
                <td className="p-3 font-mono">{formatNumber(cmp.sent)}</td>
                <td className="p-3 font-mono text-emerald-600 font-bold">{cmp.readRate}%</td>
                <td className="p-3">
                  <button className="text-slate-500 hover:text-slate-900 font-semibold text-[11px]">Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 4. TEMPLATES VIEW
export const TemplatesView: React.FC = () => {
  const templates = [
    { id: '1', name: 'flash_sale_vip', category: 'MARKETING', status: 'APPROVED', language: 'en_US', text: '🔥 Flash Sale Alert! Hey {{1}}, get 30% off our latest catalog with code {{2}}.' },
    { id: '2', name: 'order_status_update', category: 'UTILITY', status: 'APPROVED', language: 'en_US', text: '📦 Your order #{{1}} is out for delivery! Track live: {{2}}' },
    { id: '3', name: 'account_verification_otp', category: 'AUTHENTICATION', status: 'APPROVED', language: 'en_US', text: '{{1}} is your ADSCALE ZEN verification security code. Valid for 10 minutes.' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">WhatsApp Message Templates</h2>
          <p className="text-xs text-slate-500">Meta-approved message templates for outbound notifications and marketing broadcasts.</p>
        </div>
        <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs flex items-center gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          <span>Create Template</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((tpl) => (
          <div key={tpl.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-mono font-bold text-xs text-slate-900">{tpl.name}</span>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                  {tpl.status}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                <span>{tpl.category}</span>
                <span>&bull;</span>
                <span>{tpl.language}</span>
              </div>
              <p className="mt-3 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed font-sans">
                {tpl.text}
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 flex justify-end">
              <span className="text-[11px] text-emerald-600 font-semibold cursor-pointer">Preview in WhatsApp &rarr;</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. BOT FLOWS VIEW
export const BotFlowsView: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Conversational Bot Flow Builder</h2>
          <p className="text-xs text-slate-500">Visual drag-and-drop automation journeys built with 14 modular node blocks.</p>
        </div>
        <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs flex items-center gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          <span>New Automation Flow</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-slate-900">Customer Support & FAQ Triage</span>
            <span className="rounded bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 text-[10px]">ACTIVE</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Trigger: Incoming message matches keywords [help, issue, return]</p>
          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-600 space-y-1">
            <p>START &rarr; QUESTION &rarr; AI_RESPONSE &rarr; ASSIGN_AGENT</p>
            <p className="text-emerald-600 font-semibold">Processed 14,920 sessions with 74.2% automated resolution</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-slate-900">Abandoned Cart Recovery Sequence</span>
            <span className="rounded bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 text-[10px]">ACTIVE</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Trigger: Webhook from WooCommerce checkout abandonment</p>
          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-600 space-y-1">
            <p>WEBHOOK &rarr; WAIT (1hr) &rarr; MESSAGE &rarr; BUTTON (Claim 10% Off)</p>
            <p className="text-emerald-600 font-semibold">Recovered $38,400 in merchandise this quarter</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 6. AI ASSISTANT VIEW
export const AIAssistantView: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Grounded Enterprise AI Assistant</h2>
        <p className="text-xs text-slate-500">Configure strict knowledge-base context guardrails so the AI answers without hallucinations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">System Guardrail Instructions</h3>
          <textarea
            defaultValue="You are the official WhatsApp assistant for ADSCALE ZEN. Only answer queries using the company knowledge base provided below. If a user asks a question not covered by the context, gracefully offer to connect them to a live support agent."
            className="w-full h-32 rounded-lg border border-slate-200 p-3 text-xs text-slate-800 font-mono focus:outline-hidden focus:border-emerald-500"
          />
          <button className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700">
            Save AI System Prompt
          </button>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Injected Company Context (Knowledge Base)</h3>
          <textarea
            defaultValue="1. Refund Policy: 30 days unconditional money-back guarantee.
2. WhatsApp Message Limits: Official Tier 1 (1k), Tier 2 (10k), Tier 3 (100k), Tier 4 (Unlimited).
3. API Access: REST API v1 with Bearer token authentication."
            className="w-full h-32 rounded-lg border border-slate-200 p-3 text-xs text-slate-800 font-mono focus:outline-hidden focus:border-emerald-500"
          />
          <button className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100">
            Re-index Context
          </button>
        </div>
      </div>
    </div>
  );
};

// 7. TEAM VIEW
export const TeamView: React.FC = () => {
  const members = [
    { name: 'Alex Johnson', email: 'alex@adscalezen.online', role: 'OWNER', status: 'ACTIVE' },
    { name: 'Elena Rostova', email: 'elena@adscalezen.online', role: 'ADMIN', status: 'ACTIVE' },
    { name: 'Marcus Chen', email: 'marcus@adscalezen.online', role: 'MANAGER', status: 'ACTIVE' },
    { name: 'Sarah Miller', email: 'sarah@adscalezen.online', role: 'AGENT', status: 'ACTIVE' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Team Members & Governance</h2>
          <p className="text-xs text-slate-500">Multi-tenant role-based access control (OWNER, ADMIN, MANAGER, AGENT).</p>
        </div>
        <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs flex items-center gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          <span>Invite Member</span>
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Assigned Role</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {members.map((m) => (
              <tr key={m.email} className="hover:bg-slate-50/50">
                <td className="p-3 font-semibold text-slate-900">{m.name}</td>
                <td className="p-3 font-mono text-slate-600">{m.email}</td>
                <td className="p-3">
                  <span className="font-bold font-mono px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-800">
                    {m.role}
                  </span>
                </td>
                <td className="p-3">
                  <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                    {m.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 8. INTEGRATIONS VIEW
export const IntegrationsView: React.FC = () => {
  return <IntegrationsManagerView />;
};

// 9. API & WEBHOOKS VIEW
export const ApiWebhooksView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Developer API & Webhooks</h2>
        <p className="text-xs text-slate-500">Integrate ADSCALE ZEN directly with your backend using Bearer tokens and HMAC signatures.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900">REST API v1 Key</h3>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value="az_live_sec_908234190823409812340981"
            className="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-800"
          />
          <button className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700">
            Copy Key
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3 font-mono text-xs">
        <h3 className="font-bold text-sm font-sans text-slate-900">Available Endpoints</h3>
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
          <span>POST /api/v1/messages/send</span>
          <span className="text-slate-500">Send text or rich media</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
          <span>POST /api/v1/messages/template</span>
          <span className="text-slate-500">Send Meta template broadcast</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
          <span>POST /api/webhooks/whatsapp</span>
          <span className="text-emerald-700 font-semibold">Meta webhook receiver (Idempotent)</span>
        </div>
      </div>
    </div>
  );
};

// 10. ANALYTICS VIEW
export const AnalyticsView: React.FC = () => {
  const { stats } = useTenant();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Analytics & Conversion Metrics</h2>
        <p className="text-xs text-slate-500">Comprehensive delivery, read receipts, and agent response speed tracking.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Total Sent</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{formatNumber(stats.messagesSent)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Delivery Rate</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">97.9%</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Read Rate</p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">{stats.readRate}%</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Avg Resolution</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">4.2 min</p>
        </div>
      </div>
    </div>
  );
};

// 11. BILLING VIEW
export const BillingView: React.FC = () => {
  const { currentOrg } = useTenant();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Billing & Subscription Management</h2>
        <p className="text-xs text-slate-500">Powered by Razorpay subscription billing with automated monthly invoice receipts.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
            CURRENT PLAN: {currentOrg.tier}
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-2">Active Subscription</h3>
          <p className="text-xs text-slate-500">Next billing date: Next month on the 1st &bull; Renews automatically via Razorpay</p>
        </div>
        <button className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700">
          Upgrade to Business
        </button>
      </div>
    </div>
  );
};

// 12. SETTINGS VIEW
export const SettingsView: React.FC = () => {
  const { currentOrg } = useTenant();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Organization Settings</h2>
        <p className="text-xs text-slate-500">Manage business information, timezones, and WhatsApp Cloud API credentials.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4 max-w-xl">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Organization Name</label>
          <input
            type="text"
            defaultValue={currentOrg.name}
            className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Organization Slug</label>
          <input
            type="text"
            readOnly
            defaultValue={currentOrg.slug}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs font-mono text-slate-600"
          />
        </div>
        <button className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700">
          Save Settings
        </button>
      </div>
    </div>
  );
};

// 13. ADMIN PANEL VIEW
export const AdminPanelView: React.FC = () => {
  const { organizations } = useTenant();
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2 py-0.5 rounded font-mono">ROOT</span>
          <h2 className="text-xl font-bold text-slate-900">Platform Super Admin Panel</h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">Cross-tenant organization oversight, subscription controls, and Meta health.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
            <tr>
              <th className="p-3">Organization</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Tier</th>
              <th className="p-3">WABA ID</th>
              <th className="p-3">Meta Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {organizations.map((org) => (
              <tr key={org.id} className="hover:bg-slate-50/50">
                <td className="p-3 font-semibold text-slate-900">{org.name}</td>
                <td className="p-3 font-mono text-slate-500">{org.slug}</td>
                <td className="p-3">
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-800">
                    {org.tier}
                  </span>
                </td>
                <td className="p-3 font-mono text-slate-600">{org.wabaId || 'Pending'}</td>
                <td className="p-3">
                  <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                    CONNECTED
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
