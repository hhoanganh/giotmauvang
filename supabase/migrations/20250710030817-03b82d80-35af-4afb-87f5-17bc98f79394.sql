
-- Remove duplicate RLS policies that might be causing the stack depth issue
DROP POLICY IF EXISTS "Anyone can view published articles" ON public.news_articles;
DROP POLICY IF EXISTS "Staff/Admin can manage all articles" ON public.news_articles;

-- Keep only the essential policies
-- The "Public can view published articles" policy already exists and should handle public access
-- The "System admin can manage all articles" policy already exists and should handle admin access
