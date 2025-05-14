import { createClient } from '@supabase/supabase-js';
import type { SocialMediaMention, FilterState } from '../types/data';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchSocialMediaData(filters: FilterState): Promise<SocialMediaMention[]> {
  try {
    let query = supabase
      .from('DATA_PALF_PR')
      .select('*');

    // Apply date range filter if provided
    if (filters.dateRange.startDate && filters.dateRange.endDate) {
      query = query.gte('Date', filters.dateRange.startDate.toISOString().split('T')[0])
                  .lte('Date', filters.dateRange.endDate.toISOString().split('T')[0]);
    }

    // Apply country filter if provided
    if (filters.countries.length > 0) {
      query = query.in('Country', filters.countries);
    }

    // Apply sentiment filter if provided
    if (filters.sentiment.length > 0) {
      query = query.in('Sentiment', filters.sentiment);
    }

    // Apply sorting
    if (filters.sortBy) {
      const sortColumn = filters.sortBy === 'estimated_views' ? 'Estimated Views' : 
                        filters.sortBy === 'post_date' ? 'Date' : 
                        filters.sortBy === 'likes' ? 'Engagement' : 'Date';
      query = query.order(sortColumn, { ascending: filters.sortDirection === 'asc' });
    }

    const { data, error } = await query;

    if (error) throw error;

    // Transform the data to match our expected format
    return (data || []).map(item => ({
      id: item.URL || Math.random().toString(), // Fallback to random ID if URL is missing
      platform: item.Source || 'Unknown',
      username: item.Influencer || 'Unknown',
      post_date: item.Date,
      content: item.Headline || '',
      estimated_views: parseInt(item['Estimated Views'] || '0', 10),
      likes: parseInt(item.Engagement || '0', 10),
      shares: parseInt(item['Social Echo'] || '0', 10),
      comments: 0,
      country: item.Country || 'Unknown',
      sentiment: (item.Sentiment as 'Positive' | 'Neutral' | 'Negative') || 'Neutral',
      project: 'PALF',
      url: item.URL || ''
    }));

  } catch (error) {
    console.error('Error fetching social media data:', error);
    return [];
  }
}

export async function fetchUniqueCountries(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('DATA_PALF_PR')
      .select('Country')
      .not('Country', 'is', null);

    if (error) throw error;

    // Filter unique non-null values and sort alphabetically
    const uniqueCountries = [...new Set(data.map(item => item.Country))];
    return uniqueCountries.sort();

  } catch (error) {
    console.error('Error fetching unique countries:', error);
    return [];
  }
}