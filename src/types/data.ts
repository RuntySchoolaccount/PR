export interface SocialMediaMention {
  Date: string;
  Headline: string;
  URL: string;
  'Opening Text': string;
  'Hit Sentence': string;
  Source: string;
  Influencer: string;
  Country: string;
  Subregion: string;
  Language: string;
  Reach: string;
  'Desktop Reach': string;
  'Mobile Reach': string;
  'Twitter Social Echo': string;
  'Facebook Social Echo': string;
  'Reddit Social Echo': string;
  'Earned Traffic': string;
  'National Viewership': string;
  AVE: string;
  Sentiment: string;
  'Key Phrases': string;
  'Input Name': string;
  Keywords: string;
  'Document Tags': string;
  Hidden: string;
  'Tweet Id': string;
  'Twitter Id': string;
  State: string;
  City: string;
  Engagement: string;
  'User Profile Url': string;
  Hashtags: string;
  Views: string;
  'Estimated Views': string;
  'Summarization Disabled': string;
  'Custom Categories': string;
}

export type SortDirection = 'asc' | 'desc';

export interface FilterState {
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
  countries: string[];
  sentiment: string[];
  sortBy: string;
  sortDirection: SortDirection;
}