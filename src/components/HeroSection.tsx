
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassCard } from '@/components/ui/glass-card';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleFindCenters = () => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: 'centers' } });
    } else {
      const eventsSection = document.getElementById('events-locations-section');
      if (eventsSection) {
        eventsSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          if ((window as any).switchToCentersTab) {
            (window as any).switchToCentersTab();
          }
        }, 500);
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-blue-600/5"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-3 h-3 bg-blue-400/30 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-4 h-4 bg-blue-500/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-32 left-20 w-2 h-2 bg-blue-600/25 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 container-custom section-padding text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-inter font-bold text-gray-900 tracking-tight leading-tight ">
              Kết nối những
              <span className="block bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent min-h-[20px] md:min-h-[60px] lg:min-h-[80px]">
                Giọt Máu Vàng
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Kết nối những trái tim tình nguyện. Ứng dụng giúp người dân dễ dàng hiến máu tại TP. Hồ Chí Minh, cùng nhau trao sự sống và lan tỏa yêu thương.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <GlassButton variant="primary" size="lg" className="w-full sm:w-auto min-w-[200px]" onClick={() => navigate('/donate')}>
              🩸 Hiến máu ngay
            </GlassButton>
            <GlassButton variant="secondary" size="lg" className="w-full sm:w-auto min-w-[200px]" onClick={handleFindCenters}>
              📍 Tìm trung tâm
            </GlassButton>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16">
            <GlassCard className="text-center p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="text-3xl font-bold text-red-600 mb-2">1,200+</h3>
              <p className="text-gray-600 font-medium">Người hiến máu</p>
            </GlassCard>
            <GlassCard className="text-center p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="text-3xl font-bold text-blue-600 mb-2">45</h3>
              <p className="text-gray-600 font-medium">Trung tâm y tế</p>
            </GlassCard>
            <GlassCard className="text-center p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="text-3xl font-bold text-orange-500 mb-2">2,800+</h3>
              <p className="text-gray-600 font-medium">Đơn vị máu</p>
            </GlassCard>
            <GlassCard className="text-center p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="text-3xl font-bold text-green-600 mb-2">120+</h3>
              <p className="text-gray-600 font-medium">Sự kiện hiến máu</p>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
