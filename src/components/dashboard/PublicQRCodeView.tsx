import React, { useState } from 'react';
import { 
  QrCode, Copy, Check, Download, ExternalLink, 
  Smartphone, MessageSquare, Sparkles, RefreshCw, Share2
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext.js';

export const PublicQRCodeView: React.FC = () => {
  const { currentOrg, phoneNumbers } = useTenant();
  const defaultPhone = phoneNumbers[0]?.displayPhoneNumber || '+15553829901';

  const [phone, setPhone] = useState(defaultPhone.replace(/[^0-9+]/g, ''));
  const [prefilledMessage, setPrefilledMessage] = useState(
    'Hello! I would like to learn more about your services.'
  );
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Computed wa.me URL
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(prefilledMessage);
  const waLink = `https://wa.me/${cleanPhone}${prefilledMessage ? `?text=${encodedText}` : ''}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(waLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format: 'png' | 'svg') => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <QrCode className="h-5 w-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Public WhatsApp QR Code Generator
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Display this QR code in your store, website, or marketing flyers to let customers initiate instant WhatsApp chats.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-slate-400" />}
            <span>{copied ? 'Copied Link!' : 'Copy Direct Link'}</span>
          </button>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white transition-colors shadow-xs"
          >
            <span>Test wa.me Link</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Grid: Editor & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Configuration */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              QR Code Destination &amp; Payload
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                WhatsApp Business Phone Number
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+15553829901"
                  className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 font-mono focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Include country code without special characters (e.g. 1 for US, 91 for India).
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pre-Filled Customer Message
              </label>
              <div className="relative">
                <textarea
                  rows={3}
                  value={prefilledMessage}
                  onChange={(e) => setPrefilledMessage(e.target.value)}
                  placeholder="Type a message that will appear ready in the customer's WhatsApp text box..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>
              <div className="flex justify-between items-center mt-1 text-[11px] text-slate-400">
                <span>Variables like lead source will be tracked automatically.</span>
                <span>{prefilledMessage.length} chars</span>
              </div>
            </div>

            {/* Quick Templates */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Quick Template Starters
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Hi, I want a product consultation!',
                  'Hello, I saw your billboard and want the 20% discount code.',
                  'Need customer support for order #',
                  'Book a demo for our enterprise team.',
                ].map((txt) => (
                  <button
                    key={txt}
                    type="button"
                    onClick={() => setPrefilledMessage(txt)}
                    className="rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 px-2.5 py-1 text-[11px] text-slate-600 transition-colors"
                  >
                    {txt}
                  </button>
                ))}
              </div>
            </div>

            {/* Embed Code */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Website Embed HTML
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={`<a href="${waLink}" target="_blank" rel="noopener" class="whatsapp-btn">Chat on WhatsApp</a>`}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-[11px] font-mono text-slate-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live QR Code Card Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-md text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold mb-4 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Scan with any camera or WhatsApp</span>
            </div>

            {/* Generated QR Graphic (High-Resolution Vector Mockup) */}
            <div className="mx-auto my-2 p-4 bg-white rounded-2xl border-2 border-dashed border-emerald-300 shadow-inner flex flex-col items-center justify-center w-56 h-56 relative group">
              <svg viewBox="0 0 100 100" className="w-48 h-48 drop-shadow-xs">
                {/* Simulated clean QR matrix */}
                {/* Corner markers */}
                <rect x="5" y="5" width="26" height="26" rx="4" fill="#0f172a" />
                <rect x="9" y="9" width="18" height="18" rx="2" fill="#ffffff" />
                <rect x="13" y="13" width="10" height="10" rx="1" fill="#10b981" />

                <rect x="69" y="5" width="26" height="26" rx="4" fill="#0f172a" />
                <rect x="73" y="9" width="18" height="18" rx="2" fill="#ffffff" />
                <rect x="77" y="13" width="10" height="10" rx="1" fill="#10b981" />

                <rect x="5" y="69" width="26" height="26" rx="4" fill="#0f172a" />
                <rect x="9" y="73" width="18" height="18" rx="2" fill="#ffffff" />
                <rect x="13" y="77" width="10" height="10" rx="1" fill="#10b981" />

                {/* Data dots matrix */}
                <rect x="36" y="8" width="6" height="6" fill="#0f172a" />
                <rect x="46" y="8" width="6" height="6" fill="#10b981" />
                <rect x="56" y="8" width="6" height="6" fill="#0f172a" />
                <rect x="36" y="18" width="6" height="6" fill="#0f172a" />
                <rect x="46" y="24" width="6" height="6" fill="#0f172a" />
                <rect x="56" y="18" width="6" height="6" fill="#10b981" />

                <rect x="8" y="36" width="6" height="6" fill="#0f172a" />
                <rect x="18" y="36" width="6" height="6" fill="#10b981" />
                <rect x="28" y="36" width="6" height="6" fill="#0f172a" />

                <rect x="8" y="48" width="6" height="6" fill="#10b981" />
                <rect x="18" y="56" width="6" height="6" fill="#0f172a" />
                <rect x="28" y="48" width="6" height="6" fill="#0f172a" />

                <rect x="68" y="36" width="6" height="6" fill="#0f172a" />
                <rect x="78" y="36" width="6" height="6" fill="#10b981" />
                <rect x="88" y="36" width="6" height="6" fill="#0f172a" />

                <rect x="68" y="48" width="6" height="6" fill="#0f172a" />
                <rect x="78" y="56" width="6" height="6" fill="#0f172a" />
                <rect x="88" y="48" width="6" height="6" fill="#10b981" />

                <rect x="36" y="68" width="6" height="6" fill="#0f172a" />
                <rect x="46" y="78" width="6" height="6" fill="#10b981" />
                <rect x="56" y="68" width="6" height="6" fill="#0f172a" />
                <rect x="46" y="88" width="6" height="6" fill="#0f172a" />
                <rect x="56" y="88" width="6" height="6" fill="#10b981" />
                <rect x="68" y="88" width="6" height="6" fill="#0f172a" />
                <rect x="78" y="78" width="6" height="6" fill="#0f172a" />
                <rect x="88" y="88" width="6" height="6" fill="#10b981" />

                {/* Center WhatsApp Logo Badge */}
                <circle cx="50" cy="50" r="14" fill="#ffffff" />
                <circle cx="50" cy="50" r="11" fill="#10b981" />
                <path
                  d="M45 47C45 44.5 47 44.5 48.5 44.5C49.2 44.5 50 45 50.5 46L51.5 48C51.7 48.4 51.5 48.8 51.2 49L50.5 49.5C51 50.5 52 51.5 53 52L53.5 51.3C53.7 51 54.1 50.8 54.5 51L56.5 52C57.5 52.5 57.5 53.3 57.5 54C57.5 55.5 56 56.5 54.5 56.5C50 56.5 45 51.5 45 47Z"
                  fill="#ffffff"
                />
              </svg>
            </div>

            <p className="font-mono text-xs text-slate-800 font-bold mt-2">{phone}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{currentOrg.name}</p>

            {downloadSuccess && (
              <div className="mt-3 p-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold">
                QR Code package downloaded successfully!
              </div>
            )}

            {/* Download Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-5">
              <button
                onClick={() => handleDownload('png')}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
              >
                <Download className="h-3.5 w-3.5" />
                <span>PNG Format</span>
              </button>
              <button
                onClick={() => handleDownload('svg')}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2 text-xs font-bold text-white transition-colors shadow-xs"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Vector SVG</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
