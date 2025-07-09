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

  // Fetch all galleries on mount
  useEffect(() => {
    const fetchGalleries = async () => {
      const { data, error } = await supabase.from('galleries').select('*').order('created_at', { ascending: false });
      if (error) setError('Lỗi khi tải danh sách album: ' + error.message);
      else setGalleries(data || []);
    };
    fetchGalleries();
  }, []);

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
      // 1. Upload to storage
      const filePath = `${galleryId}/${Date.now()}_${file.name}`;
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
          gallery_id: galleryId,
          url: publicUrl,
        },
      ]);
      if (insertError) throw insertError;
      setSuccess('Tải ảnh lên thành công!');
      // 4. Refetch images for this gallery
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
            <div className="text-xs text-gray-400 mt-2">Debug: profile?.primary_role = {profile?.primary_role?.toString() ?? 'null'}, isAdmin = {isAdmin ? 'true' : 'false'}</div>
            {error && <div className="mt-4 text-red-600 font-medium">{error}</div>}
            {success && <div className="mt-4 text-green-600 font-medium">{success}</div>}
            {isAdmin && (
              <button
                className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg font-semibold shadow hover:bg-red-700 transition-colors"
                onClick={() => {
                  // setShowCreateModal(true); // This state is not defined in the original file
                  // setFormTitle(''); // This state is not defined in the original file
                  // setFormDescription(''); // This state is not defined in the original file
                  // setFormCover(null); // This state is not defined in the original file
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
                  <>
                    <button
                      className="absolute top-3 right-3 z-10 bg-red-600 text-white px-3 py-1 rounded shadow hover:bg-red-700 transition-colors text-xs font-semibold disabled:opacity-60"
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
                  </>
                )}
                {/* Show images for this album */}
                {images[gallery.id] && images[gallery.id].length > 0 && (
                  <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                    {images[gallery.id].map((img) => (
                      <img
                        key={img.id}
                        src={img.url}
                        alt={img.caption || ''}
                        className="rounded-lg object-cover w-full h-32"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {galleries.length === 0 && !error && (
            <div className="text-center text-gray-500 mt-8">
              Chưa có album nào. {isAdmin && "Hãy tạo album mới!"}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Gallery; 