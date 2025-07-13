import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Clock, User, Phone, Mail, Heart, AlertCircle, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
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

  // Form state
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

  // Form sections state
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    personal: true,
    eligibility: false,
    center: false,
    schedule: false
  });

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
      if (!user || profile?.primary_role !== 'donor') {
        navigate('/auth');
      } else {
        fetchCenters();
        fetchUserLastCenter();
      }
    }
  }, [user, profile, loading, navigate]);

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



  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Check if form is complete
  const isFormComplete = () => {
    return selectedCenter && selectedDate && selectedTimeSlot;
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
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Form Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Đăng ký hiến máu
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Vui lòng điền đầy đủ thông tin bên dưới để đăng ký hiến máu. 
                Quá trình này bao gồm kiểm tra điều kiện sức khỏe và chọn lịch hẹn.
              </p>
            </div>

            {/* Personal Information Section */}
            <GlassCard className="overflow-hidden">
              <div 
                className="p-6 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection('personal')}
              >
                <div className="flex items-center gap-3">
                  <User className="h-6 w-6 text-blue-600" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Thông tin cá nhân</h2>
                    <p className="text-sm text-gray-600">Thông tin từ hồ sơ của bạn</p>
                  </div>
                </div>
                {expandedSections.personal ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
              </div>
              
              {expandedSections.personal && (
                <div className="px-6 pb-6 border-t border-gray-200">
                  <div className="pt-6 space-y-4">
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

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500 mb-3">
                        Để thay đổi thông tin, vui lòng cập nhật trong hồ sơ cá nhân
                      </p>
                      <GlassButton 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate('/profile')}
                      >
                        Cập nhật hồ sơ
                      </GlassButton>
                    </div>
                  </div>
                </div>
              )}
            </GlassCard>

            {/* Eligibility Checker Section */}
            <GlassCard className="overflow-hidden">
              <div 
                className="p-6 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection('eligibility')}
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Kiểm tra điều kiện hiến máu (Tùy chọn)</h2>
                    <p className="text-sm text-gray-600">
                      {isEligible === null ? 'Chưa kiểm tra' : 
                       isEligible ? 'Đủ điều kiện' : 'Không đủ điều kiện'}
                    </p>
                  </div>
                </div>
                {expandedSections.eligibility ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
              </div>
              
              {expandedSections.eligibility && (
                <div className="px-6 pb-6 border-t border-gray-200">
                  <div className="pt-6">
                    {isEligible === null ? (
                      <div>
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
                      </div>
                    ) : (
                      <div className="text-center">
                        {isEligible ? (
                          <div>
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                              Chúc mừng! Bạn có thể hiến máu
                            </h3>
                            <p className="text-gray-600 mb-6">
                              Bạn đã hoàn thành kiểm tra điều kiện sức khỏe
                            </p>
                            <GlassButton 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setCurrentQuestion(0);
                                setEligibilityAnswers({});
                                setIsEligible(null);
                              }}
                            >
                              Kiểm tra lại
                            </GlassButton>
                          </div>
                        ) : (
                          <div>
                            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                              Hiện tại bạn chưa đủ điều kiện hiến máu
                            </h3>
                            <p className="text-gray-600 mb-6">
                              Hãy tìm hiểu thêm về các điều kiện và thử lại sau
                            </p>
                            <div className="space-y-3">
                              <GlassButton 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setCurrentQuestion(0);
                                  setEligibilityAnswers({});
                                  setIsEligible(null);
                                }}
                              >
                                Kiểm tra lại
                              </GlassButton>
                              <GlassButton 
                                variant="secondary" 
                                size="sm"
                                onClick={() => navigate('/')}
                              >
                                Về trang chủ
                              </GlassButton>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </GlassCard>

            {/* Center Selection Section */}
            <GlassCard className="overflow-hidden">
              <div 
                className="p-6 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection('center')}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-green-600" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Chọn trung tâm hiến máu</h2>
                    <p className="text-sm text-gray-600">
                      {selectedCenter ? 
                        centers.find(c => c.id === selectedCenter)?.name : 
                        'Chưa chọn trung tâm'}
                    </p>
                  </div>
                </div>
                {expandedSections.center ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
              </div>
              
              {expandedSections.center && (
                <div className="px-6 pb-6 border-t border-gray-200">
                  <div className="pt-6 space-y-4">
                    {centers.map((center) => (
                      <div
                        key={center.id} 
                        className={`p-4 cursor-pointer transition-all duration-300 rounded-lg border-2 ${
                          selectedCenter === center.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
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
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>

            {/* Schedule Selection Section */}
            <GlassCard className="overflow-hidden">
              <div 
                className="p-6 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection('schedule')}
              >
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-purple-600" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Chọn lịch hẹn</h2>
                    <p className="text-sm text-gray-600">
                      {selectedDate && selectedTimeSlot ? 
                        `${new Date(selectedDate).toLocaleDateString('vi-VN')} - ${timeSlots.find(t => t.id === selectedTimeSlot)?.label}` : 
                        'Chưa chọn lịch hẹn'}
                    </p>
                  </div>
                </div>
                {expandedSections.schedule ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
              </div>
              
              {expandedSections.schedule && (
                <div className="px-6 pb-6 border-t border-gray-200">
                  <div className="pt-6 space-y-6">
                    {/* Date Selection */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Chọn ngày</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {generateAvailableDates().map((dateInfo) => {
                          const registrationCount = dateRegistrations[dateInfo.date] || 0;
                          const isOverbooked = registrationCount > 20;
                          
                          return (
                            <div
                              key={dateInfo.date}
                              className={`p-4 cursor-pointer transition-all duration-300 rounded-lg border-2 text-center ${
                                selectedDate === dateInfo.date ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                              }`}
                              onClick={() => handleDateSelect(dateInfo.date)}
                            >
                              <p className="font-semibold text-gray-900">{dateInfo.label}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                {registrationCount} người đã đăng ký
                              </p>
                              {isOverbooked && (
                                <div className="flex items-center justify-center gap-1 mt-2 text-orange-600 text-xs">
                                  <AlertCircle className="h-3 w-3" />
                                  <span>Đã quá tải</span>
                                </div>
                              )}
                            </div>
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
                    </div>

                    {/* Time Selection */}
                    {selectedDate && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Chọn giờ</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {timeSlots.map((slot) => (
                            <div
                              key={slot.id}
                              className={`p-4 cursor-pointer transition-all duration-300 rounded-lg border-2 text-center ${
                                selectedTimeSlot === slot.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                              }`}
                              onClick={() => setSelectedTimeSlot(slot.id)}
                            >
                              <Clock className="h-6 w-6 text-gray-500 mx-auto mb-2" />
                              <p className="font-semibold text-gray-900">{slot.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </GlassCard>

            {/* Form Actions */}
            <div className="flex justify-center pt-6">
              <GlassButton 
                variant="primary" 
                size="lg"
                onClick={handleBooking}
                disabled={!isFormComplete() || bookingLoading}
                className="px-8 py-3"
              >
                {bookingLoading ? 'Đang đăng ký...' : 'Đăng ký hiến máu'}
              </GlassButton>
            </div>

            {/* Form Status */}
            {!isFormComplete() && (
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Vui lòng chọn trung tâm, ngày và giờ để có thể đăng ký hiến máu
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Donate; 