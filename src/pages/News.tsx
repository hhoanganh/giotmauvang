import React, { useEffect } from 'react';
import { Header } from '@/components/Header';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';

const News: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const newsArticles = [
    {
      id: 1,
      title: "TP.HCM thiếu hụt máu nhóm O trong dịp Tết",
      excerpt: "Tình trạng thiếu hụt máu nhóm O đang trở nên nghiêm trọng tại các bệnh viện TP.HCM trong dịp Tết Nguyên đán...",
      category: "Tin tức",
      date: "20/12/2024",
      image: "🏥",
      readTime: "3 phút"
    },
    {
      id: 2,
      title: "Công nghệ mới giúp bảo quản máu lâu hơn",
      excerpt: "Các nhà khoa học đã phát triển công nghệ mới giúp bảo quản máu hiến tặng trong thời gian dài hơn...",
      category: "Khoa học",
      date: "18/12/2024",
      image: "🔬",
      readTime: "5 phút"
    },
    {
      id: 3,
      title: "Lễ tôn vinh người hiến máu tiêu biểu 2024",
      excerpt: "Buổi lễ tôn vinh những người hiến máu tiêu biểu đã được tổ chức tại Hà Nội với sự tham gia của hơn 500 người...",
      category: "Sự kiện",
      date: "15/12/2024",
      image: "🏆",
      readTime: "4 phút"
    },
    {
      id: 4,
      title: "Chiến dịch hiến máu tình nguyện tại các trường đại học",
      excerpt: "Hơn 50 trường đại học trên cả nước đã tham gia chiến dịch hiến máu tình nguyện mùa hè 2024...",
      category: "Tin tức",
      date: "12/12/2024",
      image: "🎓",
      readTime: "3 phút"
    },
    {
      id: 5,
      title: "Hướng dẫn mới về quy trình hiến máu an toàn",
      excerpt: "Bộ Y tế vừa ban hành hướng dẫn mới về quy trình hiến máu an toàn với nhiều cải tiến quan trọng...",
      category: "Hướng dẫn",
      date: "10/12/2024",
      image: "📋",
      readTime: "6 phút"
    },
    {
      id: 6,
      title: "Thành lập trung tâm hiến máu mới tại Đà Nẵng",
      excerpt: "Trung tâm hiến máu mới với công nghệ hiện đại đã được khánh thành tại Đà Nẵng...",
      category: "Tin tức",
      date: "08/12/2024",
      image: "🏢",
      readTime: "3 phút"
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Tin tức":
        return "bg-blue-100 text-blue-600";
      case "Khoa học":
        return "bg-purple-100 text-purple-600";
      case "Sự kiện":
        return "bg-green-100 text-green-600";
      case "Hướng dẫn":
        return "bg-orange-100 text-orange-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/30 to-orange-50/30">
      <Header />
      <main className="section-padding">
        <div className="container-custom">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Tin Tức & Bài Viết
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cập nhật những tin tức mới nhất về hoạt động hiến máu và các sự kiện cộng đồng
            </p>
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsArticles.map((article) => (
              <GlassCard key={article.id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="h-32 bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center text-6xl">
                  {article.image}
                </div>
                <GlassCardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getCategoryColor(article.category)}>
                      {article.category}
                    </Badge>
                    <span className="text-sm text-gray-500">{article.readTime}</span>
                  </div>
                  <GlassCardTitle className="text-lg leading-tight">
                    {article.title}
                  </GlassCardTitle>
                  <p className="text-sm text-gray-500">{article.date}</p>
                </GlassCardHeader>
                <GlassCardContent>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {article.excerpt}
                  </p>
                  <button className="text-red-600 hover:text-red-700 font-medium text-sm transition-colors">
                    Đọc tiếp →
                  </button>
                </GlassCardContent>
              </GlassCard>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
              Tải thêm tin tức
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default News; 