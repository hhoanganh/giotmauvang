
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

// Define the type for news articles (no read_time)
interface NewsArticle {
  id: string;
  title: string;
  excerpt: string | null;
  image_url: string | null;
  category: string | null;
  published_at: string | null;
}

const News: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('news_articles')
          .select('id, title, excerpt, image_url, category, published_at') // removed read_time
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(12);
        if (error) {
          setError('Không thể tải tin tức.');
          setArticles([]);
        } else {
          setArticles(data || []);
        }
      } catch (err) {
        setError('Có lỗi xảy ra khi tải tin tức.');
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case 'Tin tức':
        return 'bg-blue-100 text-blue-600';
      case 'Khoa học':
        return 'bg-purple-100 text-purple-600';
      case 'Sự kiện':
        return 'bg-green-100 text-green-600';
      case 'Hướng dẫn':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Optional: Calculate estimated read time from excerpt/content length
  // function estimateReadTime(text: string) {
  //   const words = text.split(/\s+/).length;
  //   const minutes = Math.ceil(words / 200); // 200 words per minute
  //   return `${minutes} phút`;
  // }

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
            {loading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <GlassCard key={idx} className="overflow-hidden animate-pulse">
                  <div className="h-32 bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center text-6xl" />
                  <GlassCardHeader className="pb-4">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </GlassCardHeader>
                  <GlassCardContent>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </GlassCardContent>
                </GlassCard>
              ))
            ) : error ? (
              <div className="col-span-full text-center py-12">
                <p className="text-red-500">{error}</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Chưa có tin tức nào được đăng tải.</p>
              </div>
            ) : (
              articles.map((article) => (
                <GlassCard key={article.id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="h-32 bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center text-6xl">
                    {article.image_url ? (
                      <img src={article.image_url} alt={article.title} className="h-24 w-24 object-cover rounded" />
                    ) : (
                      <span role="img" aria-label="news">📰</span>
                    )}
                  </div>
                  <GlassCardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getCategoryColor(article.category)}>
                        {article.category || 'Khác'}
                      </Badge>
                      {/* Optionally show estimated read time here */}
                      {/* <span className="text-sm text-gray-500">{estimateReadTime(article.excerpt || '')}</span> */}
                    </div>
                    <GlassCardTitle className="text-lg leading-tight">
                      {article.title}
                    </GlassCardTitle>
                    <p className="text-sm text-gray-500">{article.published_at ? new Date(article.published_at).toLocaleDateString() : ''}</p>
                  </GlassCardHeader>
                  <GlassCardContent>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {article.excerpt}
                    </p>
                    <Link to={`/news/${article.id}`}>
                      <button className="text-red-600 hover:text-red-700 font-medium text-sm transition-colors">
                        Đọc tiếp →
                      </button>
                    </Link>
                  </GlassCardContent>
                </GlassCard>
              ))
            )}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium" disabled={loading}>
              Tải thêm tin tức
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default News;
