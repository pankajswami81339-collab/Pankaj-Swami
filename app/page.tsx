'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LandingPage } from '../src/components/landing/LandingPage.js';
import { Navbar } from '../src/components/layout/Navbar.js';
import { Footer } from '../src/components/layout/Footer.js';

export default function HomePage() {
  const router = useRouter();

  const handleStartFree = () => {
    router.push('/login');
  };

  const handleNavClick = (route: string) => {
    if (route === 'login') {
      router.push('/login');
    } else if (route === 'dashboard') {
      router.push('/nexus-ecommerce');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        onNavigate={handleNavClick}
        onOpenSpecs={() => {}}
        activeRoute="home"
      />
      <main className="flex-1">
        <LandingPage
          onStartFree={handleStartFree}
          onBookDemo={handleStartFree}
          onOpenSpecs={() => {}}
        />
      </main>
      <Footer onNavigate={handleNavClick} />
    </div>
  );
}
