'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ArrowRight, Building2, User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../../src/context/AuthContext.js';
import { useTenant } from '../../../src/context/TenantContext.js';
import { Role } from '../../../src/types.js';

export default function RegisterPage() {
  const router = useRouter();
  const { login, switchRole } = useAuth();
  const { switchOrg } = useTenant();

  const [orgName, setOrgName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tier, setTier] = useState('STARTER');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email || 'owner@newcompany.com');
    switchRole(Role.OWNER);
    setIsLoading(false);
    router.push('/nexus-ecommerce');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-4">
          <Shield className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white">Create New Tenant Organization</h2>
        <p className="mt-2 text-sm text-slate-400">
          Provision your isolated workspace with official Meta WhatsApp Cloud API credentials
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800/80 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-700/60">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Organization Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Acme Retail Technologies"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <Building2 className="absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name (Owner)</label>
              <div className="relative">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Alex Rivera"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <User className="absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Business Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@acme.com"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <Mail className="absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <Lock className="absolute right-3 top-2.5 h-4 w-4 text-slate-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Subscription Tier</label>
              <select
                aria-label="Select Subscription Tier"
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="FREE">Free Trial (100 Contacts)</option>
                <option value="STARTER">Starter ($29 / mo - 2.5K Contacts)</option>
                <option value="GROWTH">Growth ($79 / mo - 15K Contacts)</option>
                <option value="BUSINESS">Business Pro ($199 / mo - 50K Contacts)</option>
                <option value="ENTERPRISE">Enterprise Dedicated</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-lg shadow-emerald-900/30"
            >
              {isLoading ? 'Creating Tenant...' : 'Complete Onboarding & Enter'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
