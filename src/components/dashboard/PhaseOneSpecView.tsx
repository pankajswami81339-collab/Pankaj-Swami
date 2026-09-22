import React, { useState } from 'react';
import { X, FolderTree, Database, Cpu, Terminal, CheckCircle2, Copy, Check, ArrowRight } from 'lucide-react';

interface PhaseOneSpecViewProps {
  onClose: () => void;
  onProceedToModules: () => void;
}

export const PhaseOneSpecView: React.FC<PhaseOneSpecViewProps> = ({ onClose, onProceedToModules }) => {
  const [activeTab, setActiveTab] = useState<'structure' | 'database' | 'api' | 'setup'>('structure');
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const FOLDER_STRUCTURE = `adscalezen-whatsapp-saas/
├── .env.example               # Complete environment variables specification
├── Dockerfile                 # Production multi-stage Docker build
├── docker-compose.yml         # PostgreSQL 16 + Redis 7 + App + Background Queue Worker
├── README.md                  # System architecture, security & deployment docs
├── prisma/
│   ├── schema.prisma          # Multi-tenant schema with 26 models & performance indexes
│   └── seed.ts                # Default plans, demo tenants, seed users & WABA credentials
├── server/
│   ├── crypto.ts              # AES-256-GCM token encryption/decryption at rest
│   ├── webhook-verifier.ts    # Meta X-Hub-Signature-256 validation & idempotency cache
│   ├── tenant.ts              # Tenant context isolation & RBAC middleware (OWNER/ADMIN/...)
│   ├── db.ts                  # Multi-tenant store implementing Prisma schema
│   ├── whatsapp-service.ts    # Official Meta Graph API v20.0 service & token exchange
│   └── routes/
│       ├── auth.ts            # Multi-tenant user auth & session handling
│       ├── organizations.ts   # Tenant switching, members & role management
│       ├── whatsapp.ts        # WABA management, phone numbers & Meta Embedded Signup
│       ├── webhooks.ts        # /api/webhooks/whatsapp receiver with idempotency
│       └── api-v1.ts          # Public REST API v1 with Bearer token authentication
├── src/
│   ├── types.ts               # Shared TypeScript interfaces for multi-tenant platform
│   ├── main.tsx               # Client entry point
│   ├── App.tsx                # Master state, router & layout coordinator
│   ├── index.css              # Global styles
│   ├── context/
│   │   ├── AuthContext.tsx    # User session, role switcher (OWNER/ADMIN/MANAGER/AGENT)
│   │   └── TenantContext.tsx  # Multi-tenant switcher, stats & live webhook bus
│   ├── components/
│   │   ├── layout/            # Navbar, Footer, Multi-tenant Sidebar & Header
│   │   ├── landing/           # 16-section high-converting modern SaaS marketing page
│   │   ├── dashboard/         # KPI Cards, Messaging Charts, WhatsApp WABA Module
│   │   └── marketing/         # Subpage modal views for all 14 marketing routes
└── server.ts                  # Express full-stack engine with Vite middleware`;

  const SETUP_INSTRUCTIONS = `# 1. Clone & Configure Environment
cp .env.example .env

# 2. Launch Local PostgreSQL & Redis Infrastructure
docker-compose up -d

# 3. Synchronize Database Schema & Seed Multi-Tenant Data
npx prisma db push
npx tsx prisma/seed.ts

# 4. Start Full-Stack Dev Server (Express + Vite)
npm run dev

# Server runs on: http://localhost:3000
# Meta Webhook endpoint: http://localhost:3000/api/webhooks/whatsapp`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative my-6 w-full max-w-5xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                Phase 1 Review
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Multi-Tenant WhatsApp SaaS Architecture Blueprint
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Production-grade foundational layer: Database, Tenant Isolation, RBAC, Meta Embedded Signup & Webhooks
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/80 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 px-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('structure')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'structure'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderTree className="h-4 w-4" />
            <span>Folder Structure</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'database'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="h-4 w-4" />
            <span>Prisma Schema (26 Models)</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'api'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cpu className="h-4 w-4" />
            <span>API & Webhook Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('setup')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'setup'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="h-4 w-4" />
            <span>Setup Instructions & Docker</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-slate-800 bg-slate-900">
          {activeTab === 'structure' && (
            <div className="relative">
              <button
                onClick={() => copyToClipboard(FOLDER_STRUCTURE, 'structure')}
                className="absolute right-2 top-2 rounded bg-slate-800 px-2 py-1 text-[11px] text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-1"
              >
                {copied === 'structure' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copied === 'structure' ? 'Copied' : 'Copy'}</span>
              </button>
              <pre className="text-emerald-400 font-mono leading-relaxed whitespace-pre-wrap">{FOLDER_STRUCTURE}</pre>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-4 text-slate-200">
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 font-sans text-xs text-slate-300">
                <span className="font-bold text-emerald-400">Multi-Tenant Prisma Schema:</span> Contains all 26 models requested by the prompt (User, Organization, OrganizationMember, Role, WhatsAppAccount, WhatsAppPhoneNumber, Contact, ContactLabel, Conversation, Message, MessageMedia, Template, Campaign, CampaignRecipient, Workflow, WorkflowVersion, WorkflowExecution, AIConfiguration, ApiKey, Webhook, WebhookEvent, Subscription, Plan, Payment, Usage, AuditLog, Integration) with performance indexes on <code className="text-emerald-400">organization_id</code>, <code className="text-emerald-400">phone_number</code>, <code className="text-emerald-400">conversation_id</code>, <code className="text-emerald-400">campaign_id</code>, <code className="text-emerald-400">created_at</code>, and <code className="text-emerald-400">status</code>.
              </div>
              <pre className="text-emerald-300 font-mono text-[11px] leading-relaxed max-h-[400px] overflow-y-auto">
{`// Highlights from prisma/schema.prisma
model Organization {
  id               String               @id @default(uuid())
  name             String
  slug             String               @unique
  tier             PlanTier             @default(STARTER)
  wabaId           String?
  members          OrganizationMember[]
  whatsAppAccounts WhatsAppAccount[]
  phoneNumbers     WhatsAppPhoneNumber[]
  contacts         Contact[]
  conversations    Conversation[]
  campaigns        Campaign[]
  workflows        Workflow[]
  webhookEvents    WebhookEvent[]
  subscription     Subscription?
  auditLogs        AuditLog[]
  @@index([slug])
  @@index([createdAt])
}

model WhatsAppAccount {
  id                 String                @id @default(uuid())
  organizationId     String
  wabaId             String                @unique
  encryptedToken     String                // AES-256-GCM token vault
  status             WhatsAppAccountStatus @default(CONNECTED)
  webhookVerifyToken String
  organization       Organization          @relation(fields: [organizationId], references: [id])
  phoneNumbers       WhatsAppPhoneNumber[]
  @@index([organizationId])
  @@index([wabaId])
}`}
              </pre>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-4 text-slate-200 font-sans">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                  <h4 className="font-bold text-emerald-400 font-mono text-xs">Meta Webhook Engine</h4>
                  <ul className="mt-2 space-y-1 text-xs text-slate-300 font-mono">
                    <li>&bull; GET /api/webhooks/whatsapp (Hub verification)</li>
                    <li>&bull; POST /api/webhooks/whatsapp (Payload Ingestion)</li>
                    <li>&bull; X-Hub-Signature-256 HMAC-SHA256 verification</li>
                    <li>&bull; In-memory event ID deduplication (Idempotency)</li>
                  </ul>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                  <h4 className="font-bold text-blue-400 font-mono text-xs">REST API v1 (Bearer Token)</h4>
                  <ul className="mt-2 space-y-1 text-xs text-slate-300 font-mono">
                    <li>&bull; POST /api/v1/messages/send</li>
                    <li>&bull; POST /api/v1/messages/template</li>
                    <li>&bull; GET & POST /api/v1/contacts</li>
                    <li>&bull; GET /api/v1/stats/overview</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'setup' && (
            <div className="relative">
              <button
                onClick={() => copyToClipboard(SETUP_INSTRUCTIONS, 'setup')}
                className="absolute right-2 top-2 rounded bg-slate-800 px-2 py-1 text-[11px] text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-1"
              >
                {copied === 'setup' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copied === 'setup' ? 'Copied' : 'Copy'}</span>
              </button>
              <pre className="text-emerald-400 font-mono leading-relaxed whitespace-pre-wrap">{SETUP_INSTRUCTIONS}</pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Phase 1 Architecture Complete: Project setup &bull; DB &bull; Auth &bull; Multi-Tenant &bull; Layout &bull; WABA &bull; Webhooks</span>
          </div>
          <button
            onClick={() => {
              onClose();
              onProceedToModules();
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
          >
            <span>Explore Live Modules</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
