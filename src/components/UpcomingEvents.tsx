
import React from 'react';
import EventCard from '@/components/EventCard';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';

const UpcomingEvents: React.FC = () => {
  // Dummy data for events
  const events = [
    {
      title: "Ngày Hiến Máu Nhân Đạo",
      location: "Bệnh viện Chợ Rẫy, Quận 5",
      date: "15/01/2025",
      time: "08:00 - 17:00",
      description: "Chương trình hiến máu lớn nhất trong tháng, tổ chức tại Bệnh viện Chợ Rẫy với sự tham gia của nhiều bác sĩ chuyên khoa.",
      bloodTypesNeeded: ["A+", "O+", "AB-", "B+"],
      spotsAvailable: 45
    },
    {
      title: "Hiến Máu Cứu Người - Quận 1",
      location: "Trung tâm Y tế Quận 1",
      date: "18/01/2025", 
      time: "07:30 - 16:00",
      description: "Sự kiện hiến máu định kỳ tại trung tâm y tế, phục vụ nhu cầu cấp thiết của bệnh viện trong khu vực.",
      bloodTypesNeeded: ["O-", "A-", "B-"],
      spotsAvailable: 32
    },
    {
      title: "Chương Trình Hiến Máu Tình Nguyện",
      location: "Bệnh viện Từ Dũ, Quận 1",
      date: "22/01/2025",
      time: "08:30 - 15:30", 
      description: "Hiến máu tình nguyện hỗ trợ các ca sinh nở khó khăn và điều trị bệnh nhi tại bệnh viện chuyên khoa.",
      bloodTypesNeeded: ["O+", "A+"],
      spotsAvailable: 28
    },
    {
      title: "Hiến Máu Khẩn Cấp - Bệnh Viện 115",
      location: "Bệnh viện 115, Quận 10", 
      date: "25/01/2025",
      time: "06:00 - 14:00",
      description: "Chương trình hiến máu khẩn cấp phục vụ các ca cấp cứu và phẫu thuật tại bệnh viện đa khoa.",
      bloodTypesNeeded: ["AB+", "O+", "B+", "A+"],
      spotsAvailable: 52
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-inter font-bold text-foreground mb-4 tracking-tight">
            Sự Kiện Hiến Máu
            <span className="gradient-blood bg-clip-text text-transparent"> Sắp Tới</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tham gia các sự kiện hiến máu tại TP. Hồ Chí Minh và trở thành người hùng thầm lặng
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {events.map((event, index) => (
            <EventCard
              key={index}
              title={event.title}
              location={event.location}
              date={event.date}
              time={event.time}
              description={event.description}
              bloodTypesNeeded={event.bloodTypesNeeded}
              spotsAvailable={event.spotsAvailable}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <GlassCard className="max-w-md mx-auto p-6">
            <GlassCardHeader>
              <GlassCardTitle className="text-xl mb-2">
                Không tìm thấy sự kiện phù hợp?
              </GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Đăng ký nhận thông báo về các sự kiện hiến máu mới
              </p>
              <GlassButton variant="primary" size="md" className="w-full">
                Đăng ký thông báo
              </GlassButton>
            </GlassCardContent>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
