
import React, { useEffect, useState } from 'react';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle, GlassCardFooter } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import NewsModal from './NewsModal';

type GalleryImage = {
  id: string;
  url: string;
  caption?: string;
};

type NewsArticle = {
  id: string;
  title: string;
  excerpt: string | null;
  image_url: string | null;
  category: string | null;
  published_at: string | null;
  type: string | null;
};

const InspiringContentSection: React.FC = () => {
  const [latestImages, setLatestImages] = useState<GalleryImage[]>([]);
  const [latestArticles, setLatestArticles] = useState<NewsArticle[]>([]);
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestImages = async () => {
      try {
        const { data, error } = await supabase
          .from('gallery_images')
          .select('id, url, caption')
          .order('uploaded_at', { ascending: false })
          .limit(4);
        
        if (error) {
          console.error('Error fetching gallery images:', error);
          setLatestImages([]);
        } else {
          setLatestImages(data || []);
        }
      } catch (err) {
        console.error('Unexpected error fetching gallery images:', err);
        setLatestImages([]);
      }
    };
    fetchLatestImages();
  }, []);

  useEffect(() => {
    const fetchLatestArticles = async () => {
      setIsLoadingArticles(true);
      try {
        console.log('Fetching stories from Supabase...');
        
        const { data, error } = await supabase
          .from('news_articles')
          .select('id, title, excerpt, image_url, category, published_at, type')
          .eq('status', 'published')
          .eq('type', 'story')
          .order('published_at', { ascending: false })
          .limit(3);
        
        if (error) {
          console.error('Supabase error fetching stories:', error);
          setLatestArticles([]);
        } else {
          console.log('Stories fetched successfully:', data);
          setLatestArticles(data || []);
        }
      } catch (err) {
        console.error('Unexpected error fetching stories:', err);
        setLatestArticles([]);
      } finally {
        setIsLoadingArticles(false);
      }
    };

    fetchLatestArticles();
  }, []);

  useEffect(() => {
    const fetchLatestNews = async () => {
      setIsLoadingNews(true);
      try {
        console.log('Fetching news from Supabase...');
        
        const { data, error } = await supabase
          .from('news_articles')
          .select('id, title, excerpt, image_url, category, published_at, type')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(6);
        
        if (error) {
          console.error('Supabase error fetching news:', error);
          setLatestNews([]);
        } else {
          console.log('News fetched successfully:', data);
          setLatestNews(data || []);
        }
      } catch (err) {
        console.error('Unexpected error fetching news:', err);
        setLatestNews([]);
      } finally {
        setIsLoadingNews(false);
      }
    };

    fetchLatestNews();
  }, []);

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case "news":
        return "bg-blue-100 text-blue-600";
      case "story":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const handleArticleClick = (articleId: string) => {
    setSelectedArticleId(articleId);
    setIsModalOpen(true);
    // Scroll to top of modal for better UX
    setTimeout(() => {
      const modalContent = document.querySelector('.modal-scrollbar');
      if (modalContent) {
        modalContent.scrollTop = 0;
      }
    }, 100);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticleId(null);
  };



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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingArticles ? (
              // Loading skeleton
              Array.from({ length: 2 }).map((_, index) => (
                <GlassCard key={index} className="overflow-hidden">
                  <div className="h-32 bg-gray-200 animate-pulse"></div>
                  <GlassCardHeader className="pb-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  </GlassCardHeader>
                  <GlassCardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    </div>
                  </GlassCardContent>
                </GlassCard>
              ))
            ) : latestArticles.length > 0 ? (
              latestArticles.map((article, index) => (
                <GlassCard key={article.id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="h-32 bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center overflow-hidden">
                    {article.image_url ? (
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl">
                        {article.type === 'story' ? '📖' : '📰'}
                      </span>
                    )}
                  </div>
                  <GlassCardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                        {article.category === 'story' ? 'Câu chuyện' : 'Tin tức'}
                      </span>
                      <span className="text-sm text-gray-500">{formatDate(article.published_at)}</span>
                    </div>
                    <GlassCardTitle className="text-lg leading-tight">
                      {article.title}
                    </GlassCardTitle>
                  </GlassCardHeader>
                  <GlassCardContent>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {article.excerpt || 'Không có tóm tắt...'}
                    </p>
                    <Link to={`/news/${article.id}`}>
                      <GlassButton variant="ghost" size="sm" className="w-full">
                        Đọc tiếp
                      </GlassButton>
                    </Link>
                  </GlassCardContent>
                </GlassCard>
              ))
            ) : (
              // Empty state
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Chưa có tin tức nào được đăng tải.</p>
              </div>
            )}
          </div>
        </div>

        {/* News & Articles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GlassCard variant="with-bottom-button" className="p-6">
            <GlassCardHeader variant="with-bottom-button">
              <GlassCardTitle className="text-2xl mb-4 flex items-center gap-3">
                <span className="text-2xl">📰</span>
                Tin Tức & Bài Viết
              </GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent variant="with-bottom-button">
              <div className="space-y-4">
                {isLoadingNews ? (
                  // Loading skeleton for news list
                  Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3"></div>
                    </div>
                  ))
                ) : latestNews.length > 0 ? (
                  latestNews.map((article, index) => (
                    <div key={article.id} className="border-b border-gray-100 last:border-b-0 pb-3 last:pb-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <button
                            onClick={() => handleArticleClick(article.id)}
                            className="text-left w-full"
                          >
                            <h4 className="font-medium text-gray-900 mb-1 leading-tight hover:text-red-600 transition-colors cursor-pointer">
                              {article.title}
                            </h4>
                          </button>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(article.category)}`}>
                              {article.category === 'story' ? 'Câu chuyện' : 'Tin tức'}
                            </span>
                            <span>{formatDate(article.published_at)}</span>
                          </div>
                        </div>
                        <GlassButton
                          onClick={() => handleArticleClick(article.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          Đọc tiếp
                        </GlassButton>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">Chưa có tin tức nào.</p>
                )}
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

          <GlassCard variant="with-bottom-button" className="p-6">
            <GlassCardHeader variant="with-bottom-button">
              <GlassCardTitle className="text-2xl mb-4 flex items-center gap-3">
                <span className="text-2xl">📸</span>
                Thư Viện Ảnh
              </GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent variant="with-bottom-button">
              <div className="grid grid-cols-2 gap-4 mb-6">
                {latestImages.length > 0
                  ? latestImages.map((img, idx) => (
                      <div
                        key={img.id}
                        className="aspect-square bg-gradient-to-br from-red-100 to-pink-100 rounded-xl flex items-center justify-center overflow-hidden"
                      >
                        <img
                          src={img.url}
                          alt={img.caption || `Ảnh ${idx + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))
                  : [1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-4xl text-gray-300"
                      >
                        🖼️
                      </div>
                    ))}
              </div>
              <p className="text-gray-600 text-sm text-center">
                Hình ảnh từ các trung tâm hiến máu và sự kiện cộng đồng
              </p>
            </GlassCardContent>
            <GlassCardFooter>
              <GlassButton asChild variant="primary" size="md" className="w-full">
                <Link to="/gallery">
                  Xem thư viện
                </Link>
              </GlassButton>
            </GlassCardFooter>
          </GlassCard>
        </div>
      </div>

      {/* News Modal */}
      <NewsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        articleId={selectedArticleId}
      />
    </section>
  );
};

export default InspiringContentSection;
