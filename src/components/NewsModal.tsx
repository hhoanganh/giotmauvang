import React, { useEffect, useState } from 'react';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-button';
import { supabase } from '@/integrations/supabase/client';

interface NewsArticle {
  id: string;
  title: string;
  content: string | null;
  excerpt: string | null;
  image_url: string | null;
  category: string | null;
  published_at: string | null;
  type: string | null;
}

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleId: string | null;
}

const NewsModal: React.FC<NewsModalProps> = ({ 
  isOpen, 
  onClose, 
  articleId
}) => {
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && articleId) {
      fetchArticle();
    }
  }, [isOpen, articleId]);

  const fetchArticle = async () => {
    if (!articleId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('id, title, content, excerpt, image_url, category, published_at, type')
        .eq('id', articleId)
        .eq('status', 'published')
        .single();

      if (error) {
        setError('Không thể tải bài viết.');
        setArticle(null);
      } else {
        setArticle(data);
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tải bài viết.');
      setArticle(null);
    } finally {
      setLoading(false);
    }
  };

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
      case 'story':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getCategoryLabel = (category: string | null, type: string | null) => {
    if (type === 'story') return 'Câu chuyện';
    if (category === 'story') return 'Câu chuyện';
    return category || 'Tin tức';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 backdrop-enter"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden modal-enter modal-mobile">
        {/* Header */}
        <div className="flex items-center p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {article?.type === 'story' ? '📖' : '📰'}
            </span>
            <h2 className="text-xl font-semibold text-gray-900">
              {loading ? 'Đang tải...' : article?.title || 'Bài viết'}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] modal-scrollbar">
          {loading ? (
            <div className="p-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <GlassButton onClick={fetchArticle} variant="primary">
                Thử lại
              </GlassButton>
            </div>
          ) : article ? (
            <div className="p-6">
              {/* Article Image */}
              {article.image_url && (
                <div className="mb-6">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-64 object-cover rounded-xl"
                  />
                </div>
              )}

              {/* Article Meta */}
              <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(article.published_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                    {getCategoryLabel(article.category, article.type)}
                  </span>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                {article.content ? (
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                ) : (
                  <div className="text-gray-700 leading-relaxed">
                    {article.excerpt || 'Nội dung bài viết đang được cập nhật...'}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-center mt-8 pt-6 border-t border-gray-100">
                <GlassButton 
                  onClick={onClose} 
                  variant="ghost"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại
                </GlassButton>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">Không tìm thấy bài viết.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsModal; 