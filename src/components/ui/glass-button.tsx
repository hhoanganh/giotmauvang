
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl font-inter font-normal tracking-tighter transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      default: "bg-white/20 backdrop-blur-md border border-white/30 text-foreground shadow-xl hover:bg-white/30 hover:shadow-2xl hover:shadow-blue-500/20",
      primary: "gradient-medical text-white shadow-xl hover:shadow-2xl hover:shadow-blue-500/40 border-0",
      secondary: "gradient-blood text-white shadow-xl hover:shadow-2xl hover:shadow-red-500/40 border-0"
    };

    const sizes = {
      sm: "text-sm h-8 px-3 py-2",
      md: "text-sm h-10 px-4 py-2", 
      lg: "text-base h-12 px-6 py-3"
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
