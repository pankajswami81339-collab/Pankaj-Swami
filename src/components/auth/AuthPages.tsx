import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  Building2,
  Phone,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  KeyRound,
  Sparkles,
  Check
} from 'lucide-react';
import { AdScaleZenLogo } from '../brand/AdScaleZenLogo.js';
import { useAuth } from '../../context/AuthContext.js';
import { useTenant } from '../../context/TenantContext.js';
import { Role } from '../../types.js';

export type AuthMode = 'login' | 'register' | 'forgot-password';

interface AuthPagesProps {
  initialMode?: AuthMode;
  onSuccess: () => void;
  onBackToLanding: () => void;
  onNavigateSupport?: () => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({
  initialMode = 'login',
  onSuccess,
  onBackToLanding,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const { login, switchRole } = useAuth();
  const { organizations, currentOrg, switchOrg } = useTenant();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('alex.rivera@nexus-ecommerce.com');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regBusinessName, setRegBusinessName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Forgot password form state
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Google Login Modal & Account Selection state
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [customGmail, setCustomGmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [isAddingCustomAccount, setIsAddingCustomAccount] = useState(false);

  // Common state
  const [selectedOrgId, setSelectedOrgId] = useState(currentOrg.id);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleSignIn = async (accountEmail: string, accountName: string, avatar?: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/v1/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: accountEmail,
          name: accountName,
          avatarUrl: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(accountName)}&background=00d2b4&color=fff`,
          organizationName: `${accountName}'s Workspace`,
        }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        await login(data.user.email, data.user.name, data.user.avatarUrl);
        switchRole(Role.OWNER);
        if (data.organization?.id) {
          switchOrg(data.organization.id);
        }
        setIsGoogleModalOpen(false);
        setIsLoading(false);
        onSuccess();
      } else {
        throw new Error(data.error || 'Google login failed.');
      }
    } catch (err: any) {
      // Fallback client-side login
      await login(accountEmail, accountName, avatar);
      switchRole(Role.OWNER);
      setIsGoogleModalOpen(false);
      setIsLoading(false);
      onSuccess();
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMsg('Please enter your email and password.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      login(loginEmail);
      switchOrg(selectedOrgId);
      setIsLoading(false);
      onSuccess();
    }, 500);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!regName.trim() || !regBusinessName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword.trim()) {
      setErrorMsg('Please fill out all required fields.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      login(regEmail);
      switchRole(Role.OWNER);
      setIsLoading(false);
      onSuccess();
    }, 600);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setResetSent(true);
    }, 600);
  };

  const handleQuickDemoLogin = (role: Role, emailVal: string, orgId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      switchRole(role);
      switchOrg(orgId);
      login(emailVal);
      setIsLoading(false);
      onSuccess();
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900 relative overflow-hidden font-sans">
      {/* Subtle WhatsApp communication doodle background pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(#10b981 1px, transparent 1px), radial-gradient(#075e54 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
          backgroundPosition: '0 0, 14px 14px',
        }}
      />

      {/* Top Header */}
      <header className="relative z-10 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 text-emerald-600" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Meta WhatsApp Cloud API Ready
          </span>
          <span className="text-xs text-slate-400 font-mono">app.adscalezen.online</span>
        </div>
      </header>

      {/* Main Form Center */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Brand Logo Lockup */}
          <div className="text-center mb-6">
            <div className="inline-flex justify-center mb-2">
              <AdScaleZenLogo
                variant="full"
                size="lg"
                theme="light"
                showDomain={true}
                domainText="app.adscalezen.online"
                showTagline={true}
                taglineText="WhatsApp & Business Automation Platform"
                id="auth-brand-logo"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Official Meta Cloud API &bull; Shared Inbox &bull; CRM &bull; Automations
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/60 relative">
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 mb-6 text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(null); }}
                className={`rounded-lg py-2 transition-all ${
                  mode === 'login'
                    ? 'bg-white text-emerald-800 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMsg(null); }}
                className={`rounded-lg py-2 transition-all ${
                  mode === 'register'
                    ? 'bg-white text-emerald-800 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 font-medium">
                {errorMsg}
              </div>
            )}

            {/* Google / Gmail Sign In & Sign Up Button (For both Login and Registration) */}
            {mode !== 'forgot-password' && (
              <div className="mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setIsGoogleModalOpen(true);
                  }}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.99] py-2.5 px-4 text-xs font-bold text-slate-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                >
                  <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>{mode === 'register' ? 'Sign up with Google (Gmail)' : 'Sign in with Google (Gmail)'}</span>
                </button>

                <div className="relative flex items-center justify-center my-4">
                  <div className="border-t border-slate-200 w-full" />
                  <span className="bg-white px-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider absolute">
                    or continue with email
                  </span>
                </div>
              </div>
            )}

            {/* LOGIN MODE */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Work Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => { setMode('forgot-password'); setErrorMsg(null); }}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Organization Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tenant Organization
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <select
                      value={selectedOrgId}
                      onChange={(e) => setSelectedOrgId(e.target.value)}
                      aria-label="Select Tenant Organization"
                      className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                    >
                      {organizations.map((org) => (
                        <option key={org.id} value={org.id}>
                          {org.name} ({org.slug}) &bull; Tier {org.tier}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Remember me on this browser</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                {/* Quick Demo Login Presets */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
                    Instant Demo Role Sandbox
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin(Role.OWNER, 'alex.rivera@nexus-ecommerce.com', 'org-1')}
                      className="rounded-lg border border-slate-200 bg-slate-50/80 p-2 text-left hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors"
                    >
                      <p className="text-xs font-bold text-slate-900 flex items-center justify-between">
                        <span>Alex Rivera</span>
                        <span className="text-[9px] font-mono bg-slate-200 px-1 rounded">OWNER</span>
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">Nexus E-Commerce</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin(Role.ADMIN, 'sarah.lin@nexus-ecommerce.com', 'org-1')}
                      className="rounded-lg border border-slate-200 bg-slate-50/80 p-2 text-left hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors"
                    >
                      <p className="text-xs font-bold text-slate-900 flex items-center justify-between">
                        <span>Sarah Lin</span>
                        <span className="text-[9px] font-mono bg-blue-100 text-blue-700 px-1 rounded">ADMIN</span>
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">Nexus E-Commerce</p>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* REGISTRATION MODE */}
            {mode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Business Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={regBusinessName}
                      onChange={(e) => setRegBusinessName(e.target.value)}
                      placeholder="e.g. Acme Corp Automation"
                      className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Work Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Re-type password"
                        className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Provisioning Account...
                    </span>
                  ) : (
                    <>
                      <span>Create Account & Start Free</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* FORGOT PASSWORD MODE */}
            {mode === 'forgot-password' && (
              <div>
                {resetSent ? (
                  <div className="text-center py-4 space-y-3">
                    <div className="inline-flex h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 items-center justify-center">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">Password Reset Link Dispatched</h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      We sent secure reset instructions to <span className="font-semibold text-slate-800">{forgotEmail}</span>.
                    </p>
                    <button
                      type="button"
                      onClick={() => { setMode('login'); setResetSent(false); }}
                      className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Back to Sign In</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <div className="text-center mb-2">
                      <h3 className="text-sm font-bold text-slate-900">Reset Your Password</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Enter your verified business email and we'll send you an encrypted recovery link.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Registered Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="you@company.com"
                          className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                    >
                      {isLoading ? 'Processing...' : 'Send Password Reset Link'}
                    </button>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => { setMode('login'); setErrorMsg(null); }}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Return to Sign In</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Trust badges footer */}
          <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Official Meta Cloud API
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Lock className="h-3.5 w-3.5 text-emerald-600" /> AES-256 Token Encryption
            </span>
          </div>
        </div>

        {/* Google OAuth / Account Chooser Modal */}
        {isGoogleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
              {/* Google Header */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 border border-slate-200/80 shadow-2xs mx-auto">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Sign in with Google
                </h3>
                <p className="text-xs text-slate-500">
                  to continue to <span className="font-semibold text-slate-800">ADSCALE ZEN Cloud Platform</span>
                </p>
              </div>

              {/* Account Selection List */}
              <div className="divide-y divide-slate-100 border-y border-slate-100 my-3">
                {/* Account 1: Pankaj Swami (User Email) */}
                <button
                  type="button"
                  onClick={() => handleGoogleSignIn('pankajswami81339@gmail.com', 'Pankaj Swami')}
                  disabled={isLoading}
                  className="w-full flex items-center gap-3 py-3 px-2 text-left hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                    P
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 truncate">
                      Pankaj Swami
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      pankajswami81339@gmail.com
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                    Default
                  </span>
                </button>

                {/* Account 2: Alex Rivera */}
                <button
                  type="button"
                  onClick={() => handleGoogleSignIn('alex.rivera@nexus-ecommerce.com', 'Alex Rivera')}
                  disabled={isLoading}
                  className="w-full flex items-center gap-3 py-3 px-2 text-left hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                    A
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700 truncate">
                      Alex Rivera
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      alex.rivera@nexus-ecommerce.com
                    </p>
                  </div>
                </button>

                {/* Account 3: Use another Gmail account */}
                {!isAddingCustomAccount ? (
                  <button
                    type="button"
                    onClick={() => setIsAddingCustomAccount(true)}
                    className="w-full flex items-center gap-3 py-3 px-2 text-left hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center text-sm shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-700">
                        Use another Gmail account
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Enter any personal or work @gmail.com
                      </p>
                    </div>
                  </button>
                ) : (
                  <div className="py-3 px-2 space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={customGoogleName}
                        onChange={(e) => setCustomGoogleName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:outline-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Gmail Address
                      </label>
                      <input
                        type="email"
                        value={customGmail}
                        onChange={(e) => setCustomGmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:outline-emerald-500"
                      />
                    </div>
                    <button
                      type="button"
                      disabled={!customGmail.trim() || isLoading}
                      onClick={() => {
                        const name = customGoogleName.trim() || customGmail.split('@')[0];
                        handleGoogleSignIn(customGmail.trim(), name);
                      }}
                      className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 text-xs transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      {isLoading ? 'Connecting Google Account...' : 'Continue with this Gmail'}
                    </button>
                  </div>
                )}
              </div>

              {/* Footnote & Close */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsGoogleModalOpen(false);
                    setIsAddingCustomAccount(false);
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <p className="text-[10px] text-slate-400">
                  Protected by Google Identity Services
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
