import React from 'react';
import Header from '@/components/Header';
import { GlassButton } from '@/components/ui/glass-button';
import { Input } from '@/components/ui/input';

const StaffCheckin: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/30 to-orange-50/30 flex flex-col">
      <Header />
      <main className="flex-1 section-padding">
        <div className="container-custom max-w-lg mx-auto py-6 space-y-6">
          {/* Page Title */}
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Donor Check-in</h1>
          <p className="text-center text-gray-600 mb-4">Scan donor QR code or search manually to check in a donor.</p>

          {/* Scan QR Button */}
          <div className="flex justify-center mb-4">
            <GlassButton variant="primary" size="lg" className="w-full py-4">
              Scan QR Code
            </GlassButton>
          </div>

          {/* Manual Search */}
          <div className="flex gap-2 mb-4">
            <Input placeholder="Enter Donor ID, phone, or name" className="flex-1" />
            <GlassButton variant="secondary" size="sm">Search</GlassButton>
          </div>

          {/* Placeholder: Search Results */}
          <div className="bg-white/70 rounded-lg p-4 text-center text-gray-400 border border-dashed border-gray-200">
            Search results will appear here.
          </div>

          {/* Placeholder: Appointment Details */}
          <div className="bg-white/70 rounded-lg p-4 text-center text-gray-400 border border-dashed border-gray-200">
            Appointment details will appear here after selecting a donor.
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffCheckin; 