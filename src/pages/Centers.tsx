
import React, { useState, useMemo } from 'react';
import { MapPin, Phone, Navigation, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';

interface DonationCenter {
  id: string;
  name: string;
  address: string;
  district: string;
  phone: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

const Centers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  // Sample data for donation centers
  const centers: DonationCenter[] = [
    {
      id: '1',
      name: 'Bệnh viện Chợ Rẫy',
      address: '201B Nguyễn Chí Thanh, Quận 5',
      district: 'Quận 5',
      phone: '028 3855 4269',
    },
    {
      id: '2',
      name: 'Viện Huyết học - Truyền máu Trung ương',
      address: '125 Lê Lợi, Quận 1',
      district: 'Quận 1',
      phone: '028 3829 7935',
    },
    {
      id: '3',
      name: 'Bệnh viện Từ Dũ',
      address: '284 Cống Quỳnh, Quận 1',
      district: 'Quận 1',
      phone: '028 3829 5024',
    },
    {
      id: '4',
      name: 'Bệnh viện Nhân dân Gia Định',
      address: '1 Đường số 1, Phường Linh Xuân, Quận Thủ Đức',
      district: 'Quận Thủ Đức',
      phone: '028 3715 3424',
    },
    {
      id: '5',
      name: 'Bệnh viện Đại học Y Dược',
      address: '215 Hồng Bàng, Quận 5',
      district: 'Quận 5',
      phone: '028 3855 2225',
    },
    {
      id: '6',
      name: 'Bệnh viện Nguyễn Tri Phương',
      address: '468 Nguyễn Tri Phương, Quận 10',
      district: 'Quận 10',
      phone: '028 3865 1515',
    },
    {
      id: '7',
      name: 'Bệnh viện Quận 2',
      address: '101 Đường D2, Quận 2',
      district: 'Quận 2',
      phone: '028 3740 5555',
    },
    {
      id: '8',
      name: 'Bệnh viện Bình Dân',
      address: '371 Điện Biên Phủ, Quận 3',
      district: 'Quận 3',
      phone: '028 3955 4269',
    }
  ];

  // Get unique districts for the filter
  const districts = useMemo(() => {
    const uniqueDistricts = [...new Set(centers.map(center => center.district))];
    return uniqueDistricts.sort();
  }, [centers]);

  // Filter centers based on search and district
  const filteredCenters = useMemo(() => {
    return centers.filter(center => {
      const matchesSearch = searchTerm === '' || 
        center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDistrict = selectedDistrict === 'all' || center.district === selectedDistrict;
      
      return matchesSearch && matchesDistrict;
    });
  }, [centers, searchTerm, selectedDistrict]);

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(`${address}, Ho Chi Minh City, Vietnam`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-red-100">
      {/* Consistent Header */}
      <Header />

      <main className="section-padding">
        {/* Title & Subtitle Section (matching Events.tsx) */}
        <div className="container-custom">
          <div className="text-center mb-8 space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-inter font-bold text-gray-900 tracking-tight leading-tight">
              Tất Cả Trung Tâm
              <span className="block bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent mt-2">
                Hiến Máu
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Tìm trung tâm gần bạn để tham gia hiến máu!
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Chọn quận" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả quận</SelectItem>
                {districts.map(district => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Community Impact Banner */}
        <div className="container-custom py-6">
          <GlassCard className="text-center p-6 mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-2xl font-bold text-gray-900">{centers.length}</span>
            </div>
            <p className="text-gray-600">
              Trung tâm đang hoạt động tại TP.HCM
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Sẵn sàng phục vụ cộng đồng 24/7
            </p>
          </GlassCard>
        </div>

        {/* Centers Grid */}
        <div className="container-custom pb-16">
          {filteredCenters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCenters.map((center) => (
                <GlassCard key={center.id} className="p-6 hover:shadow-xl transition-all duration-300">
                  <div className="space-y-4">
                    {/* Center Name */}
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                      {center.name}
                    </h3>

                    {/* Address */}
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {center.address}
                      </p>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <button
                        onClick={() => handleCall(center.phone)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                      >
                        {center.phone}
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <GlassButton
                        variant="primary"
                        size="sm"
                        onClick={() => handleDirections(center.address)}
                        className="flex-1"
                      >
                        <Navigation className="h-4 w-4" />
                        Chỉ đường
                      </GlassButton>
                      <GlassButton
                        variant="secondary"
                        size="sm"
                        onClick={() => handleCall(center.phone)}
                        className="flex-1"
                      >
                        <Phone className="h-4 w-4" />
                        Gọi ngay
                      </GlassButton>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy trung tâm
              </h3>
              <p className="text-gray-500">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc quận
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Centers;
