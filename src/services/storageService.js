import { DEFAULT_CALENDAR_DATA } from '../data/defaultCalendar';

const STORAGE_KEYS = {
  CALENDAR_DATA: 'avent_chic_calendar_data_v1',
  UNLOCKED_DAYS: 'avent_chic_unlocked_days_v1',
  REDEEMED_COUPONS: 'avent_chic_redeemed_coupons_v1',
  CLOUD_CONFIG: 'avent_chic_cloud_config_v1',
};

const DEFAULT_SUPABASE_URL = 'https://fofbrldrfwjkhprkczzn.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZmJybGRyZndqa2hwcmtjenpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ4OTQyNDcsImV4cCI6MjExMDQ3MDI0N30.5ePYZZ26vvncEfnFdWNrRTGR_s_UJoTlVbkfy_PMBOs';

export function getCloudConfig() {
  const envUrl = import.meta.env?.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const envKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
  const envCalId = import.meta.env?.VITE_CALENDAR_ID;

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLOUD_CONFIG);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.provider && parsed.provider !== 'none' && parsed.endpointUrl) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read cloud config:', e);
  }

  if (envUrl && envKey) {
    return {
      provider: 'supabase',
      endpointUrl: envUrl,
      apiKey: envKey,
      calendarId: envCalId || 'mon-calendrier-noel',
    };
  }

  return {
    provider: 'none', // 'none' | 'firebase' | 'supabase' | 'jsonbin'
    endpointUrl: '',
    apiKey: '',
    calendarId: envCalId || 'mon-calendrier-noel',
  };
}

export function saveCloudConfig(config) {
  localStorage.setItem(STORAGE_KEYS.CLOUD_CONFIG, JSON.stringify(config));
}

export function loadLocalCalendarData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CALENDAR_DATA);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        settings: { ...DEFAULT_CALENDAR_DATA.settings, ...(parsed.settings || {}) },
        days: Array.isArray(parsed.days) && parsed.days.length > 0 ? parsed.days : DEFAULT_CALENDAR_DATA.days,
      };
    }
  } catch (e) {
    console.error('Error loading local calendar data:', e);
  }
  return DEFAULT_CALENDAR_DATA;
}

export const LOCAL_STORAGE_BUDGET = 5 * 1024 * 1024; // ~5 Mo on most browsers

// Returns false when the browser storage is full (e.g. too many big stickers)
export function saveLocalCalendarData(data) {
  try {
    localStorage.setItem(STORAGE_KEYS.CALENDAR_DATA, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Local save failed (storage full?):', e);
    return false;
  }
}

// Synchronisation Cloud (Firebase Realtime DB, Supabase, ou JSONBin)
export async function fetchCloudCalendarData() {
  const config = getCloudConfig();
  if (!config || config.provider === 'none' || !config.endpointUrl) {
    return null;
  }

  try {
    if (config.provider === 'firebase') {
      const baseUrl = config.endpointUrl.replace(/\/$/, '');
      const res = await fetch(`${baseUrl}/calendars/${config.calendarId || 'default'}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data && data.days) {
        saveLocalCalendarData(data);
        return data;
      }
    } else if (config.provider === 'supabase') {
      const baseUrl = config.endpointUrl.replace(/\/$/, '');
      const res = await fetch(
        `${baseUrl}/rest/v1/advent_calendars?id=eq.${encodeURIComponent(config.calendarId || 'default')}&select=data`,
        {
          headers: {
            apikey: config.apiKey,
            Authorization: `Bearer ${config.apiKey}`,
          },
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const rows = await res.json();
      if (rows?.[0]?.data) {
        saveLocalCalendarData(rows[0].data);
        return rows[0].data;
      }
    } else if (config.provider === 'jsonbin') {
      const headers = config.apiKey ? { 'X-Master-Key': config.apiKey } : {};
      const res = await fetch(config.endpointUrl, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const record = json.record || json;
      if (record && record.days) {
        saveLocalCalendarData(record);
        return record;
      }
    }
  } catch (err) {
    console.warn('Cloud fetch fallback to local storage:', err);
  }
  return null;
}

export async function pushCloudCalendarData(data) {
  const localOk = saveLocalCalendarData(data);
  const result = await pushCloudOnly(data);
  return localOk ? result : { ...result, quotaExceeded: true };
}

async function pushCloudOnly(data) {
  const config = getCloudConfig();
  if (!config || config.provider === 'none' || !config.endpointUrl) {
    return { synced: false, mode: 'local' };
  }

  try {
    if (config.provider === 'firebase') {
      const baseUrl = config.endpointUrl.replace(/\/$/, '');
      const res = await fetch(`${baseUrl}/calendars/${config.calendarId || 'default'}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Firebase HTTP ${res.status}`);
      return { synced: true, mode: 'firebase' };
    } else if (config.provider === 'supabase') {
      const baseUrl = config.endpointUrl.replace(/\/$/, '');
      const res = await fetch(`${baseUrl}/rest/v1/advent_calendars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: config.apiKey,
          Authorization: `Bearer ${config.apiKey}`,
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          id: config.calendarId || 'default',
          data,
          updated_at: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error(`Supabase HTTP ${res.status}`);
      return { synced: true, mode: 'supabase' };
    } else if (config.provider === 'jsonbin') {
      const headers = {
        'Content-Type': 'application/json',
        ...(config.apiKey ? { 'X-Master-Key': config.apiKey } : {}),
      };
      const res = await fetch(config.endpointUrl, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`JSONBin HTTP ${res.status}`);
      return { synced: true, mode: 'jsonbin' };
    }
  } catch (err) {
    console.error('Cloud push failed:', err);
    return { synced: false, error: err.message };
  }
  return { synced: false, mode: 'local' };
}

export function loadUnlockedDays() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.UNLOCKED_DAYS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveUnlockedDays(days) {
  localStorage.setItem(STORAGE_KEYS.UNLOCKED_DAYS, JSON.stringify(days));
}

export function loadRedeemedCoupons() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REDEEMED_COUPONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRedeemedCoupons(days) {
  localStorage.setItem(STORAGE_KEYS.REDEEMED_COUPONS, JSON.stringify(days));
}
