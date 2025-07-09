import React, { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import { useParams, Link } from 'react-router-dom';
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

const GalleryGroup: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { profile } = useAuth();
  const isAdmin = profile?.primary_role === 'system_admin';
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingGallery, setLoadingGallery] = useState(true);

  // Fetch gallery info
  useEffect(() => {
    const fetchGallery = async () => {
      setLoadingGallery(true);
      const { data, error } = await supabase.from('galleries').select('*').eq('id', groupId).single();
      if (!error && data) setGallery(data);
      else setGallery(null);
      setLoadingGallery(false);
    };
    if (groupId) fetchGallery();
  }, [groupId]);

  // Fetch images for this gallery
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('gallery_id', groupId)
        .order('uploaded_at', { ascending: true });
      if (!error && data) setImages(data);
      else setImages([]);
      setLoading(false);
    };
    if (groupId) fetchImages();
  }, [groupId]);

  const handleUploadClick = () => {
    fileInput.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !gallery) return;
    setError(null);
    setSuccess(null);
    setUploading(true);
    try {
      // 1. Upload to storage
      const filePath = `${gallery.id}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from(BUCKET).upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (uploadError) throw uploadError;
      // 2. Get public URL
      const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
      const publicUrl = publicUrlData?.publicUrl;
      if (!publicUrl) throw new Error('Không lấy được đường dẫn ảnh sau khi upload.');
      // 3. Insert into gallery_images
      const { error: insertError } = await supabase.from('gallery_images').insert([
        {
          gallery_id: gallery.id,
          url: publicUrl,
          uploaded_by: profile?.id, // Set uploaded_by
        },
      ]);
      if (insertError) throw insertError;
      setSuccess('Tải ảnh lên thành công!');
      // 4. Refetch images
      const { data: newImages, error: fetchError } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('gallery_id', gallery.id)
        .order('uploaded_at', { ascending: true });
      if (!fetchError && newImages) setImages(newImages);
    } catch (err: any) {
      setError('Lỗi khi tải ảnh lên: ' + (err.message || err));
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  if (loadingGallery) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50/30 to-orange-50/30">
        <Header />
        <div className="text-center mt-20 text-gray-400">Đang tải album...</div>
      </div>
    );
  }
  if (!gallery) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50/30 to-orange-50/30">
        <Header />
        <div className="text-center mt-20">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Album không tồn tại</h1>
          <Link to="/gallery" className="text-red-600 hover:underline">Quay lại Thư Viện Ảnh</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/30 to-orange-50/30">
      <Header />
      <main className="section-padding">
        <div className="container-custom">
          <div className="mb-8 flex items-center gap-4">
            <Link to="/gallery" className="text-red-600 hover:underline text-sm">← Quay lại Thư Viện Ảnh</Link>
          </div>
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{gallery.title}</h1>
            {gallery.description && <p className="text-gray-600 text-base max-w-2xl mx-auto">{gallery.description}</p>}
            {isAdmin && (
              <div className="mt-6 flex flex-col items-center">
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition-colors text-sm font-semibold disabled:opacity-60"
                  onClick={handleUploadClick}
                  disabled={uploading}
                >
                  {uploading ? 'Đang tải...' : 'Upload Image'}
                </button>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  ref={fileInput}
                  onChange={handleFileChange}
                />
                {error && <div className="mt-2 text-red-600 font-medium">{error}</div>}
                {success && <div className="mt-2 text-green-600 font-medium">{success}</div>}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {!loading && images.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                Chưa có ảnh nào trong album này.
              </div>
            )}
            {loading && (
              <div className="text-center text-gray-400 mt-8">Đang tải ảnh...</div>
            )}
            {images.map((img) => (
              <div key={img.id} className="rounded-xl overflow-hidden bg-white/80 shadow hover:shadow-lg transition-all duration-300 flex flex-col">
                <div className="aspect-[4/3] w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.caption || ''}
                    className="object-cover w-full h-full"
                  />
                </div>
                {img.caption && (
                  <div className="p-3 text-gray-700 text-sm text-center border-t border-gray-100 bg-white/60">
                    {img.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GalleryGroup; 