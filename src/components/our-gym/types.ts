export type ThemeMode = 'light' | 'dark';

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  description: string;
  primaryColor: string;
  bgColor: string;
  accentBadge: string;
}

export interface TrainingProgram {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  highlights: string[];
}

export interface FacilityItem {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  role: string;
  rating: number;
  text: string;
  date: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'all' | 'gym' | 'equipment' | 'training' | 'community';
  image: string;
  caption: string;
}

export interface MembershipPlan {
  id: string;
  title: string;
  badge?: string;
  subtitle: string;
  description: string;
  features: string[];
  recommended?: boolean;
}
