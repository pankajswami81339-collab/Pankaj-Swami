'use client';

import React from 'react';
import { Settings, Building2, ShieldAlert, Key, Save } from 'lucide-react';
import { useTenant } from '../../../../src/context/TenantContext.js';
import { useAuth } from '../../../../src/context/AuthContext.js';
import { Role } from '../../../../src/types.js';

export default function SettingsPage() {
  const { currentOrg } = useTenant();
  const { currentRole } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-black text-white flex items-center gap-2">
          <Settings className="h-5 w-5 text-emerald-400" />
          Tenant Organization Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure general organization details and security for {currentOrg.name}
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Building2 className="h-4 w-4 text-emerald-400" />
          General Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Organization Name</label>
            <input
              type="text"
              defaultValue={currentOrg.name}
              disabled={currentRole !== Role.OWNER && currentRole !== Role.ADMIN}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white disabled:opacity-60 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Tenant Slug (Subdomain)</label>
            <input
              type="text"
              defaultValue={currentOrg.slug}
              disabled
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 font-mono text-slate-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Subscription Plan</label>
            <input
              type="text"
              defaultValue={`${currentOrg.tier} Tier`}
              disabled
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-emerald-400 font-bold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Tenant UUID</label>
            <input
              type="text"
              defaultValue={currentOrg.id}
              disabled
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 font-mono text-slate-400 text-[11px] focus:outline-none"
            />
          </div>
        </div>

        {currentRole === Role.OWNER && (
          <div className="pt-3 flex justify-end">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {currentRole === Role.OWNER && (
        <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-rose-400">
            <ShieldAlert className="h-5 w-5" />
            <h2 className="text-sm font-bold">Danger Zone (Owner Only)</h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Deleting an organization permanently wipes all associated WhatsApp accounts, phone numbers, contact records, messages, and API keys. This action cannot be reversed.
          </p>
          <div className="pt-2">
            <button
              type="button"
              className="px-3.5 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-bold transition-colors"
            >
              Delete Organization Workspace
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
