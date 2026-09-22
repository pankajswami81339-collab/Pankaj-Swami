import React, { useState } from 'react';
import {
  Crown,
  User,
  Users,
  Megaphone,
  Layers,
  Bot,
  UserCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  Play,
  Lock,
  Info,
  Video,
  Download,
  MessageCircle,
  ExternalLink,
  X
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext.js';

interface OverviewViewProps {
  onNavigateTab: (tab: string) => void;
  onOpenSpecs?: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onNavigateTab,
}) => {
  const { currentOrg, contacts, stats, whatsappAccount, phoneNumbers } = useTenant();

  // Modals for Video Tutorials & APK download
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);

  // Exact 8 stat cards as shown in Screenshot 1
  const statCards = [
    {
      id: 'stat-contacts',
      title: 'TOTAL CONTACTS',
      value: contacts?.length ? contacts.length.toString() : '0',
      icon: User,
      actionText: 'Manage Contacts →',
      actionTab: 'contacts',
    },
    {
      id: 'stat-groups',
      title: 'TOTAL GROUPS',
      value: '0',
      icon: Users,
      actionText: 'Manage Groups →',
      actionTab: 'contacts',
    },
    {
      id: 'stat-campaigns',
      title: 'TOTAL CAMPAIGNS',
      value: '0',
      icon: Megaphone,
      actionText: 'Manage Campaigns →',
      actionTab: 'campaigns',
    },
    {
      id: 'stat-templates',
      title: 'TOTAL TEMPLATES',
      value: '0',
      icon: Layers,
      actionText: 'Manage Templates →',
      actionTab: 'templates',
    },
    {
      id: 'stat-bot-replies',
      title: 'BOT REPLIES',
      value: '0',
      icon: Bot,
      actionText: 'Manage Bot Replies →',
      actionTab: 'automation',
    },
    {
      id: 'stat-team',
      title: 'TEAM MEMBERS',
      value: '0',
      icon: UserCheck,
      actionText: 'Manage Team →',
      actionTab: 'team',
    },
    {
      id: 'stat-queue',
      title: 'MESSAGES IN QUEUE',
      value: '0',
      icon: Clock,
      actionText: '',
      actionTab: '',
    },
    {
      id: 'stat-processed',
      title: 'MESSAGES PROCESSED',
      value: stats?.messagesDelivered ? stats.messagesDelivered.toString() : '0',
      icon: CheckCircle2,
      actionText: '',
      actionTab: '',
    },
  ];

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12">
      {/* ======================================================== */}
      {/* 1. TOP GREEN GREETING BANNER (SCREENSHOT 1) */}
      {/* ======================================================== */}
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#175338] via-[#124930] to-[#0d3b24] text-white p-5 sm:p-6 shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Subtle decorative orb */}
        <div className="absolute top-1/2 left-1/2 sm:left-2/3 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Hello, Skill!
          </h1>
          <p className="text-xs text-emerald-100/90 mt-1">
            Need help? Visit{' '}
            <button
              onClick={() => onNavigateTab('support')}
              className="font-bold underline text-emerald-100 hover:text-white transition-colors cursor-pointer"
            >
              Contact &amp; Support
            </button>
          </p>
        </div>

        <div className="relative z-10 self-start sm:self-auto shrink-0">
          <button
            onClick={() => onNavigateTab('subscription')}
            className="inline-flex items-center gap-1.5 bg-white text-[#155338] hover:bg-emerald-50 px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>View Plan</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. EXACT 8 STAT CARDS (SCREENSHOT 1) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 tracking-wider uppercase">
                  {card.title}
                </span>
                <div className="w-9 h-9 rounded-xl bg-[#155338] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="my-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {card.value}
                </span>
              </div>

              {card.actionText ? (
                <button
                  onClick={() => card.actionTab && onNavigateTab(card.actionTab)}
                  className="text-[11px] font-medium text-slate-500 hover:text-slate-800 transition-colors text-left inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>{card.actionText}</span>
                </button>
              ) : (
                <div className="h-4" />
              )}
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 3. WHATSAPP CLOUD API DASHBOARD CONNECTION STATUS CARD */}
      {/* ======================================================== */}
      <div
        className={`rounded-2xl p-5 border shadow-xs space-y-4 transition-all ${
          whatsappAccount?.status === 'CONNECTED'
            ? 'bg-gradient-to-r from-[#155338] to-emerald-900 text-white border-emerald-800'
            : 'bg-[#155338] text-white border-emerald-900/40'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                whatsappAccount?.status === 'CONNECTED'
                  ? 'bg-emerald-400/20 border border-emerald-400/40 text-emerald-300'
                  : 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-300'
              }`}
            >
              {whatsappAccount?.status === 'CONNECTED' ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-300" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-emerald-300" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 font-bold">
                  WhatsApp Cloud API
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    whatsappAccount?.status === 'CONNECTED'
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'bg-black/40 text-emerald-200 border border-white/10'
                  }`}
                >
                  {whatsappAccount?.status === 'CONNECTED' ? 'Connected ✓' : 'Not Connected'}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white leading-snug mt-0.5">
                {whatsappAccount?.status === 'CONNECTED'
                  ? `Active Phone: ${phoneNumbers[0]?.displayPhoneNumber || '+1 (555) 382-9901'} (${phoneNumbers[0]?.verifiedName || currentOrg.name})`
                  : 'Complete Your WhatsApp Cloud API Setup'}
              </h3>
              <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed max-w-2xl">
                {whatsappAccount?.status === 'CONNECTED'
                  ? 'Your WhatsApp messaging system and Meta webhook pipeline are active. Broadcast campaigns, native BullMQ automations, and AI replies are fully enabled.'
                  : 'Your WhatsApp messaging system is not active yet. Complete the WhatsApp Cloud API Setup to start sending messages, run automations, and access all platform features.'}
              </p>
            </div>
          </div>

          <div className="self-start md:self-auto shrink-0 flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('whatsapp')}
              className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-emerald-50 text-[#155338] px-4 py-2.5 text-xs font-extrabold shadow-xs transition-all cursor-pointer"
            >
              <UploadCloud className="h-4 w-4" />
              <span>
                {whatsappAccount?.status === 'CONNECTED' ? 'Manage WhatsApp Setup' : 'Connect WhatsApp'}
              </span>
            </button>

            {whatsappAccount?.status !== 'CONNECTED' && (
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#e11d48] hover:bg-[#be123c] text-white px-3.5 py-2.5 text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>Video Guide</span>
              </button>
            )}
          </div>
        </div>

        {/* Status Highlights */}
        <div className="rounded-lg bg-black/20 border border-white/5 px-3 py-2 text-xs text-emerald-100/90 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Info className="h-3.5 w-3.5 text-emerald-300 shrink-0" />
            <span>
              {whatsappAccount?.status === 'CONNECTED'
                ? 'Webhook Endpoint: https://adscalezen.online/api/webhooks/meta (Subscribed: messages, status)'
                : 'Click "Connect WhatsApp" to configure official Meta OAuth authorization or manual credentials.'}
            </span>
          </div>

          <button
            onClick={() => onNavigateTab('whatsapp')}
            className="text-[11px] font-bold underline text-emerald-200 hover:text-white transition-colors"
          >
            Settings &rarr; WhatsApp Setup &rarr;
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. THREE BOTTOM QUICK ACTION CARDS (SCREENSHOT 1) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Video Tutorials */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs text-center flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <Video className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">Video Tutorials</h4>
            <p className="text-xs text-slate-500 mt-1">Learn with easy video guides</p>
          </div>
          <button
            onClick={() => setIsVideoModalOpen(true)}
            className="mt-4 w-full rounded-lg bg-[#1f7249] hover:bg-[#185d3b] text-white py-2 px-3 text-xs font-semibold transition-colors cursor-pointer"
          >
            Watch Tutorials →
          </button>
        </div>

        {/* Card 2: Mobile App */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs text-center flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <Download className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">Mobile App</h4>
            <p className="text-xs text-slate-500 mt-1">Download Android APK</p>
          </div>
          <button
            onClick={() => setIsApkModalOpen(true)}
            className="mt-4 w-full rounded-lg bg-[#1f7249] hover:bg-[#185d3b] text-white py-2 px-3 text-xs font-semibold transition-colors cursor-pointer"
          >
            Download Now →
          </button>
        </div>

        {/* Card 3: WhatsApp Support */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs text-center flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">WhatsApp Support</h4>
            <p className="text-xs text-slate-500 mt-1">Quick help on WhatsApp</p>
          </div>
          <button
            onClick={() => onNavigateTab('support')}
            className="mt-4 w-full rounded-lg bg-[#1f7249] hover:bg-[#185d3b] text-white py-2 px-3 text-xs font-semibold transition-colors cursor-pointer"
          >
            💬 Chat Now
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODALS: VIDEO TUTORIALS & APK DOWNLOAD */}
      {/* ======================================================== */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  ADSCALE ZEN Setup Video Guide
                </h3>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 aspect-video rounded-xl bg-slate-900 overflow-hidden relative flex flex-col items-center justify-center text-center p-6 text-white">
              <Play className="h-12 w-12 text-rose-500 fill-rose-500 mb-2" />
              <p className="text-sm font-bold">5-Minute Meta WhatsApp Cloud API Setup Guide</p>
              <p className="text-xs text-slate-400 mt-1">
                Learn how to generate Permanent Token, configure Webhook, and verify phone numbers.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <a
                href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <span>Read Official Meta Documentation</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="rounded-lg bg-slate-900 text-white text-xs font-bold px-4 py-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isApkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <Download className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">ADSCALE ZEN Mobile APK</h3>
            <p className="text-xs text-slate-500 mt-2">
              Manage WhatsApp live chats, contacts, broadcast campaigns, and view delivery metrics directly from your Android phone.
            </p>
            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-600">
              adscalezen-v2.4.0-release.apk (24.8 MB)
            </div>
            <div className="mt-5 space-y-2">
              <button
                onClick={() => {
                  alert('Starting secure download of ADSCALE ZEN Android APK...');
                  setIsApkModalOpen(false);
                }}
                className="w-full rounded-xl bg-[#1f7249] hover:bg-[#185d3b] text-white py-2.5 px-4 text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Download APK Directly
              </button>
              <button
                onClick={() => setIsApkModalOpen(false)}
                className="w-full rounded-xl border border-slate-200 text-slate-600 py-2 px-4 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
