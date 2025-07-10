-- Add category field to news_articles table
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS category text DEFAULT 'news';

-- Enable RLS on news_articles table
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

-- Public can view published articles only
CREATE POLICY "Public can view published articles" ON news_articles
  FOR SELECT USING (status = 'published');

-- System admin can manage all articles (CRUD)
CREATE POLICY "System admin can manage all articles" ON news_articles
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.primary_role = 'system_admin'
  )); 