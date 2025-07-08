import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlassButton } from '@/components/ui/glass-button';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import {
  LogOut,
  User as UserIcon,
  Heart,
  Bell,
  Calendar,
  History,
  ChevronDown,
  Users,
  UserCheck,
  Shield,
  Megaphone,
  ClipboardList,
  FileText,
  BarChart2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Define profile type
interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  primary_role: string | null;
  phone_number: string | null;
  blood_type: string | null;
  is_active: boolean;
  total_donations: number;
}

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch user profile data
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);
      }
      
      setIsLoading(false);
    };
    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

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
      setDropdownOpen(false);
    } catch (error) {
      toast({
        title: 'Có lỗi xảy ra',
        description: 'Vui lòng thử lại sau',
        variant: 'destructive',
      });
    }
  };

  // Get user icon by role
  const getUserIcon = (role: string | undefined) => {
    switch (role) {
      case 'center_staff':
        return <Users className="w-6 h-6 text-blue-500" />;
      case 'medical_professional':
        return <UserCheck className="w-6 h-6 text-green-500" />;
      case 'system_admin':
        return <Shield className="w-6 h-6 text-yellow-500" />;
      case 'donor':
      default:
        return <Heart className="w-6 h-6 text-red-500" />;
    }
  };

  // Get menu items by role
  const getMenuItems = (role: string | undefined) => {
    switch (role) {
      case 'center_staff':
        return [
          { label: 'Donor Check-in', icon: <ClipboardList className="w-4 h-4" />, to: '/staff/checkin' },
          { label: 'Broadcast Alerts', icon: <Megaphone className="w-4 h-4" />, to: '/staff/alerts' },
          { label: 'Logout', icon: <LogOut className="w-4 h-4" />, action: handleSignOut, danger: true },
        ];
      case 'medical_professional':
        return [
          { label: 'Medical Screening', icon: <UserCheck className="w-4 h-4" />, to: '/medical/screening' },
          { label: 'Logout', icon: <LogOut className="w-4 h-4" />, action: handleSignOut, danger: true },
        ];
      case 'system_admin':
        return [
          { label: 'Dashboard', icon: <Shield className="w-4 h-4" />, to: '/admin' },
          { label: 'Events', icon: <Calendar className="w-4 h-4" />, to: '/admin/events' },
          { label: 'Users', icon: <Users className="w-4 h-4" />, to: '/admin/users' },
          { label: 'Content', icon: <FileText className="w-4 h-4" />, to: '/admin/content' },
          { label: 'Reports', icon: <BarChart2 className="w-4 h-4" />, to: '/admin/reports' },
          { label: 'Logout', icon: <LogOut className="w-4 h-4" />, action: handleSignOut, danger: true },
        ];
      case 'donor':
      default:
        return [
          { label: 'My Profile', icon: <UserIcon className="w-4 h-4" />, to: '/profile' },
          { label: 'My Appointments', icon: <Calendar className="w-4 h-4" />, to: '/appointments' },
          { label: 'My Donation History', icon: <History className="w-4 h-4" />, to: '/history' },
          { label: 'Notification', icon: <Bell className="w-4 h-4" />, to: '/notifications' },
          { label: 'Logout', icon: <LogOut className="w-4 h-4" />, action: handleSignOut, danger: true },
        ];
    }
  };

  // Get display name from profile or fallback to email
  const getDisplayName = () => {
    if (profile?.full_name) {
      return profile.full_name;
    }
    if (profile?.email) {
      return profile.email;
    }
    if (user?.email) {
      return user.email;
    }
    return 'Người dùng';
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
                  setTimeout(() => {
                    if ((window as any).switchToEventsTab) {
                      (window as any).switchToEventsTab();
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
                  setTimeout(() => {
                    if ((window as any).switchToCentersTab) {
                      (window as any).switchToCentersTab();
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
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => setDropdownOpen((open) => !open)}
                  aria-haspopup="menu"
                  aria-expanded={dropdownOpen}
                >
                  {getUserIcon(profile?.primary_role)}
                  <span className="max-w-32 truncate text-sm text-gray-700">
                    {getDisplayName()}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md z-50 py-2 border border-gray-100 animate-fade-in">
                    {getMenuItems(profile?.primary_role).map((item, idx) =>
                      item.action ? (
                        <button
                          key={item.label}
                          onClick={item.action}
                          className={`flex items-center gap-2 px-4 py-2 w-full text-left transition-colors ${
                            item.danger ? 'text-red-600 hover:bg-gray-100' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {item.icon} {item.label}
                        </button>
                      ) : (
                        <Link
                          key={item.label}
                          to={item.to}
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          {item.icon} {item.label}
                        </Link>
                      )
                    )}
                  </div>
                )}
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
