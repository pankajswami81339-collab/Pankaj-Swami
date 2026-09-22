import React, { useState } from 'react';
import { 
  ArrowRight, Check, ShieldCheck, Zap, Bot, MessageSquare, 
  Users, Workflow, BarChart3, Code2, Webhook, Database, 
  ShoppingBag, Sparkles, CheckCircle2, ChevronDown, 
  Send, PhoneCall, Play, Clock, Smartphone, Layers
} from 'lucide-react';
import { SEED_PLANS } from '../../constants/plans.js';
import { AdScaleZenLogo } from '../brand/AdScaleZenLogo.js';

interface LandingPageProps {
  onStartFree: () => void;
  onBookDemo: () => void;
  onOpenSpecs: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartFree, onBookDemo, onOpenSpecs }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [simulatedPrompt, setSimulatedPrompt] = useState('Order #NX-8921 tracking');
  const [simulatedChat, setSimulatedChat] = useState<{ sender: 'user' | 'bot' | 'agent'; text: string; time: string }[]>([
    { sender: 'user', text: 'Hi, I need delivery updates for order #NX-8921', time: '10:42 AM' },
    { sender: 'bot', text: '👋 Hello! Checking with our warehouse system now...', time: '10:42 AM' },
    { sender: 'bot', text: '📦 Order #NX-8921 is in transit! Estimated delivery: Tomorrow by 2:00 PM via FedEx Express.', time: '10:43 AM' },
  ]);

  const handleSendSimulatedMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatedPrompt.trim()) return;

    const userMsg = { sender: 'user' as const, text: simulatedPrompt, time: 'Just now' };
    setSimulatedChat((prev) => [...prev, userMsg]);
    const inputVal = simulatedPrompt;
    setSimulatedPrompt('');

    setTimeout(() => {
      setSimulatedChat((prev) => [
        ...prev,
        {
          sender: 'bot' as const,
          text: `🤖 [AI Automated Workflow Triggered]: Acknowledged "${inputVal}". Our sales agent is also tagged into this shared thread!`,
          time: 'Just now',
        },
      ]);
    }, 600);
  };

  const FAQS = [
    {
      q: 'What is the difference between ADSCALE ZEN and unofficial WhatsApp scrapers?',
      a: 'ADSCALE ZEN strictly uses the official Meta WhatsApp Cloud API (Graph API v20.0). We do not use QR-code browser automation or unofficial web-session wrappers. Your business numbers are safe from Meta account bans, and you receive official verified green-check eligibility, higher tier throughput, and 99.9% uptime SLA.',
    },
    {
      q: 'How does the Meta Embedded Signup onboarding work?',
      a: 'With one click, you launch the official Meta co-branded dialog. You select your Meta Business Manager, pick or generate a WhatsApp Business Account (WABA), link your phone number, and grant permissions. Our backend automatically exchanges the system token, registers the webhook, and provisions your tenant securely.',
    },
    {
      q: 'Can multiple agents manage the same WhatsApp phone number simultaneously?',
      a: 'Yes! ADSCALE ZEN provides a true multi-tenant shared inbox. Unlimited team members can collaborate on conversations, leave internal team notes, assign tickets, and set automated routing rules from a single WhatsApp Business number.',
    },
    {
      q: 'How does the n8n and REST API integration work?',
      a: 'Every tenant receives their own dedicated REST API endpoint and webhook signing keys. You can trigger messages from n8n nodes, sync CRM contacts from WooCommerce or Google Sheets, and stream incoming replies back into your own infrastructure.',
    },
    {
      q: 'Are my WhatsApp customer data and Meta tokens secure?',
      a: 'Yes. All Meta System User Access Tokens are encrypted at rest using AES-256-GCM. Frontend code never receives Meta App Secrets. Tenant isolation is strictly enforced at database and API boundary layers.',
    },
    {
      q: 'Can I send mass broadcast marketing campaigns?',
      a: 'Yes. Using Meta-approved marketing and utility templates, you can send targeted broadcasts to segmented contact audiences. ADSCALE ZEN utilizes an asynchronous queue engine to ensure high delivery rates without hitting rate limits.',
    },
  ];

  return (
    <div className="bg-white text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white shadow-xs px-4 py-1.5 mb-6 hover:border-emerald-300 transition-colors">
              <AdScaleZenLogo variant="icon" size="xs" id="hero-badge-logo" />
              <span className="text-xs font-bold tracking-tight text-slate-800">
                ADSCALE ZEN
              </span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-xs font-semibold text-emerald-700 font-mono">
                Meta Cloud API v20.0
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-mono font-bold text-emerald-700 border border-emerald-200">
                Official SaaS
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              WhatsApp Automation That Works For Your Business
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
              Connect WhatsApp, automate conversations, manage leads and build powerful customer workflows from one platform.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onStartFree}
                id="hero-btn-start-free"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 transition-all hover:scale-[1.02]"
              >
                <span>Start Free</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={onBookDemo}
                id="hero-btn-book-demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
              >
                <PhoneCall className="h-4 w-4 text-emerald-600" />
                <span>Book a Demo</span>
              </button>

              <button
                onClick={onOpenSpecs}
                id="hero-btn-view-blueprint"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-emerald-400 bg-emerald-50/50 px-5 py-3.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-100/70 transition-all"
              >
                <Code2 className="h-4 w-4 text-emerald-600" />
                <span>View Architecture Blueprint</span>
              </button>
            </div>

            {/* Micro badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Meta Embedded Signup
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Zero Unofficial Scraping
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> AES-256 Token Encryption
              </span>
            </div>
          </div>

          {/* ORIGINAL DASHBOARD & PRODUCT MOCKUP */}
          <div className="mt-14 relative mx-auto max-w-5xl rounded-2xl border border-slate-800 bg-[#090E1A] p-2 sm:p-3 shadow-2xl shadow-slate-950/40">
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80"></div>
                  <div className="h-3 w-3 rounded-full bg-amber-500/80"></div>
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <div className="h-4 w-px bg-slate-800" />
                <AdScaleZenLogo variant="compact" size="xs" theme="dark" id="hero-mockup-brand" />
                <span className="font-mono text-[11px] text-slate-400 hidden sm:inline">https://app.adscalezen.online/dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-950/80 px-2.5 py-1 text-[10px] font-semibold text-emerald-400 border border-emerald-800/80 font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Meta Cloud API: Connected
                </span>
              </div>
            </div>

            {/* Dashboard Inner Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 p-2 sm:p-3 bg-slate-950 rounded-b-xl text-slate-200">
              {/* Left Column: KPI metrics and Live Automations */}
              <div className="lg:col-span-5 space-y-3">
                {/* 3 Metric cards */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3">
                    <p className="text-[11px] text-slate-400 font-medium">Messages Sent</p>
                    <p className="text-xl font-bold text-white mt-1">482,190</p>
                    <p className="text-[10px] text-emerald-400 mt-0.5">↑ 18.4% this month</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3">
                    <p className="text-[11px] text-slate-400 font-medium">Read Rate</p>
                    <p className="text-xl font-bold text-emerald-400 mt-1">88.8%</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Industry avg: 54%</p>
                  </div>
                </div>

                {/* Visual Bot Flow snippet */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <Workflow className="h-3.5 w-3.5" /> Active Flow: Order Tracker & AI
                    </span>
                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Live</span>
                  </div>
                  <div className="space-y-1.5 text-[11px] font-mono">
                    <div className="p-1.5 rounded bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                      <span className="text-slate-300">① [TRIGGER] Incoming Keyword</span>
                      <span className="text-emerald-400">Match &bull; 100%</span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                      <span className="text-slate-300">② [AI RESPONSE] Contextual Order Lookup</span>
                      <span className="text-blue-400">Gemini 2.5</span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                      <span className="text-slate-300">③ [ACTION] Tag Lead: &apos;ACTIVE_ORDER&apos;</span>
                      <span className="text-purple-400">CRM Updated</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Shared Inbox & WhatsApp Simulator */}
              <div className="lg:col-span-7 flex flex-col rounded-xl border border-slate-800 bg-slate-900/90 p-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">
                      ER
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">Elena Rostova (+1 415-555-2671)</p>
                      <p className="text-[10px] text-emerald-400">VIP Lead &bull; High Intent &bull; Active Cart</p>
                    </div>
                  </div>
                  <span className="text-[10px] rounded bg-slate-800 px-2 py-0.5 text-slate-300 font-mono">
                    Assigned: Alex (Agent)
                  </span>
                </div>

                {/* Message Thread */}
                <div className="flex-1 space-y-2 py-2 overflow-y-auto max-h-[190px]">
                  {simulatedChat.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-start' : 'items-end'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                            : 'bg-emerald-700 text-white rounded-tr-none shadow-sm'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-slate-500 mt-0.5 px-1">{msg.time}</span>
                    </div>
                  ))}
                </div>

                {/* Interactive Simulator Form */}
                <form onSubmit={handleSendSimulatedMsg} className="mt-2 flex gap-2 border-t border-slate-800 pt-2">
                  <input
                    type="text"
                    value={simulatedPrompt}
                    onChange={(e) => setSimulatedPrompt(e.target.value)}
                    placeholder="Type a test customer reply..."
                    className="flex-1 rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors flex items-center gap-1"
                  >
                    <span>Simulate</span>
                    <Send className="h-3 w-3" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION 1: WhatsApp Business API */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                <Zap className="h-3.5 w-3.5" /> 1. Meta WhatsApp Cloud API
              </div>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Official Enterprise Infrastructure Directly from Meta
              </h2>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                Connect your WhatsApp Business Account (WABA) using official Meta Embedded Signup. Enjoy zero setup downtime, automatic token renewal, and official message tier scalability without the risk of phone number blocking.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700"><strong>Embedded Signup Dialog:</strong> Complete WhatsApp Business onboarding directly on your domain without manual developer portal hassles.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700"><strong>AES-256 Token Vault:</strong> System User Access Tokens are encrypted with AES-256-GCM and never exposed to the client browser.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700"><strong>Quality Rating Guard:</strong> Live monitors phone number health, spam reports, and messaging limit tiers (10K, 100K, Unlimited).</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Phone Number Verification</p>
                    <p className="text-xs text-slate-500">+1 (555) 382-9901 &bull; Verified Name Approved</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">GREEN</span>
                </div>
                <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Daily Messaging Tier</p>
                    <p className="text-xs text-slate-500">Tier 100K recipients / 24 hours</p>
                  </div>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-700">TIER_100K</span>
                </div>
                <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Webhook Status</p>
                    <p className="text-xs text-slate-500">Real-time bi-directional events subscribed</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION 2: Shared WhatsApp Inbox */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
              <MessageSquare className="h-3.5 w-3.5" /> 2. Shared WhatsApp Inbox
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              A Collaborative Inbox for Support & Sales Teams
            </h2>
            <p className="mt-4 text-slate-600">
              Give your entire team access to incoming WhatsApp chats with collision detection, internal agent notes, custom tags, and quick-reply snippets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-4">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Multi-Agent Assignment</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Auto-assign conversations using round-robin routing or skill-based assignments. Prevent two agents from typing responses simultaneously.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-4">
                <Bot className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Internal Team Notes</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Leave private notes on customer threads visible only to team members. Mention teammates to escalate complex technical requests.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-4">
                <Smartphone className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Rich Media Support</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Send and receive PDFs, images, videos, audio notes, and interactive WhatsApp buttons directly from the dashboard desktop interface.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION 3: AI Chatbot */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-slate-100 font-mono text-xs shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
                <span>ADSCALE ZEN AI Agent Guardrail Engine</span>
                <span className="text-emerald-400">Active</span>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-slate-400">// System Prompt Guardrail</p>
                <p className="text-emerald-300">You are the official WhatsApp assistant for Nexus E-Commerce.</p>
                <p className="text-emerald-300">Only answer based on verified business context. If unsure, gracefully invoke human handoff.</p>
                <p className="text-slate-400 mt-3">// Business Context Injected</p>
                <p className="text-blue-300">&bull; Return Window: 30 days money-back guarantee</p>
                <p className="text-blue-300">&bull; Free shipping threshold: $75 or above</p>
                <p className="text-blue-300">&bull; Warranty: 2 years manufacturer warranty on all electronics</p>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                <Bot className="h-3.5 w-3.5" /> 3. Grounded AI Chatbot
              </div>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Smart WhatsApp AI with Zero Hallucinations
              </h2>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                Empower your business with an AI chatbot that knows your products, FAQs, and policies inside and out. Our context-injection layer ensures your bot speaks accurately in your brand voice.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Custom knowledge base ingestion (PDF, FAQ, website URL)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Configurable temperature and strict non-hallucination guardrails</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span>Automated sentiment analysis and instant fallback to human agents</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION 4: Campaign Management */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                <Zap className="h-3.5 w-3.5" /> 4. Campaign Management
              </div>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                High-Volume WhatsApp Broadcasts with Rate Limiting
              </h2>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                Launch scheduled or immediate broadcasts to tagged customer cohorts. ADSCALE ZEN processes thousands of messages asynchronously using Redis queues to prevent API throttling and ensure maximum delivery rates.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <p className="font-bold text-slate-900 text-lg">98.2%</p>
                  <p className="text-slate-500">Average Delivery Rate</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <p className="font-bold text-emerald-600 text-lg">89.4%</p>
                  <p className="text-slate-500">Average Read Rate</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-900">Broadcast Campaign Queue</span>
                <span className="text-[11px] font-mono text-emerald-600">Redis Background Worker</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-800">Spring Flash Sale VIP Broadcast</p>
                  <p className="text-slate-500">Template: flash_sale_vip &bull; 24,500 recipients</p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                  COMPLETED
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-800">Cart Abandonment Recovery v2</p>
                  <p className="text-slate-500">Template: cart_recovery &bull; 8,120 recipients</p>
                </div>
                <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[10px]">
                  ACTIVE
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECTION 5: Bot Flow Builder */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
            <Workflow className="h-3.5 w-3.5" /> 5. Bot Flow Builder
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Visual Drag-and-Drop Workflow Canvas
          </h2>
          <p className="mt-4 text-base text-slate-600 max-w-2xl mx-auto">
            Design multi-step conversational journeys using 14 modular node blocks. Chain condition checks, question collections, database queries, and human escalations visually.
          </p>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs font-medium">
            {['START', 'MESSAGE', 'QUESTION', 'BUTTON', 'LIST', 'CONDITION', 'WAIT', 'TAG', 'ASSIGN AGENT', 'HTTP REQUEST', 'WEBHOOK', 'AI RESPONSE', 'END'].map((node) => (
              <div key={node} className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 hover:border-emerald-500 hover:bg-emerald-50 transition-colors">
                <span className="font-mono font-bold text-slate-800">{node}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SECTION 6: Contact CRM */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                <Database className="h-3.5 w-3.5" /> 6. Built-in Contact CRM
              </div>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Capture, Segment & Enrich WhatsApp Leads
              </h2>
              <p className="mt-4 text-slate-600">
                Organize your WhatsApp phone contacts with custom labels, dynamic fields (order value, company size, account tier), language preferences, and full conversation archives.
              </p>
              <div className="mt-6 space-y-2 text-sm text-slate-700">
                <p className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> One-click CSV contact import & export with column mapping</p>
                <p className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Instant filtering by labels: VIP, CART_ABANDONED, B2B_DEMO</p>
                <p className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Custom key-value attributes for external ERP & CRM sync</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs text-xs font-mono">
              <div className="text-slate-400 pb-2 border-b border-slate-100">CRM Record Preview: contact_id: cnt_1</div>
              <div className="mt-3 space-y-1.5 text-slate-800">
                <p><span className="text-slate-400">Phone:</span> +1 415-555-2671</p>
                <p><span className="text-slate-400">Name:</span> Elena Rostova</p>
                <p><span className="text-slate-400">Labels:</span> [&quot;VIP&quot;, &quot;CART_ABANDONED&quot;]</p>
                <p><span className="text-slate-400">Custom Fields:</span> &#123; order_id: &quot;NX-8921&quot;, ltv: &quot;$1,420&quot; &#125;</p>
                <p><span className="text-slate-400">Source:</span> INCOMING_WHATSAPP</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SECTION 7: Team Inbox */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
            <Users className="h-3.5 w-3.5" /> 7. Team Inbox & Granular RBAC
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Role-Based Access for OWNER, ADMIN, MANAGER & AGENT
          </h2>
          <p className="mt-4 text-base text-slate-600 max-w-2xl mx-auto">
            Maintain strict governance over billing, API keys, broadcast permissions, and customer conversations with enterprise role hierarchies.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
              <span className="font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">OWNER</span>
              <p className="mt-2 text-xs text-slate-600">Full tenant control, billing management, organization deletion, and role delegation.</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
              <span className="font-bold text-xs bg-blue-700 text-white px-2 py-0.5 rounded">ADMIN</span>
              <p className="mt-2 text-xs text-slate-600">Team member invites, Meta WABA connection, API keys, webhooks, and integrations.</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
              <span className="font-bold text-xs bg-emerald-700 text-white px-2 py-0.5 rounded">MANAGER</span>
              <p className="mt-2 text-xs text-slate-600">Campaign broadcasting, bot flows creation, template management, and team analytics.</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
              <span className="font-bold text-xs bg-purple-700 text-white px-2 py-0.5 rounded">AGENT</span>
              <p className="mt-2 text-xs text-slate-600">Shared inbox replying, contact notes, and resolution of assigned conversations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9 & 10. SECTION 8 & 9: REST API & Webhooks */}
      <section className="py-20 bg-slate-900 text-slate-100 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-md bg-emerald-950 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-800">
                <Code2 className="h-3.5 w-3.5" /> 8 & 9. REST API & Idempotent Webhooks
              </div>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Developer-First Architecture with SHA-256 HMAC Signatures
              </h2>
              <p className="mt-4 text-slate-400 text-sm leading-relaxed">
                Connect your backends via Bearer API keys. Our webhook engine verifies incoming Meta `X-Hub-Signature-256` headers and deduplicates events using an in-memory idempotency cache to prevent double-processing.
              </p>
              <div className="mt-6 space-y-2 text-xs font-mono text-emerald-400">
                <p>POST /api/v1/messages/send</p>
                <p>POST /api/v1/messages/template</p>
                <p>GET /api/v1/contacts</p>
                <p>POST /api/webhooks/whatsapp</p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs font-mono text-slate-300">
              <p className="text-slate-500">// Meta Webhook Verification & Processing</p>
              <p className="text-blue-400">router.post(&apos;/api/webhooks/whatsapp&apos;, (req, res) =&gt; &#123;</p>
              <p className="pl-4 text-slate-300">const valid = verifyMetaSignature(req.rawBody, req.headers[&apos;x-hub-signature-256&apos;]);</p>
              <p className="pl-4 text-slate-300">if (!valid) return res.status(401).json(&#123; error: &apos;Invalid Signature&apos; &#125;);</p>
              <p className="pl-4 text-emerald-400">if (isEventProcessed(eventId)) return res.json(&#123; skipped: true &#125;);</p>
              <p className="pl-4 text-slate-300">dispatchToWorkflowQueue(req.body);</p>
              <p className="text-blue-400">&#125;);</p>
            </div>
          </div>
        </div>
      </section>

      {/* 11, 12, 13. SECTIONS 10, 11, 12: n8n, Google Sheets & WooCommerce Integrations */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
            <Layers className="h-3.5 w-3.5" /> 10, 11, 12. Native Integrations
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Seamlessly Connect with Your Existing Tech Stack
          </h2>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            Trigger WhatsApp workflows from n8n nodes, sync order updates from WooCommerce, and stream leads directly into Google Sheets without writing custom glue code.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50 hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold mb-4">
                n8n
              </div>
              <h3 className="font-bold text-slate-900 text-lg">n8n Automation Node</h3>
              <p className="mt-2 text-sm text-slate-600">
                Trigger workflows on incoming messages, route leads to custom endpoints, and fire actions back to WhatsApp via our native API credentials.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50 hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-4">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Google Sheets Sync</h3>
              <p className="mt-2 text-sm text-slate-600">
                Bi-directional sync: automatically write every new WhatsApp lead into a designated Google Sheet row, or broadcast messages from spreadsheet rows.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50 hover:shadow-md transition-shadow">
              <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-4">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">WooCommerce Store</h3>
              <p className="mt-2 text-sm text-slate-600">
                Send automatic order confirmations, shipping dispatch tracking links, and abandoned checkout discount coupons with zero manual work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 14. SECTION 13: Analytics */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
              <BarChart3 className="h-3.5 w-3.5" /> 13. Deep Messaging Analytics
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Real-Time Metrics That Drive Higher Conversion
            </h2>
            <p className="mt-4 text-slate-600">
              Track delivery rates, read rates, agent response latency, campaign ROI, and bot resolution ratios from interactive dashboards.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <p className="text-3xl font-extrabold text-slate-900">482K+</p>
              <p className="text-xs font-medium text-slate-500 mt-1">Messages Processed</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <p className="text-3xl font-extrabold text-emerald-600">97.9%</p>
              <p className="text-xs font-medium text-slate-500 mt-1">Delivery Success</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <p className="text-3xl font-extrabold text-blue-600">88.8%</p>
              <p className="text-xs font-medium text-slate-500 mt-1">Open / Read Rate</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <p className="text-3xl font-extrabold text-purple-600">1.8 min</p>
              <p className="text-xs font-medium text-slate-500 mt-1">Avg First Response</p>
            </div>
          </div>
        </div>
      </section>

      {/* 15. SECTION 14: Pricing */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
              <Zap className="h-3.5 w-3.5" /> 14. Transparent Pricing
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Predictable Plans for Every Stage of Growth
            </h2>
            <p className="mt-4 text-slate-600">
              Scale from a single WhatsApp number to high-throughput enterprise deployments with Razorpay subscription billing.
            </p>

            {/* Toggle */}
            <div className="mt-6 inline-flex items-center gap-3 p-1 rounded-xl bg-slate-100 border border-slate-200">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${billingCycle === 'annual' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
              >
                <span>Annual Billing</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-bold">SAVE 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {SEED_PLANS.map((plan) => {
              const price = billingCycle === 'monthly' ? plan.monthlyPrice / 100 : Math.round((plan.annualPrice / 12) / 100);
              const isPopular = plan.tier === 'GROWTH';

              return (
                <div
                  key={plan.tier}
                  className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                    isPopular ? 'border-emerald-600 bg-emerald-50/20 shadow-md ring-2 ring-emerald-600' : 'border-slate-200 bg-white shadow-xs'
                  }`}
                >
                  <div>
                    {isPopular && (
                      <span className="inline-block rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold uppercase text-white mb-2">
                        Most Popular
                      </span>
                    )}
                    <h3 className="font-bold text-slate-900 text-lg">{plan.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{plan.description}</p>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-3xl font-extrabold text-slate-900">${price}</span>
                      <span className="text-xs text-slate-500 ml-1">/ mo</span>
                    </div>

                    <div className="mt-6 space-y-2 text-xs text-slate-700 border-t border-slate-100 pt-4">
                      <p className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600" /> {plan.contactsLimit.toLocaleString()} Contacts</p>
                      <p className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600" /> {plan.messagesLimit.toLocaleString()} Messages</p>
                      <p className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600" /> {plan.numbersLimit} WhatsApp Number</p>
                      <p className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600" /> {plan.membersLimit} Team Members</p>
                      <p className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600" /> {plan.workflowsLimit} Bot Workflows</p>
                    </div>
                  </div>

                  <button
                    onClick={onStartFree}
                    className={`mt-6 w-full rounded-xl py-2 text-xs font-bold transition-all ${
                      isPopular
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    Select {plan.name}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 16. SECTION 15: FAQ */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
              15. Frequently Asked Questions
            </div>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 tracking-tight">
              Everything You Need to Know About Meta Cloud API
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180 text-emerald-600' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 17. SECTION 16: Final CTA */}
      <section className="py-20 bg-emerald-600 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Automate Your WhatsApp Business Today?
          </h2>
          <p className="mt-4 text-emerald-100 text-base sm:text-lg max-w-2xl mx-auto">
            Launch your official WhatsApp Business Cloud API setup in under 90 seconds. No credit card required to explore the sandbox.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartFree}
              id="final-cta-start-free"
              className="w-full sm:w-auto rounded-xl bg-white px-8 py-3.5 text-base font-bold text-emerald-800 shadow-lg hover:bg-emerald-50 transition-all hover:scale-105"
            >
              Start Free Trial
            </button>
            <button
              onClick={onBookDemo}
              id="final-cta-book-demo"
              className="w-full sm:w-auto rounded-xl border border-emerald-400 bg-emerald-700/60 px-8 py-3.5 text-base font-bold text-white hover:bg-emerald-700 transition-all"
            >
              Schedule Live Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
