
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
    <GlassCard className="w-full">
      <GlassCardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <GlassCardTitle className="text-lg mb-2">{title}</GlassCardTitle>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blood-red rounded-full"></span>
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blood-gold rounded-full"></span>
                <span>{date} • {time}</span>
              </div>
            </div>
          </div>
          {spotsAvailable && (
            <div className="flex flex-col items-end">
              <span className="text-xs text-muted-foreground">Còn lại</span>
              <span className="text-lg font-semibold text-blood-red">{spotsAvailable}</span>
              <span className="text-xs text-muted-foreground">chỗ</span>
            </div>
          )}
        </div>
      </GlassCardHeader>
      
      <GlassCardContent>
        <p className="text-sm text-foreground/80 mb-4 line-clamp-2">
          {description}
        </p>
        
        {bloodTypesNeeded.length > 0 && (
          <div className="mb-4">
            <span className="text-xs font-medium text-muted-foreground mb-2 block">
              Nhóm máu cần:
            </span>
            <div className="flex flex-wrap gap-2">
              {bloodTypesNeeded.map((bloodType) => (
                <span
                  key={bloodType}
                  className="px-2 py-1 text-xs font-medium bg-blood-red/20 text-blood-red rounded-lg backdrop-blur-sm"
                >
                  {bloodType}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <GlassButton variant="primary" size="sm" className="flex-1">
            Đăng ký hiến máu
          </GlassButton>
          <GlassButton variant="default" size="sm">
            Chi tiết
          </GlassButton>
        </div>
      </GlassCardContent>
    </GlassCard>
  );
};

export default EventCard;
