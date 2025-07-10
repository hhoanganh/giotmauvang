
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import EventsLocationsSection from '@/components/EventsLocationsSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import InspiringContentSection from '@/components/InspiringContentSection';
import ContactSupportSection from '@/components/ContactSupportSection';

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      const eventsSection = document.getElementById('events-locations-section');
      if (eventsSection) {
        eventsSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          if (location.state.scrollTo === 'events' && (window as any).switchToEventsTab) {
            (window as any).switchToEventsTab();
          }
          if (location.state.scrollTo === 'centers' && (window as any).switchToCentersTab) {
            (window as any).switchToCentersTab();
          }
        }, 500);
      }
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* 1. Hero Section */}
        <HeroSection />
        
        {/* 2. Events & Locations Section (F1.1.1) */}
        <EventsLocationsSection />
        
        {/* 3. How It Works & Guidelines Section (F1.1.2) */}
        <HowItWorksSection />
        
        {/* 5. Inspiring Content Section (F1.1.3) */}
        <InspiringContentSection />
        
        {/* 7. Contact & Support Section (F1.1.4) */}
        <ContactSupportSection />
      </main>
    </div>
  );
};

export default Index;
