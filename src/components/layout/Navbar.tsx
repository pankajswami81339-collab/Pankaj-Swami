import React from 'react';
import { ArrowRight, Sparkles, LogIn } from 'lucide-react';
import { AdScaleZenLogo } from '../brand/AdScaleZenLogo.js';

interface NavbarProps {
  onNavigate: (route: string) => void;
  onOpenSpecs: () => void;
  activeRoute: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, onOpenSpecs, activeRoute }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center cursor-pointer group"
          id="nav-logo"
        >
          {/* Mobile version (compact) */}
          <div className="sm:hidden">
            <AdScaleZenLogo
              variant="compact"
              size="sm"
              showDomain={false}
              id="nav-logo-mobile"
            />
          </div>

          {/* Tablet & Desktop version (full with tagline & domain badge) */}
          <div className="hidden sm:block">
            <AdScaleZenLogo
              variant="full"
              size="md"
              showDomain={true}
              domainText="app.adscalezen.online"
              showTagline={true}
              id="nav-logo-desktop"
            />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button 
            onClick={() => onNavigate('features')} 
            className="transition-colors hover:text-emerald-600 cursor-pointer"
            id="nav-link-features"
          >
            Features
          </button>
          <button 
            onClick={() => onNavigate('whatsapp-api')} 
            className="transition-colors hover:text-emerald-600 cursor-pointer"
            id="nav-link-whatsapp-api"
          >
            WhatsApp API
          </button>
          <button 
            onClick={() => onNavigate('automation')} 
            className="transition-colors hover:text-emerald-600 cursor-pointer"
            id="nav-link-automation"
          >
            Automation
          </button>
          <button 
            onClick={() => onNavigate('ai-chatbot')} 
            className="transition-colors hover:text-emerald-600 cursor-pointer"
            id="nav-link-ai-chatbot"
          >
            AI Chatbot
          </button>
          <button 
            onClick={() => onNavigate('integrations')} 
            className="transition-colors hover:text-emerald-600 cursor-pointer"
            id="nav-link-integrations"
          >
            Integrations
          </button>
          <button 
            onClick={() => onNavigate('pricing')} 
            className="transition-colors hover:text-emerald-600 cursor-pointer"
            id="nav-link-pricing"
          >
            Pricing
          </button>
          <button 
            onClick={() => onNavigate('developers')} 
            className="transition-colors hover:text-emerald-600 cursor-pointer"
            id="nav-link-developers"
          >
            Developers & Docs
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('login')}
            id="btn-login-nav"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-emerald-600 hover:bg-slate-50 transition-colors"
          >
            <LogIn className="h-4 w-4 text-emerald-600" />
            <span>Sign In</span>
          </button>

          <button
            onClick={onOpenSpecs}
            id="btn-specs-nav"
            className="hidden xl:inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            Blueprint
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            id="btn-open-dashboard-nav"
            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-3.5 py-2 text-xs sm:text-sm font-bold text-white shadow-sm transition-all hover:shadow-emerald-600/20 cursor-pointer"
          >
            <span>Launch App</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
