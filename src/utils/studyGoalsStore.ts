export interface FocusTimerState {
  active: boolean;
  hoursGoal: number;
  minutesGoal: number;
  status: 'idle' | 'running' | 'paused';
  elapsedTodaySec: number;
  dateKey: string;
  lastUpdatedAt: number;
}

export interface PracticeGoalLogEntry {
  completed: number;
  target: number;
}

export const GOALS_UPDATED_EVENT = 'achiev_goals_updated';

export const SHORT_DAY_NAMES = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'] as const;

const FOCUS_STATE_KEY = 'achiev_focus_timer_state_v1';
const FOCUS_LOGS_KEY = 'achiev_focus_timer_logs_v1';
const FOCUS_HOURS_KEY = 'medden_daily_hours';
const FOCUS_MINUTES_KEY = 'achiev_daily_focus_minutes';
const FOCUS_ACTIVE_KEY = 'achiev_focus_target_active';

const MCQ_GOAL_KEY = 'medden_daily_qbank';
const IMAGE_Q_GOAL_KEY = 'achiev_daily_image_q_goal';
const MCQ_LOGS_KEY = 'achiev_daily_mcq_logs_v1';
const IMAGE_Q_LOGS_KEY = 'achiev_daily_image_q_logs_v1';

export function getLocalDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatShortDayAndClock12h(date: Date = new Date()): { day: string; time: string } {
  const day = SHORT_DAY_NAMES[date.getDay()] || 'Mon';
  let h = date.getHours();
  const m = String(date.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return {
    day,
    time: `${h}:${m} ${ampm}`,
  };
}

export function formatDurationCompact(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function formatDurationWords(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m ${s}s`;
  if (h > 0) return `${h}h ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function formatLogDateLabel(dateKey: string): string {
  const parts = dateKey.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return dateKey;
  const d = new Date(parts[0]!, parts[1]! - 1, parts[2]!);
  const day = SHORT_DAY_NAMES[d.getDay()] || '';
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  return `${day}, ${parts[2]} ${month} ${parts[0]}`;
}

export function getFocusTargetConfig(): { active: boolean; hours: number; minutes: number } {
  try {
    const rawHours = localStorage.getItem(FOCUS_HOURS_KEY);
    const rawMins = localStorage.getItem(FOCUS_MINUTES_KEY);
    const rawActive = localStorage.getItem(FOCUS_ACTIVE_KEY);
    const hours = rawHours !== null ? Math.max(0, Math.min(24, Number(rawHours) || 0)) : 5;
    const minutes = rawMins !== null ? Math.max(0, Math.min(59, Number(rawMins) || 0)) : 0;
    const active = rawActive === 'true' || rawHours !== null || rawMins !== null;
    return { active, hours, minutes };
  } catch {
    return { active: false, hours: 5, minutes: 0 };
  }
}

export function getFocusTimerLogs(): Record<string, number> {
  try {
    const raw = localStorage.getItem(FOCUS_LOGS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function getFocusTimerState(): FocusTimerState {
  const todayKey = getLocalDateKey();
  const cfg = getFocusTargetConfig();
  const logs = getFocusTimerLogs();
  const baseElapsed = Math.max(0, Number(logs[todayKey]) || 0);

  try {
    const raw = localStorage.getItem(FOCUS_STATE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<FocusTimerState>;
      const isSameDay = parsed.dateKey === todayKey;
      return {
        active: cfg.active || Boolean(parsed.active),
        hoursGoal: cfg.hours,
        minutesGoal: cfg.minutes,
        status: isSameDay && (parsed.status === 'running' || parsed.status === 'paused' || parsed.status === 'idle')
          ? parsed.status
          : 'idle',
        elapsedTodaySec: isSameDay ? Math.max(baseElapsed, Number(parsed.elapsedTodaySec) || 0) : baseElapsed,
        dateKey: todayKey,
        lastUpdatedAt: Number(parsed.lastUpdatedAt) || Date.now(),
      };
    }
  } catch {}

  return {
    active: cfg.active,
    hoursGoal: cfg.hours,
    minutesGoal: cfg.minutes,
    status: 'idle',
    elapsedTodaySec: baseElapsed,
    dateKey: todayKey,
    lastUpdatedAt: Date.now(),
  };
}

export function saveFocusTimerState(next: FocusTimerState, notify = true): void {
  try {
    localStorage.setItem(FOCUS_STATE_KEY, JSON.stringify(next));
    if (next.elapsedTodaySec > 0) {
      const logs = getFocusTimerLogs();
      logs[next.dateKey] = Math.max(Number(logs[next.dateKey]) || 0, next.elapsedTodaySec);
      localStorage.setItem(FOCUS_LOGS_KEY, JSON.stringify(logs));
    }
  } catch {}
  if (notify && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(GOALS_UPDATED_EVENT));
  }
}

export function setFocusTargetGoal(hours: number, minutes: number): void {
  const safeHours = Math.max(0, Math.min(24, Math.floor(hours)));
  const safeMinutes = safeHours === 24 ? 0 : Math.max(0, Math.min(59, Math.floor(minutes)));
  try {
    localStorage.setItem(FOCUS_HOURS_KEY, String(safeHours));
    localStorage.setItem(FOCUS_MINUTES_KEY, String(safeMinutes));
    localStorage.setItem(FOCUS_ACTIVE_KEY, 'true');
  } catch {}
  const prev = getFocusTimerState();
  saveFocusTimerState({
    ...prev,
    active: true,
    hoursGoal: safeHours,
    minutesGoal: safeMinutes,
  });
}

export function recordFocusSecondTick(): FocusTimerState {
  const prev = getFocusTimerState();
  if (prev.status !== 'running') return prev;
  const nextSec = prev.elapsedTodaySec + 1;
  const next: FocusTimerState = {
    ...prev,
    elapsedTodaySec: nextSec,
    dateKey: getLocalDateKey(),
    lastUpdatedAt: Date.now(),
  };
  saveFocusTimerState(next, true);
  return next;
}

export function setFocusTimerStatus(status: 'running' | 'paused' | 'idle', resetElapsed = false): FocusTimerState {
  const prev = getFocusTimerState();
  const next: FocusTimerState = {
    ...prev,
    active: true,
    status,
    elapsedTodaySec: resetElapsed ? 0 : prev.elapsedTodaySec,
    dateKey: getLocalDateKey(),
    lastUpdatedAt: Date.now(),
  };
  if (resetElapsed) {
    try {
      const logs = getFocusTimerLogs();
      logs[next.dateKey] = 0;
      localStorage.setItem(FOCUS_LOGS_KEY, JSON.stringify(logs));
    } catch {}
  }
  saveFocusTimerState(next, true);
  return next;
}

export function getDailyMcqGoal(): number {
  try {
    const val = Number(localStorage.getItem(MCQ_GOAL_KEY));
    return Number.isFinite(val) && val > 0 ? Math.round(val) : 40;
  } catch {
    return 40;
  }
}

export function setDailyMcqGoalValue(target: number): number {
  const safe = Math.max(1, Math.min(2000, Math.round(target) || 1));
  try {
    localStorage.setItem(MCQ_GOAL_KEY, String(safe));
    const logs = getPracticeLogs('mcq');
    const todayKey = getLocalDateKey();
    logs[todayKey] = {
      completed: logs[todayKey]?.completed ?? 0,
      target: safe,
    };
    localStorage.setItem(MCQ_LOGS_KEY, JSON.stringify(logs));
  } catch {}
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(GOALS_UPDATED_EVENT));
  }
  return safe;
}

export function getDailyImageQGoal(): number {
  try {
    const val = Number(localStorage.getItem(IMAGE_Q_GOAL_KEY));
    return Number.isFinite(val) && val > 0 ? Math.round(val) : 15;
  } catch {
    return 15;
  }
}

export function setDailyImageQGoalValue(target: number): number {
  const safe = Math.max(1, Math.min(2000, Math.round(target) || 1));
  try {
    localStorage.setItem(IMAGE_Q_GOAL_KEY, String(safe));
    const logs = getPracticeLogs('image');
    const todayKey = getLocalDateKey();
    logs[todayKey] = {
      completed: logs[todayKey]?.completed ?? 0,
      target: safe,
    };
    localStorage.setItem(IMAGE_Q_LOGS_KEY, JSON.stringify(logs));
  } catch {}
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(GOALS_UPDATED_EVENT));
  }
  return safe;
}

export function getPracticeLogs(kind: 'mcq' | 'image'): Record<string, PracticeGoalLogEntry> {
  const key = kind === 'mcq' ? MCQ_LOGS_KEY : IMAGE_Q_LOGS_KEY;
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function logTodayPracticeCount(kind: 'mcq' | 'image', completed: number, target: number): void {
  const key = kind === 'mcq' ? MCQ_LOGS_KEY : IMAGE_Q_LOGS_KEY;
  const todayKey = getLocalDateKey();
  const safeCompleted = Math.max(0, Math.min(5000, Math.round(completed) || 0));
  const safeTarget = Math.max(1, Math.min(5000, Math.round(target) || 1));
  try {
    const logs = getPracticeLogs(kind);
    logs[todayKey] = { completed: safeCompleted, target: safeTarget };
    localStorage.setItem(key, JSON.stringify(logs));
  } catch {}
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(GOALS_UPDATED_EVENT));
  }
}
