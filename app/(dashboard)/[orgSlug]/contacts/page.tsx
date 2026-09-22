'use client';

import React, { useState } from 'react';
import { Users, Search, Plus, Filter } from 'lucide-react';
import { useTenant } from '../../../../src/context/TenantContext.js';
import { Contact } from '../../../../src/types.js';

export default function ContactsPage() {
  const { contacts, currentOrg } = useTenant();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = contacts.filter(
    (c: Contact) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phoneNumber.includes(searchTerm)
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-400" />
            Contacts CRM ({filtered.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tenant-isolated customer records for {currentOrg.name}
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Contact
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search contacts by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 hover:bg-slate-800"
        >
          <Filter className="h-3.5 w-3.5" />
          Filters
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">Name</th>
                <th className="p-3.5">WhatsApp Number</th>
                <th className="p-3.5">Labels</th>
                <th className="p-3.5">Source</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filtered.map((contact: Contact) => (
                <tr key={contact.id} className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold text-white">{contact.name}</td>
                  <td className="p-3.5 font-mono text-emerald-400">{contact.phoneNumber}</td>
                  <td className="p-3.5">
                    <div className="flex gap-1">
                      {contact.labels.map((l: string) => (
                        <span key={l} className="bg-slate-800 border border-slate-700 text-slate-300 rounded px-1.5 py-0.5 text-[9px] font-medium">
                          {l}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-400">{contact.source || 'WHATSAPP_INBOUND'}</td>
                  <td className="p-3.5 text-right">
                    <button type="button" className="text-emerald-400 hover:underline font-semibold text-[11px]">
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
