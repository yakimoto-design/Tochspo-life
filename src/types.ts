// 型定義ファイル

export interface Team {
  id: number;
  name: string;
  sport_type: string;
  league: string | null;
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  website_url: string | null;
  description: string | null;
  home_venue_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface Venue {
  id: number;
  name: string;
  city: string | null;
  address: string | null;
  capacity: number | null;
  access_info: string | null;
  parking_info: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: number;
  team_id: number;
  opponent_team: string;
  match_date: string;
  venue_id: number | null;
  is_home_game: number;
  ticket_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Player {
  id: number;
  team_id: number;
  name: string;
  uniform_number: number | null;
  position: string | null;
  height: number | null;
  weight: number | null;
  birthdate: string | null;
  hometown: string | null;
  photo_url: string | null;
  bio: string | null;
  is_featured: number;
  created_at: string;
  updated_at: string;
}

export interface GuideArticle {
  id: number;
  title: string;
  sport_type: string;
  slug: string;
  icon: string | null;
  description: string | null;
  content: string;
  sections: string | null;
  tips: string | null;
  recommended_items: string | null;
  image_url: string | null;
  is_published: number;
  created_at: string;
  updated_at: string;
}

export interface LocalSpot {
  id: number;
  venue_id: number;
  name: string;
  category: string;
  address: string | null;
  description: string | null;
  walking_time: number | null;
  website_url: string | null;
  phone: string | null;
  opening_hours: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlayerFeature {
  id: number;
  player_id: number;
  title: string;
  content: string;
  feature_date: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CloudflareBindings {
  DB: D1Database;
  KV?: KVNamespace;
  R2?: R2Bucket;
}
