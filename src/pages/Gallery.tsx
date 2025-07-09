import React from 'react';
import Header from '@/components/Header';
import { Link } from 'react-router-dom';

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

const Gallery: React.FC = () => {
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {photoGroups.map((group) => (
              <Link
                to={`/gallery/${group.id}`}
                key={group.id}
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
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Gallery; 