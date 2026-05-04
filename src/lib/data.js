// ─── Challenge constants ───────────────────────────────────────────────────
export const CHALLENGE_START = new Date("2026-05-04T00:00:00");
export const CHALLENGE_END = new Date("2026-06-20T23:59:59");
export const TOTAL_DAYS = 50;

// ─── Workout schedule (keyed by JS getDay(): 0=Sun … 6=Sat) ───────────────
export const WORKOUTS = {
  1: {
    name: "Push + Core + Biceps",
    tag: "Monday",
    color: "from-orange-500 to-red-500",
    exercises: [
      { id: "pu", name: "Pushups", detail: "4 sets", icon: "💪" },
      { id: "ip", name: "Incline Pushups", detail: "3 sets", icon: "📈" },
      { id: "dp", name: "Diamond Pushups", detail: "2 sets", icon: "🔺" },
      { id: "bd", name: "Bench Dips", detail: "3 sets", icon: "🪑" },
      { id: "bc", name: "Brick Curls", detail: "3 sets (10–15)", icon: "🧱" },
      { id: "pl", name: "Plank", detail: "3 × 45–60 sec", icon: "⏱️" },
      { id: "lr", name: "Leg Raises", detail: "3 sets", icon: "🦵" },
      { id: "rn", name: "Run", detail: "400–800m", icon: "🏃" },
      { id: "wk", name: "Walk", detail: "3–3.5 km", icon: "🚶" },
    ],
  },

  2: {
    name: "Leg Day",
    tag: "Tuesday",
    color: "from-blue-500 to-cyan-500",
    exercises: [
      { id: "sq", name: "Squats", detail: "4 sets", icon: "🦵" },
      { id: "lu", name: "Lunges", detail: "3 sets each leg", icon: "🚶" },
      { id: "js", name: "Jump Squats", detail: "2 sets", icon: "⬆️" },
      { id: "cr", name: "Calf Raises", detail: "3 sets", icon: "👣" },
      { id: "stp", name: "Step-ups", detail: "3 sets", icon: "🪜" },
      { id: "rn", name: "Run", detail: "400–800m", icon: "🏃" },
      { id: "wk", name: "Walk", detail: "3–5 km", icon: "🚶" },
    ],
  },

  3: {
    name: "Back + Biceps + Light Cardio",
    tag: "Wednesday",
    color: "from-green-500 to-teal-500",
    exercises: [
      { id: "rw", name: "Backpack Rows", detail: "4 sets", icon: "🎒" },
      { id: "sh", name: "Superman Holds", detail: "3 sets", icon: "🦸" },
      { id: "rs", name: "Reverse Snow Angels", detail: "3 sets", icon: "❄️" },
      {
        id: "bc",
        name: "Bicep Curls",
        detail: "3 sets (12–15 reps)",
        icon: "💪",
      },
      {
        id: "sc",
        name: "Slow Curls",
        detail: "2 sets (controlled)",
        icon: "🐢",
      },
      { id: "jg", name: "Light Jog", detail: "10–15 min", icon: "🏃" },
    ],
  },

  4: {
    name: "Upper + Biceps",
    tag: "Thursday",
    color: "from-purple-500 to-pink-500",
    exercises: [
      { id: "pu", name: "Pushups", detail: "4 sets", icon: "💪" },
      { id: "dp", name: "Decline Pushups", detail: "3 sets", icon: "📉" },
      { id: "cp", name: "Close Pushups", detail: "2 sets", icon: "🔻" },
      { id: "bd", name: "Bench Dips", detail: "3 sets", icon: "🪑" },
      { id: "bc", name: "Brick Curls", detail: "4 sets", icon: "🧱" },
      { id: "sc", name: "Slow Curls", detail: "2 sets", icon: "🐢" },
      { id: "st", name: "Shoulder Taps", detail: "3 sets", icon: "🤲" },
      { id: "rn", name: "Run", detail: "800m–1 km", icon: "🏃" },
      { id: "wk", name: "Walk", detail: "3–4 km", icon: "🚶" },
    ],
  },

  5: {
    name: "Legs + Core",
    tag: "Friday",
    color: "from-yellow-500 to-orange-500",
    exercises: [
      { id: "sq", name: "Squats", detail: "3 sets", icon: "🦵" },
      { id: "lu", name: "Lunges", detail: "3 sets", icon: "🚶" },
      { id: "stp", name: "Step-ups", detail: "3 sets", icon: "🪜" },
      { id: "ws", name: "Wall Sit", detail: "2 sets", icon: "🧱" },
      { id: "pl", name: "Plank", detail: "3 sets", icon: "⏱️" },
      { id: "rw", name: "Reverse Walk", detail: "200–300m", icon: "↩️" },
      { id: "rn", name: "Run", detail: "800m", icon: "🏃" },
      { id: "wk", name: "Walk", detail: "3–4 km", icon: "🚶" },
    ],
  },

  6: {
    name: "Active + Light Arms",
    tag: "Saturday",
    color: "from-pink-500 to-rose-500",
    exercises: [
      { id: "wk", name: "Walk", detail: "5–6 km", icon: "🚶" },
      { id: "rn", name: "Easy Run", detail: "800m–1 km", icon: "🏃" },
      { id: "pu", name: "Pushups", detail: "2 sets", icon: "💪" },
      { id: "bc", name: "Light Curls", detail: "2 sets", icon: "🧱" },
      { id: "st", name: "Stretching", detail: "10 min", icon: "🧘" },
    ],
  },

  0: {
    name: "Recovery Day",
    tag: "Sunday",
    color: "from-slate-500 to-gray-600",
    exercises: [
      { id: "wk", name: "Recovery Walk", detail: "3–4 km", icon: "🚶" },
      { id: "st", name: "Stretching", detail: "15 min", icon: "🧘" },
    ],
  },
};

// ─── Date helpers ───────────────────────────────────────────────────────────

function getLocalDateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
export function getTodayKey() {
  return getLocalDateKey(new Date());
}
export function dateKey(d) {
  return getLocalDateKey(d);
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
    markDayDone(getTodayKey());
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
    const k = getLocalDateKey(cur);
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
    const k = getLocalDateKey(d);
    let status = "future";

    if (done.includes(k)) {
      status = "done";
    } else if (d.getTime() === today.getTime()) {
      status = "today";
    } else if (d < today) {
      status = "missed";
    }
    days.push({ date: d, key: k, dayNum: i + 1, status });
  }
  return days;
}
export function getHighestSteps() {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem("highestSteps") || "0");
}

export function updateHighestSteps(steps) {
  const current = getHighestSteps();
  if (steps > current) {
    localStorage.setItem("highestSteps", steps);
  }
}

export function getHighestWater() {
  if (typeof window === "undefined") return 0;
  return parseFloat(localStorage.getItem("highestWater") || "0");
}

export function updateHighestWater(water) {
  const current = getHighestWater();
  if (water > current) {
    localStorage.setItem("highestWater", water);
  }
}

export function getBestStreak() {
  return parseInt(localStorage.getItem("bestStreak") || "0");
}

export function updateBestStreak(streak) {
  const current = getBestStreak();
  if (streak > current) {
    localStorage.setItem("bestStreak", streak);
  }
}
