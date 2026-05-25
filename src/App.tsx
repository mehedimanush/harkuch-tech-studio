/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DbProvider, useDb } from './dbContext';
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import Footer from './components/Footer';
import StorefrontHome from './components/StorefrontHome';
import StorefrontShop from './components/StorefrontShop';
import StorefrontProductDetail from './components/StorefrontProductDetail';
import StorefrontCart from './components/StorefrontCart';
import StorefrontCheckout from './components/StorefrontCheckout';
import StorefrontThankYou from './components/StorefrontThankYou';
import StorefrontTrackOrder from './components/StorefrontTrackOrder';
import StorefrontAccount from './components/StorefrontAccount';
import StorefrontBlog from './components/StorefrontBlog';
import StorefrontPages from './components/StorefrontPages';
import AdminPanel from './components/AdminPanel';

function AppContent() {
  const [currentRoute, setCurrentRoute] = useState(window.location.hash || '#home');

  useEffect(() => {
    const handleHashChange = () => {
      // Set State
      setCurrentRoute(window.location.hash || '#home');
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: string) => {
    window.location.hash = route;
  };

  const isRouteAdmin = currentRoute.startsWith('#admin');

  // Render Component depending on Hash
  const renderRoutedView = () => {
    const hash = currentRoute.split('?')[0];

    if (hash === '#home' || hash === '') {
      return <StorefrontHome onNavigate={navigateTo} />;
    }
    if (hash === '#shop') {
      return <StorefrontShop onNavigate={navigateTo} currentRoute={currentRoute} />;
    }
    if (hash.startsWith('#product')) {
      return <StorefrontProductDetail onNavigate={navigateTo} currentRoute={currentRoute} />;
    }
    if (hash === '#cart') {
      return <StorefrontCart onNavigate={navigateTo} />;
    }
    if (hash === '#checkout') {
      return <StorefrontCheckout onNavigate={navigateTo} />;
    }
    if (hash.startsWith('#thank-you')) {
      return <StorefrontThankYou onNavigate={navigateTo} currentRoute={currentRoute} />;
    }
    if (hash.startsWith('#track-order')) {
      return <StorefrontTrackOrder onNavigate={navigateTo} currentRoute={currentRoute} />;
    }
    if (hash.startsWith('#account')) {
      return <StorefrontAccount onNavigate={navigateTo} currentRoute={currentRoute} />;
    }
    if (hash.startsWith('#blog')) {
      return <StorefrontBlog onNavigate={navigateTo} currentRoute={currentRoute} />;
    }
    if (
      hash === '#about' ||
      hash === '#contact' ||
      hash === '#faq' ||
      hash.startsWith('#policy')
    ) {
      return <StorefrontPages onNavigate={navigateTo} currentRoute={currentRoute} />;
    }
    if (hash === '#admin') {
      return <AdminPanel />;
    }

    // Default Fallback
    return <StorefrontHome onNavigate={navigateTo} />;
  };

  if (isRouteAdmin) {
    return <div className="dark transition-colors">{renderRoutedView()}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <AnnouncementBar />
      <Header onNavigate={navigateTo} currentRoute={currentRoute} />
      
      {/* Dynamic Client Stage */}
      <main className="flex-1">
        {renderRoutedView()}
      </main>

      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export default function App() {
  return (
    <DbProvider>
      <AppContent />
    </DbProvider>
  );
}
