import React from 'react';
import { X, Check, Code, ArrowRight, ShieldCheck, Zap, Bot, Layers, Workflow, Webhook } from 'lucide-react';

interface MarketingPagesModalProps {
  page: string | null;
  onClose: () => void;
  onOpenDashboard: () => void;
}

export const MarketingPagesModal: React.FC<MarketingPagesModalProps> = ({ page, onClose, onOpenDashboard }) => {
  if (!page) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative my-8 w-full max-w-4xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          id="btn-close-modal"
        >
          <X className="h-5 w-5" />
        </button>

        {page === 'whatsapp-api' && (
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
              <Zap className="h-4 w-4" /> Official Meta WhatsApp Cloud API
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900">
              Direct Meta WhatsApp Business Platform Integration
            </h2>
            <p className="mt-2 text-slate-600">
              ADSCALE ZEN connects directly to Meta Graph API v20.0 endpoints. No unofficial QR-code web scrapers, no account bans, and zero browser automation risks.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                <h4 className="font-semibold text-slate-900">Meta Embedded Signup</h4>
                <p className="mt-1 text-xs text-slate-500">Co-branded Meta dialog for instant WABA creation and token exchange in under 90 seconds.</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                <h4 className="font-semibold text-slate-900">High-Throughput Tiering</h4>
                <p className="mt-1 text-xs text-slate-500">Supports up to Unlimited messages/day with Tier 1 (1K), Tier 2 (10K), Tier 3 (100K) automatic upgrades.</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                <h4 className="font-semibold text-slate-900">Two-Way Webhooks</h4>
                <p className="mt-1 text-xs text-slate-500">Real-time status tracking for sent, delivered, read, and incoming interactive list/button responses.</p>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-slate-900 p-4 text-emerald-400 font-mono text-xs overflow-x-auto">
              <p className="text-slate-400">// Sample ADSCALE ZEN Server-Side Dispatch</p>
              <p>POST https://graph.facebook.com/v20.0/109283746192837/messages</p>
              <p>Authorization: Bearer [AES_256_DECRYPTED_TOKEN]</p>
              <p>{'{"messaging_product": "whatsapp", "to": "+14155552671", "type": "template"}'}</p>
            </div>
          </div>
        )}

        {page === 'developers' && (
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
              <Code className="h-4 w-4" /> Developer Platform & REST API v1
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900">
              Modern REST API with Bearer Token Authentication
            </h2>
            <p className="mt-2 text-slate-600">
              Integrate ADSCALE ZEN WhatsApp capability directly into your core product, ERP, or internal scripts.
            </p>

            <div className="mt-4 space-y-3 font-mono text-xs">
              <div className="rounded-lg border border-slate-200 p-3 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-600">POST</span> <span className="text-slate-800">/api/v1/messages/send</span>
                </div>
                <span className="text-slate-500">Send custom text, image, audio, doc</span>
              </div>
              <div className="rounded-lg border border-slate-200 p-3 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-600">POST</span> <span className="text-slate-800">/api/v1/messages/template</span>
                </div>
                <span className="text-slate-500">Trigger Meta-approved template broadcasts</span>
              </div>
              <div className="rounded-lg border border-slate-200 p-3 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-blue-600">GET</span> <span className="text-slate-800">/api/v1/contacts</span>
                </div>
                <span className="text-slate-500">Query CRM contacts and labels</span>
              </div>
              <div className="rounded-lg border border-slate-200 p-3 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-600">POST</span> <span className="text-slate-800">/api/webhooks/whatsapp</span>
                </div>
                <span className="text-slate-500">Meta incoming webhook receiver (Idempotent)</span>
              </div>
            </div>
          </div>
        )}

        {page === 'automation' && (
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
              <Workflow className="h-4 w-4" /> Visual Bot Flow Builder
            </div>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Drag & Drop Conversational Flow Editor
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Build branching WhatsApp journeys without writing code. Use 14 versatile node types: START, MESSAGE, QUESTION, BUTTON, LIST, CONDITION, WAIT, TAG, ASSIGN AGENT, HTTP REQUEST, WEBHOOK, AI RESPONSE, and END.
            </p>
          </div>
        )}

        {page === 'ai-chatbot' && (
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
              <Bot className="h-4 w-4" /> Non-Hallucinating Enterprise AI Chatbot
            </div>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Grounded on Your Company Knowledge Base
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Provide your FAQ, pricing matrices, return policies, and product catalogs. The AI assistant strictly answers from provided context with automatic seamless fallback to human agents.
            </p>
          </div>
        )}

        {page === 'integrations' && (
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
              <Layers className="h-4 w-4" /> Native Integrations Ecosystem
            </div>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Connect to n8n, Google Sheets, WooCommerce & Zapier
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Bi-directional triggers allow automated lead creation, order confirmation notifications, abandoned cart recovery, and CRM data syncing.
            </p>
          </div>
        )}

        {page === 'docs' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Documentation & Setup Guides</h2>
            <p className="mt-2 text-sm text-slate-600">
              Explore our guides covering Meta Business Manager setup, WhatsApp Business Account verification, webhook callback configuration, and multi-tenant SDK integration.
            </p>
          </div>
        )}

        {['features', 'about', 'contact', 'privacy', 'terms', 'pricing'].includes(page) && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 capitalize">{page.replace('-', ' ')}</h2>
            <p className="mt-2 text-sm text-slate-600">
              ADSCALE ZEN provides enterprise multi-tenant WhatsApp Business Cloud Automation designed for high delivery rates, multi-role team governance, and secure data persistence.
            </p>
          </div>
        )}

        <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenDashboard();
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            <span>Open SaaS Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
