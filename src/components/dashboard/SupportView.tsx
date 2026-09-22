import React, { useState } from 'react';
import { 
  HelpCircle, MessageSquare, Plus, CheckCircle2, Clock, 
  AlertCircle, ExternalLink, Send, X, ShieldCheck, Phone
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext.js';

interface Ticket {
  id: string;
  subject: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  created: string;
  lastUpdate: string;
  messagesCount: number;
}

export const SupportView: React.FC = () => {
  const { currentOrg } = useTenant();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('Meta Cloud API');
  const [newPriority, setNewPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [newDescription, setNewDescription] = useState('');

  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'TICK-4921',
      subject: 'WABA Tier 250K messaging limit increase request',
      category: 'Meta Cloud API',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      created: 'Today, 09:30 AM',
      lastUpdate: '15m ago by Support Team',
      messagesCount: 3,
    },
    {
      id: 'TICK-4819',
      subject: 'Webhook HMAC-SHA256 signature verification question',
      category: 'Developer API',
      priority: 'MEDIUM',
      status: 'RESOLVED',
      created: 'Yesterday, 02:15 PM',
      lastUpdate: 'Yesterday, 04:00 PM',
      messagesCount: 4,
    },
    {
      id: 'TICK-4702',
      subject: 'Custom bot flow condition branching for payment receipts',
      category: 'Automation',
      priority: 'LOW',
      status: 'RESOLVED',
      created: '3 days ago',
      lastUpdate: '2 days ago',
      messagesCount: 2,
    },
  ]);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDescription.trim()) return;

    const newTicket: Ticket = {
      id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: newSubject,
      category: newCategory,
      priority: newPriority,
      status: 'OPEN',
      created: 'Just now',
      lastUpdate: 'Created by User',
      messagesCount: 1,
    };

    setTickets([newTicket, ...tickets]);
    setIsCreateModalOpen(false);
    setNewSubject('');
    setNewDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <HelpCircle className="h-5 w-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              My Support &amp; Help Desk
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            24/7 dedicated enterprise technical support for WhatsApp Cloud API, webhooks, and automation flows.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Ticket</span>
          </button>
        </div>
      </div>

      {/* Support Direct Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Channel 1: WhatsApp Priority Desk */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <MessageSquare className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-emerald-200 text-emerald-900 px-2 py-0.5 text-[10px] font-bold">
                INSTANT
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-3">Priority WhatsApp Support</h3>
            <p className="text-xs text-slate-600 mt-1">
              Connect directly with an ADSCALE ZEN automation specialist on WhatsApp.
            </p>
          </div>
          <a
            href="https://wa.me/15553829901?text=Hello%2C%20I%20need%20priority%20support%20for%20my%20ADSCALE%20ZEN%20organization"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2 text-xs font-bold text-white transition-colors"
          >
            <span>Chat on WhatsApp →</span>
          </a>
        </div>

        {/* Channel 2: Official Documentation */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="h-9 w-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <HelpCircle className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-3">Developer Documentation</h3>
            <p className="text-xs text-slate-500 mt-1">
              Browse API guides, webhook schemas, payload examples, and automation bot tutorials.
            </p>
          </div>
          <button
            onClick={() => alert('Opening ADSCALE ZEN Official Developer Documentation...')}
            className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 py-2 text-xs font-bold text-slate-700 transition-colors"
          >
            <span>Open Documentation</span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </button>
        </div>

        {/* Channel 3: Phone Escalations */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="h-9 w-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Phone className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-3">Emergency SLA Hotline</h3>
            <p className="text-xs text-slate-500 mt-1">
              For critical broadcast campaign delivery outage or WABA authentication blocks.
            </p>
          </div>
          <div className="mt-4 text-xs font-mono font-bold text-slate-800 bg-slate-50 p-2 rounded-xl text-center border border-slate-200">
            +1 (555) 382-9901 (24/7)
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Your Active Support Tickets
          </h3>
          <span className="text-xs text-slate-400">{tickets.length} total tickets</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Ticket ID</th>
                <th className="p-3.5">Subject</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Last Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-slate-900">{t.id}</td>
                  <td className="p-3.5">
                    <p className="font-bold text-slate-900">{t.subject}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{t.messagesCount} message(s) in thread</p>
                  </td>
                  <td className="p-3.5">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                      {t.category}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.priority === 'HIGH' || t.priority === 'URGENT'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="p-3.5">
                    {t.status === 'RESOLVED' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>RESOLVED</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                        <Clock className="h-3.5 w-3.5" />
                        <span>IN PROGRESS</span>
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-slate-500 text-[11px]">{t.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE TICKET MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Create Support Request</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Brief summary of the issue..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                  >
                    <option value="Meta Cloud API">Meta Cloud API</option>
                    <option value="Developer API">Developer API &amp; Webhooks</option>
                    <option value="Automation">Bot Automation Flow</option>
                    <option value="Campaigns">Broadcast Campaigns</option>
                    <option value="Billing">Billing &amp; Subscription</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent (Production Down)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description &amp; Error Details</label>
                <textarea
                  rows={4}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe what happened, error codes (e.g. #131026), or steps to reproduce..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-md transition-colors"
              >
                Submit Ticket
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
