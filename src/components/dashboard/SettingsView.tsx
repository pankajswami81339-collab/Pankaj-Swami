import React, { useState, useEffect } from 'react';
import { 
  Settings, Building2, Smartphone, Bell, Shield, 
  Key, Save, RefreshCw, CheckCircle2, Copy, Check, Lock, Globe, Share2
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext.js';
import { WhatsAppCloudApiSetupView } from './WhatsAppCloudApiSetupView.js';
import { IntegrationsManagerView } from './IntegrationsManagerView.js';

interface SettingsViewProps {
  initialTab?: 'general' | 'whatsapp' | 'integrations' | 'notifications' | 'security';
  onNavigateTab?: (tab: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  initialTab = 'general',
  onNavigateTab,
}) => {
  const { currentOrg } = useTenant();

  const [activeTab, setActiveTab] = useState<'general' | 'whatsapp' | 'integrations' | 'notifications' | 'security'>(initialTab);
  const [orgName, setOrgName] = useState(currentOrg.name);
  const [supportPhone, setSupportPhone] = useState('+1 (555) 382-9901');
  const [timezone, setTimezone] = useState('America/New_York (EST)');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-6xl pb-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
            <Settings className="h-5 w-5" />
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
            Organization &amp; System Settings
          </h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Configure Meta Cloud API credentials, WhatsApp setup, connected integrations, notifications, and security protocols.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        {[
          { id: 'general', label: 'General Business', icon: Building2 },
          { id: 'whatsapp', label: 'WhatsApp Setup', icon: Smartphone },
          { id: 'integrations', label: 'Integrations', icon: Share2 },
          { id: 'notifications', label: 'Alerts & Notifications', icon: Bell },
          { id: 'security', label: 'Security & 2FA', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs font-extrabold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: General Business Settings */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="max-w-2xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs text-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Organization Profile
          </h3>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Company / Organization Name</label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Organization Slug (Multi-Tenant Identifier)</label>
              <input
                type="text"
                readOnly
                value={currentOrg.slug}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-mono text-slate-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Active Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-hidden"
              >
                <option value="America/New_York (EST)">America/New_York (EST)</option>
                <option value="America/Los_Angeles (PST)">America/Los_Angeles (PST)</option>
                <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST)</option>
                <option value="Asia/Dubai (GST)">Asia/Dubai (GST)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Public Support Phone Number</label>
            <input
              type="text"
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-hidden"
            />
          </div>

          {saveSuccess && (
            <div className="flex items-center gap-1.5 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="h-4 w-4" />
              <span>General settings updated successfully!</span>
            </div>
          )}

          <div className="pt-3">
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save General Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: WhatsApp Setup */}
      {activeTab === 'whatsapp' && (
        <div className="pt-2">
          <WhatsAppCloudApiSetupView onNavigateTab={onNavigateTab} />
        </div>
      )}

      {/* TAB 3: Integrations */}
      {activeTab === 'integrations' && (
        <div className="pt-2">
          <IntegrationsManagerView onNavigateTab={(tab) => {
            if (tab === 'whatsapp') {
              setActiveTab('whatsapp');
            } else if (onNavigateTab) {
              onNavigateTab(tab);
            }
          }} />
        </div>
      )}

      {/* TAB 4: Alerts & Notifications */}
      {activeTab === 'notifications' && (
        <div className="max-w-2xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs text-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            System Notification Rules
          </h3>

          <div className="space-y-3 divide-y divide-slate-100">
            {[
              {
                title: 'Broadcast Campaign Completion',
                desc: 'Receive immediate email and push notification when a scheduled broadcast completes.',
                defaultChecked: true,
              },
              {
                title: 'Message Undeliverability Spike',
                desc: 'Alert when message failure rate exceeds 5% in any 15-minute window.',
                defaultChecked: true,
              },
              {
                title: 'Low Message Balance Alert',
                desc: 'Notify billing admins when plan message limit reaches 85% utilization.',
                defaultChecked: true,
              },
              {
                title: 'Browser Audio Chime',
                desc: 'Play a subtle audio notification when new inbound customer messages arrive.',
                defaultChecked: true,
              },
            ].map((rule) => (
              <div key={rule.title} className="pt-3 flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-slate-900">{rule.title}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">{rule.desc}</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={rule.defaultChecked}
                  className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 mt-1 cursor-pointer"
                />
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => alert('Notification preferences updated!')}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white cursor-pointer"
            >
              Save Notification Rules
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: Security & 2FA */}
      {activeTab === 'security' && (
        <div className="max-w-2xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs text-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Authentication &amp; Access Controls
          </h3>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
            <div>
              <p className="font-bold text-slate-900">Two-Factor Authentication (2FA)</p>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Enforce TOTP authenticator app verification for all team admins and managers.
              </p>
            </div>
            <span className="rounded-full bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 text-[10px]">
              ENABLED
            </span>
          </div>

          <div className="space-y-2">
            <label className="block font-bold text-slate-700">API IP Address Allowlist</label>
            <textarea
              rows={2}
              placeholder="e.g. 192.168.1.1, 10.0.0.1/24 (Leave blank to allow all)"
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-mono text-slate-800 focus:border-emerald-600 focus:outline-hidden"
            />
            <span className="text-[11px] text-slate-400">Restrict REST API key calls to specific server IP addresses.</span>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => alert('Security parameters updated!')}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white cursor-pointer"
            >
              Update Security Policies
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
