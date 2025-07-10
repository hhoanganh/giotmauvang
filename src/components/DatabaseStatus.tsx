import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const DatabaseStatus: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [error, setError] = useState<string>('');
  const [articleCount, setArticleCount] = useState<number>(0);

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing Supabase connection...');
        
        // Test basic connection
        const { data, error } = await supabase
          .from('news_articles')
          .select('id')
          .limit(1);
        
        if (error) {
          console.error('Database connection error:', error);
          setStatus('error');
          setError(error.message);
        } else {
          console.log('Database connection successful');
          setStatus('connected');
          
          // Get article count (fix: only select id)
          const { count, error: countError } = await supabase
            .from('news_articles')
            .select('id', { count: 'exact', head: true });
          if (countError) {
            setError(countError.message);
          }
          setArticleCount(count || 0);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setStatus('error');
        setError('Unexpected error occurred');
      }
    };

    testConnection();
  }, []);

  if (status === 'loading') {
    return (
      <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded z-50">
        Testing database connection...
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded z-50 max-w-sm">
        <div className="font-bold">Database Error:</div>
        <div className="text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded z-50">
      <div className="font-bold">Database Connected</div>
      <div className="text-sm">{articleCount} articles found</div>
    </div>
  );
};

export default DatabaseStatus; 