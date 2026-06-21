import { api } from './api';
import { tokenStore } from './storage';
import type { Calendar, CalendarEvent, Crop, User } from './types';

/** Auth */
export const auth = {
  async register(name: string, email: string, password: string) {
    const res = await api<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      auth: false,
      body: { name, email, password },
    });
    await tokenStore.set(res.token);
    return res.user;
  },
  async login(email: string, password: string) {
    const res = await api<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      auth: false,
      body: { email, password },
    });
    await tokenStore.set(res.token);
    return res.user;
  },
  async me() {
    const res = await api<{ user: User }>('/api/auth/me');
    return res.user;
  },
  async logout() {
    try {
      await api('/api/auth/logout', { method: 'POST' });
    } finally {
      await tokenStore.clear();
    }
  },
};

/** Calendars */
export const calendars = {
  async list() {
    return (await api<{ calendars: Calendar[] }>('/api/calendars')).calendars;
  },
  async create(name: string, hemisphere: 'north' | 'south' = 'north') {
    return (await api<{ calendar: Calendar }>('/api/calendars', { method: 'POST', body: { name, hemisphere } })).calendar;
  },
  async invite(calendarId: number, email: string, role: 'editor' | 'viewer' = 'editor') {
    return api<{ invite_token: string }>(`/api/calendars/${calendarId}/invite`, { method: 'POST', body: { email, role } });
  },
};

/** Events */
export const events = {
  async list(calendarId: number, params?: { from?: string; to?: string; category?: string }) {
    const qs = params
      ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v) as [string, string][]).toString()
      : '';
    return (await api<{ events: CalendarEvent[] }>(`/api/calendars/${calendarId}/events${qs}`)).events;
  },
  async create(calendarId: number, payload: Partial<CalendarEvent> & { title: string; start_date: string }) {
    return (await api<{ event: CalendarEvent }>(`/api/calendars/${calendarId}/events`, { method: 'POST', body: payload })).event;
  },
  async update(eventId: number, payload: Partial<CalendarEvent>) {
    return (await api<{ event: CalendarEvent }>(`/api/events/${eventId}`, { method: 'PUT', body: payload })).event;
  },
  async remove(eventId: number) {
    return api(`/api/events/${eventId}`, { method: 'DELETE' });
  },
};

/** Crops + garden */
export const garden = {
  async crops() {
    return (await api<{ crops: Crop[] }>('/api/crops')).crops;
  },
  async list(calendarId: number) {
    return (await api<{ garden: Crop[] }>(`/api/calendars/${calendarId}/garden`)).garden;
  },
  async add(calendarId: number, cropId: number) {
    return api(`/api/calendars/${calendarId}/garden`, { method: 'POST', body: { crop_id: cropId } });
  },
  async remove(calendarId: number, cropId: number) {
    return api(`/api/calendars/${calendarId}/garden/${cropId}`, { method: 'DELETE' });
  },
};
