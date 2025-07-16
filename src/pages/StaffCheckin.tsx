import React, { useState, Suspense } from 'react';
import Header from '@/components/Header';
import { GlassButton } from '@/components/ui/glass-button';
import { Input } from '@/components/ui/input';
import { GlassCard } from '@/components/ui/glass-card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Use dynamic import for QR reader to avoid SSR issues
const QrReader = React.lazy(() => 
  import('react-qr-reader').then(module => ({ default: module.QrReader }))
);

function isUUID(str: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

const StaffCheckin: React.FC = () => {
  const { toast } = useToast();
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [centerName, setCenterName] = useState<string>('');
  const [healthDeclaration, setHealthDeclaration] = useState<any | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);

  // Search handler
  const handleSearch = async (inputOverride?: string) => {
    setLoading(true);
    setError(null);
    setResults([]);
    setSelected(null);
    setHealthDeclaration(null);
    try {
      const input = (inputOverride ?? searchValue).trim();
      let appointments: any[] = [];
      if (isUUID(input)) {
        // Search by appointment id or user_id
        const { data, error } = await supabase
          .from('appointments')
          .select('*, profiles: user_id (full_name, phone_number, email, id)')
          .or(`id.eq.${input},user_id.eq.${input}`)
          .eq('status', 'scheduled')
          .order('appointment_date', { ascending: true });
        if (error) throw error;
        appointments = data || [];
      } else if (input) {
        // Search profiles for matching name or phone
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .or(`full_name.ilike.%${input}%,phone_number.ilike.%${input}%`);
        if (profileError) throw profileError;
        const userIds = profiles?.map((p: any) => p.id) || [];
        if (userIds.length === 0) {
          setError('Không tìm thấy người dùng phù hợp.');
          return;
        }
        // Search appointments for those user_ids
        const { data, error } = await supabase
          .from('appointments')
          .select('*, profiles: user_id (full_name, phone_number, email, id)')
          .in('user_id', userIds)
          .eq('status', 'scheduled')
          .order('appointment_date', { ascending: true });
        if (error) throw error;
        appointments = data || [];
      } else {
        setError('Vui lòng nhập thông tin tìm kiếm.');
        return;
      }
      if (!appointments || appointments.length === 0) {
        setError('Không tìm thấy lịch hẹn phù hợp.');
        return;
      }
      setResults(appointments);
    } catch (err: any) {
      setError('Có lỗi xảy ra khi tìm kiếm.');
      toast({ title: 'Lỗi', description: err.message || 'Có lỗi xảy ra khi tìm kiếm.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch health declaration for selected appointment
  const fetchHealthDeclaration = async (appointment: any) => {
    setHealthDeclaration(null);
    if (!appointment?.id) return;
    try {
      const { data, error } = await supabase
        .from('health_declarations')
        .select('*')
        .eq('appointment_id', appointment.id)
        .single();
      if (error) {
        setHealthDeclaration(null);
        return;
      }
      setHealthDeclaration(data);
    } catch {
      setHealthDeclaration(null);
    }
  };

  // When selecting an appointment, fetch health declaration and center name
  const handleSelect = async (appt: any) => {
    setSelected(appt);
    fetchHealthDeclaration(appt);
    setCenterName('');
    if (appt?.center_id) {
      try {
        const { data, error } = await supabase
          .from('donation_centers')
          .select('name')
          .eq('id', appt.center_id)
          .single();
        if (!error && data?.name) {
          setCenterName(data.name);
        }
      } catch {}
    }
  };

  // Map health declaration keys to readable questions
  const healthQuestions: Record<string, string> = {
    hasDonatedBefore: '1. Anh/chị từng hiến máu chưa?',
    hasCurrentDisease: '2. Hiện tại, anh/chị có mắc bệnh lý nào không?',
    currentDiseaseDetails: 'Nếu có, vui lòng mô tả bệnh lý',
    hasPreviousDisease: '3. Trước đây, anh/chị có từng mắc các bệnh nghiêm trọng?',
    previousDiseaseDetails: 'Nếu có, vui lòng mô tả bệnh',
    last12Months: '4. Trong 12 tháng gần đây, anh/chị có:',
    last6Months: '5. Trong 06 tháng gần đây, anh/chị có:',
    last1Month: '6. Trong 01 tháng gần đây, anh/chị có:',
    last14Days: '7. Trong 14 ngày gần đây, anh/chị có:',
    last14DaysDetails: 'Nếu khác, vui lòng mô tả',
    last7Days: '8. Trong 07 ngày gần đây, anh/chị có:',
    last7DaysDetails: 'Nếu khác, vui lòng mô tả',
    womenSpecific: '9. Câu hỏi dành cho phụ nữ:',
  };
  const healthSubQuestions: Record<string, Record<string, string>> = {
    last12Months: {
      recoveredFromDisease: 'Khỏi bệnh sau khi mắc các bệnh nghiêm trọng',
      receivedBloodTransfusion: 'Được truyền máu hoặc các chế phẩm máu',
      receivedVaccine: 'Tiêm Vacxin',
      vaccineDetails: 'Loại vacxin',
      none: 'Không',
    },
    last6Months: {
      recoveredFromDisease: 'Khỏi bệnh sau khi mắc các bệnh nghiêm trọng',
      rapidWeightLoss: 'Sút cân nhanh không rõ nguyên nhân',
      persistentLymphNodes: 'Nổi hạch kéo dài',
      invasiveMedicalProcedure: 'Thực hiện thủ thuật y tế xâm lấn',
      tattooOrPiercing: 'Xăm, xỏ lỗ',
      drugUse: 'Sử dụng ma túy',
      bloodExposure: 'Tiếp xúc trực tiếp với máu',
      livingWithHepatitisB: 'Sinh sống chung với người nhiễm viêm gan B',
      sexualContactWithInfected: 'Quan hệ với người nhiễm bệnh',
      sameSexContact: 'Quan hệ với người cùng giới',
      none: 'Không',
    },
  };
  // Render health declaration answers (user-friendly)
  const renderHealthDeclaration = () => {
    if (!healthDeclaration) {
      return <div className="text-gray-400 text-sm">Không có phiếu khai báo sức khỏe.</div>;
    }
    let answers;
    try {
      answers = typeof healthDeclaration.answers === 'string' ? JSON.parse(healthDeclaration.answers) : healthDeclaration.answers;
    } catch {
      return <div className="text-red-500 text-sm">Lỗi dữ liệu phiếu khai báo.</div>;
    }
    return (
      <div className="mt-2 text-sm text-gray-700 space-y-2">
        {Object.entries(answers).map(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            // Grouped answers (e.g., last12Months, last6Months)
            return (
              <div key={key} className="mb-2">
                <div className="font-medium text-gray-900">{healthQuestions[key] || key}</div>
                <ul className="list-disc ml-6 mt-1">
                  {Object.entries(value).map(([subKey, subValue]) => (
                    <li key={subKey} className="mb-1">
                      <span className="font-normal">{healthSubQuestions[key]?.[subKey] || subKey}: </span>
                      <span className="font-semibold">{typeof subValue === 'boolean' ? (subValue ? 'Có' : 'Không') : subValue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          } else {
            return (
              <div key={key}>
                <span className="font-medium">{healthQuestions[key] || key}: </span>
                <span className="font-semibold">{value === null || value === '' ? 'Không' : String(value)}</span>
              </div>
            );
          }
        })}
      </div>
    );
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
            onClick={() => handleSelect(appt)}
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
        <div className="mb-1 text-gray-700">Trung tâm: {centerName || selected.center_id}</div>
        <div className="mb-1 text-gray-700">Trạng thái: {selected.status}</div>
        <div className="mt-4 font-semibold text-gray-900">Phiếu khai báo sức khỏe</div>
        {renderHealthDeclaration()}
      </GlassCard>
    );
  };

  // Handle QR scan result
  const handleQRScan = (result: any) => {
    if (result) {
      try {
        const data = typeof result === 'string' ? result : result.text;
        console.log('QR scan result:', data);
        const parsed = JSON.parse(data);
        if (parsed.appointmentId) {
          setShowQR(false);
          setSearchValue(parsed.appointmentId);
          handleSearch(parsed.appointmentId);
        } else {
          toast({ title: 'Lỗi', description: 'QR code không hợp lệ.', variant: 'destructive' });
        }
      } catch {
        toast({ title: 'Lỗi', description: 'QR code không hợp lệ.', variant: 'destructive' });
      }
    }
  };

  // Handle QR scan error
  const handleQRError = (error: any) => {
    console.error('QR scan error:', error);
    setScannerError('Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập camera.');
    toast({ 
      title: 'Lỗi camera', 
      description: 'Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập camera.', 
      variant: 'destructive' 
    });
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
            <GlassButton variant="primary" size="lg" className="w-full py-4" onClick={() => {
              setShowQR(true);
              setScannerError(null);
            }}>
              Scan QR Code
            </GlassButton>
          </div>

          {/* QR Scanner Modal */}
          {showQR && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-white rounded-lg p-4 max-w-sm w-full mx-4 flex flex-col items-center">
                <div className="mb-4 font-semibold text-gray-900 text-center">Scan QR Code</div>
                
                {scannerError ? (
                  <div className="text-red-500 text-sm text-center mb-4 p-4 bg-red-50 rounded">
                    {scannerError}
                  </div>
                ) : (
                  <div className="w-full aspect-square max-w-xs mb-4">
                    <Suspense fallback={
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                        <div className="text-gray-500">Loading scanner...</div>
                      </div>
                    }>
                      <div style={{ width: '100%', height: '100%' }}>
                        <QrReader
                          onResult={(result, error) => {
                            if (error) {
                              handleQRError(error);
                            }
                            if (result) {
                              handleQRScan(result?.getText());
                            }
                          }}
                          constraints={{
                            facingMode: 'environment'
                          }}
                        />
                      </div>
                    </Suspense>
                  </div>
                )}
                
                <div className="flex gap-2 w-full">
                  <GlassButton 
                    variant="secondary" 
                    size="sm" 
                    className="flex-1" 
                    onClick={() => {
                      setShowQR(false);
                      setScannerError(null);
                    }}
                  >
                    Đóng
                  </GlassButton>
                  {scannerError && (
                    <GlassButton 
                      variant="primary" 
                      size="sm" 
                      className="flex-1" 
                      onClick={() => setScannerError(null)}
                    >
                      Thử lại
                    </GlassButton>
                  )}
                </div>
              </div>
            </div>
          )}

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
            <GlassButton variant="secondary" size="sm" onClick={() => handleSearch()} disabled={loading || !searchValue.trim()}>
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
