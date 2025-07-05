
import React from 'react';
import { GlassButton } from '@/components/ui/glass-button';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200/50">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">🩸</span>
            </div>
            <div>
              <h1 className="text-lg font-inter font-semibold text-gray-900 tracking-tight">
                Giọt Máu Vàng
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Kết nối yêu thương
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <GlassButton variant="ghost" size="sm">
              Trang chủ
            </GlassButton>
            <GlassButton variant="ghost" size="sm">
              Sự kiện
            </GlassButton>
            <GlassButton variant="ghost" size="sm">
              Trung tâm
            </GlassButton>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center gap-2">
            <GlassButton variant="primary" size="sm" className="hidden sm:flex">
              Đăng nhập
            </GlassButton>
            <GlassButton variant="primary" size="sm" className="sm:hidden">
              Đăng nhập
            </GlassButton>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
