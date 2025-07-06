
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Users, Heart } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import SocialAuth from '@/components/auth/SocialAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      {/* Header */}
      <div className="container-custom px-4 py-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Quay lại</span>
        </button>
      </div>

      {/* Hero Section */}
      <div className="container-custom px-4 pb-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-white to-orange-100 rounded-xl flex items-center justify-center shadow-lg">
            <img 
              src="https://jduhcsgsf4.ufs.sh/f/YxhhsvmLP58IE2O12LrHIx6jwqh5iWJp4bOGCTRgVKQFmtZd" 
              alt="Giọt Máu Vàng"
              className="w-6 h-6 object-contain"
            />
            </div>
            <h1 className="text-2xl font-inter font-bold text-gray-900">
              Giọt Máu Vàng
            </h1>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Tham gia cộng đồng cứu người
          </h2>
          <p className="text-gray-600 mb-6">
            Kết nối với các trung tâm y tế và góp phần cứu sống nhiều người
          </p>

          {/* Community Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">1,200+</div>
              <div className="text-sm text-gray-600">Người hiến máu</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">50+</div>
              <div className="text-sm text-gray-600">Trung tâm y tế</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">3,600+</div>
              <div className="text-sm text-gray-600">Người được cứu</div>
            </div>
          </div>
        </div>

        {/* Auth Card */}
        <div className="max-w-md mx-auto">
          <GlassCard className="overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200/50">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'login'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Đăng nhập
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'register'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Đăng ký
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6">
              {/* Social Auth */}
              <SocialAuth />
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">hoặc</span>
                </div>
              </div>

              {/* Forms */}
              {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
            </div>
          </GlassCard>

          {/* Trust Indicators */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
              <Shield className="w-4 h-4" />
              <span>Thông tin của bạn được bảo mật an toàn</span>
            </div>
            
            <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
              <a href="#" className="hover:text-gray-700 transition-colors">
                Chính sách bảo mật
              </a>
              <a href="#" className="hover:text-gray-700 transition-colors">
                Điều khoản sử dụng
              </a>
              <a href="#" className="hover:text-gray-700 transition-colors">
                Hỗ trợ
              </a>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Users className="w-5 h-5 text-blue-500" />
              <span>Nhận thông báo về các sự kiện hiến máu gần bạn</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Heart className="w-5 h-5 text-red-500" />
              <span>Theo dõi lịch sử và sức khỏe hiến máu của bạn</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Shield className="w-5 h-5 text-green-500" />
              <span>Kết nối an toàn với các trung tâm y tế uy tín</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
