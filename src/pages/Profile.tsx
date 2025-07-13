import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, MapPin, Heart, Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Appointment {
  id: string;
  appointment_date: string;
  time_slot: string;
  status: string;
  qr_code: string;
  center: {
    name: string;
    address: string;
  };
}

interface DonationRecord {
  id: string;
  donation_date: string;
  blood_type: string;
  blood_volume: number;
  screening_result: string;
  center: {
    name: string;
  };
}

const Profile: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [donationRecords, setDonationRecords] = useState<DonationRecord[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && user) {
      fetchUserData();
    }
  }, [user, loading]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch appointments
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          id,
          appointment_date,
          time_slot,
          status,
          qr_code,
          donation_centers (
            name,
            address
          )
        `)
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: false });

      if (appointmentsError) throw appointmentsError;

      // Fetch donation records
      const { data: donationsData, error: donationsError } = await supabase
        .from('donation_records')
        .select(`
          id,
          donation_date,
          blood_type,
          blood_volume,
          screening_result,
          donation_centers (
            name
          )
        `)
        .eq('user_id', user.id)
        .order('donation_date', { ascending: false });

      if (donationsError) throw donationsError;

      // Transform the data to match our interfaces
      const transformedAppointments = (appointmentsData || []).map(apt => ({
        id: apt.id,
        appointment_date: apt.appointment_date,
        time_slot: apt.time_slot,
        status: apt.status || '',
        qr_code: apt.qr_code || '',
        center: {
          name: apt.donation_centers?.name || '',
          address: apt.donation_centers?.address || ''
        }
      }));

      const transformedDonations = (donationsData || []).map(donation => ({
        id: donation.id,
        donation_date: donation.donation_date,
        blood_type: donation.blood_type || '',
        blood_volume: donation.blood_volume || 0,
        screening_result: donation.screening_result || '',
        center: {
          name: donation.donation_centers?.name || ''
        }
      }));

      setAppointments(transformedAppointments);
      setDonationRecords(transformedDonations);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu người dùng',
        variant: 'destructive',
      });
    } finally {
      setLoadingData(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Đã đăng ký</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Hoàn thành</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Đã hủy</Badge>;
      case 'no-show':
        return <Badge variant="secondary">Không đến</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getScreeningResultBadge = (result: string) => {
    switch (result) {
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">Được chấp nhận</Badge>;
      case 'deferred':
        return <Badge variant="secondary">Tạm hoãn</Badge>;
      case 'declined':
        return <Badge variant="destructive">Bị từ chối</Badge>;
      default:
        return <Badge variant="outline">{result || 'Chưa có kết quả'}</Badge>;
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50/30 to-orange-50/30">
        <Header />
        <main className="section-padding">
          <div className="container-custom">
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user || !profile) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/30 to-orange-50/30">
      <Header />
      <main className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profile.full_name || 'Chưa cập nhật tên'}
              </h1>
              <p className="text-gray-600">
                {profile.email || 'Chưa cập nhật email'}
              </p>
            </div>

            {/* Personal Information */}
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Thông tin cá nhân
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="font-medium">{profile.phone_number || 'Chưa cập nhật'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vai trò</p>
                    <p className="font-medium">{profile.primary_role || 'Chưa xác định'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tổng số lần hiến máu</p>
                    <p className="font-medium">{donationRecords.length} lần</p>
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>

            {/* Upcoming Appointments */}
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Lịch hẹn sắp tới
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                {appointments.filter(apt => apt.status === 'scheduled').length > 0 ? (
                  <div className="space-y-4">
                    {appointments
                      .filter(apt => apt.status === 'scheduled')
                      .map((appointment) => (
                        <div key={appointment.id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-blue-600" />
                              <span className="font-medium">
                                {new Date(appointment.appointment_date).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                            {getStatusBadge(appointment.status)}
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{appointment.time_slot}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{appointment.center?.name}</span>
                            </div>
                            {appointment.qr_code && (
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span>Mã QR: {appointment.qr_code}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Bạn chưa có lịch hẹn nào</p>
                    <GlassButton onClick={() => navigate('/donate')}>
                      Đăng ký hiến máu
                    </GlassButton>
                  </div>
                )}
              </GlassCardContent>
            </GlassCard>

            {/* Donation History */}
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Lịch sử hiến máu
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                {donationRecords.length > 0 ? (
                  <div className="space-y-4">
                    {donationRecords.map((record) => (
                      <div key={record.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-red-600" />
                            <span className="font-medium">
                              {new Date(record.donation_date).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          {getScreeningResultBadge(record.screening_result)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <p className="text-gray-500">Nhóm máu</p>
                            <p className="font-medium">{record.blood_type || 'Chưa xác định'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Lượng máu</p>
                            <p className="font-medium">{record.blood_volume || 'N/A'} ml</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Trung tâm</p>
                            <p className="font-medium">{record.center?.name}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Bạn chưa có lịch sử hiến máu</p>
                    <GlassButton onClick={() => navigate('/donate')}>
                      Hiến máu lần đầu
                    </GlassButton>
                  </div>
                )}
              </GlassCardContent>
            </GlassCard>

            {/* Quick Actions */}
            <div className="flex justify-center gap-4">
              <GlassButton 
                variant="primary" 
                onClick={() => navigate('/donate')}
                className="flex items-center gap-2"
              >
                <Heart className="h-4 w-4" />
                Đăng ký hiến máu
              </GlassButton>
              <GlassButton 
                variant="secondary" 
                onClick={() => navigate('/centers')}
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                Tìm trung tâm
              </GlassButton>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile; 