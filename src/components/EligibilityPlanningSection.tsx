import React, { useState } from 'react';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import EligibilityCheckerModal from './EligibilityCheckerModal';

const EligibilityPlanningSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

        <div className="max-w-2xl mx-auto">
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
              <GlassButton 
                variant="primary" 
                size="lg" 
                className="w-full"
                onClick={() => setIsModalOpen(true)}
              >
                Bắt đầu kiểm tra
              </GlassButton>
            </GlassCardContent>
          </GlassCard>
        </div>
      </div>

      {/* Eligibility Checker Modal */}
      <EligibilityCheckerModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default EligibilityPlanningSection;
