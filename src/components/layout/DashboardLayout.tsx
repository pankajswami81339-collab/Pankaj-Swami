import React, { useState } from 'react';
import { 
  LayoutDashboard, MessageSquare, FileText, Users, Megaphone, 
  Workflow, UserCheck, QrCode, ScrollText, CreditCard, 
  Code2, Layers, HelpCircle, Settings, ShieldAlert,
  ChevronDown, ChevronRight, Bell, Check, Building2,
  Menu, X, Sparkles, ExternalLink, Sliders, Smartphone, Lock,
  Headphones, UploadCloud, Bot, BarChart3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useTenant } from '../../context/TenantContext.js';
import { Role } from '../../types.js';
import { AdScaleZenLogo } from '../brand/AdScaleZenLogo.js';

interface DashboardLayoutProps {
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  onGoHome: () => void;
  onOpenSpecs: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  activeTab,
  onNavigateTab,
  onGoHome,
  onOpenSpecs,
  children,
}) => {
  const { user, currentRole, switchRole, logout } = useAuth();
  const { organizations, currentOrg, switchOrg, whatsappAccount } = useTenant();

  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(
    activeTab.startsWith('settings')
  );
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Exact primary sidebar items per user specification
  const primaryNav = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'whatsapp', label: 'WhatsApp Setup', icon: UploadCloud, badge: 'API' },
    { id: 'whatsapp-chat', label: 'WhatsApp Chat', icon: MessageSquare, badge: 'Live' },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
    { id: 'automation', label: 'Automation', icon: Workflow },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, badge: 'AI' },
    { id: 'team', label: 'Team Members', icon: UserCheck },
    { id: 'qr', label: 'Public QR Code', icon: QrCode },
    { id: 'messages', label: 'Message Logs', icon: ScrollText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'subscription', label: 'My Subscription', icon: CreditCard },
    { id: 'api', label: 'API & Webhooks', icon: Code2 },
    { id: 'integrations', label: 'Integrations', icon: Layers },
    { id: 'support', label: 'My Support', icon: HelpCircle },
  ];

  const settingsSubItems = [
    { id: 'settings-general', label: 'General', icon: Sliders },
    { id: 'settings-whatsapp', label: 'WhatsApp Setup', icon: Smartphone },
    { id: 'settings-notifications', label: 'Notifications', icon: Bell },
    { id: 'settings-security', label: 'Security', icon: Lock },
  ];

  // Admin panel visibility based on RBAC
  const showAdminPanel = currentRole === Role.OWNER || currentRole === Role.ADMIN;

  const handleNavClick = (id: string) => {
    onNavigateTab(id);
    setIsMobileMenuOpen(false);
  };

  const isSettingsActive = activeTab === 'settings' || activeTab.startsWith('settings-');

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden relative">
      {/* Subtle WhatsApp-style communication background pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `radial-gradient(#10b981 1.2px, transparent 1.2px), radial-gradient(#075e54 1.2px, transparent 1.2px)`,
          backgroundSize: '32px 32px',
          backgroundPosition: '0 0, 16px 16px',
        }}
      />

      {/* MOBILE/TABLET COMPACT ICON RAIL (MATCHING SCREENSHOTS) */}
      <aside className="flex lg:hidden w-12 sm:w-14 flex-col items-center border-r border-slate-200 bg-white select-none relative z-20 shrink-0 py-2.5 gap-1.5 overflow-y-auto">
        {/* Brand Round Logo */}
        <div
          onClick={onGoHome}
          className="w-8 h-8 rounded-full bg-[#155338] flex items-center justify-center text-white cursor-pointer shadow-2xs mb-1"
          title="ADSCALE ZEN Home"
        >
          <span className="font-black text-xs tracking-tighter">AZ</span>
        </div>

        {/* Vertical Icon List */}
        <div className="flex-1 flex flex-col items-center gap-1 w-full px-1">
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeTab === item.id ||
              (item.id === 'whatsapp' && activeTab === 'settings-whatsapp') ||
              (item.id === 'whatsapp-chat' && activeTab === 'inbox') ||
              (item.id === 'subscription' && activeTab === 'billing');

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={item.label}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-[#155338] text-white shadow-2xs'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}

          <button
            onClick={() => handleNavClick('settings-general')}
            title="Settings"
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              isSettingsActive
                ? 'bg-[#155338] text-white shadow-2xs'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200 bg-white select-none relative z-10 shrink-0">
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 bg-white">
          <div onClick={onGoHome} className="cursor-pointer" title="Go to Home">
            <AdScaleZenLogo
              variant="compact"
              size="sm"
              showDomain={true}
              domainText="app"
              id="dashboard-sidebar-logo"
            />
          </div>

          <button
            onClick={onOpenSpecs}
            title="System Architecture Blueprint"
            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {primaryNav.map((item) => {
            const Icon = item.icon;
            // Match canonical or alias
            const isActive = activeTab === item.id || 
              (item.id === 'whatsapp-chat' && activeTab === 'inbox') ||
              (item.id === 'automation' && activeTab === 'bot-flows') ||
              (item.id === 'subscription' && activeTab === 'billing') ||
              (item.id === 'api' && activeTab === 'api-webhooks');

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                id={`sidebar-link-${item.id}`}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span className="flex-1 text-left truncate">{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* SETTINGS (Expandable) */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
              className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                isSettingsActive
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings className={`h-4 w-4 shrink-0 ${isSettingsActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>Settings</span>
              </div>
              {isSettingsExpanded ? (
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              )}
            </button>

            {isSettingsExpanded && (
              <div className="ml-5 pl-2 mt-1 space-y-1 border-l border-slate-200">
                {settingsSubItems.map((sub) => {
                  const SubIcon = sub.icon;
                  const isSubActive = activeTab === sub.id || (activeTab === 'settings' && sub.id === 'settings-general');
                  return (
                    <button
                      key={sub.id}
                      onClick={() => handleNavClick(sub.id)}
                      className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                        isSubActive
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <SubIcon className={`h-3.5 w-3.5 ${isSubActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span>{sub.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ADMIN PANEL (Governance) */}
          {showAdminPanel && (
            <div className="pt-2 border-t border-slate-100 mt-2">
              <button
                onClick={() => handleNavClick('admin-panel')}
                id="sidebar-link-admin-panel"
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                  activeTab === 'admin-panel'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <ShieldAlert className={`h-4 w-4 shrink-0 ${activeTab === 'admin-panel' ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span className="flex-1 text-left">Admin Panel</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-700 font-bold px-1.5 py-0.5 rounded font-mono">
                  ROOT
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-200 p-3 bg-slate-50/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-medium text-slate-600">Meta Cloud API Live</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">v20.0</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex flex-1 flex-col overflow-hidden relative z-10">
        {/* DASHBOARD HEADER */}
        <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-6 flex items-center justify-between gap-4 select-none shrink-0 shadow-xs">
          {/* Left: Mobile hamburger & Greeting */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle navigation drawer"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* User Greeting & Subtitle */}
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                Hello, {user?.name || 'Alex Rivera'}!
              </h1>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Need help?{' '}
                <button
                  onClick={() => onNavigateTab('support')}
                  className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline inline cursor-pointer"
                >
                  Visit Contact &amp; Support
                </button>
              </p>
            </div>
          </div>

          {/* Right: Plan, Notifications, Org Switcher, Role, Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Multi-Tenant Switcher */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
                id="topbar-org-switcher"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <Building2 className="h-3.5 w-3.5 text-emerald-600" />
                <span className="truncate max-w-[120px]">{currentOrg.name}</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {isOrgDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50">
                  <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Workspace
                  </p>
                  <div className="space-y-1 mt-1">
                    {organizations.map((org) => (
                      <button
                        key={org.id}
                        onClick={() => {
                          switchOrg(org.id);
                          setIsOrgDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-xs text-left hover:bg-slate-100 transition-colors"
                      >
                        <div>
                          <p className="font-semibold text-slate-800">{org.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">Tier: {org.tier}</p>
                        </div>
                        {org.id === currentOrg.id && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* "View Plan" Button per requirement */}
            <button
              onClick={() => onNavigateTab('subscription')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/80 hover:bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800 transition-colors cursor-pointer shadow-xs"
            >
              <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
              <span>View Plan</span>
              <span className="hidden sm:inline-block rounded bg-emerald-200 px-1 py-0.2 text-[9px] uppercase font-mono font-black">
                {currentOrg.tier}
              </span>
            </button>

            {/* Role Switcher */}
            <div className="relative hidden xl:block">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                title="Test Role-Based Access Control"
              >
                <span className="text-[10px] text-slate-400">Role:</span>
                <span className="font-bold text-slate-900">{currentRole}</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-50 text-xs">
                  <p className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase">Test RBAC Scope</p>
                  {[Role.OWNER, Role.ADMIN, Role.MANAGER, Role.AGENT].map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        switchRole(r);
                        setIsRoleDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between rounded-lg px-2 py-1.5 text-left hover:bg-slate-50 font-semibold"
                    >
                      <span>{r}</span>
                      {currentRole === r && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                aria-label="View notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">Mark all read</span>
                  </div>
                  <div className="space-y-2 mt-2">
                    <div className="rounded-xl bg-slate-50 p-2.5 text-xs">
                      <p className="font-semibold text-slate-800">Meta Cloud API Webhook Verified</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">X-Hub-Signature-256 validation active for +1 (555) 382-9901.</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">5m ago</span>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2.5 text-xs">
                      <p className="font-semibold text-slate-800">New Contact Added</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Marcus Vance enrolled via Public QR code.</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">32m ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-2 border-l border-slate-200 pl-2 sm:pl-3">
              <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                {(user?.name || 'Alex').charAt(0)}
              </div>
              <div className="hidden lg:block text-left text-xs">
                <p className="font-semibold text-slate-800 leading-tight truncate max-w-[120px]">{user?.name || 'Alex Rivera'}</p>
                <p className="text-[10px] text-slate-400 leading-tight truncate max-w-[120px]">{user?.email || 'alex@nexus.com'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT VIEWPORT */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 bg-[#eef3ee] bg-[url('/whatsapp-bg.svg')] bg-repeat relative">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

      {/* FLOATING "NEED HELP?" BUTTON (AS SEEN IN SCREENSHOT 3) */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => onNavigateTab('support')}
          className="relative group flex items-center gap-2 rounded-full bg-[#128C7E] hover:bg-[#0d6e63] text-white px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
        >
          <Headphones className="h-5 w-5 text-white" />
          <span className="text-xs font-bold tracking-tight pr-1">Need Help?</span>
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-xs animate-pulse">
            !
          </span>
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-950/60 backdrop-blur-xs">
          <div className="w-72 max-w-[85vw] bg-white h-full flex flex-col p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <AdScaleZenLogo variant="compact" size="sm" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-1">
              {primaryNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold ${
                      isActive ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="h-4 w-4 text-emerald-600" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div className="pt-2">
                <p className="px-3 pb-1 text-[10px] font-bold uppercase text-slate-400">Settings</p>
                {settingsSubItems.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => handleNavClick(sub.id)}
                    className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100"
                  >
                    <sub.icon className="h-3.5 w-3.5 text-slate-400" />
                    <span>{sub.label}</span>
                  </button>
                ))}
              </div>

              {showAdminPanel && (
                <div className="pt-3">
                  <button
                    onClick={() => handleNavClick('admin-panel')}
                    className="w-full flex items-center gap-3 rounded-xl bg-slate-900 text-white px-3 py-2.5 text-xs font-bold"
                  >
                    <ShieldAlert className="h-4 w-4 text-emerald-400" />
                    <span>Admin Panel</span>
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 pt-3">
              <button
                onClick={onGoHome}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <span>Landing Page</span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
