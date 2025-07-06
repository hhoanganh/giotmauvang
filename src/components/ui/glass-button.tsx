
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl font-inter font-medium tracking-tight transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      default: "bg-white/90 backdrop-blur-sm border border-gray-200/50 text-gray-900 shadow-md hover:bg-white hover:shadow-lg hover:border-gray-300/50",
      primary: "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 border-0",
      secondary: "bg-gradient-to-r from-orange-500 to-white-500 text-white shadow-lg hover:shadow-xl hover:from-red-600 hover:to-orange-600 border-0",
      ghost: "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 border-0 shadow-none"
    };

    const sizes = {
      sm: "text-sm h-9 px-4 py-2",
      md: "text-sm h-10 px-5 py-2", 
      lg: "text-base h-12 px-8 py-3"
    };

    return (
      <button
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

GlassButton.displayName = "GlassButton";

export { GlassButton };
