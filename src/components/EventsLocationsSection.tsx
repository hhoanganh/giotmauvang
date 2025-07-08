
import React, { useState } from 'react';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EventCard from '@/components/EventCard';
import { Link } from 'react-router-dom';

const EventsLocationsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('events');

  // Function to switch tabs from external components
  const switchToTab = (tabName: string) => {
    setActiveTab(tabName);
  };

  // Expose the function globally for header navigation
  React.useEffect(() => {
    (window as any).switchToEventsTab = () => switchToTab('events');
    (window as any).switchToCentersTab = () => switchToTab('centers');
    
    return () => {
      delete (window as any).switchToEventsTab;
      delete (window as any).switchToCentersTab;
    };
  }, []);

  const events = [
    {
      title: "Ngày Hiến Máu Nhân Đạo",
      location: "Bệnh viện Chợ Rẫy, Quận 5",
      date: "15/01/2025",
      time: "08:00 - 17:00",
      description: "Chương trình hiến máu lớn nhất trong tháng",
      bloodTypesNeeded: ["A+", "O+", "AB-", "B+"],
      spotsAvailable: 45
    },
    {
      title: "Hiến Máu Cứu Người - Quận 1",
      location: "Trung tâm Y tế Quận 1",
      date: "18/01/2025", 
      time: "07:30 - 16:00",
      description: "Sự kiện hiến máu định kỳ tại trung tâm y tế",
      bloodTypesNeeded: ["O-", "A-", "B-"],
      spotsAvailable: 32
    }
  ];

  const donationCenters = [
    { name: "Bệnh viện Chợ Rẫy", address: "201B Nguyễn Chí Thanh, Quận 5", phone: "028 3855 4269" },
    { name: "Viện Huyết học - Truyền máu TW", address: "125 Lê Lợi, Quận 1", phone: "028 3829 7935" },
    { name: "Bệnh viện Từ Dũ", address: "284 Cống Quỳnh, Quận 1", phone: "028 3829 5024" }
  ];

  const bloodDemand = [
    { type: "O+", demand: "Cao", color: "text-red-600", level: 85 },
    { type: "A+", demand: "Trung bình", color: "text-orange-500", level: 60 },
    { type: "B+", demand: "Thấp", color: "text-green-600", level: 30 },
    { type: "AB+", demand: "Cao", color: "text-red-600", level: 75 }
  ];

  return (
    <section id="events-locations-section" className="py-16 px-4 lg:py-24">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sự Kiện & Địa Điểm
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tìm hiểu các sự kiện hiến máu và trung tâm y tế gần bạn
          </p>
        </div>

        <GlassCard className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="events">Sự kiện</TabsTrigger>
              <TabsTrigger value="centers">Trung tâm</TabsTrigger>
              <TabsTrigger value="demand">Nhu cầu</TabsTrigger>
            </TabsList>
            
            <TabsContent value="events" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {events.map((event, index) => (
                  <EventCard key={index} {...event} />
                ))}
              </div>
              <div className="text-center pt-4 pb-8 px-4">
                <Link to="/events">
                  <GlassButton variant="primary" size="lg" className="min-w-[200px]">
                    Xem tất cả sự kiện
                  </GlassButton>
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="centers" className="space-y-4">
              {donationCenters.map((center, index) => (
                <GlassCard key={index} className="p-6">
                  <div className="flex gap-4">
                    {/* Left: Center Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{center.name}</h3>
                      <p className="text-gray-600 mb-2">📍 {center.address}</p>
                      <p className="text-gray-600">📞 {center.phone}</p>
                    </div>
                    
                    {/* Right: Small Map */}
                    <div className="w-32 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-sm">🗺️</span>
                    </div>
                  </div>
                </GlassCard>
              ))}
              <div className="text-center pt-4 pb-8 px-4">
                <Link to="/centers">
                  <GlassButton variant="primary" size="lg" className="min-w-[200px]">
                    Xem tất cả trung tâm
                  </GlassButton>
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="demand" className="space-y-4">
              <h3 className="text-xl font-semibold mb-6 text-center">Mức độ cần máu theo nhóm</h3>
              {bloodDemand.map((blood, index) => (
                <GlassCard key={index} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-red-600">{blood.type}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">Nhóm máu {blood.type}</h4>
                        <p className={`${blood.color} font-medium`}>Nhu cầu: {blood.demand}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                          style={{ width: `${blood.level}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">{blood.level}%</span>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </TabsContent>
          </Tabs>
        </GlassCard>
      </div>
    </section>
  );
};

export default EventsLocationsSection;
