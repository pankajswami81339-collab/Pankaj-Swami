'use client';

import React from 'react';
import { UserCheck, Shield, Plus, Key } from 'lucide-react';
import { useTenant } from '../../../../src/context/TenantContext.js';
import { useAuth } from '../../../../src/context/AuthContext.js';
import { Role } from '../../../../src/types.js';

export default function TeamPage() {
  const { currentOrg } = useTenant();
  const { currentRole } = useAuth();

  const members = [
    { id: 'usr_1', name: 'Alex Rivera', email: 'alex.rivera@nexus-ecommerce.com', role: Role.OWNER, status: 'Active', joinedAt: '2026-01-15' },
    { id: 'usr_2', name: 'Sarah Chen', email: 'sarah.chen@nexus-ecommerce.com', role: Role.ADMIN, status: 'Active', joinedAt: '2026-01-20' },
    { id: 'usr_3', name: 'Devon Vance', email: 'devon.v@nexus-ecommerce.com', role: Role.MANAGER, status: 'Active', joinedAt: '2026-02-01' },
    { id: 'usr_4', name: 'Maya Lin', email: 'maya.lin@nexus-ecommerce.com', role: Role.AGENT, status: 'Active', joinedAt: '2026-02-10' },
  ];

  const roleColors: Record<Role, string> = {
    [Role.OWNER]: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    [Role.ADMIN]: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    [Role.MANAGER]: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    [Role.AGENT]: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-emerald-400" />
            Team Members & Role-Based Access Control
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage organization members and assign permissions for {currentOrg.name}
          </p>
        </div>

        {currentRole === Role.OWNER || currentRole === Role.ADMIN ? (
          <button
            type="button"
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors"
          >
            <Plus className="h-4 w-4" />
            Invite Member
          </button>
        ) : (
          <span className="text-xs text-slate-500 italic">Read-only permissions view</span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {[
          { role: Role.OWNER, desc: 'Complete organization control, billing & tenant deletion' },
          { role: Role.ADMIN, desc: 'WABA setup, API keys, webhook config & team invitations' },
          { role: Role.MANAGER, desc: 'Broadcast campaigns, template approvals & bot flows' },
          { role: Role.AGENT, desc: 'Shared inbox replies, customer conversations & contact CRM' },
        ].map((item) => (
          <div key={item.role} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${roleColors[item.role]}`}>
                {item.role}
              </span>
              <Shield className="h-3.5 w-3.5 text-slate-500" />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-3.5">User</th>
              <th className="p-3.5">Email</th>
              <th className="p-3.5">Assigned Role</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Joined</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-slate-800/40">
                <td className="p-3.5 font-bold text-white flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-slate-800 border border-slate-700 text-white flex items-center justify-center font-bold text-[11px]">
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  {member.name}
                </td>
                <td className="p-3.5 text-slate-400 font-mono">{member.email}</td>
                <td className="p-3.5">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${roleColors[member.role]}`}>
                    {member.role}
                  </span>
                </td>
                <td className="p-3.5">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold">
                    {member.status}
                  </span>
                </td>
                <td className="p-3.5 text-slate-500 font-mono">{member.joinedAt}</td>
                <td className="p-3.5 text-right">
                  {currentRole === Role.OWNER && member.role !== Role.OWNER && (
                    <button type="button" className="text-slate-400 hover:text-white font-semibold text-[11px]">
                      Edit Role
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
