
import React from 'react';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';

interface EventCardProps {
  title: string;
  location: string;
  date: string;
  time: string;
  description: string;
  bloodTypesNeeded?: string[];
  spotsAvailable?: number;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  location,
  date,
  time,
  description,
  bloodTypesNeeded = [],
  spotsAvailable
}) => {
  return (
    <GlassCard className="w-full hover:shadow-xl transition-all duration-300">
      <GlassCardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <GlassCardTitle className="text-xl mb-3 leading-tight">{title}</GlassCardTitle>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span>{date} • {time}</span>
              </div>
            </div>
          </div>
          {spotsAvailable && (
            <div className="flex flex-col items-center bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-3 min-w-[70px]">
              <span className="text-xs text-gray-500 mb-1">Còn lại</span>
              <span className="text-2xl font-bold text-red-600">{spotsAvailable}</span>
              <span className="text-xs text-gray-500">chỗ</span>
            </div>
          )}
        </div>
      </GlassCardHeader>
      
      <GlassCardContent className="space-y-6">
        <p className="text-gray-700 leading-relaxed">
          {description}
        </p>
        
        {bloodTypesNeeded.length > 0 && (
          <div>
            <span className="text-sm font-medium text-gray-700 mb-3 block">
              Nhóm máu cần:
            </span>
            <div className="flex flex-wrap gap-2">
              {bloodTypesNeeded.map((bloodType) => (
                <span
                  key={bloodType}
                  className="px-3 py-1 text-sm font-medium bg-red-100 text-red-700 rounded-full"
                >
                  {bloodType}
                </span>
              ))}
            </div>
          </div>
        )}
        
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
  );
};

export default EventCard;
