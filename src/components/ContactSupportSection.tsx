
import React from 'react';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';

const ContactSupportSection: React.FC = () => {
  const contacts = [
    {
      icon: "📞",
      title: "Hotline 24/7",
      info: "1900 1234",
      description: "Hỗ trợ tư vấn và đăng ký hiến máu"
    },
    {
      icon: "📧",
      title: "Email",
      info: "hotro@giotmauvang.vn",
      description: "Gửi câu hỏi và phản hồi của bạn"
    },
    {
      icon: "📍",
      title: "Văn phòng chính",
      info: "123 Nguyễn Huệ, Quận 1, TP.HCM",
      description: "Thứ 2 - Thứ 6: 8:00 - 17:00"
    },
    {
      icon: "💬",
      title: "Chat trực tuyến",
      info: "Chatbot hỗ trợ",
      description: "Trả lời tự động 24/7"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Liên Hệ & Hỗ Trợ
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi
          </p>
        </div>

        <div className="homepage-grid-4-centered mb-12">
          {contacts.map((contact, index) => (
            <GlassCard key={index} className="text-center p-6 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl mb-4">{contact.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{contact.title}</h3>
              <p className="text-red-600 font-medium mb-2">{contact.info}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{contact.description}</p>
            </GlassCard>
          ))}
        </div>

        {/* Emergency Contact */}
        <GlassCard className="w-full max-w-none p-8 text-center bg-gradient-to-r from-red-50 to-orange-50">
          <GlassCardHeader>
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl text-white">🚨</span>
            </div>
            <GlassCardTitle className="text-2xl text-red-600 mb-4">
              Trường Hợp Khẩn Cấp
            </GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Nếu bạn cần hỗ trợ khẩn cấp về hiến máu hoặc có tình huống y tế cần máu gấp, 
              vui lòng liên hệ ngay với chúng tôi
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GlassButton variant="primary" size="lg" className="min-w-[200px]">
                📞 Gọi khẩn cấp
              </GlassButton>
              <GlassButton variant="secondary" size="lg" className="min-w-[200px]">
                💬 Chat ngay
              </GlassButton>
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>
    </section>
  );
};

export default ContactSupportSection;
