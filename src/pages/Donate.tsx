import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Clock, User, Phone, Mail, Heart, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DonationCenter {
  id: string;
  name: string;
  address: string;
  phone: string;
}

interface TimeSlot {
  id: string;
  time: string;
  label: string;
}

interface HealthDeclaration {
  answers: Record<number, 'yes' | 'no' | 'uncertain' | 'not-applicable'>;
  isEligible: boolean;
}

const Donate: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Booking state
  const [step, setStep] = useState<'auth' | 'info' | 'center' | 'date' | 'time' | 'confirm'>('auth');
  const [centers, setCenters] = useState<DonationCenter[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [dateRegistrations, setDateRegistrations] = useState<Record<string, number>>({});
  const [bookingLoading, setBookingLoading] = useState(false);

  // Eligibility state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [eligibilityAnswers, setEligibilityAnswers] = useState<Record<number, 'yes' | 'no' | 'uncertain' | 'not-applicable'>>({});
  const [isEligible, setIsEligible] = useState<boolean | null>(null);

  // Time slots (2-hour intervals)
  const timeSlots: TimeSlot[] = [
    { id: '09:00-11:00', time: '09:00-11:00', label: 'Sáng (09:00 - 11:00)' },
    { id: '11:00-13:00', time: '11:00-13:00', label: 'Trưa (11:00 - 13:00)' },
    { id: '13:00-15:00', time: '13:00-15:00', label: 'Chiều (13:00 - 15:00)' },
    { id: '15:00-17:00', time: '15:00-17:00', label: 'Chiều (15:00 - 17:00)' },
  ];

  // Eligibility questions (same as EligibilityCheckerModal)
  const eligibilityQuestions = [
    {
      id: 1,
      text: "Hiện tại, anh/chị có bị các bệnh: viêm khớp, đau dạ dày, viêm gan/ vàng da, bệnh tim, huyết áp thấp/cao, hen, ho kéo dài, bệnh máu, lao?",
      options: [
        { value: 'yes' as const, label: 'Có' },
        { value: 'no' as const, label: 'Không' },
        { value: 'uncertain' as const, label: 'Không chắc chắn' }
      ]
    },
    {
      id: 2,
      text: "Trong vòng 12 tháng gần đây, anh/chị có mắc các bệnh và đã được điều trị khỏi: Sốt rét, Giang mai, Lao, Viêm não, Phẫu thuật ngoại khoa? Được truyền máu và các chế phẩm máu? Tiêm Vacxin bệnh dại?",
      options: [
        { value: 'yes' as const, label: 'Có' },
        { value: 'no' as const, label: 'Không' },
        { value: 'uncertain' as const, label: 'Không chắc chắn' }
      ]
    },
    {
      id: 3,
      text: "Trong vòng 06 tháng gần đây, anh/chị có bị một trong số các triệu chứng sau không? Sút cân nhanh không rõ nguyên nhân? Nổi hạch kéo dài? Chữa răng, châm cứu? Xăm mình, xỏ lỗ tai, lỗ mũi? Sử dụng ma túy? Quan hệ tình dục với người nhiễm HIV hoặc người có hành vi nguy cơ lây nhiễm HIV? Quan hệ tình dục với người cùng giới?",
      options: [
        { value: 'yes' as const, label: 'Có' },
        { value: 'no' as const, label: 'Không' },
        { value: 'uncertain' as const, label: 'Không chắc chắn' }
      ]
    },
    {
      id: 4,
      text: "Trong 01 tháng gần đây anh/chị có: Khỏi bệnh sau khi mắc bệnh viêm đường tiết niệu, viêm da nhiễm trùng viêm phế quản, viêm phổi, sởi, quai bị, Rubella? Tiêm vắc xin phòng bệnh? Đi vào vùng có dịch bệnh lưu hành (sốt rét, sốt xuất huyết, Zika,..)?",
      options: [
        { value: 'yes' as const, label: 'Có' },
        { value: 'no' as const, label: 'Không' },
        { value: 'uncertain' as const, label: 'Không chắc chắn' }
      ]
    },
    {
      id: 5,
      text: "Trong 07 ngày gần đây anh/chị có: Bị cảm cúm (ho, nhức đầu, sốt...)? Dùng thuốc kháng sinh, Aspirin, Corticoid? Tiêm Vacxin phòng Viêm gan siêu vi B, Human Papilloma Virus?",
      options: [
        { value: 'yes' as const, label: 'Có' },
        { value: 'no' as const, label: 'Không' },
        { value: 'uncertain' as const, label: 'Không chắc chắn' }
      ]
    },
    {
      id: 6,
      text: "Câu hỏi dành cho phụ nữ: Hiện có thai, hoặc nuôi con dưới 12 tháng tuổi? Có kinh nguyệt trong vòng một tuần hay không?",
      options: [
        { value: 'yes' as const, label: 'Có' },
        { value: 'no' as const, label: 'Không' },
        { value: 'uncertain' as const, label: 'Không chắc chắn' },
        { value: 'not-applicable' as const, label: 'Không áp dụng (Nam giới)' }
      ]
    }
  ];

  // Check authentication and role on mount
  useEffect(() => {
    if (!loading) {
      if (!user) {
        setStep('auth');
      } else if (profile?.primary_role !== 'donor') {
        setStep('auth');
      } else {
        setStep('info');
        fetchCenters();
        fetchUserLastCenter();
      }
    }
  }, [user, profile, loading]);

  // Fetch centers
  const fetchCenters = async () => {
    try {
      const { data, error } = await supabase
        .from('donation_centers')
        .select('id, name, address, phone')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      setCenters(data || []);
    } catch (error) {
      console.error('Error fetching centers:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách trung tâm',
        variant: 'destructive',
      });
    }
  };

  // Fetch user's last donation center for smart defaults
  const fetchUserLastCenter = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('donation_records')
        .select('center_id')
        .eq('user_id', user.id)
        .order('donation_date', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const lastCenterId = data[0].center_id;
        // Check if center still exists
        const centerExists = centers.find(c => c.id === lastCenterId);
        if (centerExists) {
          setSelectedCenter(lastCenterId);
        }
      }
    } catch (error) {
      console.error('Error fetching last center:', error);
    }
  };

  // Fetch registrations for selected date
  const fetchDateRegistrations = async (date: string) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('id')
        .eq('appointment_date', date)
        .eq('status', 'scheduled');
      
      if (error) throw error;
      
      const count = data?.length || 0;
      setDateRegistrations(prev => ({ ...prev, [date]: count }));
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  // Handle eligibility answer
  const handleEligibilityAnswer = (questionId: number, answer: 'yes' | 'no' | 'uncertain' | 'not-applicable') => {
    const newAnswers = { ...eligibilityAnswers, [questionId]: answer };
    setEligibilityAnswers(newAnswers);

    // Check for immediate ineligibility
    if (answer === 'yes' && questionId <= 5) {
      setIsEligible(false);
      return;
    }

    // Move to next question or calculate result
    if (currentQuestion < eligibilityQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateEligibility(newAnswers);
    }
  };

  // Calculate eligibility result
  const calculateEligibility = (answers: Record<number, 'yes' | 'no' | 'uncertain' | 'not-applicable'>) => {
    // Check for any "yes" answers to questions 1-5
    for (let i = 1; i <= 5; i++) {
      if (answers[i] === 'yes') {
        setIsEligible(false);
        return;
      }
    }

    // Check question 6 (women-specific)
    if (answers[6] === 'yes') {
      setIsEligible(false);
    } else if (answers[6] === 'uncertain') {
      setIsEligible(false); // Require consultation
    } else {
      setIsEligible(true);
    }
  };

  // Handle date selection
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    fetchDateRegistrations(date);
  };

  // Generate available dates (next 30 days)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip weekends (optional)
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip Sunday and Saturday
        dates.push({
          date: date.toISOString().split('T')[0],
          label: date.toLocaleDateString('vi-VN', { 
            weekday: 'short', 
            day: 'numeric', 
            month: 'short' 
          })
        });
      }
    }
    
    return dates;
  };

  // Handle booking submission
  const handleBooking = async () => {
    if (!user || !selectedCenter || !selectedDate || !selectedTimeSlot) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin',
        variant: 'destructive',
      });
      return;
    }

    setBookingLoading(true);
    
    try {
      // Create appointment
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert([{
          user_id: user.id,
          center_id: selectedCenter,
          appointment_date: selectedDate,
          time_slot: selectedTimeSlot,
          status: 'scheduled'
        }])
        .select()
        .single();

      if (appointmentError) throw appointmentError;

      // Create health declaration
      const { error: healthError } = await supabase
        .from('health_declarations')
        .insert([{
          user_id: user.id,
          appointment_id: appointment.id,
          answers: eligibilityAnswers,
          is_eligible: isEligible
        }]);

      if (healthError) throw healthError;

      // Generate QR code (simple implementation)
      const qrCode = `DONATE-${appointment.id.slice(0, 8).toUpperCase()}`;
      
      const { error: qrError } = await supabase
        .from('appointments')
        .update({ qr_code: qrCode })
        .eq('id', appointment.id);

      if (qrError) throw qrError;

      toast({
        title: 'Đăng ký thành công!',
        description: 'Vui lòng đến trung tâm đúng giờ với mã QR này',
      });

      // Navigate to confirmation or profile
      navigate('/profile');
      
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể đăng ký. Vui lòng thử lại.',
        variant: 'destructive',
      });
    } finally {
      setBookingLoading(false);
    }
  };

  // Render authentication step
  const renderAuthStep = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Heart className="h-8 w-8 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Đăng ký hoặc đăng nhập để hiến máu ngay!
      </h2>
      <p className="text-gray-600 mb-8">
        Vui lòng đăng nhập hoặc tạo tài khoản để tiếp tục quy trình hiến máu
      </p>
      <GlassButton 
        variant="primary" 
        size="lg" 
        onClick={() => navigate('/auth')}
      >
        Đăng nhập / Đăng ký
      </GlassButton>
    </div>
  );



  // Render personal info step with eligibility checker
  const renderInfoStep = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Personal Info Section */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Thông tin cá nhân
          </h2>
          <p className="text-gray-600">
            Thông tin này được lấy từ hồ sơ của bạn
          </p>
        </div>

        <GlassCard className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Họ và tên</p>
                <p className="font-medium">{profile?.full_name || 'Chưa cập nhật'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="font-medium">{profile?.phone_number || 'Chưa cập nhật'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{profile?.email || 'Chưa cập nhật'}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Để thay đổi thông tin, vui lòng cập nhật trong hồ sơ cá nhân
            </p>
            <div className="flex gap-3">
              <GlassButton 
                variant="ghost" 
                onClick={() => navigate('/profile')}
              >
                Cập nhật hồ sơ
              </GlassButton>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Eligibility Checker Section */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Kiểm tra điều kiện hiến máu
          </h2>
          <p className="text-gray-600">
            Vui lòng trả lời các câu hỏi sau để kiểm tra điều kiện hiến máu
          </p>
        </div>

        {isEligible === null ? (
          <GlassCard className="p-6">
            <div className="text-center mb-6">
              <p className="text-lg font-medium text-gray-900 mb-2">
                Câu hỏi {currentQuestion + 1} / {eligibilityQuestions.length}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / eligibilityQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-lg leading-relaxed mb-6">
                {eligibilityQuestions[currentQuestion].text}
              </h3>
            </div>
            
            <div className="space-y-4">
              {eligibilityQuestions[currentQuestion].options.map((option) => (
                <GlassButton
                  key={option.value}
                  variant="default"
                  size="lg"
                  className="w-full py-4 text-left justify-start"
                  onClick={() => handleEligibilityAnswer(eligibilityQuestions[currentQuestion].id, option.value)}
                >
                  {option.label}
                </GlassButton>
              ))}
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="p-6">
            <div className="text-center">
              {isEligible ? (
                <div>
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Chúc mừng! Bạn có thể hiến máu
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Hãy tiếp tục để đăng ký lịch hiến máu
                  </p>
                  <GlassButton 
                    variant="primary" 
                    size="lg" 
                    onClick={() => setStep('center')}
                  >
                    Tiếp tục đăng ký
                  </GlassButton>
                </div>
              ) : (
                <div>
                  <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Hiện tại bạn chưa đủ điều kiện hiến máu
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Hãy tìm hiểu thêm về các điều kiện và thử lại sau
                  </p>
                  <div className="space-y-4">
                    <GlassButton 
                      variant="secondary" 
                      size="lg" 
                      onClick={() => navigate('/')}
                    >
                      Về trang chủ
                    </GlassButton>
                    <GlassButton 
                      variant="ghost" 
                      size="lg" 
                      onClick={() => {
                        setCurrentQuestion(0);
                        setEligibilityAnswers({});
                        setIsEligible(null);
                      }}
                    >
                      Kiểm tra lại
                    </GlassButton>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );

  // Render center selection step
  const renderCenterStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Chọn trung tâm hiến máu
        </h2>
        <p className="text-gray-600">
          Chọn trung tâm thuận tiện nhất cho bạn
        </p>
      </div>

      <div className="space-y-4">
        {centers.map((center) => (
          <GlassCard 
            key={center.id} 
            className={`p-4 cursor-pointer transition-all duration-300 ${
              selectedCenter === center.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-lg'
            }`}
            onClick={() => setSelectedCenter(center.id)}
          >
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{center.name}</h3>
                <p className="text-sm text-gray-600">{center.address}</p>
                <p className="text-sm text-gray-500">{center.phone}</p>
              </div>
              {selectedCenter === center.id && (
                <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <GlassButton variant="ghost" onClick={() => setStep('info')}>
          Quay lại
        </GlassButton>
        <GlassButton 
          variant="primary" 
          onClick={() => setStep('date')}
          disabled={!selectedCenter}
        >
          Tiếp tục
        </GlassButton>
      </div>
    </div>
  );

  // Render date selection step
  const renderDateStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Chọn ngày hiến máu
        </h2>
        <p className="text-gray-600">
          Chọn ngày phù hợp với lịch trình của bạn
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {generateAvailableDates().map((dateInfo) => {
          const registrationCount = dateRegistrations[dateInfo.date] || 0;
          const isOverbooked = registrationCount > 20; // Assuming max 20 per day
          
          return (
            <GlassCard 
              key={dateInfo.date}
              className={`p-4 cursor-pointer transition-all duration-300 ${
                selectedDate === dateInfo.date ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-lg'
              }`}
              onClick={() => handleDateSelect(dateInfo.date)}
            >
              <div className="text-center">
                <p className="font-semibold text-gray-900">{dateInfo.label}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {registrationCount} người đã đăng ký
                </p>
                {isOverbooked && (
                  <div className="flex items-center gap-1 mt-2 text-orange-600 text-xs">
                    <AlertCircle className="h-3 w-3" />
                    <span>Đã quá tải</span>
                  </div>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>

      {selectedDate && dateRegistrations[selectedDate] > 20 && (
        <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2 text-orange-800">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">
              Ngày này đã có {dateRegistrations[selectedDate]} người đăng ký (quá tải). 
              Bạn có muốn chọn ngày khác?
            </span>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <GlassButton variant="ghost" onClick={() => setStep('center')}>
          Quay lại
        </GlassButton>
        <GlassButton 
          variant="primary" 
          onClick={() => setStep('time')}
          disabled={!selectedDate}
        >
          Tiếp tục
        </GlassButton>
      </div>
    </div>
  );

  // Render time slot selection step
  const renderTimeStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Chọn giờ hiến máu
        </h2>
        <p className="text-gray-600">
          Chọn khung giờ phù hợp với bạn
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {timeSlots.map((slot) => (
          <GlassCard 
            key={slot.id}
            className={`p-4 cursor-pointer transition-all duration-300 ${
              selectedTimeSlot === slot.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-lg'
            }`}
            onClick={() => setSelectedTimeSlot(slot.id)}
          >
            <div className="text-center">
              <Clock className="h-6 w-6 text-gray-500 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">{slot.label}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <GlassButton variant="ghost" onClick={() => setStep('date')}>
          Quay lại
        </GlassButton>
        <GlassButton 
          variant="primary" 
          onClick={() => setStep('confirm')}
          disabled={!selectedTimeSlot}
        >
          Tiếp tục
        </GlassButton>
      </div>
    </div>
  );

  // Render confirmation step
  const renderConfirmStep = () => {
    const selectedCenterData = centers.find(c => c.id === selectedCenter);
    const selectedTimeData = timeSlots.find(t => t.id === selectedTimeSlot);
    
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Xác nhận đăng ký
          </h2>
          <p className="text-gray-600">
            Vui lòng kiểm tra thông tin trước khi xác nhận
          </p>
        </div>

        <GlassCard className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Trung tâm</p>
                <p className="font-medium">{selectedCenterData?.name}</p>
                <p className="text-sm text-gray-600">{selectedCenterData?.address}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Ngày</p>
                <p className="font-medium">
                  {new Date(selectedDate).toLocaleDateString('vi-VN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Giờ</p>
                <p className="font-medium">{selectedTimeData?.label}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex gap-3">
              <GlassButton 
                variant="ghost" 
                onClick={() => setStep('time')}
              >
                Quay lại
              </GlassButton>
              <GlassButton 
                variant="primary" 
                onClick={handleBooking}
                disabled={bookingLoading}
              >
                {bookingLoading ? 'Đang đăng ký...' : 'Xác nhận đăng ký'}
              </GlassButton>
            </div>
          </div>
        </GlassCard>
      </div>
    );
  };

  if (loading) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/30 to-orange-50/30">
      <Header />
      <main className="section-padding">
        <div className="container-custom">
          {step === 'auth' && renderAuthStep()}
          {step === 'info' && renderInfoStep()}
          {step === 'center' && renderCenterStep()}
          {step === 'date' && renderDateStep()}
          {step === 'time' && renderTimeStep()}
          {step === 'confirm' && renderConfirmStep()}
        </div>
      </main>
    </div>
  );
};

export default Donate; 