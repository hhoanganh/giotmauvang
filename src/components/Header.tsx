
import React from 'react';
import { GlassButton } from '@/components/ui/glass-button';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass-card border-b border-white/20 rounded-none backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-blood rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">🩸</span>
            </div>
            <div>
              <h1 className="text-lg font-inter font-semibold tracking-tight">
                Giọt Máu Vàng
              </h1>
              <p className="text-xs text-muted-foreground">
                Kết nối yêu thương
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <GlassButton variant="default" size="sm">
              Trang chủ
            </GlassButton>
            <GlassButton variant="default" size="sm">
              Sự kiện
            </GlassButton>
            <GlassButton variant="default" size="sm">
              Trung tâm
            </GlassButton>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center gap-2">
            <GlassButton variant="primary" size="sm">
              Đăng ký hiến máu
            </GlassButton>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
