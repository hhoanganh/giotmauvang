import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { GlassButton } from '@/components/ui/glass-button';
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

const AdminNews: React.FC = () => {
  const { profile } = useAuth();
  const isAdmin = profile?.primary_role === 'system_admin';
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<NewsArticle | null>(null);
  const [form, setForm] = useState<Partial<NewsArticle>>({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) fetchArticles();
    // eslint-disable-next-line
  }, [isAdmin]);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('id, title, content, excerpt, image_url, category, published_at')
        .order('published_at', { ascending: false });
      if (error) setError('Không thể tải tin tức.');
      else setArticles(data || []);
    } catch (err) {
      setError('Có lỗi xảy ra khi tải tin tức.');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', content: '', excerpt: '', image_url: '', category: '', published_at: '' });
    setShowModal(true);
  };

  const openEdit = (article: NewsArticle) => {
    setEditing(article);
    setForm({ ...article });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (!form.title || !form.content) throw new Error('Tiêu đề và nội dung là bắt buộc.');
      if (editing) {
        // Update
        const { error } = await supabase
          .from('news_articles')
          .update({ ...form })
          .eq('id', editing.id);
        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from('news_articles')
          .insert([{ ...form, status: 'published', published_at: form.published_at || new Date().toISOString() }]);
        if (error) throw error;
      }
      closeModal();
      fetchArticles();
    } catch (err: any) {
      setError('Lỗi khi lưu bài viết: ' + (err.message || err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const { error } = await supabase.from('news_articles').delete().eq('id', id);
      if (error) throw error;
      fetchArticles();
    } catch (err: any) {
      setError('Lỗi khi xóa bài viết: ' + (err.message || err));
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Header />
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">403 - Không có quyền truy cập</h1>
          <p className="text-gray-600">Chỉ quản trị viên mới được phép quản lý tin tức.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/30 to-orange-50/30">
      <Header />
      <main className="section-padding">
        <div className="container-custom max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Quản lý Tin tức</h1>
            <GlassButton variant="primary" onClick={openCreate}>+ Thêm bài viết</GlassButton>
          </div>
          {error && <div className="mb-4 text-red-600">{error}</div>}
          {loading ? (
            <div className="text-gray-400">Đang tải...</div>
          ) : articles.length === 0 ? (
            <div className="text-gray-500">Chưa có bài viết nào.</div>
          ) : (
            <div className="space-y-4">
              {articles.map(article => (
                <div key={article.id} className="bg-white/80 rounded-lg shadow p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getCategoryColor(article.category)}>{article.category || 'Khác'}</Badge>
                      <span className="text-gray-500 text-xs">{article.published_at ? new Date(article.published_at).toLocaleDateString() : ''}</span>
                    </div>
                    <div className="font-semibold text-lg text-gray-900">{article.title}</div>
                    <div className="text-gray-600 text-sm line-clamp-2">{article.excerpt}</div>
                  </div>
                  <div className="flex gap-2 md:flex-col md:gap-2">
                    <GlassButton variant="outline" size="sm" onClick={() => openEdit(article)}>Sửa</GlassButton>
                    <GlassButton variant="destructive" size="sm" onClick={() => handleDelete(article.id)} disabled={deletingId === article.id}>
                      {deletingId === article.id ? 'Đang xóa...' : 'Xóa'}
                    </GlassButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Modal for create/edit */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <form className="bg-white rounded-lg p-8 shadow-lg w-full max-w-lg" onSubmit={handleSave}>
              <h2 className="text-xl font-bold mb-4">{editing ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}</h2>
              <label className="block mb-2 font-medium">Tiêu đề *</label>
              <input className="w-full border rounded px-3 py-2 mb-4" name="title" value={form.title || ''} onChange={handleChange} required />
              <label className="block mb-2 font-medium">Tóm tắt</label>
              <textarea className="w-full border rounded px-3 py-2 mb-4" name="excerpt" value={form.excerpt || ''} onChange={handleChange} />
              <label className="block mb-2 font-medium">Nội dung (Markdown được hỗ trợ) *</label>
              <textarea className="w-full border rounded px-3 py-2 mb-4 min-h-[120px]" name="content" value={form.content || ''} onChange={handleChange} required />
              <label className="block mb-2 font-medium">Ảnh (URL)</label>
              <input className="w-full border rounded px-3 py-2 mb-4" name="image_url" value={form.image_url || ''} onChange={handleChange} />
              <label className="block mb-2 font-medium">Chuyên mục</label>
              <input className="w-full border rounded px-3 py-2 mb-4" name="category" value={form.category || ''} onChange={handleChange} />
              <label className="block mb-2 font-medium">Ngày đăng (yyyy-mm-dd)</label>
              <input className="w-full border rounded px-3 py-2 mb-4" name="published_at" value={form.published_at || ''} onChange={handleChange} type="date" />
              <div className="flex gap-2 mt-4">
                <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700" disabled={saving}>
                  {saving ? 'Đang lưu...' : 'Lưu'}
                </button>
                <button type="button" className="bg-gray-300 text-gray-800 px-4 py-2 rounded font-semibold hover:bg-gray-400" onClick={closeModal} disabled={saving}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminNews; 