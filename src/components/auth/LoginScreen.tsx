import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  Zap,
  Building2,
  Users,
  KeyRound,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  BadgeCheck
} from 'lucide-react';
import { AdScaleZenLogo } from '../brand/AdScaleZenLogo.js';
import { useTenant } from '../../context/TenantContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { UserRole } from '../../types.js';

interface LoginScreenProps {
  onSuccess: () => void;
  onBackToLanding: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess, onBackToLanding }) => {
  const { organizations, currentOrg, switchOrg } = useTenant();
  const { switchRole, currentRole, login } = useAuth();

  const [authMode, setAuthMode] = useState<'password' | 'sso' | 'quick'>('password');
  const [email, setEmail] = useState('alex.rivera@nexus-ecommerce.com');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedOrgId, setSelectedOrgId] = useState(currentOrg.id);
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [isLoading, setIsLoading] = useState(false);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate enterprise authentication handshake
    setTimeout(() => {
      switchOrg(selectedOrgId);
      switchRole(selectedRole);
      login(email);
      setIsLoading(false);
      onSuccess();
    }, 600);
  };

  const handleQuickRoleSelect = (role: UserRole, orgId: string) => {
    setSelectedRole(role);
    setSelectedOrgId(orgId);
    switchOrg(orgId);
    switchRole(role);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess();
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-200 relative overflow-hidden font-sans">
      {/* Ambient Cybernetic Lighting Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0F172A18_1px,transparent_1px),linear-gradient(to_bottom,#0F172A18_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Radiant Glowing Orbs */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[42rem] h-[22rem] bg-gradient-to-tr from-teal-500/15 via-emerald-500/20 to-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 right-10 w-[30rem] h-[20rem] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full border-b border-slate-800/80 bg-[#090E1A]/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 text-emerald-400" />
          <span>Back to public overview</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Meta Graph API v20.0 Verified
          </span>
          <span className="text-xs text-slate-500 font-mono">app.adscalezen.online</span>
        </div>
      </header>

      {/* Main Authentication Core */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Brand Presentation */}
          <div className="text-center mb-8">
            <div className="inline-flex justify-center mb-4">
              <AdScaleZenLogo
                variant="full"
                size="lg"
                theme="dark"
                showDomain={true}
                domainText="app.adscalezen.online"
                showTagline={true}
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-3">
              Enterprise Console Sign In
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              WhatsApp Automation That Works For Your Business
            </p>
          </div>

          {/* Card Container */}
          <div className="rounded-2xl border border-slate-800 bg-[#0B1222]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/60 relative">
            {/* Mode Selector Tabs */}
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-900/90 p-1 border border-slate-800 mb-6 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setAuthMode('password')}
                className={`py-2 px-3 rounded-lg transition-all ${
                  authMode === 'password'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Work Credentials
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('quick')}
                className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'quick'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
                Quick Role Sandbox
              </button>
            </div>

            {authMode === 'password' ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                {/* Organization Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-emerald-400" />
                      Tenant Organization
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Isolated DB Schema</span>
                  </label>
                  <select
                    value={selectedOrgId}
                    onChange={(e) => setSelectedOrgId(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50"
                  >
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id} className="bg-slate-900 text-white">
                        {org.name} ({org.slug}) &bull; Tier {org.tier}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-emerald-400" />
                    Corporate Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-emerald-400" />
                      Encrypted Password
                    </label>
                    <a href="#reset" onClick={(e) => e.preventDefault()} className="text-[11px] text-emerald-400 hover:text-emerald-300">
                      Forgot password?
                    </a>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50"
                  />
                </div>

                {/* Role Switcher */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-emerald-400" />
                    Session Role
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 text-center">
                    {(['OWNER', 'ADMIN', 'MANAGER', 'AGENT'] as UserRole[]).map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className={`rounded-lg py-1.5 text-[10px] font-bold tracking-wider transition-all ${
                          selectedRole === role
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                            : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold py-3 text-xs tracking-wide shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      Authenticating Handshake...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span>Launch ADSCALE ZEN Console</span>
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </button>
              </form>
            ) : (
              /* Quick Sandbox Switcher */
              <div className="space-y-3">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Select a pre-configured enterprise role to experience tenant permissions and Cloud API capabilities instantly:
                </p>

                <div className="space-y-2">
                  <button
                    onClick={() => handleQuickRoleSelect('OWNER', 'org_nexus_ecom')}
                    className="w-full text-left p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">Alex Rivera</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          OWNER
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Nexus E-Commerce &bull; Full Meta Account & Billing Admin</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  </button>

                  <button
                    onClick={() => handleQuickRoleSelect('ADMIN', 'org_nexus_ecom')}
                    className="w-full text-left p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">Elena Rostova</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          ADMIN
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Campaigns, WABA Phone Sync & Team Governance</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  </button>

                  <button
                    onClick={() => handleQuickRoleSelect('AGENT', 'org_nexus_ecom')}
                    className="w-full text-left p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">Sarah Miller</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          AGENT
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Shared Live Inbox, Quick Replies & Ticketing</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  </button>
                </div>
              </div>
            )}

            {/* Meta Business Security Badge */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span className="flex items-center gap-1 text-emerald-400">
                <Shield className="h-3.5 w-3.5" />
                AES-256-GCM Vault
              </span>
              <span>TLS 1.3 &bull; MFA Ready</span>
            </div>
          </div>

          {/* Compliance & Trust Seal */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" />
                Official Meta Tech Provider
              </span>
              <span>&bull;</span>
              <span>ISO 27001</span>
              <span>&bull;</span>
              <span>SOC-2 Type II</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Branding Bar */}
      <footer className="relative z-10 w-full border-t border-slate-800/60 bg-[#090E1A]/60 py-4 px-4 sm:px-8 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono">
        <div>
          &copy; {new Date().getFullYear()} ADSCALE ZEN Technologies Inc. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400">www.adscalezen.online</span>
          <span>&bull;</span>
          <span className="text-emerald-400">app.adscalezen.online</span>
        </div>
      </footer>
    </div>
  );
};
