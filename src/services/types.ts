import type { EventCategory } from '@/config';

export interface User {
  id: number;
  name: string;
  email: string;
}

export type Hemisphere = 'north' | 'south';
export type MemberRole = 'owner' | 'editor' | 'viewer';

export interface Calendar {
  id: number;
  name: string;
  owner_id: number;
  hemisphere: Hemisphere;
  created_at: string;
  role?: MemberRole;
}

export interface CalendarEvent {
  id: number;
  calendar_id: number;
  title: string;
  description: string | null;
  category: EventCategory;
  start_date: string; // YYYY-MM-DD
  start_time: string | null; // HH:MM:SS
  end_date: string | null;
  end_time: string | null;
  all_day: 0 | 1;
  rrule: string | null; // RFC 5545 RRULE, expanded client-side
  color: string | null;
  created_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface Crop {
  id: number;
  name: string;
  type: string | null;
  plant_start_month: number | null;
  plant_end_month: number | null;
  harvest_start_month: number | null;
  harvest_end_month: number | null;
  icon: string | null;
}
