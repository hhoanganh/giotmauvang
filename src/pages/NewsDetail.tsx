import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

interface NewsArticle {
  id: string;
  title: string;
  content: string | null;
  excerpt: string | null;
  image_url: string | null;
  category: string | null;
  published_at: string | null;
}

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

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('news_articles')
          .select('id, title, content, excerpt, image_url, category, published_at')
          .eq('id', id)
          .single();
        if (error || !data) {
          setError('Không tìm thấy bài viết.');
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
    if (id) fetchArticle();
  }, [id]);

  // Render content as paragraphs
  const renderContent = (content: string | null) => {
    if (!content) return null;
    return content.split(/\n{2,}/).map((para, idx) => (
      <p key={idx} className="mb-4 text-gray-800 leading-relaxed whitespace-pre-line">{para}</p>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/30 to-orange-50/30">
      <Header />
      <main className="section-padding">
        <div className="container-custom max-w-2xl mx-auto">
          <Link to="/news" className="text-red-600 hover:underline text-sm mb-6 inline-block">← Quay lại Tin tức</Link>
          {loading ? (
            <div className="text-center py-24 text-gray-400">Đang tải bài viết...</div>
          ) : error ? (
            <div className="text-center py-24 text-red-500">{error}</div>
          ) : article ? (
            <article>
              {article.image_url && (
                <img src={article.image_url} alt={article.title} className="w-full h-64 object-cover rounded-lg mb-6" />
              )}
              <div className="flex items-center gap-3 mb-2">
                <Badge className={getCategoryColor(article.category)}>{article.category || 'Khác'}</Badge>
                <span className="text-gray-500 text-sm">{article.published_at ? new Date(article.published_at).toLocaleDateString() : ''}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
              <div className="prose prose-lg max-w-none">
                {renderContent(article.content)}
              </div>
            </article>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default NewsDetail; 