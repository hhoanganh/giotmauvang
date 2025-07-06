import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'with-bottom-button';
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const baseClasses = "bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300";
    
    const variants = {
      default: "",
      "with-bottom-button": "flex flex-col"
    };

    return (
      <div
        className={cn(baseClasses, variants[variant], className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

interface GlassCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'with-bottom-button';
}

const GlassCardHeader = React.forwardRef<HTMLDivElement, GlassCardHeaderProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const baseClasses = "p-6";
    
    const variants = {
      default: "",
      "with-bottom-button": "flex-shrink-0"
    };

    return (
      <div
        className={cn(baseClasses, variants[variant], className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCardHeader.displayName = "GlassCardHeader";

interface GlassCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'with-bottom-button';
}

const GlassCardContent = React.forwardRef<HTMLDivElement, GlassCardContentProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const baseClasses = "px-6 pb-6";
    
    const variants = {
      default: "",
      "with-bottom-button": "flex flex-col flex-grow"
    };

    return (
      <div
        className={cn(baseClasses, variants[variant], className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCardContent.displayName = "GlassCardContent";

interface GlassCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const GlassCardFooter = React.forwardRef<HTMLDivElement, GlassCardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn("px-6 pb-6 mt-auto", className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCardFooter.displayName = "GlassCardFooter";

interface GlassCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const GlassCardTitle = React.forwardRef<HTMLHeadingElement, GlassCardTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        className={cn("text-xl font-inter font-semibold text-gray-900", className)}
        ref={ref}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

GlassCardTitle.displayName = "GlassCardTitle";

export { GlassCard, GlassCardHeader, GlassCardContent, GlassCardFooter, GlassCardTitle };
