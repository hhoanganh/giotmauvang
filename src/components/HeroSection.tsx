
import React from 'react';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassCard } from '@/components/ui/glass-card';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-medical opacity-90"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-40"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-white/20 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-white/15 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-32 left-20 w-5 h-5 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-inter font-bold text-white mb-6 tracking-tight">
            Kết nối những
            <span className="gradient-blood bg-clip-text text-transparent block">
              Giọt Máu Vàng
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Ứng dụng hiện đại giúp kết nối người hiến máu với các trung tâm y tế tại TP. Hồ Chí Minh. 
            Cùng nhau chia sẻ yêu thương, cứu sống cuộc đời.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <GlassButton variant="secondary" size="lg" className="w-full sm:w-auto">
              🩸 Hiến máu ngay
            </GlassButton>
            <GlassButton variant="default" size="lg" className="w-full sm:w-auto">
              📍 Tìm trung tâm
            </GlassButton>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <GlassCard className="text-center p-4">
              <h3 className="text-2xl font-bold text-red-600 mb-1">1,200+</h3>
              <p className="text-sm text-muted-foreground">Người hiến máu</p>
            </GlassCard>
            <GlassCard className="text-center p-4">
              <h3 className="text-2xl font-bold text-yellow-600 mb-1">45</h3>
              <p className="text-sm text-muted-foreground">Trung tâm y tế</p>
            </GlassCard>
            <GlassCard className="text-center p-4">
              <h3 className="text-2xl font-bold text-primary mb-1">2,800+</h3>
              <p className="text-sm text-muted-foreground">Đơn vị máu</p>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
