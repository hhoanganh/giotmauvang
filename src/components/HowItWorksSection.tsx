
import React, { useState } from 'react';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import EligibilityCheckerModal from './EligibilityCheckerModal';

const HowItWorksSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const steps = [
    {
      icon: "📝",
      title: "Đăng ký & Kiểm tra",
      description: "Điền thông tin cá nhân và thực hiện khám sơ bộ",
      time: "15-20 phút"
    },
    {
      icon: "🩸",
      title: "Hiến máu",
      description: "Quá trình hiến máu an toàn với thiết bị y tế hiện đại",
      time: "8-10 phút"
    },
    {
      icon: "🍪",
      title: "Nghỉ ngơi",
      description: "Thư giãn và bổ sung năng lượng sau khi hiến máu",
      time: "10-15 phút"
    },
    {
      icon: "🏆",
      title: "Hoàn thành",
      description: "Nhận giấy chứng nhận và lời cảm ơn từ cộng đồng",
      time: "Tổng: 45-60 phút"
    }
  ];

  const faqs = [
    {
      question: "Hiến máu có đau không?",
      answer: "Kim tiêm hiện đại giúp giảm thiểu cảm giác đau. Hầu hết người hiến máu chỉ cảm thấy một chút khó chịu nhẹ khi kim đâm vào."
    },
    {
      question: "Tôi có thể hiến máu bao lâu một lần?",
      answer: "Người trưởng thành khỏe mạnh có thể hiến máu mỗi 3 tháng một lần (12 tuần). Điều này đảm bảo cơ thể có đủ thời gian phục hồi."
    },
    {
      question: "Có những lợi ích gì khi hiến máu?",
      answer: "Bạn sẽ được khám sức khỏe miễn phí, kiểm tra các chỉ số máu cơ bản, và có cơ hội giúp cứu sống những người khác."
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Quy Trình Hiến Máu
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tìm hiểu quy trình hiến máu an toàn và những thông tin cần biết
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, index) => (
            <GlassCard key={index} className="text-center p-6 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">{step.description}</p>
              <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {step.time}
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <GlassCard className="p-8">
            <GlassCardHeader className="pb-6">
              <GlassCardTitle className="text-2xl mb-4 flex items-center gap-3">
                <span className="text-2xl">✓</span>
                Kiểm Tra Điều Kiện
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
          <GlassCard className="p-8">
            <GlassCardHeader className="pb-6">
              <GlassCardTitle className="text-2xl mb-4 flex items-center gap-3">
                <span className="text-2xl">🛡️</span>
                An Toàn & Bảo Đảm
              </GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <p className="text-gray-600">Thiết bị y tế hiện đại, vô trùng</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <p className="text-gray-600">Đội ngũ y bác sĩ chuyên nghiệp</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <p className="text-gray-600">Tuân thủ tiêu chuẩn y tế quốc tế</p>
              </div>
              <GlassButton variant="default" size="lg" className="w-full mt-6">
                Xem chi tiết an toàn
              </GlassButton>
            </GlassCardContent>
          </GlassCard>

          <GlassCard className="p-8">
            <GlassCardHeader className="pb-6">
              <GlassCardTitle className="text-2xl mb-4 flex items-center gap-3">
                <span className="text-2xl">💝</span>
                Lợi Ích Khi Hiến Máu
              </GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-red-600 text-xl">♥️</span>
                <p className="text-gray-600">Khám sức khỏe miễn phí</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-600 text-xl">♥️</span>
                <p className="text-gray-600">Kiểm tra máu cơ bản</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-600 text-xl">♥️</span>
                <p className="text-gray-600">Cứu sống những người khác</p>
              </div>
              <GlassButton variant="secondary" size="lg" className="w-full mt-6">
                Tìm hiểu thêm
              </GlassButton>
            </GlassCardContent>
          </GlassCard>
        </div>

        {/* FAQ Accordion */}
        <GlassCard className="max-w-4xl mx-auto p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Câu Hỏi Thường Gặp
          </h3>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="text-center mt-8">
            <GlassButton variant="default" size="lg">
              Xem tất cả câu hỏi
            </GlassButton>
          </div>
        </GlassCard>
      </div>

      {/* Eligibility Checker Modal */}
      <EligibilityCheckerModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default HowItWorksSection;
