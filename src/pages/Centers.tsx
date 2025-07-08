
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Phone, Navigation, ArrowLeft, Building2 } from 'lucide-react';
import Header from '@/components/Header';
import { GlassCard, GlassCardHeader, GlassCardContent } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DonationCenter {
  id: string;
  name: string;
  address: string;
  district: string;
  phone: string;
  image?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Sample data for blood donation centers in Ho Chi Minh City
const donationCenters: DonationCenter[] = [
  {
    id: '1',
    name: 'Bệnh viện Chợ Rẫy',
    address: '201B Nguyễn Chí Thanh, Phường 12',
    district: 'Quận 5',
    phone: '028 3855 4269',
    image: 'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=400&h=200&fit=crop',
  },
  {
    id: '2',
    name: 'Viện Huyết học - Truyền máu Trung ương',
    address: '125 Lê Lợi, Phường Bến Nghé',
    district: 'Quận 1',
    phone: '028 3829 7935',
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=200&fit=crop',
  },
  {
    id: '3',
    name: 'Bệnh viện Từ Dũ',
    address: '284 Cống Quỳnh, Phường Phạm Ngũ Lão',
    district: 'Quận 1',
    phone: '028 3829 5024',
    image: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=400&h=200&fit=crop',
  },
  {
    id: '4',
    name: 'Trung tâm Huyết học TP.HCM',
    address: '118 Hồng Bàng, Phường 12',
    district: 'Quận 5',
    phone: '028 3855 7890',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=200&fit=crop',
  },
  {
    id: '5',
    name: 'Bệnh viện Đại học Y Dược',
    address: '215 Hồng Bàng, Phường 11',
    district: 'Quận 5',
    phone: '028 3855 2983',
    image: 'https://images.unsplash.com/photo-1574192324001-ee41e18ed679?w=400&h=200&fit=crop',
  },
  {
    id: '6',
    name: 'Bệnh viện Thống Nhất',
    address: '1 Lý Thường Kiệt, Phường 7',
    district: 'Quận Tân Bình',
    phone: '028 3846 1344',
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031d4cc?w=400&h=200&fit=crop',
  },
  {
    id: '7',
    name: 'Bệnh viện Nhi đồng 1',
    address: '341 Sư Vạn Hạnh, Phường 12',
    district: 'Quận 10',
    phone: '028 3865 3355',
    image: 'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=400&h=200&fit=crop',
  },
  {
    id: '8',
    name: 'Bệnh viện Nguyễn Tri Phương',
    address: '468 Nguyễn Tri Phương, Phường 9',
    district: 'Quận 10',
    phone: '028 3865 4025',
    image: 'https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&h=200&fit=crop',
  },
];

const districts = [
  'Tất cả quận/huyện',
  'Quận 1',
  'Quận 3',
  'Quận 4',
  'Quận 5',
  'Quận 6',
  'Quận 7',
  'Quận 8',
  'Quận 10',
  'Quận 11',
  'Quận 12',
  'Quận Bình Thạnh',
  'Quận Gò Vấp',
  'Quận Phú Nhuận',
  'Quận Tân Bình',
  'Quận Tân Phú',
  'Quận Thủ Đức',
  'Huyện Bình Chánh',
  'Huyện Cần Giờ',
  'Huyện Củ Chi',
  'Huyện Hóc Môn',
  'Huyện Nhà Bè',
];

const Centers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('Tất cả quận/huyện');

  const filteredCenters = useMemo(() => {
    return donationCenters.filter((center) => {
      const matchesSearch = 
        center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDistrict = 
        selectedDistrict === 'Tất cả quận/huyện' || 
        center.district === selectedDistrict;

      return matchesSearch && matchesDistrict;
    });
  }, [searchTerm, selectedDistrict]);

  const handleDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(`${address}, TP.HCM, Việt Nam`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-red-50 to-orange-50">
        <div className="container-custom">
          <div className="text-center mb-8">
            <Link 
              to="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay về trang chủ
            </Link>
            
            <h1 className="text-3xl md:text-4xl font-inter font-bold text-gray-900 mb-4">
              Tất cả trung tâm hiến máu
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tìm trung tâm gần bạn để tham gia hiến máu và cứu người!
            </p>
          </div>

          {/* Community Impact Banner */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl p-6 mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Building2 className="w-6 h-6" />
              <span className="text-2xl font-bold">{donationCenters.length}</span>
            </div>
            <p className="text-lg">
              trung tâm đang hoạt động tại TP.HCM
            </p>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
            
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Chọn quận/huyện" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Centers List */}
      <section className="section-padding">
        <div className="container-custom">
          {filteredCenters.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Không tìm thấy trung tâm nào
              </h3>
              <p className="text-gray-600">
                Hãy thử tìm kiếm với từ khóa khác hoặc chọn quận/huyện khác
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                Tìm thấy <span className="font-semibold text-gray-900">{filteredCenters.length}</span> trung tâm
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCenters.map((center) => (
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
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-2 text-gray-600">
                          <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm">{center.address}</p>
                            <p className="text-sm font-medium text-gray-900">{center.district}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-5 h-5 text-blue-500 flex-shrink-0" />
                          <span className="text-sm">{center.phone}</span>
                        </div>
                      </div>
                    </GlassCardHeader>
                    
                    <GlassCardContent>
                      <div className="grid grid-cols-2 gap-3">
                        <GlassButton
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCall(center.phone)}
                          className="flex items-center gap-2 justify-center"
                        >
                          <Phone className="w-4 h-4" />
                          Gọi
                        </GlassButton>
                        
                        <GlassButton
                          variant="primary"
                          size="sm"
                          onClick={() => handleDirections(center.address)}
                          className="flex items-center gap-2 justify-center"
                        >
                          <Navigation className="w-4 h-4" />
                          Chỉ đường
                        </GlassButton>
                      </div>
                    </GlassCardContent>
                  </GlassCard>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Centers;
