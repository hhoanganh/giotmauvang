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

interface HealthDeclarationForm {
  // Question 1
  hasDonatedBefore: 'yes' | 'no' | null;
  
  // Question 2
  hasCurrentDisease: 'yes' | 'no' | null;
  currentDiseaseDetails: string;
  
  // Question 3
  hasPreviousDisease: 'yes' | 'no' | 'other' | null;
  previousDiseaseDetails: string;
  
  // Question 4 (multiple selection)
  last12Months: {
    recoveredFromDisease: boolean;
    receivedBloodTransfusion: boolean;
    receivedVaccine: boolean;
    vaccineDetails: string;
    none: boolean;
  };
  
  // Question 5 (multiple selection)
  last6Months: {
    recoveredFromDisease: boolean;
    rapidWeightLoss: boolean;
    persistentLymphNodes: boolean;
    invasiveMedicalProcedure: boolean;
    tattooOrPiercing: boolean;
    drugUse: boolean;
    bloodExposure: boolean;
    livingWithHepatitisB: boolean;
    sexualContactWithInfected: boolean;
    sameSexContact: boolean;
    none: boolean;
  };
  
  // Question 6
  last1Month: 'yes' | 'no' | null;
  
  // Question 7
  last14Days: 'yes' | 'no' | 'other' | null;
  last14DaysDetails: string;
  
  // Question 8
  last7Days: 'yes' | 'no' | 'other' | null;
  last7DaysDetails: string;
  
  // Question 9 (women only, optional)
  womenSpecific: 'pregnant' | 'breastfeeding' | 'terminatedPregnancy' | 'no' | null;
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

  // Form sections state
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    personal: true,
    center: false,
    schedule: false,
    healthDeclaration: false
  });

  // Health declaration form state
  const [healthForm, setHealthForm] = useState<HealthDeclarationForm>({
    hasDonatedBefore: null,
    hasCurrentDisease: null,
    currentDiseaseDetails: '',
    hasPreviousDisease: null,
    previousDiseaseDetails: '',
    last12Months: {
      recoveredFromDisease: false,
      receivedBloodTransfusion: false,
      receivedVaccine: false,
      vaccineDetails: '',
      none: false
    },
    last6Months: {
      recoveredFromDisease: false,
      rapidWeightLoss: false,
      persistentLymphNodes: false,
      invasiveMedicalProcedure: false,
      tattooOrPiercing: false,
      drugUse: false,
      bloodExposure: false,
      livingWithHepatitisB: false,
      sexualContactWithInfected: false,
      sameSexContact: false,
      none: false
    },
    last1Month: null,
    last14Days: null,
    last14DaysDetails: '',
    last7Days: null,
    last7DaysDetails: '',
    womenSpecific: null
  });

  // Time slots (2-hour intervals)
  const timeSlots: TimeSlot[] = [
    { id: '09:00-11:00', time: '09:00-11:00', label: 'Sáng (09:00 - 11:00)' },
    { id: '11:00-13:00', time: '11:00-13:00', label: 'Trưa (11:00 - 13:00)' },
    { id: '13:00-15:00', time: '13:00-15:00', label: 'Chiều (13:00 - 15:00)' },
    { id: '15:00-17:00', time: '15:00-17:00', label: 'Chiều (15:00 - 17:00)' },
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



  // Handle date selection
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    fetchDateRegistrations(date);
  };

  // Generate available dates (next 7 days)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
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

    if (!isHealthDeclarationComplete()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng hoàn thành phiếu đăng ký hiến máu',
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
          answers: JSON.parse(JSON.stringify(healthForm)),
          is_eligible: true // Will be determined by medical staff
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

  // Handle health form updates
  const updateHealthForm = (field: keyof HealthDeclarationForm, value: any) => {
    setHealthForm(prev => ({ ...prev, [field]: value }));
  };

  const updateLast12Months = (field: keyof HealthDeclarationForm['last12Months'], value: boolean) => {
    setHealthForm(prev => ({
      ...prev,
      last12Months: {
        ...prev.last12Months,
        [field]: value,
        // If "none" is selected, uncheck others
        ...(field === 'none' && value ? {
          recoveredFromDisease: false,
          receivedBloodTransfusion: false,
          receivedVaccine: false
        } : {}),
        // If other option is selected, uncheck "none"
        ...(field !== 'none' && value ? { none: false } : {})
      }
    }));
  };

  const updateLast6Months = (field: keyof HealthDeclarationForm['last6Months'], value: boolean) => {
    setHealthForm(prev => ({
      ...prev,
      last6Months: {
        ...prev.last6Months,
        [field]: value,
        // If "none" is selected, uncheck others
        ...(field === 'none' && value ? {
          recoveredFromDisease: false,
          rapidWeightLoss: false,
          persistentLymphNodes: false,
          invasiveMedicalProcedure: false,
          tattooOrPiercing: false,
          drugUse: false,
          bloodExposure: false,
          livingWithHepatitisB: false,
          sexualContactWithInfected: false,
          sameSexContact: false
        } : {}),
        // If other option is selected, uncheck "none"
        ...(field !== 'none' && value ? { none: false } : {})
      }
    }));
  };

  // Check if form is complete
  const isFormComplete = () => {
    return selectedCenter && selectedDate && selectedTimeSlot;
  };

  // Check if health declaration is complete (required fields only)
  const isHealthDeclarationComplete = () => {
    return healthForm.hasDonatedBefore !== null &&
           healthForm.hasCurrentDisease !== null &&
           (healthForm.hasCurrentDisease !== 'yes' || healthForm.currentDiseaseDetails.trim() !== '') &&
           healthForm.hasPreviousDisease !== null &&
           (healthForm.hasPreviousDisease !== 'other' || healthForm.previousDiseaseDetails.trim() !== '') &&
           healthForm.last1Month !== null &&
           healthForm.last14Days !== null &&
           (healthForm.last14Days !== 'other' || healthForm.last14DaysDetails.trim() !== '') &&
           healthForm.last7Days !== null &&
           (healthForm.last7Days !== 'other' || healthForm.last7DaysDetails.trim() !== '');
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
                        onClick={() => {
                          setSelectedCenter(center.id);
                          // Auto-collapse the section when a center is selected
                          setExpandedSections(prev => ({
                            ...prev,
                            center: false
                          }));
                        }}
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
                        <div className="grid grid-cols-2 gap-3">
                          {timeSlots.map((slot) => (
                            <div
                              key={slot.id}
                              className={`p-3 cursor-pointer transition-all duration-300 rounded-lg border-2 text-center ${
                                selectedTimeSlot === slot.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                              }`}
                              onClick={() => setSelectedTimeSlot(slot.id)}
                            >
                              <p className="font-semibold text-gray-900 text-sm">{slot.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </GlassCard>

            {/* Health Declaration Form Section */}
            <GlassCard className="overflow-hidden">
              <div 
                className="p-6 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection('healthDeclaration')}
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Phiếu đăng ký hiến máu</h2>
                    <p className="text-sm text-gray-600">
                      {isHealthDeclarationComplete() ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
                    </p>
                  </div>
                </div>
                {expandedSections.healthDeclaration ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
              </div>
              
              {expandedSections.healthDeclaration && (
                <div className="px-6 pb-6 border-t border-gray-200">
                  <div className="pt-6 space-y-8">
                    {/* Question 1 */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">1. Anh/chị từng hiến máu chưa?</h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="hasDonatedBefore"
                            value="yes"
                            checked={healthForm.hasDonatedBefore === 'yes'}
                            onChange={(e) => updateHealthForm('hasDonatedBefore', e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Có</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="hasDonatedBefore"
                            value="no"
                            checked={healthForm.hasDonatedBefore === 'no'}
                            onChange={(e) => updateHealthForm('hasDonatedBefore', e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Không</span>
                        </label>
                      </div>
                    </div>

                    {/* Question 2 */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">2. Hiện tại, anh/chị có mắc bệnh lý nào không?</h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="hasCurrentDisease"
                            value="yes"
                            checked={healthForm.hasCurrentDisease === 'yes'}
                            onChange={(e) => updateHealthForm('hasCurrentDisease', e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Có</span>
                        </label>
                        {healthForm.hasCurrentDisease === 'yes' && (
                          <div className="ml-7">
                            <Input
                              placeholder="Vui lòng mô tả bệnh lý"
                              value={healthForm.currentDiseaseDetails}
                              onChange={(e) => updateHealthForm('currentDiseaseDetails', e.target.value)}
                              className="w-full"
                            />
                          </div>
                        )}
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="hasCurrentDisease"
                            value="no"
                            checked={healthForm.hasCurrentDisease === 'no'}
                            onChange={(e) => updateHealthForm('hasCurrentDisease', e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Không</span>
                        </label>
                      </div>
                    </div>

                    {/* Question 3 */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">3. Trước đây, anh/chị có từng mắc một trong các bệnh: viêm gan siêu vi B, C, HIV, vảy nến, phì đại tiền liệt tuyến, sốc phản vệ, tai biến mạch máu não, nhồi máu cơ tim, lupus ban đỏ, động kinh, ung thư, hen, được cấy ghép mô tạng?</h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="hasPreviousDisease"
                            value="yes"
                            checked={healthForm.hasPreviousDisease === 'yes'}
                            onChange={(e) => updateHealthForm('hasPreviousDisease', e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Có</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="hasPreviousDisease"
                            value="no"
                            checked={healthForm.hasPreviousDisease === 'no'}
                            onChange={(e) => updateHealthForm('hasPreviousDisease', e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Không</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="hasPreviousDisease"
                            value="other"
                            checked={healthForm.hasPreviousDisease === 'other'}
                            onChange={(e) => updateHealthForm('hasPreviousDisease', e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Bệnh khác</span>
                        </label>
                        {healthForm.hasPreviousDisease === 'other' && (
                          <div className="ml-7">
                            <Input
                              placeholder="Vui lòng mô tả bệnh"
                              value={healthForm.previousDiseaseDetails}
                              onChange={(e) => updateHealthForm('previousDiseaseDetails', e.target.value)}
                              className="w-full"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Question 4 */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">4. Trong 12 tháng gần đây, anh/chị có:</h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={healthForm.last12Months.recoveredFromDisease}
                            onChange={(e) => updateLast12Months('recoveredFromDisease', e.target.checked)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Khỏi bệnh sau khi mắc một trong các bệnh: sốt rét, giang mai, lao, viêm não-màng não, uốn ván, phẫu thuật ngoại khoa?</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={healthForm.last12Months.receivedBloodTransfusion}
                            onChange={(e) => updateLast12Months('receivedBloodTransfusion', e.target.checked)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Được truyền máu hoặc các chế phẩm máu?</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={healthForm.last12Months.receivedVaccine}
                            onChange={(e) => updateLast12Months('receivedVaccine', e.target.checked)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Tiêm Vacxin?</span>
                        </label>
                        {healthForm.last12Months.receivedVaccine && (
                          <div className="ml-7">
                            <Input
                              placeholder="Loại vacxin"
                              value={healthForm.last12Months.vaccineDetails}
                              onChange={(e) => updateHealthForm('last12Months', { ...healthForm.last12Months, vaccineDetails: e.target.value })}
                              className="w-full"
                            />
                          </div>
                        )}
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={healthForm.last12Months.none}
                            onChange={(e) => updateLast12Months('none', e.target.checked)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Không</span>
                        </label>
                      </div>
                    </div>

                    {/* Question 5 */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">5. Trong 06 tháng gần đây, anh/chị có:</h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={healthForm.last6Months.recoveredFromDisease}
                            onChange={(e) => updateLast6Months('recoveredFromDisease', e.target.checked)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Khỏi bệnh sau khi mắc một trong các bệnh: thương hàn, nhiễm trùng máu, bị rắn cắn, viêm tắc động mạch, viêm tắc tĩnh mạch, viêm tụy, viêm tủy xương?</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={healthForm.last6Months.rapidWeightLoss}
                            onChange={(e) => updateLast6Months('rapidWeightLoss', e.target.checked)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Sút cân nhanh không rõ nguyên nhân?</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={healthForm.last6Months.persistentLymphNodes}
                            onChange={(e) => updateLast6Months('persistentLymphNodes', e.target.checked)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Nổi hạch kéo dài?</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={healthForm.last6Months.invasiveMedicalProcedure}
                            onChange={(e) => updateLast6Months('invasiveMedicalProcedure', e.target.checked)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Thực hiện thủ thuật y tế xâm lấn (chữa răng, châm cứu, lăn kim, nội soi,...)?</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={healthForm.last6Months.tattooOrPiercing}
                            onChange={(e) => updateLast6Months('tattooOrPiercing', e.target.checked)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Xăm, xỏ lỗ tai, lỗ mũi hoặc các vị trí khác trên cơ thể?</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={healthForm.last6Months.drugUse}
                            onChange={(e) => updateLast6Months('drugUse', e.target.checked)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Sử dụng ma túy?</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={healthForm.last6Months.bloodExposure}
                            onChange={(e) => updateLast6Months('bloodExposure', e.target.checked)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Tiếp xúc trực tiếp với máu, dịch tiết của người khác hoặc bị thương bởi kim tiêm?</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={healthForm.last6Months.livingWithHepatitisB}
                            onChange={(e) => updateLast6Months('livingWithHepatitisB', e.target.checked)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Sinh sống chung với người nhiễm Bệnh viêm gan siêu vi B?</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={healthForm.last6Months.sexualContactWithInfected}
                            onChange={(e) => updateLast6Months('sexualContactWithInfected', e.target.checked)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Quan hệ tình dục với người nhiễm viêm gan siêu vi B, C, HIV, giang mai hoặc người có nguy cơ nhiễm viêm gan siêu vi B, C, HIV, giang mai?</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={healthForm.last6Months.sameSexContact}
                            onChange={(e) => updateLast6Months('sameSexContact', e.target.checked)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Quan hệ tình dục với người cùng giới?</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={healthForm.last6Months.none}
                            onChange={(e) => updateLast6Months('none', e.target.checked)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Không</span>
                        </label>
                      </div>
                    </div>

                    {/* Question 6 */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">6. Trong 01 tháng gần đây, anh/chị có:</h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="last1Month"
                            value="yes"
                            checked={healthForm.last1Month === 'yes'}
                            onChange={(e) => updateHealthForm('last1Month', e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Khỏi bệnh sau khi mắc bệnh viêm đường tiết niệu, viêm da nhiễm trùng, viêm phế quản, viêm phổi, sởi, ho gà, quai bị, sốt xuất huyết, kiết lỵ, tả, Rubella?</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="last1Month"
                            value="no"
                            checked={healthForm.last1Month === 'no'}
                            onChange={(e) => updateHealthForm('last1Month', e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Không</span>
                        </label>
                      </div>
                    </div>

                    {/* Question 7 */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">7. Trong 14 ngày gần đây, anh/chị có:</h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="last14Days"
                            value="yes"
                            checked={healthForm.last14Days === 'yes'}
                            onChange={(e) => updateHealthForm('last14Days', e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Bị cúm, cảm lạnh, ho, nhức đầu, sốt, đau họng?</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="last14Days"
                            value="no"
                            checked={healthForm.last14Days === 'no'}
                            onChange={(e) => updateHealthForm('last14Days', e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Không</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="last14Days"
                            value="other"
                            checked={healthForm.last14Days === 'other'}
                            onChange={(e) => updateHealthForm('last14Days', e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Khác (cụ thể)</span>
                        </label>
                        {healthForm.last14Days === 'other' && (
                          <div className="ml-7">
                            <Input
                              placeholder="Vui lòng mô tả"
                              value={healthForm.last14DaysDetails}
                              onChange={(e) => updateHealthForm('last14DaysDetails', e.target.value)}
                              className="w-full"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Question 8 */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">8. Trong 07 ngày gần đây, anh/chị có:</h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="last7Days"
                            value="yes"
                            checked={healthForm.last7Days === 'yes'}
                            onChange={(e) => updateHealthForm('last7Days', e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Dùng thuốc kháng sinh, kháng viêm, Aspirin, Corticoid?</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="last7Days"
                            value="no"
                            checked={healthForm.last7Days === 'no'}
                            onChange={(e) => updateHealthForm('last7Days', e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Không</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="last7Days"
                            value="other"
                            checked={healthForm.last7Days === 'other'}
                            onChange={(e) => updateHealthForm('last7Days', e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Khác (cụ thể)</span>
                        </label>
                        {healthForm.last7Days === 'other' && (
                          <div className="ml-7">
                            <Input
                              placeholder="Vui lòng mô tả"
                              value={healthForm.last7DaysDetails}
                              onChange={(e) => updateHealthForm('last7DaysDetails', e.target.value)}
                              className="w-full"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Question 9 - Women only */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">9. Câu hỏi dành cho phụ nữ: (không bắt buộc)</h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="womenSpecific"
                            value="pregnant"
                            checked={healthForm.womenSpecific === 'pregnant'}
                            onChange={(e) => updateHealthForm('womenSpecific', e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Hiện chị đang mang thai hoặc nuôi con dưới 12 tháng tuổi?</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="womenSpecific"
                            value="terminatedPregnancy"
                            checked={healthForm.womenSpecific === 'terminatedPregnancy'}
                            onChange={(e) => updateHealthForm('womenSpecific', e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Chấm dứt thai kỳ trong 12 tháng gần đây (sảy thai, phá thai, thai ngoài tử cung)?</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="womenSpecific"
                            value="no"
                            checked={healthForm.womenSpecific === 'no'}
                            onChange={(e) => updateHealthForm('womenSpecific', e.target.value)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>Không</span>
                        </label>
                      </div>
                    </div>
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
            {(!isFormComplete() || !isHealthDeclarationComplete()) && (
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  {!isFormComplete() 
                    ? 'Vui lòng chọn trung tâm, ngày và giờ để có thể đăng ký hiến máu'
                    : 'Vui lòng hoàn thành phiếu đăng ký hiến máu để có thể đăng ký'
                  }
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