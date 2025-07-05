
import React from 'react';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';

const EligibilityPlanningSection: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Bạn Có Đủ Điều Kiện Hiến Máu?
          </h2>
          <p className="text-lg text-gray-600">
            Kiểm tra nhanh tính đủ điều kiện và lên kế hoạch cho cuộc hẹn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GlassCard className="text-center p-8 hover:shadow-xl transition-all duration-300">
            <GlassCardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
              <GlassCardTitle className="text-xl mb-4">
                Kiểm tra điều kiện
              </GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Thực hiện bài kiểm tra nhanh và ẩn danh để xác định bạn có đủ điều kiện hiến máu hay không
              </p>
              <GlassButton variant="primary" size="lg" className="w-full">
                Bắt đầu kiểm tra
              </GlassButton>
            </GlassCardContent>
          </GlassCard>

          <GlassCard className="text-center p-8 hover:shadow-xl transition-all duration-300">
            <GlassCardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">⏰</span>
              </div>
              <GlassCardTitle className="text-xl mb-4">
                Thời gian cần thiết
              </GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Đăng ký & khám sơ bộ:</span>
                  <span className="font-semibold">15-20 phút</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Hiến máu:</span>
                  <span className="font-semibold">8-10 phút</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Nghỉ ngơi & ăn nhẹ:</span>
                  <span className="font-semibold">10-15 phút</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Tổng thời gian:</span>
                  <span className="text-red-600">45-60 phút</span>
                </div>
              </div>
              <GlassButton variant="default" size="md" className="w-full">
                Xem chi tiết
              </GlassButton>
            </GlassCardContent>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default EligibilityPlanningSection;
