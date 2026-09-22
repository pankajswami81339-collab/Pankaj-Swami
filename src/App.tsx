import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext.js';
import { TenantProvider } from './context/TenantContext.js';
import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';
import { LandingPage } from './components/landing/LandingPage.js';
import { DashboardLayout } from './components/layout/DashboardLayout.js';
import { OverviewView } from './components/dashboard/OverviewView.js';
import { PhaseOneSpecView } from './components/dashboard/PhaseOneSpecView.js';
import { MarketingPagesModal } from './components/marketing/MarketingPagesModal.js';
import { AuthPages } from './components/auth/AuthPages.js';
import { WhatsAppChatView } from './components/dashboard/WhatsAppChatView.js';
import { AutomationWorkflowView } from './components/dashboard/AutomationWorkflowView.js';
import { PublicQRCodeView } from './components/dashboard/PublicQRCodeView.js';
import { MessageLogsView } from './components/dashboard/MessageLogsView.js';
import { SubscriptionView } from './components/dashboard/SubscriptionView.js';
import { SupportView } from './components/dashboard/SupportView.js';
import { SettingsView } from './components/dashboard/SettingsView.js';
import { WhatsAppCloudApiSetupView } from './components/dashboard/WhatsAppCloudApiSetupView.js';
import {
  ContactsView,
  CampaignsView,
  TemplatesView,
  TeamView,
  IntegrationsView,
  ApiWebhooksView,
  AnalyticsView,
  AdminPanelView,
  AIAssistantView,
} from './components/dashboard/ModuleViews.js';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'login'>('landing');
  const [dashboardTab, setDashboardTab] = useState<string>('overview');
  const [activeMarketingModal, setActiveMarketingModal] = useState<string | null>(null);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);

  // Handle navigation from public landing / navbar
  const handleNavClick = (route: string) => {
    if (route === 'home') {
      setCurrentView('landing');
    } else if (route === 'dashboard') {
      setCurrentView('dashboard');
    } else if (route === 'login') {
      setCurrentView('login');
    } else {
      setActiveMarketingModal(route);
    }
  };

  return (
    <AuthProvider>
      <TenantProvider>
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
          {currentView === 'login' ? (
            <AuthPages
              onSuccess={() => setCurrentView('dashboard')}
              onBackToLanding={() => setCurrentView('landing')}
            />
          ) : currentView === 'landing' ? (
            <div className="flex flex-col min-h-screen">
              <Navbar
                onNavigate={handleNavClick}
                onOpenSpecs={() => setIsSpecsOpen(true)}
                activeRoute="home"
              />
              <main className="flex-1">
                <LandingPage
                  onStartFree={() => setCurrentView('dashboard')}
                  onBookDemo={() => setActiveMarketingModal('contact')}
                  onOpenSpecs={() => setIsSpecsOpen(true)}
                />
              </main>
              <Footer onNavigate={handleNavClick} />
            </div>
          ) : (
            <DashboardLayout
              activeTab={dashboardTab}
              onNavigateTab={(tab) => setDashboardTab(tab)}
              onGoHome={() => setCurrentView('landing')}
              onOpenSpecs={() => setIsSpecsOpen(true)}
            >
              {dashboardTab === 'overview' && (
                <OverviewView
                  onNavigateTab={(tab) => setDashboardTab(tab)}
                  onOpenSpecs={() => setIsSpecsOpen(true)}
                />
              )}
              {dashboardTab === 'whatsapp' && (
                <WhatsAppCloudApiSetupView onNavigateTab={(tab) => setDashboardTab(tab)} />
              )}
              {(dashboardTab === 'whatsapp-chat' || dashboardTab === 'inbox') && (
                <WhatsAppChatView />
              )}
              {dashboardTab === 'contacts' && <ContactsView />}
              {dashboardTab === 'campaigns' && <CampaignsView />}
              {dashboardTab === 'templates' && <TemplatesView />}
              {(dashboardTab === 'automation' || dashboardTab === 'bot-flows') && (
                <AutomationWorkflowView />
              )}
              {(dashboardTab === 'ai-assistant' || dashboardTab === 'ai') && <AIAssistantView />}
              {dashboardTab === 'team' && <TeamView />}
              {dashboardTab === 'qr' && <PublicQRCodeView />}
              {dashboardTab === 'messages' && <MessageLogsView />}
              {dashboardTab === 'analytics' && <AnalyticsView />}
              {(dashboardTab === 'subscription' || dashboardTab === 'billing') && (
                <SubscriptionView />
              )}
              {(dashboardTab === 'api' || dashboardTab === 'api-webhooks') && (
                <ApiWebhooksView />
              )}
              {dashboardTab === 'integrations' && (
                <SettingsView initialTab="integrations" onNavigateTab={(tab) => setDashboardTab(tab)} />
              )}
              {dashboardTab === 'support' && <SupportView />}
              {dashboardTab === 'settings-whatsapp' && (
                <SettingsView initialTab="whatsapp" onNavigateTab={(tab) => setDashboardTab(tab)} />
              )}
              {dashboardTab === 'settings-general' && (
                <SettingsView initialTab="general" onNavigateTab={(tab) => setDashboardTab(tab)} />
              )}
              {dashboardTab === 'settings-notifications' && (
                <SettingsView initialTab="notifications" onNavigateTab={(tab) => setDashboardTab(tab)} />
              )}
              {dashboardTab === 'settings-security' && (
                <SettingsView initialTab="security" onNavigateTab={(tab) => setDashboardTab(tab)} />
              )}
              {dashboardTab === 'settings' && (
                <SettingsView initialTab="general" onNavigateTab={(tab) => setDashboardTab(tab)} />
              )}
              {dashboardTab === 'admin-panel' && <AdminPanelView />}
            </DashboardLayout>
          )}

          {/* Phase 1 Architecture Blueprint Modal */}
          {isSpecsOpen && (
            <PhaseOneSpecView
              onClose={() => setIsSpecsOpen(false)}
              onProceedToModules={() => {
                setIsSpecsOpen(false);
                setCurrentView('dashboard');
              }}
            />
          )}

          {/* Marketing Subpage Modal */}
          <MarketingPagesModal
            page={activeMarketingModal}
            onClose={() => setActiveMarketingModal(null)}
            onOpenDashboard={() => {
              setActiveMarketingModal(null);
              setCurrentView('dashboard');
            }}
          />
        </div>
      </TenantProvider>
    </AuthProvider>
  );
}
