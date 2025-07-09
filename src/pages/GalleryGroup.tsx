import React from 'react';
import Header from '@/components/Header';
import { useParams, Link } from 'react-router-dom';

const photoGroups = [
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

const GalleryGroup: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const group = photoGroups.find((g) => g.id === groupId);

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