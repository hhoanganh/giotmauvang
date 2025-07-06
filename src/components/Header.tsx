
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlassButton } from '@/components/ui/glass-button';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: 'Có lỗi xảy ra',
          description: 'Không thể đăng xuất. Vui lòng thử lại.',
          variant: 'destructive',
        });
        return;
      }
      
      toast({
        title: 'Đăng xuất thành công',
        description: 'Hẹn gặp lại bạn!',
      });
    } catch (error) {
      toast({
        title: 'Có lỗi xảy ra',
        description: 'Vui lòng thử lại sau',
        variant: 'destructive',
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200/50">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
            <img 
                src="https://jduhcsgsf4.ufs.sh/f/YxhhsvmLP58IE2O12LrHIx6jwqh5iWJp4bOGCTRgVKQFmtZd" 
                alt="Giọt Máu Vàng"
                className="w-6 h-6 object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-inter font-semibold text-gray-900 tracking-tight">
                Giọt Máu Vàng
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Kết nối yêu thương
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <GlassButton 
              variant="ghost" 
              size="sm"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Trang chủ
            </GlassButton>
            <GlassButton 
              variant="ghost" 
              size="sm"
              onClick={() => {
                const eventsSection = document.getElementById('events-locations-section');
                if (eventsSection) {
                  eventsSection.scrollIntoView({ behavior: 'smooth' });
                  // Set active tab to events after a short delay
                  setTimeout(() => {
                    const eventsTab = document.querySelector('[data-value="events"]');
                    if (eventsTab) {
                      (eventsTab as HTMLElement).click();
                    }
                  }, 500);
                }
              }}
            >
              Sự kiện
            </GlassButton>
            <GlassButton 
              variant="ghost" 
              size="sm"
              onClick={() => {
                const eventsSection = document.getElementById('events-locations-section');
                if (eventsSection) {
                  eventsSection.scrollIntoView({ behavior: 'smooth' });
                  // Set active tab to centers after a short delay
                  setTimeout(() => {
                    const centersTab = document.querySelector('[data-value="centers"]');
                    if (centersTab) {
                      (centersTab as HTMLElement).click();
                    }
                  }, 500);
                }
              }}
            >
              Trung tâm
            </GlassButton>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-2">
            {isLoading ? (
              <div className="w-20 h-9 bg-gray-200 rounded-2xl animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-700">
                  <UserIcon className="w-4 h-4" />
                  <span className="max-w-32 truncate">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                </div>
                <GlassButton
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Đăng xuất</span>
                </GlassButton>
              </div>
            ) : (
              <>
                <Link to="/auth">
                  <GlassButton variant="primary" size="sm" className="hidden sm:flex">
                    Đăng nhập
                  </GlassButton>
                </Link>
                <Link to="/auth">
                  <GlassButton variant="primary" size="sm" className="sm:hidden">
                    Đăng nhập
                  </GlassButton>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
