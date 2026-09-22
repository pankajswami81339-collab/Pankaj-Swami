# RelayFlow — Enterprise Multi-Tenant WhatsApp Business Automation SaaS

RelayFlow is an enterprise-grade multi-tenant WhatsApp Business Automation platform engineered on the official **Meta WhatsApp Cloud API**. It provides tenant organization isolation, AES-256 encrypted credential management at rest, shared team inbox, visual flow builder, AI chatbot integration, and developer REST APIs.

---

## 🏗️ Multi-Tenant Architecture

Every customer and company is isolated by a strict `organization_id` tenancy boundary across all database tables, caches, and API operations.

```
                    ┌─────────────────────────┐
                    │      Organization       │
                    │   (Tenancy Boundary)    │
                    └────────────┬────────────┘
                                 │
     ┌───────────────────────────┼──────────────────────────┐
     │                           │                          │
┌────┴────────────┐     ┌────────┴──────────┐     ┌─────────┴─────────┐
│ Organization    │     │  WhatsAppAccount  │     │    Contacts &     │
│ Members & Roles │     │ (Meta WABA + Num) │     │   Conversations   │
│ OWNER/ADMIN/... │     │ AES-256 encrypted │     │    Shared Inbox   │
└─────────────────┘     └────────┬──────────┘     └───────────────────┘
                                 │
                ┌────────────────┴────────────────┐
                │                                 │
     ┌──────────┴───────────┐         ┌───────────┴──────────┐
     │ Templates & Campaign │         │ Workflows, Webhooks, │
     │ Asynchronous Queues  │         │  n8n & REST API v1   │
     └──────────────────────┘         └──────────────────────┘
```

---

## 🔒 Security & RBAC Model

1. **Zero Secret Leakage**: Meta App Secret, System User Tokens, and webhook secrets are kept strictly server-side.
2. **At-Rest Token Encryption**: Meta Graph access tokens are encrypted with `AES-256-GCM` using 96-bit initialization vectors and authentication tags.
3. **Webhook Verification**: Raw body preservation enables strict `X-Hub-Signature-256` SHA-256 HMAC signature verification with replay attack prevention.
4. **Role-Based Access Control (RBAC)**:
   - `OWNER`: Full administrative control, billing, tenant deletion, role delegation.
   - `ADMIN`: Team management, WABA connection, API keys, webhook configurations.
   - `MANAGER`: Campaign broadcasts, bot flows, templates, analytics.
   - `AGENT`: Shared inbox, customer conversation replies, contacts CRM.

---

## 📂 Project Structure

```
├── app/                                 # Next.js App Router
│   ├── (auth)/                          # Authentication group
│   │   ├── login/page.tsx               # Login & demo credentials switcher
│   │   └── register/page.tsx            # Multi-tenant onboarding flow
│   ├── (dashboard)/                     # Authenticated dashboard group
│   │   ├── [orgSlug]/                   # Dynamic tenant-scoped routes
│   │   │   ├── page.tsx                 # Overview KPI analytics
│   │   │   ├── contacts/page.tsx        # CRM contact manager
│   │   │   ├── team/page.tsx            # RBAC member management
│   │   │   └── settings/page.tsx        # Organization & security settings
│   │   └── layout.tsx                   # Dashboard shell (Sidebar + Header + Tenant switch)
│   ├── api/                             # App Router API endpoints
│   │   ├── auth/[...nextauth]/route.ts  # NextAuth session handlers
│   │   └── v1/
│   │       └── organizations/           # Multi-tenant organization CRUD
│   │           ├── route.ts
│   │           └── [orgId]/members/route.ts
│   ├── layout.tsx                       # Root layout & providers
│   └── page.tsx                         # Landing page
├── middleware.ts                        # Subdomain/Slug tenant routing & RBAC middleware
├── prisma/
│   ├── schema.prisma                    # 26-model PostgreSQL multi-tenant schema
│   ├── seed.ts                          # Production seed script with demo tenants
│   └── migrations/
│       └── 20260320000000_init/
│           └── migration.sql            # Full PostgreSQL DDL migration
├── server/                              # Full-stack Express API server
│   ├── crypto.ts                        # AES-256-GCM encryption utilities
│   ├── db.ts                            # In-memory mock & persistence layer
│   ├── whatsapp-service.ts              # Meta Graph API & Embedded Signup
│   └── routes/
│       ├── api-v1.ts                    # REST API v1 endpoints
│       └── webhooks.ts                  # HMAC-verified Meta webhook handler
├── src/                                 # Shared UI components & client context
│   ├── components/
│   │   ├── dashboard/                   # Specialized modules (Inbox, Flow Builder, etc.)
│   │   ├── layout/                      # Navbar, Sidebar, Footer shells
│   │   └── landing/                     # High-converting landing & pricing
│   ├── context/
│   │   ├── AuthContext.tsx              # Session & RBAC role state
│   │   └── TenantContext.tsx            # Active tenant data & switcher state
│   ├── constants/                       # Shared plans, tiers & configurations
│   ├── types.ts                         # Universal TypeScript definitions
│   └── main.tsx                         # Client application entry point
├── docker-compose.yml                   # PostgreSQL 16, Redis 7, App & Worker stack
├── Dockerfile                           # Multi-stage production container build
├── .env.example                         # Sanitized environment variables template
└── metadata.json                        # Platform metadata
```

---

## 🗄️ Database Schema & Index Strategy

- **Tenant Isolation**: Foreign key `organizationId` with `ON DELETE CASCADE` across all operational tables:
  - `User`, `Organization`, `OrganizationMember` (compound unique `[organizationId, userId]`)
  - `WhatsAppAccount`, `WhatsAppPhoneNumber`
  - `Contact`, `ContactLabel`, `Conversation`, `Message`
  - `Template`, `Campaign`, `Workflow`, `WorkflowExecution`
  - `Subscription`, `ApiKey`, `WebhookSubscription`, `AuditLog`
- **Composite Indexes**:
  - `[organizationId, phone]` on `Contact`
  - `[organizationId, status]` on `Conversation`
  - `[organizationId, createdAt]` on `Message`
  - `[organizationId, keyPrefix]` on `ApiKey`

---

## 🛣️ Routes

### Client Routes (App Router)
- `/` — Landing page & pricing calculator
- `/login` — Sign in with organization selector & RBAC simulator
- `/register` — Create new tenant organization
- `/[orgSlug]` — Organization overview dashboard
- `/[orgSlug]/inbox` — Shared team inbox
- `/[orgSlug]/contacts` — CRM contacts & labels
- `/[orgSlug]/campaigns` — Broadcast marketing manager
- `/[orgSlug]/templates` — Meta template approval sync
- `/[orgSlug]/bot-flows` — Visual drag-and-drop automation builder
- `/[orgSlug]/team` — Team members & RBAC permission matrix
- `/[orgSlug]/settings` — Organization profile & danger zone

### REST API Endpoints (`/api/v1`)
- `GET /api/v1/stats/overview` — Tenant KPI stats & time series metrics
- `GET /api/v1/contacts` — Query organization contacts
- `POST /api/v1/contacts` — Create/import contacts
- `GET /api/v1/campaigns` — List scheduled & completed broadcasts
- `GET /api/v1/templates` — Fetch approved WhatsApp templates
- `GET /api/v1/whatsapp/accounts` — Query WABA connection & phone numbers
- `POST /api/v1/whatsapp/signup/exchange` — Complete Meta Embedded Signup
- `POST /api/v1/whatsapp/disconnect` — Revoke WABA credentials
- `POST /api/webhooks/whatsapp` — Meta Cloud API webhook receiver (HMAC verified)

---

## ⚡ Setup Commands

### 1. Configure Environment
```bash
cp .env.example .env
```

### 2. Start Infrastructure with Docker
```bash
docker-compose up -d
```
Starts:
- PostgreSQL 16 (`localhost:5432`)
- Redis 7 (`localhost:6379`)
- RelayFlow API (`localhost:3000`)

### 3. Run Prisma Migrations & Seed
```bash
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
```

### 4. Development Server
```bash
npm run dev
```

---

## 📋 Phase Implementation Roadmap

- [x] **PHASE 1 (COMPLETED)**:
  - Next.js project structure & App Router layout
  - PostgreSQL + Prisma 26-model schema & migrations
  - Multi-tenant organization architecture & tenant switcher
  - Role-Based Access Control (OWNER, ADMIN, MANAGER, AGENT)
  - Responsive dashboard shell, collapsible sidebar & navigation
  - Dockerfile, docker-compose.yml & sanitized .env.example
- [ ] **PHASE 2 (REMAINING)**:
  - Meta WhatsApp Cloud API sending engine (`/v1/messages`)
  - BullMQ Redis queue worker with rate-limiting (80 msgs/sec tier 10k)
  - Meta Template message payload builder with dynamic parameter substitution
- [ ] **PHASE 3 (REMAINING)**:
  - Shared Team Inbox with real-time WebSockets & 24-hour customer window timer
  - Inbound webhook processing & media download pipeline
- [ ] **PHASE 4 (REMAINING)**:
  - Interactive Visual Flow Builder (drag-and-drop nodes: Keyword, Menu, AI Agent)
  - OpenAI / Gemini integration for automated customer support
- [ ] **PHASE 5 (REMAINING)**:
  - Razorpay subscription billing & usage quota enforcement
  - n8n community node & external webhook triggers
