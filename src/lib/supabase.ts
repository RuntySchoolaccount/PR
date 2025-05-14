import { createClient } from '@supabase/supabase-js';
import type { SocialMediaMention, FilterState } from '../types/data';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
      query = query.order(filters.sortBy, { ascending: filters.sortDirection === 'asc' });
    } else {
      query = query.order('Date', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    return data || [];

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

    const uniqueCountries = [...new Set(data.map(item => item.Country))]
      .filter(Boolean)
      .sort();

    return uniqueCountries;

  } catch (error) {
    console.error('Error fetching unique countries:', error);
    return [];
  }
}