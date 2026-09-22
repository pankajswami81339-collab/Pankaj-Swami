import React, { useState } from 'react';
import { 
  ScrollText, Search, Filter, Check, CheckCheck, 
  AlertTriangle, ArrowUpRight, ArrowDownLeft, Clock, 
  Download, Eye, RefreshCw, X, ShieldCheck
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext.js';

interface MessageLogItem {
  id: string;
  wamid: string;
  phone: string;
  contactName: string;
  direction: 'outbound' | 'inbound';
  type: 'template' | 'text' | 'media' | 'interactive';
  status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  campaignName?: string;
  textPreview: string;
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
  errorCode?: string;
}

export const MessageLogsView: React.FC = () => {
  const { currentOrg } = useTenant();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED'>('ALL');
  const [directionFilter, setDirectionFilter] = useState<'ALL' | 'outbound' | 'inbound'>('ALL');
  const [selectedLog, setSelectedLog] = useState<MessageLogItem | null>(null);

  // Mock message log stream from Meta Cloud API
  const [logs] = useState<MessageLogItem[]>([
    {
      id: 'log-1',
      wamid: 'wamid.HBgLMTU1NTAxOTI1MA==',
      phone: '+1 (555) 382-9901',
      contactName: 'Elena Rostova',
      direction: 'outbound',
      type: 'template',
      status: 'READ',
      campaignName: 'Enterprise Onboarding',
      textPreview: 'Hi Elena! Welcome to ADSCALE ZEN. Your dedicated WABA is active.',
      sentAt: 'Today, 10:14 AM',
      deliveredAt: 'Today, 10:14 AM',
      readAt: 'Today, 10:15 AM',
    },
    {
      id: 'log-2',
      wamid: 'wamid.HBgLMTU1NTAxOTI1MQ==',
      phone: '+1 (555) 382-9901',
      contactName: 'Elena Rostova',
      direction: 'inbound',
      type: 'text',
      status: 'DELIVERED',
      textPreview: 'Thank you for the fast response! Sending this over to our team.',
      sentAt: 'Today, 10:16 AM',
      deliveredAt: 'Today, 10:16 AM',
    },
    {
      id: 'log-3',
      wamid: 'wamid.HBgLMTU1NTAxOTI1Mg==',
      phone: '+1 (555) 234-8891',
      contactName: 'Marcus Vance',
      direction: 'outbound',
      type: 'template',
      status: 'DELIVERED',
      campaignName: 'Flash Sale Broadcast',
      textPreview: 'Use code ZEN20 for 20% off all automation licenses.',
      sentAt: 'Today, 09:30 AM',
      deliveredAt: 'Today, 09:31 AM',
    },
    {
      id: 'log-4',
      wamid: 'wamid.HBgLMTU1NTAxOTI1Mw==',
      phone: '+1 (555) 777-1234',
      contactName: 'Sarah Jenkins',
      direction: 'outbound',
      type: 'text',
      status: 'FAILED',
      errorCode: '#131026: Message Undeliverable (Recipient not registered on WhatsApp)',
      textPreview: 'Your appointment is confirmed for Tuesday 3:00 PM.',
      sentAt: 'Today, 09:12 AM',
    },
    {
      id: 'log-5',
      wamid: 'wamid.HBgLMTU1NTAxOTI1NA==',
      phone: '+1 (555) 890-4321',
      contactName: 'Devon Lee',
      direction: 'outbound',
      type: 'interactive',
      status: 'READ',
      campaignName: 'NPS Survey Flow',
      textPreview: 'How satisfied were you with our customer service today? (1-5)',
      sentAt: 'Today, 08:45 AM',
      deliveredAt: 'Today, 08:45 AM',
      readAt: 'Today, 08:47 AM',
    },
    {
      id: 'log-6',
      wamid: 'wamid.HBgLMTU1NTAxOTI1NQ==',
      phone: '+1 (555) 444-9911',
      contactName: 'Carlos Gomez',
      direction: 'outbound',
      type: 'media',
      status: 'DELIVERED',
      campaignName: 'Invoice Receipts',
      textPreview: '[PDF Document: invoice_zen_092026.pdf]',
      sentAt: 'Yesterday, 04:20 PM',
      deliveredAt: 'Yesterday, 04:21 PM',
    },
  ]);

  const filteredLogs = logs.filter((l) => {
    const matchesSearch = 
      l.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.wamid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.textPreview.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    const matchesDirection = directionFilter === 'ALL' || l.direction === directionFilter;

    return matchesSearch && matchesStatus && matchesDirection;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <ScrollText className="h-5 w-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Message Delivery &amp; Webhook Logs
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time audit trail of all inbound and outbound WhatsApp messages verified by Meta Graph API webhooks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Exporting message logs as CSV...')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs"
          >
            <Download className="h-4 w-4 text-slate-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search phone number, wamid, or content..."
              className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
            />
          </div>

          {/* Status Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            {(['ALL', 'READ', 'DELIVERED', 'SENT', 'FAILED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-2.5 py-1.5 transition-colors ${
                  statusFilter === st
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Message Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Direction</th>
                <th className="p-3.5">Recipient / Sender</th>
                <th className="p-3.5">Type &amp; Preview</th>
                <th className="p-3.5">Meta WAMID</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      log.direction === 'outbound'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {log.direction === 'outbound' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownLeft className="h-3 w-3" />}
                      <span>{log.direction.toUpperCase()}</span>
                    </span>
                  </td>

                  <td className="p-3.5">
                    <p className="font-bold text-slate-900">{log.contactName}</p>
                    <p className="font-mono text-[11px] text-slate-500">{log.phone}</p>
                  </td>

                  <td className="p-3.5 max-w-xs">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="rounded bg-slate-100 px-1 py-0.2 text-[9px] font-bold text-slate-600 uppercase font-mono">
                        {log.type}
                      </span>
                      {log.campaignName && (
                        <span className="text-[10px] text-slate-400 truncate">
                          &bull; {log.campaignName}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 truncate">{log.textPreview}</p>
                  </td>

                  <td className="p-3.5 font-mono text-[10px] text-slate-400 truncate max-w-[120px]">
                    {log.wamid}
                  </td>

                  <td className="p-3.5">
                    {log.status === 'READ' && (
                      <span className="inline-flex items-center gap-1 text-cyan-700 font-bold text-[11px] bg-cyan-50 px-2 py-0.5 rounded-md">
                        <CheckCheck className="h-3.5 w-3.5 text-cyan-600" />
                        <span>READ</span>
                      </span>
                    )}
                    {log.status === 'DELIVERED' && (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-md">
                        <CheckCheck className="h-3.5 w-3.5 text-emerald-600" />
                        <span>DELIVERED</span>
                      </span>
                    )}
                    {log.status === 'SENT' && (
                      <span className="inline-flex items-center gap-1 text-slate-600 font-bold text-[11px] bg-slate-100 px-2 py-0.5 rounded-md">
                        <Check className="h-3.5 w-3.5 text-slate-500" />
                        <span>SENT</span>
                      </span>
                    )}
                    {log.status === 'FAILED' && (
                      <span className="inline-flex items-center gap-1 text-rose-700 font-bold text-[11px] bg-rose-50 px-2 py-0.5 rounded-md" title={log.errorCode}>
                        <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                        <span>FAILED</span>
                      </span>
                    )}
                  </td>

                  <td className="p-3.5 text-slate-500 text-[11px]">
                    <p>{log.sentAt}</p>
                    {log.readAt && <p className="text-[10px] text-cyan-700">Read: {log.readAt}</p>}
                  </td>

                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                      title="Inspect Webhook Payload"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payload Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Meta Webhook Payload Inspector</h3>
              <button onClick={() => setSelectedLog(null)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="my-4 space-y-2 text-xs">
              <div className="rounded-xl bg-slate-900 text-emerald-400 p-3 font-mono text-[11px] overflow-x-auto">
                <pre>{JSON.stringify({
                  object: 'whatsapp_business_account',
                  entry: [{
                    id: '109283746192837',
                    changes: [{
                      value: {
                        messaging_product: 'whatsapp',
                        metadata: {
                          display_phone_number: '15553829901',
                          phone_number_id: '1029384756',
                        },
                        statuses: [{
                          id: selectedLog.wamid,
                          status: selectedLog.status.toLowerCase(),
                          timestamp: '1726884960',
                          recipient_id: selectedLog.phone.replace(/[^0-9]/g, ''),
                          conversation: {
                            id: 'conv_8392817263',
                            origin: { type: 'business_initiated' }
                          }
                        }]
                      },
                      field: 'messages'
                    }]
                  }]
                }, null, 2)}</pre>
              </div>
            </div>

            <button
              onClick={() => setSelectedLog(null)}
              className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
