import React from 'react';
import { Shield, CheckCircle2 } from 'lucide-react';
import { AdScaleZenLogo } from '../brand/AdScaleZenLogo.js';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-800 bg-[#070B14] text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand Col */}
          <div className="col-span-2">
            <AdScaleZenLogo
              variant="full"
              size="md"
              theme="dark"
              showDomain={true}
              domainText="app.adscalezen.online"
              id="footer-logo"
            />
            <p className="mt-3 max-w-sm text-sm text-slate-400 leading-relaxed">
              WhatsApp Automation That Works For Your Business. Official Meta WhatsApp Cloud API infrastructure with multi-tenant shared inbox, grounded AI chatbots, and automated broadcast campaigns.
            </p>
            <div className="mt-3 flex flex-col gap-1 text-xs text-slate-400 font-mono">
              <span>Marketing: <strong className="text-emerald-400">www.adscalezen.online</strong></span>
              <span>Platform App: <strong className="text-emerald-400">app.adscalezen.online</strong></span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
              <Shield className="h-4 w-4" />
              <span>AES-256 Encrypted &bull; Tenant Isolated &bull; GDPR & Meta Policy Compliant</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Product</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><button onClick={() => onNavigate('features')} className="hover:text-white transition-colors">Features</button></li>
              <li><button onClick={() => onNavigate('whatsapp-api')} className="hover:text-white transition-colors">WhatsApp API</button></li>
              <li><button onClick={() => onNavigate('automation')} className="hover:text-white transition-colors">Workflows & Bots</button></li>
              <li><button onClick={() => onNavigate('ai-chatbot')} className="hover:text-white transition-colors">AI Chatbot</button></li>
              <li><button onClick={() => onNavigate('integrations')} className="hover:text-white transition-colors">Integrations</button></li>
            </ul>
          </div>

          {/* Developers & Docs */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Developers</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><button onClick={() => onNavigate('developers')} className="hover:text-white transition-colors">REST API v1</button></li>
              <li><button onClick={() => onNavigate('docs')} className="hover:text-white transition-colors">Documentation</button></li>
              <li><button onClick={() => onNavigate('integrations')} className="hover:text-white transition-colors">n8n Community Node</button></li>
              <li><button onClick={() => onNavigate('developers')} className="hover:text-white transition-colors">Webhooks System</button></li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Company & Trust</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">Contact Sales</button></li>
              <li><button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">Terms of Service</button></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} ADSCALE ZEN Technologies Inc. All rights reserved.</p>
          <div className="mt-4 sm:mt-0 flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" /> Meta Cloud API v20.0 Verified
            </span>
            <span>PostgreSQL &bull; Redis &bull; Node.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
