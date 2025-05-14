export interface SocialMediaMention {
  id: string;
  platform: string;
  username: string;
  post_date: string;
  content: string;
  estimated_views: number;
  likes: number;
  shares: number;
  comments: number;
  country: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  project: string;
  url: string;
}

export type SortDirection = 'asc' | 'desc';

export interface FilterState {
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
  countries: string[];
  sentiment: ('Positive' | 'Neutral' | 'Negative')[];
  sortBy: string;
  sortDirection: SortDirection;
}