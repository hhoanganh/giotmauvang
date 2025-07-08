import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { GlassCard, GlassCardHeader, GlassCardContent } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';

const events = [
  {
    id: '1',
    title: 'Ngày hội hiến máu nhân đạo',
    location: 'Trung tâm Hội nghị Quốc gia',
    date: '20/04/2024',
    image: 'https://images.unsplash.com/photo-1516253015493-199ef5490798?w=400&h=200&fit=crop',
  },
  {
    id: '2',
    title: 'Hiến máu cứu người - Một nghĩa cử cao đẹp',
    location: 'Nhà văn hóa Thanh Niên',
    date: '25/04/2024',
    image: 'https://images.unsplash.com/photo-1628201693545-1d9919420c64?w=400&h=200&fit=crop',
  },
  {
    id: '3',
    title: 'Giọt máu hồng - Trao đời sự sống',
    location: 'Trường Đại học Bách Khoa',
    date: '30/04/2024',
    image: 'https://images.unsplash.com/photo-1588075592484-345e9543a8ca?w=400&h=200&fit=crop',
  },
];

const centers = [
  {
    id: '1',
    name: 'Bệnh viện Chợ Rẫy',
    address: '201B Nguyễn Chí Thanh, Quận 5',
    phone: '028 3855 4269',
    image: 'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=400&h=200&fit=crop',
  },
  {
    id: '2',
    name: 'Viện Huyết học - Truyền máu TW',
    address: '125 Lê Lợi, Quận 1',
    phone: '028 3829 7935',
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=200&fit=crop',
  },
  {
    id: '3',
    name: 'Bệnh viện Từ Dũ',
    address: '284 Cống Quỳnh, Quận 1',
    phone: '028 3829 5024',
    image: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=400&h=200&fit=crop',
  },
  {
    id: '4',
    name: 'Trung tâm Huyết học TP.HCM',
    address: '118 Hồng Bàng, Quận 5',
    phone: '028 3855 7890',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=200&fit=crop',
  },
  {
    id: '5',
    name: 'Bệnh viện Đại học Y Dược',
    address: '215 Hồng Bàng, Quận 5',
    phone: '028 3855 2983',
    image: 'https://images.unsplash.com/photo-1574192324001-ee41e18ed679?w=400&h=200&fit=crop',
  },
  {
    id: '6',
    name: 'Bệnh viện Thống Nhất',
    address: '1 Lý Thường Kiệt, Quận Tân Bình',
    phone: '028 3846 1344',
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031d4cc?w=400&h=200&fit=crop',
  },
];

const EventsLocationsSection = () => {
  const [activeTab, setActiveTab] = useState<'events' | 'centers'>('events');

  (window as any).switchToEventsTab = () => {
    setActiveTab('events');
  };

  (window as any).switchToCentersTab = () => {
    setActiveTab('centers');
  };

  return (
    <section id="events-locations-section" className="section-padding">
      <div className="container-custom">
        <h2 className="text-3xl font-inter font-bold text-gray-900 text-center mb-8">
          Sự kiện & Địa điểm
        </h2>
        
        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <GlassButton 
            variant={activeTab === 'events' ? 'primary' : 'ghost'}
            size="md"
            className="px-6"
            onClick={() => setActiveTab('events')}
          >
            Sự kiện
          </GlassButton>
          <GlassButton
            variant={activeTab === 'centers' ? 'primary' : 'ghost'}
            size="md"
            className="px-6"
            onClick={() => setActiveTab('centers')}
          >
            Địa điểm
          </GlassButton>
        </div>

        {/* Events Tab Content */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.slice(0, 6).map((event) => (
                <GlassCard key={event.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                  {event.image && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                  )}
                  <GlassCardHeader>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {event.location} - {event.date}
                    </p>
                  </GlassCardHeader>
                  <GlassCardContent>
                    <GlassButton variant="primary" size="sm">
                      Tìm hiểu thêm
                    </GlassButton>
                  </GlassCardContent>
                </GlassCard>
              ))}
            </div>
            
            <div className="text-center">
              <Link to="/events">
                <GlassButton variant="secondary" size="lg" className="px-8">
                  Xem tất cả sự kiện
                  <ArrowRight className="w-5 h-5" />
                </GlassButton>
              </Link>
            </div>
          </div>
        )}

        {/* Centers Tab Content */}
        {activeTab === 'centers' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {centers.slice(0, 6).map((center) => (
                <GlassCard key={center.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                  {center.image && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={center.image}
                        alt={center.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                  )}
                  <GlassCardHeader>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {center.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {center.address}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {center.phone}
                    </p>
                  </GlassCardHeader>
                  <GlassCardContent>
                    <GlassButton variant="primary" size="sm">
                      Xem chi tiết
                    </GlassButton>
                  </GlassCardContent>
                </GlassCard>
              ))}
            </div>
            
            <div className="text-center">
              <Link to="/centers">
                <GlassButton variant="secondary" size="lg" className="px-8">
                  Xem tất cả trung tâm
                  <ArrowRight className="w-5 h-5" />
                </GlassButton>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsLocationsSection;
