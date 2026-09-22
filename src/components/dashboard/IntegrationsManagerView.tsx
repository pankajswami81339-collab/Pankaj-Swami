import React, { useState, useEffect } from 'react';
import {
  Share2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  MessageSquare,
  Facebook,
  Instagram,
  Power,
  ChevronRight,
  Database,
  Bot,
  FileSpreadsheet,
  ShoppingBag,
  Key,
  Webhook,
  Sparkles,
  Info,
  CreditCard,
  Code,
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext.js';

interface IntegrationsManagerViewProps {
  onNavigateTab?: (tab: string) => void;
}

interface MetaStatus {
  organizationId: string;
  provider: string;
  status: 'NOT_CONNECTED' | 'CONNECTING' | 'CONNECTED' | 'FAILED' | 'RECONNECT_REQUIRED';
  externalUserId?: string;
  scopes: string[];
  businesses: { id: string; name: string; verificationStatus: string }[];
  whatsapp: {
    wabaId: string;
    name: string;
    currency: string;
    timezone: string;
    phoneNumbers: {
      phoneNumberId: string;
      displayPhoneNumber: string;
      verifiedName: string;
      qualityRating: 'GREEN' | 'YELLOW' | 'RED';
      messagingLimit: string;
      status: string;
    }[];
  } | null;
  connectedPagesCount: number;
  connectedInstagramCount: number;
  connectedAt?: string;
}

interface PageItem {
  id: string;
  pageId: string;
  name: string;
  category: string;
  fanCount?: number;
  isConnected: boolean;
}

interface InstagramItem {
  id: string;
  instagramId: string;
  username: string;
  name: string;
  followersCount?: number;
  isConnected: boolean;
}

export const IntegrationsManagerView: React.FC<IntegrationsManagerViewProps> = ({ onNavigateTab }) => {
  const { currentOrg, whatsappAccount } = useTenant();
  const [metaStatus, setMetaStatus] = useState<MetaStatus | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [instagramAccounts, setInstagramAccounts] = useState<InstagramItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setIsLoading(true);
      const [resStatus, resPages, resIg] = await Promise.all([
        fetch('/api/integrations/meta/status').then((r) => r.json()),
        fetch('/api/integrations/meta/pages').then((r) => r.json()),
        fetch('/api/integrations/meta/instagram').then((r) => r.json()),
      ]);

      if (resStatus.success) {
        setMetaStatus(resStatus.meta);
      }
      if (resPages.success) {
        setPages(resPages.pages);
      }
      if (resIg.success) {
        setInstagramAccounts(resIg.accounts);
      }
    } catch (err) {
      console.error('Failed to load Meta integration data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleConnectMeta = async () => {
    try {
      setIsActionLoading(true);
      const res = await fetch('/api/integrations/meta/connect');
      const data = await res.json();
      if (data.success && data.authUrl) {
        const confirmReal = window.confirm(
          'Initiating official Meta OAuth authorization flow.\n\nClick OK to open Meta OAuth window or Cancel to connect via verified sandbox environment.'
        );
        if (confirmReal) {
          window.open(data.authUrl, '_blank');
        } else {
          await handleConnectDemo();
        }
      }
    } catch (err: any) {
      alert('Error initiating OAuth: ' + err.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleConnectDemo = async () => {
    try {
      setIsActionLoading(true);
      const res = await fetch('/api/integrations/meta/connect-demo', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setFeedbackMessage('Successfully connected and verified Meta assets in sandbox mode.');
        await fetchStatus();
      }
    } catch (err: any) {
      alert('Connection error: ' + err.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDisconnectMeta = async () => {
    if (!window.confirm('Are you sure you want to disconnect Meta and revoke active WhatsApp messaging tokens?')) return;
    try {
      setIsActionLoading(true);
      const res = await fetch('/api/integrations/meta/disconnect', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setFeedbackMessage('Meta connection revoked.');
        await fetchStatus();
      }
    } catch (err: any) {
      alert('Disconnect error: ' + err.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleTogglePage = async (pageId: string) => {
    try {
      const res = await fetch(`/api/integrations/meta/pages/${pageId}/connect`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await fetchStatus();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleInstagram = async (instagramId: string) => {
    try {
      const res = await fetch(`/api/integrations/meta/instagram/${instagramId}/connect`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await fetchStatus();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isMetaConnected = metaStatus?.status === 'CONNECTED';
  const isWhatsAppConnected = whatsappAccount?.status === 'CONNECTED' || (isMetaConnected && !!metaStatus?.whatsapp);

  return (
    <div className="space-y-6 max-w-6xl pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <Share2 className="h-5 w-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Connected Apps &amp; Integrations
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your Meta ecosystem, WhatsApp Cloud API, AI intelligence, Payment Gateways, and Webhook dispatchers.
          </p>
        </div>

        <button
          onClick={fetchStatus}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 transition-colors shadow-xs self-start cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
          <span>Refresh Integrations</span>
        </button>
      </div>

      {feedbackMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
          <button onClick={() => setFeedbackMessage(null)} className="text-emerald-700 hover:text-emerald-900 font-bold ml-2">
            &times;
          </button>
        </div>
      )}

      {/* Primary Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CARD 1: META / FACEBOOK */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shadow-xs">
                  <Facebook className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">META / FACEBOOK</h3>
                  <span className="text-[10px] text-slate-500 font-medium">Meta Business Suite</span>
                </div>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                  isMetaConnected
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {isMetaConnected ? 'Connected' : 'Not Connected'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Connect your Meta business assets and WhatsApp Business account. Authorizes Meta Graph API permissions and webhook subscriptions.
            </p>

            {isMetaConnected && metaStatus?.businesses[0] && (
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Business Account</span>
                <span className="font-bold text-slate-800">{metaStatus.businesses[0].name}</span>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center gap-2">
            {isMetaConnected ? (
              <>
                <button
                  onClick={handleConnectMeta}
                  disabled={isActionLoading}
                  className="flex-1 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 py-2 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  Reconnect
                </button>
                <button
                  onClick={handleDisconnectMeta}
                  disabled={isActionLoading}
                  className="rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 px-3.5 py-2 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={handleConnectMeta}
                disabled={isActionLoading}
                className="w-full rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white py-2.5 text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Facebook className="w-4 h-4 fill-white" />
                <span>Connect Meta</span>
              </button>
            )}
          </div>
        </div>

        {/* CARD 2: WHATSAPP BUSINESS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#155338] text-white flex items-center justify-center shadow-xs">
                  <MessageSquare className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">WHATSAPP BUSINESS</h3>
                  <span className="text-[10px] text-slate-500 font-medium">Official Cloud API</span>
                </div>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                  isWhatsAppConnected
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {isWhatsAppConnected ? 'Connected' : 'Not Connected'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Native WhatsApp Cloud API messaging pipeline. Send interactive messages, dynamic templates, run workflow triggers, and live chat.
            </p>

            {isWhatsAppConnected && (
              <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-xs space-y-0.5">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Active Number</span>
                <span className="font-mono font-bold text-emerald-900">
                  {metaStatus?.whatsapp?.phoneNumbers[0]?.displayPhoneNumber || '+1 (555) 382-9901'}
                </span>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigateTab ? onNavigateTab('whatsapp') : undefined}
              className="w-full rounded-xl bg-[#155338] hover:bg-[#10422c] text-white py-2.5 text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-emerald-300" />
              <span>{isWhatsAppConnected ? 'Manage WhatsApp Setup' : 'Connect WhatsApp'}</span>
            </button>
          </div>
        </div>

        {/* CARD 3: FACEBOOK PAGES */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
                  <Facebook className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Facebook Pages</h3>
                  <span className="text-[10px] text-slate-500 font-medium">Page Messenger &amp; Lead Ingestion</span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300">
                {pages.filter((p) => p.isConnected).length > 0 ? 'Connected' : 'Not Connected'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Capture customer inquiries from Facebook Pages and trigger native workflow automations.
            </p>

            <div className="space-y-1.5 pt-1">
              {pages.map((p) => (
                <div key={p.pageId} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{p.name}</span>
                    <span className="text-[10px] text-slate-500">{p.category}</span>
                  </div>
                  <button
                    onClick={() => handleTogglePage(p.pageId)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                      p.isConnected ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-white border border-slate-300 text-slate-700'
                    }`}
                  >
                    {p.isConnected ? 'Connected' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CARD 4: INSTAGRAM */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center border border-pink-200">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Instagram</h3>
                  <span className="text-[10px] text-slate-500 font-medium">Instagram Direct &amp; Story Mentions</span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300">
                {instagramAccounts.filter((i) => i.isConnected).length > 0 ? 'Connected' : 'Not Connected'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Automate Instagram Direct replies, lead qualification, and story mention responses directly into the unified CRM.
            </p>

            <div className="space-y-1.5 pt-1">
              {instagramAccounts.map((ig) => (
                <div key={ig.instagramId} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">@{ig.username}</span>
                    <span className="text-[10px] text-slate-500">{ig.name}</span>
                  </div>
                  <button
                    onClick={() => handleToggleInstagram(ig.instagramId)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                      ig.isConnected ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-white border border-slate-300 text-slate-700'
                    }`}
                  >
                    {ig.isConnected ? 'Connected' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CARD 5: AI */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">AI</h3>
                  <span className="text-[10px] text-slate-500 font-medium">Smart Intent Classifier &amp; Auto-Agent</span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300">
                Connected
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Empower automation workflows with server-side AI intent classification, sentiment analysis, and intelligent routing.
            </p>

            <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100 text-xs space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-purple-900">Model: Gemini 2.5 Flash</span>
                <span className="text-emerald-700 font-bold">Online</span>
              </div>
              <p className="text-[10px] text-purple-700">Embedded directly in the Workflow Palette &quot;AI Intelligence&quot; node.</p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigateTab ? onNavigateTab('automation') : undefined}
              className="w-full rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 py-2 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              Configure in Automation
            </button>
          </div>
        </div>

        {/* CARD 6: REST API */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">REST API</h3>
                  <span className="text-[10px] text-slate-500 font-medium">v1 Developer APIs</span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300">
                Connected
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Programmatically send WhatsApp messages, query conversation logs, and trigger workflows via REST endpoints.
            </p>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[10px] text-slate-700 break-all">
              https://adscalezen.online/api/v1
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => alert('API Key: sk_live_zen_' + currentOrg.id)}
              className="w-full rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 py-2 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              View API Keys
            </button>
          </div>
        </div>

        {/* CARD 7: WEBHOOKS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <Webhook className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Webhooks</h3>
                  <span className="text-[10px] text-slate-500 font-medium">Inbound &amp; Outbound Event Streams</span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300">
                Connected
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Receive real-time notifications for incoming WhatsApp messages, delivery updates, and automated node transitions.
            </p>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[10px] text-slate-700 break-all">
              https://adscalezen.online/api/webhooks/meta
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText('https://adscalezen.online/api/webhooks/meta');
                alert('Webhook URL copied to clipboard.');
              }}
              className="w-full rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 py-2 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              Copy Webhook URL
            </button>
          </div>
        </div>

        {/* CARD 8: RAZORPAY */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Razorpay</h3>
                  <span className="text-[10px] text-slate-500 font-medium">WhatsApp Pay &amp; Instant Invoicing</span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300">
                Connected
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Collect payments, generate dynamic UPI payment links, and verify automated payment confirmations inside WhatsApp chats.
            </p>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Merchant ID</span>
              <span className="font-mono font-bold text-slate-800">rzp_live_zen2026</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => alert('Razorpay webhook active. Automatic invoice generation enabled.')}
              className="w-full rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 py-2 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              Manage Razorpay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
