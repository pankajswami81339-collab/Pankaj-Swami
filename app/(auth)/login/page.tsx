'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ArrowRight, Building2, User, Key, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../src/context/AuthContext.js';
import { useTenant } from '../../../src/context/TenantContext.js';
import { Role } from '../../../src/types.js';
import { AdScaleZenLogo } from '../../../src/components/brand/AdScaleZenLogo.js';

export default function LoginPage() {
  const router = useRouter();
  const { login, switchRole } = useAuth();
  const { organizations, switchOrg, currentOrg } = useTenant();

  const [email, setEmail] = useState('alex.rivera@nexus-ecommerce.com');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedOrgId, setSelectedOrgId] = useState(currentOrg.id);
  const [selectedRole, setSelectedRole] = useState<Role>(Role.OWNER);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email);
    switchOrg(selectedOrgId);
    switchRole(selectedRole);
    setIsLoading(false);

    const targetOrg = organizations.find((o) => o.id === selectedOrgId) || currentOrg;
    router.push(`/${targetOrg.slug}`);
  };

  const handleQuickLogin = (role: Role, orgId: string) => {
    setSelectedRole(role);
    setSelectedOrgId(orgId);
    switchRole(role);
    switchOrg(orgId);
    const targetOrg = organizations.find((o) => o.id === orgId) || currentOrg;
    router.push(`/${targetOrg.slug}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex justify-center mb-4">
          <AdScaleZenLogo
            variant="full"
            size="lg"
            theme="dark"
            showDomain={true}
            domainText="app.adscalezen.online"
            showTagline={true}
            id="login-page-logo"
          />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white mt-2">Sign in to Enterprise Console</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800/80 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-700/60">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Tenant Organization</label>
              <div className="relative">
                <select
                  aria-label="Select Tenant Organization"
                  value={selectedOrgId}
                  onChange={(e) => setSelectedOrgId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name} ({org.tier})
                    </option>
                  ))}
                </select>
                <Building2 className="absolute right-3 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Simulated RBAC Role</label>
              <div className="grid grid-cols-2 gap-2">
                {[Role.OWNER, Role.ADMIN, Role.MANAGER, Role.AGENT].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRole(r)}
                    className={`px-3 py-1.5 rounded text-xs font-semibold border text-left transition-colors ${
                      selectedRole === r
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
                        : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <User className="absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <Key className="absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-lg shadow-emerald-900/30"
            >
              {isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="mt-6 pt-5 border-t border-slate-700/60">
            <p className="text-[11px] font-semibold text-slate-400 mb-2.5 uppercase tracking-wider">
              Quick Switch Credentials (Demo Mode)
            </p>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => handleQuickLogin(Role.OWNER, 'org_nexus_ecommerce')}
                className="w-full flex items-center justify-between px-3 py-2 rounded bg-slate-900 hover:bg-slate-700/60 text-[11px] text-slate-300 text-left border border-slate-700/80 transition-colors"
              >
                <span>Nexus E-Commerce (Owner)</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono">OWNER</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin(Role.AGENT, 'org_nexus_ecommerce')}
                className="w-full flex items-center justify-between px-3 py-2 rounded bg-slate-900 hover:bg-slate-700/60 text-[11px] text-slate-300 text-left border border-slate-700/80 transition-colors"
              >
                <span>Nexus Support Agent</span>
                <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-mono">AGENT</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin(Role.ADMIN, 'org_aura_healthcare')}
                className="w-full flex items-center justify-between px-3 py-2 rounded bg-slate-900 hover:bg-slate-700/60 text-[11px] text-slate-300 text-left border border-slate-700/80 transition-colors"
              >
                <span>Aura Healthcare (Admin)</span>
                <span className="text-[9px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded font-mono">ADMIN</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
