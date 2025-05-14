import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import FilterPanel from './components/FilterPanel';
import DataTable from './components/DataTable';
import VideoBackground from './components/VideoBackground';
import { fetchSocialMediaData } from './lib/supabase';
import type { SocialMediaMention, FilterState } from './types/data';

function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SocialMediaMention[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    dateRange: { startDate: null, endDate: null },
    countries: [],
    sentiment: [],
    sortBy: 'estimated_views',
    sortDirection: 'desc'
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await fetchSocialMediaData(filters);
        setData(result);
      } catch (error) {
        console.error('Error loading data:', error);
        // In a real app, we'd show an error notification here
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters]);

  // For demonstration purposes, let's add some mock data if Supabase is not configured
  useEffect(() => {
    if (import.meta.env.VITE_SUPABASE_URL === undefined) {
      setTimeout(() => {
        setData(mockData);
        setLoading(false);
      }, 1000);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <VideoBackground src="/background-video.mp4" />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FilterPanel filters={filters} onFiltersChange={setFilters} />
          <DataTable data={data} loading={loading} />
        </motion.div>
      </main>
    </div>
  );
}

// Mock data for demonstration purposes when Supabase is not configured
const mockData: SocialMediaMention[] = [
  {
    id: '1',
    platform: 'Twitter',
    username: '@user123',
    post_date: '2025-04-01T12:00:00Z',
    content: 'Just saw the new HYBE Latin America project! Amazing visuals and sound! #HYBE #LatinAmerica',
    estimated_views: 15000,
    likes: 450,
    shares: 120,
    comments: 45,
    country: 'Mexico',
    sentiment: 'Positive',
    project: 'PALF',
    url: 'https://twitter.com/user123'
  },
  {
    id: '2',
    platform: 'Instagram',
    username: 'music_lover_2022',
    post_date: '2025-03-28T08:30:00Z',
    content: 'Not sure about this new direction HYBE is taking with their Latin America project. Mixed feelings.',
    estimated_views: 8700,
    likes: 230,
    shares: 45,
    comments: 38,
    country: 'Colombia',
    sentiment: 'Neutral',
    project: 'PALF',
    url: 'https://instagram.com/music_lover_2022'
  },
  {
    id: '3',
    platform: 'TikTok',
    username: 'dancefan',
    post_date: '2025-03-29T15:45:00Z',
    content: 'The choreography in the new HYBE Latin project is incredible! #dance #hybe',
    estimated_views: 45000,
    likes: 3200,
    shares: 1800,
    comments: 240,
    country: 'Brazil',
    sentiment: 'Positive',
    project: 'PALF',
    url: 'https://tiktok.com/dancefan'
  },
  {
    id: '4',
    platform: 'YouTube',
    username: 'MusicCritic',
    post_date: '2025-03-26T10:15:00Z',
    content: 'I believe this HYBE Latin America project is missing the mark. Here\'s why...',
    estimated_views: 12300,
    likes: 340,
    shares: 56,
    comments: 89,
    country: 'Argentina',
    sentiment: 'Negative',
    project: 'PALF',
    url: 'https://youtube.com/musiccritic'
  },
  {
    id: '5',
    platform: 'Facebook',
    username: 'Latin Music Today',
    post_date: '2025-03-30T14:20:00Z',
    content: 'HYBE\'s new Latin America project is breaking streaming records already! What do you think?',
    estimated_views: 23000,
    likes: 890,
    shares: 345,
    comments: 156,
    country: 'Spain',
    sentiment: 'Positive',
    project: 'PALF',
    url: 'https://facebook.com/latinmusictoday'
  }
];

export default App;