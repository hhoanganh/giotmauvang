
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import UpcomingEvents from '@/components/UpcomingEvents';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <UpcomingEvents />
      </main>
    </div>
  );
};

export default Index;
