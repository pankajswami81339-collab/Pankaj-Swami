import React from 'react';
import '../src/index.css';
import { AuthProvider } from '../src/context/AuthContext.js';
import { TenantProvider } from '../src/context/TenantContext.js';

export const metadata = {
  title: 'ADSCALE ZEN — WhatsApp Automation That Works For Your Business',
  description: 'Official Meta WhatsApp Cloud API multi-tenant SaaS platform with RBAC, AI bots, and shared inbox.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
        <AuthProvider>
          <TenantProvider>
            {children}
          </TenantProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
