import React, { useState } from 'react';
import Header from '@/components/Header';
import { GlassButton } from '@/components/ui/glass-button';
import { Input } from '@/components/ui/input';
import { GlassCard } from '@/components/ui/glass-card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const StaffCheckin: React.FC = () => {
  const { toast } = useToast();
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  // Search handler
  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResults([]);
    setSelected(null);
    try {
      // Query by donor id, phone, or name (case-insensitive)
      let query = supabase
        .from('appointments')
        .select(`*, profiles: user_id (full_name, phone_number, email, id)`)
        .order('appointment_date', { ascending: true })
        .gte('appointment_date', new Date().toISOString().split('T')[0]);

      if (searchValue.trim() !== '') {
        query = query.or(`user_id.eq.${searchValue},profiles.phone_number.ilike.%${searchValue}%,profiles.full_name.ilike.%${searchValue}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      if (!data || data.length === 0) {
        setError('Không tìm thấy lịch hẹn phù hợp.');
        setResults([]);
        return;
      }
      setResults(data);
    } catch (err: any) {
      setError('Có lỗi xảy ra khi tìm kiếm.');
      toast({ title: 'Lỗi', description: err.message || 'Có lỗi xảy ra khi tìm kiếm.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Render search results
  const renderResults = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }
    if (error) {
      return (
        <div className="bg-white/70 rounded-lg p-4 text-center text-red-500 border border-dashed border-red-200">
          {error}
        </div>
      );
    }
    if (results.length === 0) {
      return (
        <div className="bg-white/70 rounded-lg p-4 text-center text-gray-400 border border-dashed border-gray-200">
          Search results will appear here.
        </div>
      );
    }
    return (
      <div className="space-y-3">
        {results.map((appt, idx) => (
          <GlassCard
            key={appt.id}
            className={`cursor-pointer border-2 ${selected?.id === appt.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
            onClick={() => setSelected(appt)}
          >
            <div className="flex flex-col gap-1">
              <div className="font-semibold text-gray-900">{appt.profiles?.full_name || 'Không tên'}</div>
              <div className="text-sm text-gray-600">SĐT: {appt.profiles?.phone_number || 'N/A'}</div>
              <div className="text-sm text-gray-600">Ngày: {new Date(appt.appointment_date).toLocaleDateString('vi-VN')}</div>
              <div className="text-sm text-gray-600">Giờ: {appt.time_slot}</div>
              <div className="text-xs text-gray-500">Trạng thái: {appt.status}</div>
            </div>
          </GlassCard>
        ))}
      </div>
    );
  };

  // Render selected appointment details
  const renderDetails = () => {
    if (!selected) {
      return (
        <div className="bg-white/70 rounded-lg p-4 text-center text-gray-400 border border-dashed border-gray-200">
          Appointment details will appear here after selecting a donor.
        </div>
      );
    }
    return (
      <GlassCard className="p-4">
        <div className="mb-2 font-bold text-lg text-gray-900">Thông tin lịch hẹn</div>
        <div className="mb-1 text-gray-700">Tên: {selected.profiles?.full_name || 'Không tên'}</div>
        <div className="mb-1 text-gray-700">SĐT: {selected.profiles?.phone_number || 'N/A'}</div>
        <div className="mb-1 text-gray-700">Email: {selected.profiles?.email || 'N/A'}</div>
        <div className="mb-1 text-gray-700">Ngày: {new Date(selected.appointment_date).toLocaleDateString('vi-VN')}</div>
        <div className="mb-1 text-gray-700">Giờ: {selected.time_slot}</div>
        <div className="mb-1 text-gray-700">Trung tâm: {selected.center_id}</div>
        <div className="mb-1 text-gray-700">Trạng thái: {selected.status}</div>
        {/* Placeholder for health declaration and actions */}
        <div className="mt-4 text-gray-400 text-sm">Health declaration and actions will appear here.</div>
      </GlassCard>
    );
  };

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
            <GlassButton variant="primary" size="lg" className="w-full py-4" disabled>
              Scan QR Code (coming soon)
            </GlassButton>
          </div>

          {/* Manual Search */}
          <div className="flex gap-2 mb-4">
            <Input 
              placeholder="Enter Donor ID, phone, or name" 
              className="flex-1" 
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
              disabled={loading}
            />
            <GlassButton variant="secondary" size="sm" onClick={handleSearch} disabled={loading || !searchValue.trim()}>
              {loading ? 'Searching...' : 'Search'}
            </GlassButton>
          </div>

          {/* Search Results */}
          {renderResults()}

          {/* Appointment Details */}
          {renderDetails()}
        </div>
      </main>
    </div>
  );
};

export default StaffCheckin; 