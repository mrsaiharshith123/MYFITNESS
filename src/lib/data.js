// ─── Challenge constants ───────────────────────────────────────────────────
export const CHALLENGE_START = new Date("2026-04-29T00:00:00");
export const CHALLENGE_END = new Date("2026-06-17T23:59:59");
export const TOTAL_DAYS = 50;

// ─── Workout schedule (keyed by JS getDay(): 0=Sun … 6=Sat) ───────────────
export const WORKOUTS = {
  1: {
    name: "Push + Core",
    tag: "Monday",
    color: "from-orange-500 to-red-500",
    exercises: [
      { id: "pu", name: "Pushups", detail: "4 sets", icon: "💪" },
      { id: "dp", name: "Dips", detail: "3 sets", icon: "🏋️" },
      { id: "pp", name: "Pike Pushups", detail: "3 sets", icon: "🔼" },
      { id: "pl", name: "Plank", detail: "Max hold", icon: "⏱️" },
      { id: "lr", name: "Leg Raises", detail: "3 sets", icon: "🦵" },
      { id: "jg", name: "Jog", detail: "15 min", icon: "🏃" },
    ],
  },
  2: {
    name: "Legs + Sprints",
    tag: "Tuesday",
    color: "from-blue-500 to-cyan-500",
    exercises: [
      { id: "sq", name: "Squats", detail: "4×20", icon: "🦵" },
      { id: "lu", name: "Lunges", detail: "3×12 each", icon: "🚶" },
      { id: "js", name: "Jump Squats", detail: "3 sets", icon: "⬆️" },
      { id: "cr", name: "Calf Raises", detail: "4 sets", icon: "👣" },
      { id: "sp", name: "100m Sprints", detail: "6 runs", icon: "⚡" },
    ],
  },
  3: {
    name: "Back + Run",
    tag: "Wednesday",
    color: "from-green-500 to-teal-500",
    exercises: [
      { id: "rw", name: "Rows", detail: "4 sets", icon: "🏊" },
      { id: "sh", name: "Superman Holds", detail: "3 sets", icon: "🦸" },
      { id: "rs", name: "Reverse Snow Angels", detail: "3 sets", icon: "❄️" },
      { id: "bc", name: "Bicep Curls", detail: "3 sets", icon: "💪" },
      { id: "jg", name: "Jog", detail: "15 min", icon: "🏃" },
    ],
  },
  4: {
    name: "Full Body Circuit",
    tag: "Thursday",
    color: "from-purple-500 to-pink-500",
    exercises: [
      { id: "pu", name: "Pushups", detail: "15 reps/round", icon: "💪" },
      { id: "sq", name: "Squats", detail: "20 reps/round", icon: "🦵" },
      {
        id: "mc",
        name: "Mountain Climbers",
        detail: "20 reps/round",
        icon: "🧗",
      },
      { id: "bu", name: "Burpees", detail: "10 reps/round", icon: "🔄" },
      { id: "pl", name: "Plank", detail: "45 sec/round", icon: "⏱️" },
      { id: "rd", name: "Rounds", detail: "3–5 rounds", icon: "🔁" },
      { id: "jg", name: "Jog", detail: "10 min", icon: "🏃" },
    ],
  },
  5: {
    name: "Push + Sprints",
    tag: "Friday",
    color: "from-yellow-500 to-orange-500",
    exercises: [
      { id: "pu", name: "Pushups", detail: "4 sets", icon: "💪" },
      { id: "dp", name: "Dips", detail: "3 sets", icon: "🏋️" },
      { id: "pp", name: "Pike Pushups", detail: "3 sets", icon: "🔼" },
      { id: "pl", name: "Plank", detail: "Max hold", icon: "⏱️" },
      { id: "lr", name: "Leg Raises", detail: "3 sets", icon: "🦵" },
      { id: "sp", name: "100m Sprints", detail: "8 runs", icon: "⚡" },
    ],
  },
  6: {
    name: "Cardio + Abs",
    tag: "Saturday",
    color: "from-pink-500 to-rose-500",
    exercises: [
      { id: "jg", name: "Easy Jog", detail: "20–30 min", icon: "🏃" },
      { id: "ab", name: "Abs Workout", detail: "3 sets", icon: "🔥" },
      { id: "st", name: "Stretching", detail: "10 min", icon: "🧘" },
    ],
  },
  0: {
    name: "Recovery Day",
    tag: "Sunday",
    color: "from-slate-500 to-gray-600",
    exercises: [
      { id: "rw", name: "Recovery Walk", detail: "20–30 min", icon: "🚶" },
      { id: "st", name: "Stretching", detail: "15 min", icon: "🧘" },
    ],
  },
};

// ─── Date helpers ───────────────────────────────────────────────────────────
export function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function dateKey(d) {
  return d.toISOString().slice(0, 10);
}

export function getDayNumber() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(CHALLENGE_START);
  start.setHours(0, 0, 0, 0);
  const diff = Math.floor((today - start) / 86400000) + 1;
  if (diff < 1) return 1;
  if (diff > TOTAL_DAYS) return TOTAL_DAYS;
  return diff;
}

export function getCountdownDays() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(CHALLENGE_END);
  end.setHours(0, 0, 0, 0);
  const diff = Math.ceil((end - today) / 86400000);
  return Math.max(0, diff);
}

export function getProgressPct() {
  return Math.min(100, Math.round((getDayNumber() / TOTAL_DAYS) * 100));
}

export function getTodayWorkout() {
  const dow = new Date().getDay();
  return WORKOUTS[dow];
}

export function formatDate(d = new Date()) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// ─── localStorage helpers ───────────────────────────────────────────────────
function ls(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem("t50_" + key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
function lsSet(key, value) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("t50_" + key, JSON.stringify(value));
  } catch {}
}

// ─── Checked exercises ──────────────────────────────────────────────────────
export function getChecked(dateStr) {
  return ls("checked_" + dateStr, []);
}
export function setChecked(dateStr, arr) {
  lsSet("checked_" + dateStr, arr);
}

// ─── Done days ──────────────────────────────────────────────────────────────
export function getDoneDays() {
  return ls("done_days", []);
}
export function setDoneDays(arr) {
  lsSet("done_days", arr);
}
export function markDayDone(dateStr) {
  const days = getDoneDays();
  if (!days.includes(dateStr)) {
    days.push(dateStr);
    setDoneDays(days);
  }
}

// ─── Streak ─────────────────────────────────────────────────────────────────
export function getStreak() {
  const done = getDoneDays().sort();
  if (!done.length) return 0;
  let streak = 0;
  const today = getTodayKey();
  let cur = new Date(today);
  while (true) {
    const k = cur.toISOString().slice(0, 10);
    if (done.includes(k)) {
      streak++;
      cur.setDate(cur.getDate() - 1);
    } else break;
  }
  return streak;
}

// ─── Run log ─────────────────────────────────────────────────────────────────
export function getRunLog() {
  return ls("run_log", []);
}
export function addRunEntry(entry) {
  const log = getRunLog();
  log.unshift({ ...entry, ts: Date.now() });
  lsSet("run_log", log.slice(0, 200));
}
export function clearTodayRun() {
  const today = getTodayKey();
  lsSet(
    "run_log",
    getRunLog().filter((e) => e.date !== today),
  );
}

// ─── Step log ────────────────────────────────────────────────────────────────
export function getStepLog() {
  return ls("step_log", []);
}
export function saveStepEntry(steps) {
  const today = getTodayKey();
  const log = getStepLog().filter((e) => e.date !== today);
  log.unshift({ date: today, steps, ts: Date.now() });
  lsSet("step_log", log.slice(0, 200));
}
export function getTodaySteps() {
  const today = getTodayKey();
  const e = getStepLog().find((e) => e.date === today);
  return e ? e.steps : 0;
}

// ─── Water log ───────────────────────────────────────────────────────────────
export function getWaterLog() {
  return ls("water_log", []);
}
export function saveWaterEntry(glasses) {
  const today = getTodayKey();
  const log = getWaterLog().filter((e) => e.date !== today);
  log.unshift({ date: today, glasses, ts: Date.now() });
  lsSet("water_log", log.slice(0, 200));
}
export function getTodayWater() {
  const today = getTodayKey();
  const e = getWaterLog().find((e) => e.date === today);
  return e ? e.glasses : 0;
}

// ─── Strength log ────────────────────────────────────────────────────────────
export function getStrengthLog() {
  return ls("strength_log", []);
}
export function addStrengthEntry(entry) {
  const log = getStrengthLog();
  log.unshift({ ...entry, date: getTodayKey(), ts: Date.now() });
  lsSet("strength_log", log.slice(0, 200));
}
export function getBestPushups() {
  const log = getStrengthLog().filter((e) => e.pushups);
  return log.length ? Math.max(...log.map((e) => e.pushups)) : 0;
}

// ─── Photos ──────────────────────────────────────────────────────────────────
export function getPhotos() {
  return ls("photos", []);
}
export function addPhoto(dataUrl, label) {
  const photos = getPhotos();
  photos.unshift({ dataUrl, label, date: getTodayKey(), ts: Date.now() });
  lsSet("photos", photos.slice(0, 20));
}
export function deletePhoto(ts) {
  lsSet(
    "photos",
    getPhotos().filter((p) => p.ts !== ts),
  );
}

// ─── Calendar helpers ─────────────────────────────────────────────────────
export function buildCalendarDays() {
  const days = [];
  const start = new Date(CHALLENGE_START);
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const done = getDoneDays();

  for (let i = 0; i < TOTAL_DAYS; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const k = d.toISOString().slice(0, 10);
    let status = "future";
    if (d.getTime() === today.getTime()) status = "today";
    else if (done.includes(k)) status = "done";
    else if (d < today) status = "missed";
    days.push({ date: d, key: k, dayNum: i + 1, status });
  }
  return days;
}
