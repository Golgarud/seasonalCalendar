/**
 * App configuration.
 *
 * The API base URL comes from an EXPO_PUBLIC_ env var so it can differ per
 * environment without code changes. Set it in `.env` (see `.env.example`).
 *
 * Notes:
 * - Web + iOS simulator can use http://localhost:8000
 * - A physical device must use your machine's LAN IP (e.g. http://192.168.1.x:8000)
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://localhost:8000';

/** How often the calendar refetches itself, in milliseconds. */
export const CALENDAR_REFETCH_INTERVAL = 60_000;

export const EVENT_CATEGORIES = [
  'seasonal',
  'garden',
  'chore',
  'birthday',
  'appointment',
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];
