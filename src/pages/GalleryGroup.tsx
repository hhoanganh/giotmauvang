import React, { useRef, useState } from 'react';
import Header from '@/components/Header';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const initialPhotoGroups = [
  {
    id: 'event2024',
    title: 'Ngày hội hiến máu 2024',
    description: 'Ảnh từ sự kiện hiến máu lớn nhất năm.',
    coverImage: 'https://jduhcsgsf4.ufs.sh/f/YxhhsvmLP58IfRVfiTQCZL1vjJPsN8YhdTz4uBo3qfwpgkVr',
    images: [
      { url: 'https://jduhcsgsf4.ufs.sh/f/YxhhsvmLP58IfRVfiTQCZL1vjJPsN8YhdTz4uBo3qfwpgkVr', caption: 'Khai mạc sự kiện' },
      { url: 'https://example.com/images/event2024/2.jpg', caption: 'Người hiến máu' }
    ]
  },
  {
    id: 'center1',
    title: 'Trung tâm hiến máu Quận 1',
    description: 'Hình ảnh trung tâm hiện đại.',
    coverImage: 'https://example.com/images/center1/cover.jpg',
    images: [
      { url: 'https://example.com/images/center1/1.jpg' },
      { url: 'https://example.com/images/center1/2.jpg' }
    ]
  }
];

const BUCKET = 'gallery';

const GalleryGroup: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { profile } = useAuth();
  const isAdmin = profile?.primary_role === 'system_admin';
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [photoGroups, setPhotoGroups] = useState(initialPhotoGroups);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const group = photoGroups.find((g) => g.id === groupId);

  const handleUploadClick = () => {
    fileInput.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !group) return;
    setError(null);
    setSuccess(null);
    setUploading(true);
    try {
      const filePath = `${group.id}/${Date.now()}_${file.name}`;
      const { data, error: uploadError } = await supabase.storage.from(BUCKET).upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (uploadError) throw uploadError;
      const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
      const publicUrl = publicUrlData?.publicUrl;
      if (!publicUrl) throw new Error('Không lấy được đường dẫn ảnh sau khi upload.');
      setPhotoGroups((prev) => prev.map(g =>
        g.id === group.id
          ? { ...g, images: [...g.images, { url: publicUrl }] }
          : g
      ));
      setSuccess('Tải ảnh lên thành công!');
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải ảnh lên.');
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  if (!group) {
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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{group.title}</h1>
            {group.description && <p className="text-gray-600 text-base max-w-2xl mx-auto">{group.description}</p>}
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
            {group.images.map((img, idx) => (
              <div key={idx} className="rounded-xl overflow-hidden bg-white/80 shadow hover:shadow-lg transition-all duration-300 flex flex-col">
                <div className="aspect-[4/3] w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.caption || `Ảnh ${idx + 1}`}
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