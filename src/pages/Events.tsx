
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Search, Filter } from 'lucide-react';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';

interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  description: string;
  bloodTypesNeeded: string[];
  spotsAvailable: number;
  imageUrl?: string;
  eventType: 'regular' | 'urgent' | 'special';
  district: string;
}

const Events = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedEventType, setSelectedEventType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Extended dummy data with more events
  const allEvents: Event[] = [
    {
      id: '1',
      title: "Ngày Hiến Máu Nhân Đạo",
      location: "Bệnh viện Chợ Rẫy, Quận 5",
      date: "15/01/2025",
      time: "08:00 - 17:00",
      description: "Chương trình hiến máu lớn nhất trong tháng, tổ chức tại Bệnh viện Chợ Rẫy với sự tham gia của nhiều bác sĩ chuyên khoa.",
      bloodTypesNeeded: ["A+", "O+", "AB-", "B+"],
      spotsAvailable: 45,
      eventType: 'special',
      district: 'Quận 5'
    },
    {
      id: '2',
      title: "Hiến Máu Cứu Người - Quận 1",
      location: "Trung tâm Y tế Quận 1",
      date: "18/01/2025", 
      time: "07:30 - 16:30",
      description: "Sự kiện hiến máu định kỳ tại trung tâm y tế, phục vụ nhu cầu cấp thiết của bệnh viện trong khu vực.",
      bloodTypesNeeded: ["O-", "A-", "B-"],
      spotsAvailable: 32,
      eventType: 'regular',
      district: 'Quận 1'
    },
    {
      id: '3',
      title: "Chương Trình Hiến Máu Tình Nguyện",
      location: "Bệnh viện Từ Dũ, Quận 1",
      date: "22/01/2025",
      time: "08:30 - 15:30", 
      description: "Hiến máu tình nguyện hỗ trợ các ca sinh nở khó khăn và điều trị bệnh nhi tại bệnh viện chuyên khoa.",
      bloodTypesNeeded: ["O+", "A+"],
      spotsAvailable: 28,
      eventType: 'regular',
      district: 'Quận 1'
    },
    {
      id: '4',
      title: "Hiến Máu Khẩn Cấp - Bệnh Viện 115",
      location: "Bệnh viện 115, Quận 10", 
      date: "25/01/2025",
      time: "06:00 - 14:00",
      description: "Chương trình hiến máu khẩn cấp phục vụ các ca cấp cứu và phẫu thuật tại bệnh viện đa khoa.",
      bloodTypesNeeded: ["AB+", "O+", "B+", "A+"],
      spotsAvailable: 52,
      eventType: 'urgent',
      district: 'Quận 10'
    },
    {
      id: '5',
      title: "Hiến Máu Cộng Đồng - Quận 3",
      location: "Trung tâm Văn hóa Quận 3",
      date: "28/01/2025",
      time: "09:00 - 16:00",
      description: "Sự kiện hiến máu cộng đồng với sự tham gia của các tổ chức xã hội và doanh nghiệp địa phương.",
      bloodTypesNeeded: ["A+", "B+", "O+"],
      spotsAvailable: 38,
      eventType: 'special',
      district: 'Quận 3'
    },
    {
      id: '6',
      title: "Hiến Máu Sinh Viên - ĐH Y Dược",
      location: "Đại học Y Dược TP.HCM, Quận 5",
      date: "30/01/2025",
      time: "08:00 - 15:00",
      description: "Chương trình hiến máu dành cho sinh viên y khoa và cộng đồng, nhằm nâng cao ý thức hiến máu tình nguyện.",
      bloodTypesNeeded: ["O-", "AB-", "A-"],
      spotsAvailable: 25,
      eventType: 'regular',
      district: 'Quận 5'
    }
  ];

  const districts = ['Quận 1', 'Quận 3', 'Quận 5', 'Quận 10', 'Quận 7', 'Quận Bình Thạnh'];

  // Filter events based on search and filters
  const filteredEvents = allEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = selectedDistrict === 'all' || event.district === selectedDistrict;
    const matchesEventType = selectedEventType === 'all' || event.eventType === selectedEventType;
    
    return matchesSearch && matchesDistrict && matchesEventType;
  });

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'urgent': return 'Khẩn cấp';
      case 'special': return 'Đặc biệt';
      default: return 'Thường xuyên';
    }
  };

  const getEventTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'urgent': return 'destructive';
      case 'special': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      
      <main className="section-padding">
        <div className="container-custom">
          {/* Page Header */}
          <div className="text-center mb-8 space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-inter font-bold text-gray-900 tracking-tight leading-tight">
              Tất Cả Sự Kiện
              <span className="block bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent mt-2">
                Hiến Máu
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Chọn sự kiện phù hợp để tham gia và cứu người! Mỗi lần hiến máu có thể cứu sống 3 người.
            </p>
          </div>

          {/* Search and Filters */}
          <GlassCard className="mb-8">
            <GlassCardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm sự kiện hoặc địa điểm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50 border-gray-200/50"
                  />
                </div>

                {/* Desktop Filters */}
                <div className="hidden lg:flex gap-4">
                  <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                    <SelectTrigger className="w-[180px] bg-white/50 border-gray-200/50">
                      <SelectValue placeholder="Chọn quận" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả quận</SelectItem>
                      {districts.map(district => (
                        <SelectItem key={district} value={district}>{district}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedEventType} onValueChange={setSelectedEventType}>
                    <SelectTrigger className="w-[160px] bg-white/50 border-gray-200/50">
                      <SelectValue placeholder="Loại sự kiện" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả loại</SelectItem>
                      <SelectItem value="regular">Thường xuyên</SelectItem>
                      <SelectItem value="urgent">Khẩn cấp</SelectItem>
                      <SelectItem value="special">Đặc biệt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Mobile Filter Toggle */}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden bg-white/50 border-gray-200/50"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Bộ lọc
                </Button>
              </div>

              {/* Mobile Filters */}
              {showFilters && (
                <div className="lg:hidden mt-4 pt-4 border-t border-gray-200/50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                      <SelectTrigger className="bg-white/50 border-gray-200/50">
                        <SelectValue placeholder="Chọn quận" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả quận</SelectItem>
                        {districts.map(district => (
                          <SelectItem key={district} value={district}>{district}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedEventType} onValueChange={setSelectedEventType}>
                      <SelectTrigger className="bg-white/50 border-gray-200/50">
                        <SelectValue placeholder="Loại sự kiện" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả loại</SelectItem>
                        <SelectItem value="regular">Thường xuyên</SelectItem>
                        <SelectItem value="urgent">Khẩn cấp</SelectItem>
                        <SelectItem value="special">Đặc biệt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </GlassCardContent>
          </GlassCard>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Hiển thị <span className="font-semibold text-gray-900">{filteredEvents.length}</span> sự kiện
            </p>
            {(searchTerm || selectedDistrict !== 'all' || selectedEventType !== 'all') && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDistrict('all');
                  setSelectedEventType('all');
                }}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-12">
            {filteredEvents.map((event) => (
              <GlassCard key={event.id} className="hover:shadow-xl transition-all duration-300">
                <GlassCardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <GlassCardTitle className="text-xl leading-tight">{event.title}</GlassCardTitle>
                        <Badge variant={getEventTypeBadgeVariant(event.eventType) as any} className="text-xs">
                          {getEventTypeLabel(event.eventType)}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-red-500 flex-shrink-0" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-blue-500 flex-shrink-0" />
                          <span>{event.date} • {event.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-3 min-w-[70px]">
                      <Users className="h-4 w-4 text-gray-500 mb-1" />
                      <span className="text-2xl font-bold text-red-600">{event.spotsAvailable}</span>
                      <span className="text-xs text-gray-500">chỗ trống</span>
                    </div>
                  </div>
                </GlassCardHeader>
                
                <GlassCardContent className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    {event.description}
                  </p>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700 mb-3 block">
                      Nhóm máu cần:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {event.bloodTypesNeeded.map((bloodType) => (
                        <span
                          key={bloodType}
                          className="px-3 py-1 text-sm font-medium bg-red-100 text-red-700 rounded-full"
                        >
                          {bloodType}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex gap-3 pt-2">
                    <GlassButton variant="primary" size="md" className="flex-1">
                      Đăng ký hiến máu
                    </GlassButton>
                    <GlassButton variant="secondary" size="md">
                      Chi tiết
                    </GlassButton>
                  </div>
                </GlassCardContent>
              </GlassCard>
            ))}
          </div>

          {/* No Results */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Không tìm thấy sự kiện phù hợp
              </h3>
              <p className="text-gray-600 mb-4">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc của bạn
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDistrict('all');
                  setSelectedEventType('all');
                }}
                className="bg-white/50 border-gray-200/50"
              >
                Xóa tất cả bộ lọc
              </Button>
            </div>
          )}

          {/* Community Impact Banner */}
          <GlassCard className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200/50">
            <GlassCardContent className="p-8 text-center">
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">1,248</div>
                  <div className="text-sm text-gray-600">Người đã hiến máu</div>
                </div>
                <Separator orientation="vertical" className="hidden md:block h-12" />
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">3,744</div>
                  <div className="text-sm text-gray-600">Người được cứu sống</div>
                </div>
                <Separator orientation="vertical" className="hidden md:block h-12" />
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">98%</div>
                  <div className="text-sm text-gray-600">Mức độ hài lòng</div>
                </div>
              </div>
              <p className="text-lg text-gray-700 mt-6 max-w-2xl mx-auto">
                <strong>Cảm ơn bạn đã là một phần của cộng đồng hiến máu!</strong> Mỗi giọt máu bạn hiến đều có ý nghĩa to lớn.
              </p>
            </GlassCardContent>
          </GlassCard>
        </div>
      </main>
    </div>
  );
};

export default Events;
