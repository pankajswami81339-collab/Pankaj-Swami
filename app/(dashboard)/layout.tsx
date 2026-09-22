'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Megaphone,
  FileCode2,
  GitFork,
  Bot,
  UserCheck,
  Blocks,
  Webhook,
  BarChart3,
  CreditCard,
  Settings,
  ShieldCheck,
  Building2,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useTenant } from '../../src/context/TenantContext.js';
import { useAuth } from '../../src/context/AuthContext.js';
import { Role } from '../../src/types.js';
import { AdScaleZenLogo } from '../../src/components/brand/AdScaleZenLogo.js';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function NextDashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentOrg, organizations, switchOrg, whatsappAccount } = useTenant();
  const { user, currentRole, switchRole, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);

  // Dynamic Navigation Items with RBAC Guarding
  const navItems = [
    {
      id: 'overview',
      name: 'Overview',
      icon: LayoutDashboard,
      path: `/${currentOrg.slug}`,
      roles: [Role.OWNER, Role.ADMIN, Role.MANAGER, Role.AGENT],
    },
    {
      id: 'whatsapp',
      name: 'Meta Cloud API Hub',
      icon: MessageSquare,
      path: `/${currentOrg.slug}/whatsapp`,
      badge: whatsappAccount?.status === 'CONNECTED' ? 'Live' : 'Connect',
      badgeColor: whatsappAccount?.status === 'CONNECTED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400',
      roles: [Role.OWNER, Role.ADMIN],
    },
    {
      id: 'inbox',
      name: 'Shared Inbox',
      icon: MessageSquare,
      path: `/${currentOrg.slug}/inbox`,
      roles: [Role.OWNER, Role.ADMIN, Role.MANAGER, Role.AGENT],
    },
    {
      id: 'contacts',
      name: 'Contacts CRM',
      icon: Users,
      path: `/${currentOrg.slug}/contacts`,
      roles: [Role.OWNER, Role.ADMIN, Role.MANAGER, Role.AGENT],
    },
    {
      id: 'campaigns',
      name: 'Broadcast Campaigns',
      icon: Megaphone,
      path: `/${currentOrg.slug}/campaigns`,
      roles: [Role.OWNER, Role.ADMIN, Role.MANAGER],
    },
    {
      id: 'templates',
      name: 'Meta Templates',
      icon: FileCode2,
      path: `/${currentOrg.slug}/templates`,
      roles: [Role.OWNER, Role.ADMIN, Role.MANAGER],
    },
    {
      id: 'bot-flows',
      name: 'Flow Builder',
      icon: GitFork,
      path: `/${currentOrg.slug}/bot-flows`,
      roles: [Role.OWNER, Role.ADMIN, Role.MANAGER],
    },
    {
      id: 'ai-assistant',
      name: 'AI Chatbot & Logic',
      icon: Bot,
      path: `/${currentOrg.slug}/ai-assistant`,
      roles: [Role.OWNER, Role.ADMIN, Role.MANAGER],
    },
    {
      id: 'team',
      name: 'Team & RBAC',
      icon: UserCheck,
      path: `/${currentOrg.slug}/team`,
      roles: [Role.OWNER, Role.ADMIN],
    },
    {
      id: 'integrations',
      name: 'App Integrations',
      icon: Blocks,
      path: `/${currentOrg.slug}/integrations`,
      roles: [Role.OWNER, Role.ADMIN],
    },
    {
      id: 'api-webhooks',
      name: 'API Keys & Webhooks',
      icon: Webhook,
      path: `/${currentOrg.slug}/api-webhooks`,
      roles: [Role.OWNER, Role.ADMIN],
    },
    {
      id: 'analytics',
      name: 'Analytics & SLA',
      icon: BarChart3,
      path: `/${currentOrg.slug}/analytics`,
      roles: [Role.OWNER, Role.ADMIN, Role.MANAGER],
    },
    {
      id: 'billing',
      name: 'Subscription & Limits',
      icon: CreditCard,
      path: `/${currentOrg.slug}/billing`,
      roles: [Role.OWNER],
    },
    {
      id: 'settings',
      name: 'Tenant Settings',
      icon: Settings,
      path: `/${currentOrg.slug}/settings`,
      roles: [Role.OWNER, Role.ADMIN],
    },
  ];

  const filteredNav = navItems.filter((item) => item.roles.includes(currentRole as Role));

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Desktop Sidebar Shell */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-900/95 border-r border-slate-800 flex-shrink-0">
        {/* Brand Logo & Tenancy Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <AdScaleZenLogo
            variant="compact"
            size="sm"
            theme="dark"
            showDomain={true}
            domainText="v20.0"
            id="next-dashboard-logo"
          />
        </div>

        {/* Tenant Organization Switcher */}
        <div className="p-3 border-b border-slate-800/80">
          <div className="relative">
            <button
              type="button"
              onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-7 w-7 rounded bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-3.5 w-3.5" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-white truncate">{currentOrg.name}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{currentOrg.tier} Tier</p>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
            </button>

            {tenantDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl py-1 z-50">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Active Tenant
                </div>
                {organizations.map((org) => (
                  <button
                    key={org.id}
                    type="button"
                    onClick={() => {
                      switchOrg(org.id);
                      setTenantDropdownOpen(false);
                      router.push(`/${org.slug}`);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                      org.id === currentOrg.id
                        ? 'bg-emerald-600/20 text-emerald-400 font-bold'
                        : 'text-slate-300 hover:bg-slate-700/60'
                    }`}
                  >
                    <span className="truncate">{org.name}</span>
                    <span className="text-[9px] font-mono px-1 rounded bg-slate-900 text-slate-400">
                      {org.tier}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-700/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* RBAC Role Simulator & User Profile */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Current Role</span>
            <select
              aria-label="Simulate RBAC Role"
              value={currentRole}
              onChange={(e) => switchRole(e.target.value as Role)}
              className="text-[10px] font-mono font-bold bg-slate-800 border border-slate-700 text-emerald-400 rounded px-1.5 py-0.5 focus:outline-none"
            >
              <option value={Role.OWNER}>OWNER</option>
              <option value={Role.ADMIN}>ADMIN</option>
              <option value={Role.MANAGER}>MANAGER</option>
              <option value={Role.AGENT}>AGENT</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-7 w-7 rounded-full bg-slate-700 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                {(user?.name || 'User').split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                logout();
                router.push('/login');
              }}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-950">
        {/* Mobile Header Bar */}
        <header className="lg:hidden h-14 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xs">
              RF
            </div>
            <span className="font-extrabold text-sm text-white">{currentOrg.name}</span>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex flex-col p-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <AdScaleZenLogo
                variant="compact"
                size="xs"
                theme="dark"
                id="next-mobile-logo"
              />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 space-y-1">
              {filteredNav.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push(item.path);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800"
                >
                  <item.icon className="h-4 w-4 text-slate-400" />
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Top Header Bar for Desktop */}
        <header className="hidden lg:flex h-14 items-center justify-between px-6 border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Tenant Context: {currentOrg.slug}
            </div>
            <span className="text-slate-600">/</span>
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>RBAC Mode:</span>
              <strong className="text-white font-mono">{currentRole}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <span className="text-[11px]">Database:</span>
              <span className="font-mono text-emerald-400 font-bold">PostgreSQL 16 (Isolated)</span>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
