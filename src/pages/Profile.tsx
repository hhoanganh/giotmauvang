import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, MapPin, Heart, Clock, CheckCircle, XCircle, ArrowRight, Download, Printer, Pencil } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface Appointment {
  id: string;
  appointment_date: string;
  time_slot: string;
  status: string;
  qr_code: string;
  created_at?: string;
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
  // Store generated QR code images for each appointment
  const [qrImages, setQrImages] = useState<Record<string, string>>({});
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('appointments');
  const [selectedDeclaration, setSelectedDeclaration] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [healthDeclarations, setHealthDeclarations] = useState<any[]>([]);
  // Inline edit state
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      fetchUserData();
      fetchHealthDeclarations();
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
          created_at,
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
        created_at: apt.created_at,
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

  // Generate QR code images from JSON data after appointments are loaded
  useEffect(() => {
    const generateQRCodes = async () => {
      if (!appointments.length) return;
      const QRCode = (await import('qrcode')).default;
      const newQrImages: Record<string, string> = {};
      for (const apt of appointments) {
        if (apt.qr_code) {
          try {
            newQrImages[apt.id] = await QRCode.toDataURL(apt.qr_code, {
              width: 256,
              margin: 2,
              color: { dark: '#000000', light: '#FFFFFF' }
            });
          } catch (e) {
            newQrImages[apt.id] = '';
          }
        }
      }
      setQrImages(newQrImages);
    };
    generateQRCodes();
  }, [appointments]);

  // Fetch health declarations
  const fetchHealthDeclarations = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('health_declarations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setHealthDeclarations(data || []);
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải tờ khai sức khỏe',
        variant: 'destructive',
      });
      setHealthDeclarations([]);
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

  const handleDownloadQR = (qrDataUrl: string, appointmentDate: string, donorName: string) => {
    try {
      if (!qrDataUrl) throw new Error('No QR image');
      // Create a link to download the QR code image
      const link = document.createElement('a');
      link.href = qrDataUrl;
      link.download = `qr-checkin-${donorName}-${appointmentDate}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: 'Tải xuống thành công',
        description: 'Mã QR đã được tải xuống',
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải xuống mã QR',
        variant: 'destructive',
      });
    }
  };

  const handlePrintQR = (qrDataUrl: string, appointmentDate: string, donorName: string) => {
    try {
      if (!qrDataUrl) throw new Error('No QR image');
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>QR Code Check-in - ${donorName}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
                .qr-container { margin: 20px 0; }
                .qr-image { max-width: 300px; height: auto; }
                .info { margin: 10px 0; text-align: left; }
                @media print { body { margin: 0; } }
              </style>
            </head>
            <body>
              <h2>Mã QR Check-in Hiến Máu</h2>
              <div class="info">
                <p><strong>Người hiến máu:</strong> ${donorName}</p>
                <p><strong>Ngày hẹn:</strong> ${new Date(appointmentDate).toLocaleDateString('vi-VN')}</p>
              </div>
              <div class="qr-container">
                <img src="${qrDataUrl}" alt="QR Code" class="qr-image" />
              </div>
              <div class="info">
                <p><small>Quét mã này tại trung tâm để check-in</small></p>
                <p><small>Được tạo lúc: ${new Date().toLocaleString('vi-VN')}</small></p>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể in mã QR',
        variant: 'destructive',
      });
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) return;
    setCancellingId(appointmentId);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId);
      if (error) throw error;
      toast({
        title: 'Đã hủy lịch hẹn',
        description: 'Lịch hẹn của bạn đã được hủy thành công.',
      });
      fetchUserData();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể hủy lịch hẹn. Vui lòng thử lại.',
        variant: 'destructive',
      });
    } finally {
      setCancellingId(null);
    }
  };

  // Add a helper function to prettify the health declaration answers
  const renderHealthDeclarationDetails = (answers: any) => {
    if (!answers) return null;
    return (
      <div className="space-y-4 text-sm">
        <div>
          <span className="font-semibold">1. Đã từng hiến máu chưa?</span> {answers.hasDonatedBefore === 'yes' ? 'Có' : answers.hasDonatedBefore === 'no' ? 'Không' : 'Không rõ'}
        </div>
        <div>
          <span className="font-semibold">2. Hiện tại có mắc bệnh lý nào không?</span> {answers.hasCurrentDisease === 'yes' ? 'Có' : answers.hasCurrentDisease === 'no' ? 'Không' : 'Không rõ'}
          {answers.hasCurrentDisease === 'yes' && answers.currentDiseaseDetails && (
            <div className="ml-4 text-gray-600">Chi tiết: {answers.currentDiseaseDetails}</div>
          )}
        </div>
        <div>
          <span className="font-semibold">3. Trước đây có từng mắc bệnh nghiêm trọng?</span> {answers.hasPreviousDisease === 'yes' ? 'Có' : answers.hasPreviousDisease === 'no' ? 'Không' : answers.hasPreviousDisease === 'other' ? 'Khác' : 'Không rõ'}
          {answers.hasPreviousDisease === 'other' && answers.previousDiseaseDetails && (
            <div className="ml-4 text-gray-600">Chi tiết: {answers.previousDiseaseDetails}</div>
          )}
        </div>
        <div>
          <span className="font-semibold">4. Trong 12 tháng gần đây:</span>
          <ul className="ml-4 list-disc">
            <li>Khỏi bệnh sau sốt rét, giang mai, lao, ...: {answers.last12Months?.recoveredFromDisease ? 'Có' : 'Không'}</li>
            <li>Được truyền máu: {answers.last12Months?.receivedBloodTransfusion ? 'Có' : 'Không'}</li>
            <li>Tiêm Vacxin: {answers.last12Months?.receivedVaccine ? 'Có' : 'Không'}{answers.last12Months?.receivedVaccine && answers.last12Months?.vaccineDetails && ` (${answers.last12Months.vaccineDetails})`}</li>
            <li>Không: {answers.last12Months?.none ? 'Có' : 'Không'}</li>
          </ul>
        </div>
        <div>
          <span className="font-semibold">5. Trong 6 tháng gần đây:</span>
          <ul className="ml-4 list-disc">
            <li>Khỏi bệnh sau thương hàn, nhiễm trùng máu, ...: {answers.last6Months?.recoveredFromDisease ? 'Có' : 'Không'}</li>
            <li>Sút cân nhanh: {answers.last6Months?.rapidWeightLoss ? 'Có' : 'Không'}</li>
            <li>Nổi hạch kéo dài: {answers.last6Months?.persistentLymphNodes ? 'Có' : 'Không'}</li>
            <li>Thủ thuật y tế xâm lấn: {answers.last6Months?.invasiveMedicalProcedure ? 'Có' : 'Không'}</li>
            <li>Xăm, xỏ lỗ: {answers.last6Months?.tattooOrPiercing ? 'Có' : 'Không'}</li>
            <li>Sử dụng ma túy: {answers.last6Months?.drugUse ? 'Có' : 'Không'}</li>
            <li>Tiếp xúc máu/dịch tiết: {answers.last6Months?.bloodExposure ? 'Có' : 'Không'}</li>
            <li>Sống chung với người viêm gan B: {answers.last6Months?.livingWithHepatitisB ? 'Có' : 'Không'}</li>
            <li>Quan hệ với người nhiễm bệnh: {answers.last6Months?.sexualContactWithInfected ? 'Có' : 'Không'}</li>
            <li>Quan hệ đồng giới: {answers.last6Months?.sameSexContact ? 'Có' : 'Không'}</li>
            <li>Không: {answers.last6Months?.none ? 'Có' : 'Không'}</li>
          </ul>
        </div>
        <div>
          <span className="font-semibold">6. Trong 1 tháng gần đây khỏi bệnh sau các bệnh nhiễm trùng?</span> {answers.last1Month === 'yes' ? 'Có' : answers.last1Month === 'no' ? 'Không' : 'Không rõ'}
        </div>
        <div>
          <span className="font-semibold">7. Trong 14 ngày gần đây có bị cúm, cảm lạnh, ...?</span> {answers.last14Days === 'yes' ? 'Có' : answers.last14Days === 'no' ? 'Không' : answers.last14Days === 'other' ? 'Khác' : 'Không rõ'}
          {answers.last14Days === 'other' && answers.last14DaysDetails && (
            <div className="ml-4 text-gray-600">Chi tiết: {answers.last14DaysDetails}</div>
          )}
        </div>
        <div>
          <span className="font-semibold">8. Trong 7 ngày gần đây có dùng thuốc?</span> {answers.last7Days === 'yes' ? 'Có' : answers.last7Days === 'no' ? 'Không' : answers.last7Days === 'other' ? 'Khác' : 'Không rõ'}
          {answers.last7Days === 'other' && answers.last7DaysDetails && (
            <div className="ml-4 text-gray-600">Chi tiết: {answers.last7DaysDetails}</div>
          )}
        </div>
        <div>
          <span className="font-semibold">9. (Nữ) Mang thai, nuôi con, ...?</span> {
            answers.womenSpecific === 'pregnant' ? 'Đang mang thai/nuôi con' :
            answers.womenSpecific === 'terminatedPregnancy' ? 'Chấm dứt thai kỳ' :
            answers.womenSpecific === 'breastfeeding' ? 'Đang cho con bú' :
            answers.womenSpecific === 'no' ? 'Không' : 'Không rõ'}
        </div>
      </div>
    );
  };

  // Add updateProfile function
  const updateProfileField = async (field: string, value: string) => {
    setSavingEdit(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [field]: value })
        .eq('id', user.id);
      if (error) throw error;
      toast({ title: 'Cập nhật thành công', description: 'Thông tin đã được cập nhật.' });
      setEditField(null);
      setEditValue('');
      // Refresh profile (assume useAuth context will update, or force reload if needed)
      window.location.reload();
    } catch (error) {
      toast({ title: 'Lỗi', description: 'Không thể cập nhật thông tin.', variant: 'destructive' });
    } finally {
      setSavingEdit(false);
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
          <div className="max-w-4xl mx-auto">
            {/* Remove the profile icon, user name, and email above the personal info card */}
            <GlassCard className="mb-8">
              <GlassCardHeader>
                <GlassCardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Thông tin cá nhân
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="space-y-4">
                  {/* Full Name */}
                  <div className="flex items-center gap-3">
                    <span className="w-32 text-gray-500">Họ và tên</span>
                    {editField === 'full_name' ? (
                      <>
                        <Input
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          className="max-w-xs"
                          disabled={savingEdit}
                        />
                        <GlassButton
                          size="sm"
                          onClick={() => updateProfileField('full_name', editValue)}
                          disabled={savingEdit || !editValue.trim()}
                        >
                          Lưu
                        </GlassButton>
                        <GlassButton
                          size="sm"
                          variant="ghost"
                          onClick={() => { setEditField(null); setEditValue(''); }}
                          disabled={savingEdit}
                        >
                          Hủy
                        </GlassButton>
                      </>
                    ) : (
                      <>
                        <span className="font-medium">{profile?.full_name || 'Chưa cập nhật'}</span>
                        <button
                          className="ml-2 text-gray-400 hover:text-blue-600"
                          onClick={() => { setEditField('full_name'); setEditValue(profile?.full_name || ''); }}
                          aria-label="Chỉnh sửa họ và tên"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                  {/* Phone Number */}
                  <div className="flex items-center gap-3">
                    <span className="w-32 text-gray-500">Số điện thoại</span>
                    {editField === 'phone_number' ? (
                      <>
                        <Input
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          className="max-w-xs"
                          disabled={savingEdit}
                        />
                        <GlassButton
                          size="sm"
                          onClick={() => updateProfileField('phone_number', editValue)}
                          disabled={savingEdit || !editValue.trim()}
                        >
                          Lưu
                        </GlassButton>
                        <GlassButton
                          size="sm"
                          variant="ghost"
                          onClick={() => { setEditField(null); setEditValue(''); }}
                          disabled={savingEdit}
                        >
                          Hủy
                        </GlassButton>
                      </>
                    ) : (
                      <>
                        <span className="font-medium">{profile?.phone_number || 'Chưa cập nhật'}</span>
                        <button
                          className="ml-2 text-gray-400 hover:text-blue-600"
                          onClick={() => { setEditField('phone_number'); setEditValue(profile?.phone_number || ''); }}
                          aria-label="Chỉnh sửa số điện thoại"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <span className="w-32 text-gray-500">Email</span>
                    <span className="font-medium">{profile?.email || 'Chưa cập nhật'}</span>
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>
            <GlassCard className="section-content-medium min-h-[500px] overflow-y-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="appointments">Lịch hẹn sắp tới</TabsTrigger>
                  <TabsTrigger value="donations">Lịch sử hiến máu</TabsTrigger>
                </TabsList>
                <TabsContent value="appointments">
                  {/* Upcoming Appointments */}
                  <GlassCard>
                    <GlassCardHeader>
                      <GlassCardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Lịch hẹn sắp tới
                      </GlassCardTitle>
                    </GlassCardHeader>
                    <GlassCardContent className="px-4">
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
                                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                          <CheckCircle className="h-4 w-4 text-green-600" />
                                          <span className="text-sm font-medium text-gray-700">Mã QR Check-in</span>
                                        </div>
                                        <div className="flex gap-2">
                                          <GlassButton
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDownloadQR(qrImages[appointment.id], appointment.appointment_date, profile?.full_name || '')}
                                            className="h-8 px-2"
                                          >
                                            <Download className="h-3 w-3" />
                                          </GlassButton>
                                          <GlassButton
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handlePrintQR(qrImages[appointment.id], appointment.appointment_date, profile?.full_name || '')}
                                            className="h-8 px-2"
                                          >
                                            <Printer className="h-3 w-3" />
                                          </GlassButton>
                                        </div>
                                      </div>
                                      <div className="bg-white p-3 rounded border-2 border-dashed border-gray-300 text-center">
                                        <div className="text-xs text-gray-500 mb-2">Quét mã này tại trung tâm</div>
                                        {qrImages[appointment.id] ? (
                                          <img 
                                            src={qrImages[appointment.id]} 
                                            alt="QR Code for check-in" 
                                            className="mx-auto max-w-full h-32 object-contain"
                                          />
                                        ) : (
                                          <div className="font-mono text-xs text-gray-500 break-all">
                                            {appointment.qr_code}
                                          </div>
                                        )}
                                      </div>
                                      <div className="text-xs text-gray-500 mt-2 text-center">
                                        Chứa thông tin: Tên, SĐT, Ngày hẹn, Giờ hẹn, Trung tâm
                                      </div>
                                    </div>
                                  )}
                                </div>
                                {/* Move Đăng ký lúc to the bottom left */}
                                {appointment.created_at && (
                                  <div className="text-xs text-gray-500 mt-3 text-left">
                                    Đăng ký lúc: {new Date(appointment.created_at).toLocaleTimeString('vi-VN')} {new Date(appointment.created_at).toLocaleDateString('vi-VN')}
                                  </div>
                                )}
                                <div className="flex justify-end mt-2">
                                  <GlassButton
                                    variant="secondary"
                                    size="sm"
                                    disabled={cancellingId === appointment.id}
                                    onClick={() => handleCancelAppointment(appointment.id)}
                                  >
                                    {cancellingId === appointment.id ? 'Đang hủy...' : 'Hủy lịch hẹn'}
                                  </GlassButton>
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
                </TabsContent>
                <TabsContent value="donations">
                  {/* Donation History */}
                  <GlassCard>
                    <GlassCardHeader>
                      <GlassCardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5" />
                        Lịch sử hiến máu
                      </GlassCardTitle>
                    </GlassCardHeader>
                    <GlassCardContent className="px-4">
                      {donationRecords.length > 0 ? (
                        <div className="space-y-4">
                          {donationRecords.map((record) => {
                            // Find the health declaration for this donation (if any)
                            const declaration = healthDeclarations?.find((decl: any) => decl.appointment_id === record.id) || null;
                            return (
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
                                  {declaration && (
                                    <div className="flex items-center">
                                      <GlassButton
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => { setSelectedDeclaration(declaration); setModalOpen(true); }}
                                      >
                                        Xem tờ khai
                                      </GlassButton>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-4">Bạn chưa có lịch sử hiến máu</p>
                        </div>
                      )}
                    </GlassCardContent>
                    {/* Modal for viewing declaration details */}
                    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                      <DialogContent className="max-w-lg w-full">
                        <DialogHeader>
                          <DialogTitle>Chi tiết tờ khai sức khỏe</DialogTitle>
                        </DialogHeader>
                        {selectedDeclaration && (
                          <div className="overflow-x-auto max-h-[60vh]">
                            {renderHealthDeclarationDetails(selectedDeclaration.answers)}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </GlassCard>
                </TabsContent>
              </Tabs>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
