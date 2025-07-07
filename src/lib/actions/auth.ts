import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

// Registration schema with comprehensive validation
const registerSchema = z.object({
  fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự').max(100, 'Họ và tên quá dài'),
  email: z.string().email('Vui lòng nhập email hợp lệ'),
  phoneNumber: z.string().min(10, 'Số điện thoại phải có ít nhất 10 số').max(15, 'Số điện thoại quá dài'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').max(100, 'Mật khẩu quá dài'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// Response type for server actions
export type AuthResponse = {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
};

/**
 * Register a new donor user
 * Creates user in Supabase Auth and profile in database
 */
export async function registerUser(formData: RegisterFormData): Promise<AuthResponse> {
  try {
    // Server-side validation
    const validatedData = registerSchema.parse(formData);
    
    // Check if email already exists
    const { data: existingUser, error: checkError } = await supabase.auth.admin.getUserByEmail(validatedData.email);
    
    if (checkError && checkError.message !== 'User not found') {
      return {
        success: false,
        message: 'Có lỗi xảy ra khi kiểm tra email',
        error: checkError.message
      };
    }
    
    if (existingUser) {
      return {
        success: false,
        message: 'Email này đã được đăng ký. Vui lòng đăng nhập.',
        error: 'EMAIL_EXISTS'
      };
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          full_name: validatedData.fullName,
          phone_number: validatedData.phoneNumber,
        },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (authError) {
      return {
        success: false,
        message: 'Đăng ký thất bại',
        error: authError.message
      };
    }

    if (!authData.user) {
      return {
        success: false,
        message: 'Không thể tạo tài khoản',
        error: 'USER_CREATION_FAILED'
      };
    }

    // Create profile in database
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        full_name: validatedData.fullName,
        phone_number: validatedData.phoneNumber,
        primary_role: 'donor',
        is_active: true,
        total_donations: 0,
      });

    if (profileError) {
      // If profile creation fails, we should clean up the auth user
      // For now, we'll return an error and let the user try again
      return {
        success: false,
        message: 'Tạo hồ sơ thất bại',
        error: profileError.message
      };
    }

    // Cache invalidation handled by client-side navigation

    return {
      success: true,
      message: 'Đăng ký thành công! Chào mừng bạn đến với cộng đồng hiến máu.',
      data: {
        user: authData.user,
        session: authData.session
      }
    };

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Dữ liệu không hợp lệ',
        error: error.errors[0]?.message || 'Validation error'
      };
    }

    return {
      success: false,
      message: 'Có lỗi xảy ra, vui lòng thử lại sau',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Login user with email and password
 */
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  try {
    // Basic validation
    if (!email || !password) {
      return {
        success: false,
        message: 'Email và mật khẩu là bắt buộc',
        error: 'MISSING_CREDENTIALS'
      };
    }

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return {
          success: false,
          message: 'Email hoặc mật khẩu không chính xác',
          error: 'INVALID_CREDENTIALS'
        };
      }
      
      return {
        success: false,
        message: 'Đăng nhập thất bại',
        error: error.message
      };
    }

    if (!data.user) {
      return {
        success: false,
        message: 'Không thể xác thực người dùng',
        error: 'AUTH_FAILED'
      };
    }

    // Ensure profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      return {
        success: false,
        message: 'Không thể truy cập hồ sơ người dùng',
        error: profileError.message
      };
    }

    // Create profile if it doesn't exist (fallback)
    if (!profile) {
      const { error: createProfileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          full_name: data.user.user_metadata?.full_name || 'Người dùng',
          phone_number: data.user.user_metadata?.phone_number || null,
          primary_role: 'donor',
          is_active: true,
          total_donations: 0,
        });

      if (createProfileError) {
        console.error('Profile creation error:', createProfileError);
        // Don't fail login if profile creation fails
      }
    }

    // Cache invalidation handled by client-side navigation

    return {
      success: true,
      message: 'Đăng nhập thành công! Chào mừng bạn quay lại.',
      data: {
        user: data.user,
        session: data.session
      }
    };

  } catch (error) {
    console.error('Login error:', error);
    
    return {
      success: false,
      message: 'Có lỗi xảy ra, vui lòng thử lại sau',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Logout user
 */
export async function logoutUser(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return {
        success: false,
        message: 'Đăng xuất thất bại',
        error: error.message
      };
    }

    // Cache invalidation handled by client-side navigation

    return {
      success: true,
      message: 'Đăng xuất thành công'
    };

  } catch (error) {
    console.error('Logout error:', error);
    
    return {
      success: false,
      message: 'Có lỗi xảy ra khi đăng xuất',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 