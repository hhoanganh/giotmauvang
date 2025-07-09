import React, { useRef, useState } from 'react';
import Header from '@/components/Header';
import { Link } from 'react-router-dom';
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

const Gallery: React.FC = () => {
  const { profile } = useAuth();
  const isAdmin = profile?.primary_role === 'system_admin';
  const fileInputs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [photoGroups, setPhotoGroups] = useState(initialPhotoGroups);
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleUploadClick = (groupId: string) => {
    fileInputs.current[groupId]?.click();
  };

  const handleFileChange = async (groupId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setSuccess(null);
    setUploading((prev) => ({ ...prev, [groupId]: true }));
    try {
      const filePath = `${groupId}/${Date.now()}_${file.name}`;
      console.log('Uploading to bucket:', BUCKET, 'filePath:', filePath, 'file:', file);
      const { data, error: uploadError } = await supabase.storage.from(BUCKET).upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });
      console.log('Upload response:', data, uploadError);
      if (uploadError) {
        setError('Upload failed: ' + uploadError.message);
        setUploading((prev) => ({ ...prev, [groupId]: false }));
        return;
      }
      if (!data) {
        setError('Upload failed: No data returned.');
        setUploading((prev) => ({ ...prev, [groupId]: false }));
        return;
      }
      const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
      const publicUrl = publicUrlData?.publicUrl;
      console.log('Public URL:', publicUrl);
      if (!publicUrl) {
        setError('Không lấy được đường dẫn ảnh sau khi upload.');
        setUploading((prev) => ({ ...prev, [groupId]: false }));
        return;
      }
      setPhotoGroups((prev) => prev.map(group =>
        group.id === groupId
          ? { ...group, images: [...group.images, { url: publicUrl }] }
          : group
      ));
      setSuccess('Tải ảnh lên thành công!');
    } catch (err: any) {
      setError('Lỗi khi tải ảnh lên: ' + (err.message || err));
    } finally {
      setUploading((prev) => ({ ...prev, [groupId]: false }));
      if (fileInputs.current[groupId]) fileInputs.current[groupId]!.value = '';
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
            {error && <div className="mt-4 text-red-600 font-medium">{error}</div>}
            {success && <div className="mt-4 text-green-600 font-medium">{success}</div>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {photoGroups.map((group) => (
              <div key={group.id} className="relative group">
                <Link
                  to={`/gallery/${group.id}`}
                  className="block rounded-xl overflow-hidden shadow-lg bg-white/70 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="aspect-[4/3] w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={group.coverImage}
                      alt={group.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {group.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {group.description}
                    </p>
                    <span className="inline-block px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                      {group.images.length} ảnh
                    </span>
                  </div>
                </Link>
                {isAdmin && (
                  <>
                    <button
                      className="absolute top-3 right-3 z-10 bg-red-600 text-white px-3 py-1 rounded shadow hover:bg-red-700 transition-colors text-xs font-semibold disabled:opacity-60"
                      onClick={() => handleUploadClick(group.id)}
                      disabled={uploading[group.id]}
                    >
                      {uploading[group.id] ? 'Đang tải...' : 'Upload Image'}
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      ref={el => (fileInputs.current[group.id] = el)}
                      onChange={e => handleFileChange(group.id, e)}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Gallery; 