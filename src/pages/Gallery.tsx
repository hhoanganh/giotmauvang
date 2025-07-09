import React, { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const BUCKET = 'gallery';

type Gallery = {
  id: string;
  title: string;
  description?: string;
  cover_image?: string;
};

type GalleryImage = {
  id: string;
  gallery_id: string;
  url: string;
  caption?: string;
};

const Gallery: React.FC = () => {
  const { profile } = useAuth();
  const isAdmin = profile?.primary_role === 'system_admin';
  const fileInputs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [images, setImages] = useState<{ [galleryId: string]: GalleryImage[] }>({});
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editGallery, setEditGallery] = useState<Gallery | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteGalleryId, setDeleteGalleryId] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCover, setFormCover] = useState<File | null>(null);

  // Fetch all galleries on mount
  const fetchGalleries = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('galleries').select('*').order('created_at', { ascending: false });
    if (error) setError('Lỗi khi tải danh sách album: ' + error.message);
    else setGalleries(data || []);
    setLoading(false);
  };
  useEffect(() => { fetchGalleries(); }, []);

  // Fetch images for each gallery
  useEffect(() => {
    const fetchAllImages = async () => {
      const newImages: { [galleryId: string]: GalleryImage[] } = {};
      for (const gallery of galleries) {
        const { data, error } = await supabase
          .from('gallery_images')
          .select('*')
          .eq('gallery_id', gallery.id)
          .order('uploaded_at', { ascending: true });
        if (!error && data) newImages[gallery.id] = data;
        else newImages[gallery.id] = [];
      }
      setImages(newImages);
    };
    if (galleries.length > 0) fetchAllImages();
  }, [galleries]);

  // Upload image to storage and return public URL
  const uploadImage = async (galleryId: string, file: File) => {
    const filePath = `${galleryId}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (uploadError) throw uploadError;
    const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
    const publicUrl = publicUrlData?.publicUrl;
    if (!publicUrl) throw new Error('Không lấy được đường dẫn ảnh sau khi upload.');
    return publicUrl;
  };

  // Album creation
  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      if (!formTitle.trim()) throw new Error('Tiêu đề album là bắt buộc.');
      let coverUrl = '';
      const newId = formTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
      if (formCover) {
        coverUrl = await uploadImage(newId, formCover);
      }
      const { error: insertError } = await supabase.from('galleries').insert([
        {
          id: newId,
          title: formTitle,
          description: formDescription,
          cover_image: coverUrl,
        },
      ]);
      if (insertError) throw insertError;
      setShowCreateModal(false);
      setFormTitle('');
      setFormDescription('');
      setFormCover(null);
      setSuccess('Tạo album thành công!');
      fetchGalleries();
    } catch (err: any) {
      setError('Lỗi khi tạo album: ' + (err.message || err));
    }
  };

  // Album editing
  const handleEditAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editGallery) return;
    setError(null);
    setSuccess(null);
    try {
      let coverUrl = editGallery.cover_image || '';
      if (formCover) {
        coverUrl = await uploadImage(editGallery.id, formCover);
      }
      const { error: updateError } = await supabase.from('galleries').update({
        title: formTitle,
        description: formDescription,
        cover_image: coverUrl,
      }).eq('id', editGallery.id);
      if (updateError) throw updateError;
      setShowEditModal(false);
      setEditGallery(null);
      setFormTitle('');
      setFormDescription('');
      setFormCover(null);
      setSuccess('Cập nhật album thành công!');
      fetchGalleries();
    } catch (err: any) {
      setError('Lỗi khi cập nhật album: ' + (err.message || err));
    }
  };

  // Album deletion
  const handleDeleteAlbum = async () => {
    if (!deleteGalleryId) return;
    setError(null);
    setSuccess(null);
    try {
      const { error: deleteError } = await supabase.from('galleries').delete().eq('id', deleteGalleryId);
      if (deleteError) throw deleteError;
      setShowDeleteConfirm(false);
      setDeleteGalleryId(null);
      setSuccess('Xóa album thành công!');
      fetchGalleries();
    } catch (err: any) {
      setError('Lỗi khi xóa album: ' + (err.message || err));
    }
  };

  // Image upload for each album
  const handleUploadClick = (galleryId: string) => {
    fileInputs.current[galleryId]?.click();
  };

  const handleFileChange = async (galleryId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setSuccess(null);
    setUploading((prev) => ({ ...prev, [galleryId]: true }));
    try {
      const publicUrl = await uploadImage(galleryId, file);
      const { error: insertError } = await supabase.from('gallery_images').insert([
        {
          gallery_id: galleryId,
          url: publicUrl,
        },
      ]);
      if (insertError) throw insertError;
      setSuccess('Tải ảnh lên thành công!');
      // Refetch images for this gallery
      const { data: newImages, error: fetchError } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('gallery_id', galleryId)
        .order('uploaded_at', { ascending: true });
      if (!fetchError && newImages) {
        setImages((prev) => ({ ...prev, [galleryId]: newImages }));
      }
    } catch (err: any) {
      setError('Lỗi khi tải ảnh lên: ' + (err.message || err));
    } finally {
      setUploading((prev) => ({ ...prev, [galleryId]: false }));
      if (fileInputs.current[galleryId]) fileInputs.current[galleryId]!.value = '';
    }
  };

  // Modal helpers
  const openEditModal = (gallery: Gallery) => {
    setEditGallery(gallery);
    setFormTitle(gallery.title);
    setFormDescription(gallery.description || '');
    setFormCover(null);
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/30 to-orange-50/30">
      <Header />
      <main className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Thư Viện Ảnh
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Khám phá các album ảnh từ sự kiện và trung tâm hiến máu
            </p>
            {error && <div className="mt-4 text-red-600 font-medium">{error}</div>}
            {success && <div className="mt-4 text-green-600 font-medium">{success}</div>}
            {isAdmin && (
              <button
                className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg font-semibold shadow hover:bg-red-700 transition-colors"
                onClick={() => {
                  setShowCreateModal(true);
                  setFormTitle('');
                  setFormDescription('');
                  setFormCover(null);
                }}
              >
                + Tạo album mới
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleries.map((gallery) => (
              <div key={gallery.id} className="relative group">
                <Link
                  to={`/gallery/${gallery.id}`}
                  className="block rounded-xl overflow-hidden shadow-lg bg-white/70 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="aspect-[4/3] w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={gallery.cover_image || (images[gallery.id]?.[0]?.url ?? '')}
                      alt={gallery.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {gallery.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {gallery.description}
                    </p>
                    <span className="inline-block px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                      {(images[gallery.id]?.length ?? 0)} ảnh
                    </span>
                  </div>
                </Link>
                {isAdmin && (
                  <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                    <button
                      className="bg-blue-600 text-white px-2 py-1 rounded shadow hover:bg-blue-700 text-xs font-semibold"
                      onClick={() => openEditModal(gallery)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-gray-600 text-white px-2 py-1 rounded shadow hover:bg-gray-700 text-xs font-semibold"
                      onClick={() => {
                        setDeleteGalleryId(gallery.id);
                        setShowDeleteConfirm(true);
                      }}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded shadow hover:bg-red-700 text-xs font-semibold disabled:opacity-60"
                      onClick={() => handleUploadClick(gallery.id)}
                      disabled={uploading[gallery.id]}
                    >
                      {uploading[gallery.id] ? 'Đang tải...' : 'Upload Image'}
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      ref={el => (fileInputs.current[gallery.id] = el)}
                      onChange={e => handleFileChange(gallery.id, e)}
                    />
                  </div>
                )}
                {/* Removed image grid from album card on /gallery */}
              </div>
            ))}
          </div>
          {!loading && galleries.length === 0 && !error && (
            <div className="text-center text-gray-500 mt-8">
              Chưa có album nào. {isAdmin && "Hãy tạo album mới!"}
            </div>
          )}
          {loading && (
            <div className="text-center text-gray-400 mt-8">Đang tải dữ liệu...</div>
          )}
        </div>
        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <form
              className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md"
              onSubmit={handleCreateAlbum}
            >
              <h2 className="text-xl font-bold mb-4">Tạo album mới</h2>
              <label className="block mb-2 font-medium">Tiêu đề *</label>
              <input
                className="w-full border rounded px-3 py-2 mb-4"
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
                required
              />
              <label className="block mb-2 font-medium">Mô tả</label>
              <textarea
                className="w-full border rounded px-3 py-2 mb-4"
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
              />
              <label className="block mb-2 font-medium">Ảnh bìa</label>
              <input
                type="file"
                accept="image/*"
                className="mb-4"
                onChange={e => setFormCover(e.target.files?.[0] || null)}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700"
                >
                  Tạo album
                </button>
                <button
                  type="button"
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded font-semibold hover:bg-gray-400"
                  onClick={() => setShowCreateModal(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}
        {/* Edit Modal */}
        {showEditModal && editGallery && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <form
              className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md"
              onSubmit={handleEditAlbum}
            >
              <h2 className="text-xl font-bold mb-4">Chỉnh sửa album</h2>
              <label className="block mb-2 font-medium">Tiêu đề *</label>
              <input
                className="w-full border rounded px-3 py-2 mb-4"
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
                required
              />
              <label className="block mb-2 font-medium">Mô tả</label>
              <textarea
                className="w-full border rounded px-3 py-2 mb-4"
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
              />
              <label className="block mb-2 font-medium">Ảnh bìa (chọn để thay đổi)</label>
              <input
                type="file"
                accept="image/*"
                className="mb-4"
                onChange={e => setFormCover(e.target.files?.[0] || null)}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
                >
                  Lưu thay đổi
                </button>
                <button
                  type="button"
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded font-semibold hover:bg-gray-400"
                  onClick={() => setShowEditModal(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}
        {/* Delete Confirm */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md text-center">
              <h2 className="text-xl font-bold mb-4">Xóa album?</h2>
              <p className="mb-6">Bạn có chắc chắn muốn xóa album này? Tất cả ảnh trong album cũng sẽ bị xóa.</p>
              <div className="flex gap-2 justify-center">
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700"
                  onClick={handleDeleteAlbum}
                >
                  Xóa
                </button>
                <button
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded font-semibold hover:bg-gray-400"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Gallery; 