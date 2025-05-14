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
      query = query.gte('Date', filters.dateRange.startDate.toISOString())
                  .lte('Date', filters.dateRange.endDate.toISOString());
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
                        'Engagement';
      query = query.order(sortColumn, { ascending: filters.sortDirection === 'asc' });
    } else {
      // Default sort by estimated views
      query = query.order('Estimated Views', { ascending: false });
    }

    const { data, error } = await query;

    if (error) throw error;

    // Transform the data to match our expected format
    return (data || []).map(item => ({
      id: item.URL, // Using URL as a unique identifier since there's no id column
      platform: 'Unknown', // Platform info not available in the data
      username: item.Source || 'Unknown',
      post_date: item.Date,
      content: item.Headline || '',
      estimated_views: parseInt(item['Estimated Views'] || '0', 10),
      likes: parseInt(item.Engagement || '0', 10),
      shares: 0, // Not available in the data
      comments: 0, // Not available in the data
      country: item.Country || 'Unknown',
      sentiment: item.Sentiment || 'Unknown',
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
      .select('Country');

    if (error) throw error;

    // Manually filter for unique values
    const uniqueCountries = [...new Set(data?.map(item => item.Country))];
    return uniqueCountries.filter(Boolean);

  } catch (error) {
    console.error('Error fetching unique countries:', error);
    return [];
  }
}