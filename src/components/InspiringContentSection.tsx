
import React from 'react';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle, GlassCardFooter } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Link } from 'react-router-dom';

const InspiringContentSection: React.FC = () => {
  const stories = [
    {
      title: "Em bé được cứu sống nhờ hiến máu kịp thời",
      excerpt: "Câu chuyện cảm động về em bé 6 tháng tuổi được cứu sống nhờ những giọt máu quý giá từ cộng đồng...",
      image: "👶",
      date: "15/12/2024"
    },
    {
      title: "Anh tài xế hiến máu cứu nạn nhân tai nạn",
      excerpt: "Trong tình huống khẩn cấp, anh Minh đã không ngần ngại hiến máu để cứu một nạn nhân tai nạn giao thông...",
      image: "🚑",
      date: "12/12/2024"
    },
    {
      title: "Đại học Y khoa tổ chức ngày hiến máu",
      excerpt: "Hơn 200 sinh viên y khoa đã tham gia hiến máu trong ngày hội hiến máu nhân đạo...",
      image: "🎓",
      date: "08/12/2024"
    }
  ];

  const news = [
    {
      title: "TP.HCM thiếu hụt máu nhóm O trong dịp Tết",
      category: "Tin tức",
      date: "20/12/2024"
    },
    {
      title: "Công nghệ mới giúp bảo quản máu lâu hơn",
      category: "Khoa học",
      date: "18/12/2024"
    },
    {
      title: "Lễ tôn vinh người hiến máu tiêu biểu 2024",
      category: "Sự kiện",
      date: "15/12/2024"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-red-50/30 to-orange-50/30">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Món Quà Của Bạn Cứu Sống Cuộc Đời
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Những câu chuyện cảm động và tin tức về hoạt động hiến máu
          </p>
        </div>

        {/* Success Stories */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Câu Chuyện Cảm Động
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story, index) => (
              <GlassCard key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="h-32 bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center text-6xl">
                  {story.image}
                </div>
                <GlassCardHeader className="pb-4">
                  <GlassCardTitle className="text-lg leading-tight">
                    {story.title}
                  </GlassCardTitle>
                  <p className="text-sm text-gray-500">{story.date}</p>
                </GlassCardHeader>
                <GlassCardContent>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {story.excerpt}
                  </p>
                  <GlassButton variant="ghost" size="sm" className="w-full">
                    Đọc tiếp
                  </GlassButton>
                </GlassCardContent>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* News & Articles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GlassCard variant="with-bottom-button" className="p-8">
            <GlassCardHeader variant="with-bottom-button">
              <GlassCardTitle className="text-2xl mb-4 flex items-center gap-3">
                <span className="text-2xl">📰</span>
                Tin Tức & Bài Viết
              </GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent variant="with-bottom-button">
              <div className="space-y-4">
                {news.map((article, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1 leading-tight">
                          {article.title}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                            {article.category}
                          </span>
                          <span>{article.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCardContent>
            <GlassCardFooter>
              <GlassButton asChild variant="primary" size="md" className="w-full">
                <Link to="/news">
                  Xem tất cả tin tức
                </Link>
              </GlassButton>
            </GlassCardFooter>
          </GlassCard>

          <GlassCard variant="with-bottom-button" className="p-8">
            <GlassCardHeader variant="with-bottom-button">
              <GlassCardTitle className="text-2xl mb-4 flex items-center gap-3">
                <span className="text-2xl">📸</span>
                Thư Viện Ảnh
              </GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent variant="with-bottom-button">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="aspect-square bg-gradient-to-br from-red-100 to-pink-100 rounded-xl flex items-center justify-center text-4xl">
                  🏥
                </div>
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center text-4xl">
                  👥
                </div>
                <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center text-4xl">
                  🩸
                </div>
                <div className="aspect-square bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl flex items-center justify-center text-4xl">
                  ❤️
                </div>
              </div>
              <p className="text-gray-600 text-sm text-center">
                Hình ảnh từ các trung tâm hiến máu và sự kiện cộng đồng
              </p>
            </GlassCardContent>
            <GlassCardFooter>
              <GlassButton variant="primary" size="md" className="w-full">
                Xem thư viện
              </GlassButton>
            </GlassCardFooter>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default InspiringContentSection;
