
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import EventsLocationsSection from '@/components/EventsLocationsSection';
import EligibilityPlanningSection from '@/components/EligibilityPlanningSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import InspiringContentSection from '@/components/InspiringContentSection';
import UpcomingEvents from '@/components/UpcomingEvents';
import ContactSupportSection from '@/components/ContactSupportSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* 1. Hero Section */}
        <HeroSection />
        
        {/* 2. Events & Locations Section (F1.1.1) */}
        <EventsLocationsSection />
        
        {/* 3. Eligibility & Planning Section (F1.1.5 & F1.1.6) */}
        <EligibilityPlanningSection />
        
        {/* 4. How It Works & Guidelines Section (F1.1.2) */}
        <HowItWorksSection />
        
        {/* 5. Inspiring Content Section (F1.1.3) */}
        <InspiringContentSection />
        
        {/* 6. "No Event Found?" Section */}
        <UpcomingEvents />
        
        {/* 7. Contact & Support Section (F1.1.4) */}
        <ContactSupportSection />
      </main>
    </div>
  );
};

export default Index;
