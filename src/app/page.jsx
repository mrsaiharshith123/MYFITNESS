'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import {
  TOTAL_DAYS, WORKOUTS,
  getTodayKey, getDayNumber, getCountdownDays, getProgressPct,
  getTodayWorkout, formatDate, buildCalendarDays,
  getChecked, setChecked, getDoneDays, markDayDone, getStreak,
  getRunLog, addRunEntry, clearTodayRun,
  getStepLog, saveStepEntry, getTodaySteps,
  getWaterLog, saveWaterEntry, getTodayWater,
  getStrengthLog, addStrengthEntry, getBestPushups,
  getPhotos, addPhoto, deletePhoto,
} from '../lib/data'

import ShareProgress from '../components/ShareProgress'

// ─── Icons (inline SVG, no dependency) ──────────────────────────────────────
const Icon = ({ d, size = 24, cls = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={cls}>
    <path d={d} />
  </svg>
)
const HomeIcon    = (p) => <Icon {...p} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10" />
const DumbellIcon = (p) => <Icon {...p} d="M6 4v16M18 4v16M3 8h3m12 0h3M3 16h3m12 0h3M6 8h12M6 16h12" />
const RunIcon     = (p) => <Icon {...p} d="M13 4a1 1 0 100-2 1 1 0 000 2zM6 20l4-8 2 3 2-3 4 8M7 10l2-4 4 1 3 3" />
const DropIcon    = (p) => <Icon {...p} d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
const CalIcon     = (p) => <Icon {...p} d="M3 4h18v18H3zM16 2v4M8 2v4M3 10h18" />
const ChartIcon   = (p) => <Icon {...p} d="M3 3v18h18M9 9l3 3 4-4 3 3" />
const CamIcon     = (p) => <Icon {...p} d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z M12 17a4 4 0 100-8 4 4 0 000 8" />
const CheckIcon   = (p) => <Icon {...p} d="M20 6L9 17l-5-5" />
const FlameIcon   = (p) => <Icon {...p} d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
const AlertIcon   = (p) => <Icon {...p} d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
const XIcon       = (p) => <Icon {...p} d="M18 6L6 18M6 6l12 12" />
const StepsIcon   = (p) => <Icon {...p} d="M3 21l5-5m0 0l5-5m-5 5l-1.5-1.5M13 16l5-5m0 0l-1.5-1.5M8 16l5-5" />

// ─── Confetti ─────────────────────────────────────────────────────────────────
function fireConfetti() {
  if (typeof window === 'undefined') return
  import('canvas-confetti').then(({ default: confetti }) => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#f97316', '#fb923c', '#fdba74', '#fff', '#fde68a'] })
    setTimeout(() => confetti({ particleCount: 80, spread: 100, origin: { y: 0.4 } }), 300)
  }).catch(() => {})
}

// ─── Reusable UI primitives ──────────────────────────────────────────────────
const Card = ({ children, cls = '' }) => (
  <div className={`bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] ${cls}`}>{children}</div>
)

const Pill = ({ children, color = 'orange' }) => {
  const colors = { orange: 'bg-orange-500/20 text-orange-400', green: 'bg-green-500/20 text-green-400', blue: 'bg-blue-500/20 text-blue-400', red: 'bg-red-500/20 text-red-400' }
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colors[color]}`}>{children}</span>
}

function InputRow({ label, value, onChange, onSave, onReset, placeholder = '0', type = 'number', unit = '' }) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</label>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-[#222] border border-[#333] rounded-xl px-4 py-3 text-white text-base outline-none focus:border-orange-500 transition-colors"
          />
          {unit && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{unit}</span>}
        </div>
        <button onClick={onSave} className="bg-orange-500 text-white rounded-xl px-4 py-3 font-semibold text-sm active:scale-95 transition-transform whitespace-nowrap">
          Save
        </button>
        <button onClick={onReset} className="bg-[#2a2a2a] text-gray-400 rounded-xl px-3 py-3 text-sm active:scale-95 transition-transform">
          ✕
        </button>
      </div>
    </div>
  )
}

// ─── Progress ring SVG ────────────────────────────────────────────────────────
function ProgressRing({ pct, size = 120, stroke = 10 }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#2a2a2a" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f97316" strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
    </svg>
  )
}

// ─── TAB: HOME ────────────────────────────────────────────────────────────────
function HomeTab({ refresh, setTab }) {
  const today = getTodayKey()
  const dayNum = getDayNumber()
  const countdown = getCountdownDays()
  const pct = getProgressPct()
  const workout = getTodayWorkout()
  const checked = getChecked(today)
  const streak = getStreak()
  const doneDays = getDoneDays()
  const isWorkoutDone = doneDays.includes(today)
  const wPct = workout.exercises.length > 0 ? Math.round((checked.length / workout.exercises.length) * 100) : 0

  function completeWorkout() {
    markDayDone(today)
    fireConfetti()
    refresh()
  }

  return (
    <div className="flex flex-col gap-4 p-4 animate-slide-up">
      {/* Hero card */}
      <Card cls="p-5 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${workout.color} opacity-10 rounded-2xl`} />
        <div className="flex items-start justify-between">
          <div>
            <div className="text-gray-400 text-sm mb-1">{formatDate()}</div>
            <div className="text-5xl font-bold text-white">Day {dayNum}</div>
            <div className="text-gray-400 text-sm mt-1">of {TOTAL_DAYS} days</div>
          </div>
          <div className="relative flex items-center justify-center">
            <ProgressRing pct={pct} size={90} stroke={8} />
            <div className="absolute text-center">
              <div className="text-lg font-bold text-orange-400">{pct}%</div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <div className="flex-1 bg-black/30 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-orange-400">{countdown}</div>
            <div className="text-xs text-gray-400 mt-0.5">days left</div>
          </div>
          <div className="flex-1 bg-black/30 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-orange-400">{streak}</div>
            <div className="text-xs text-gray-400 mt-0.5">day streak 🔥</div>
          </div>
          <div className="flex-1 bg-black/30 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-orange-400">{doneDays.length}</div>
            <div className="text-xs text-gray-400 mt-0.5">days done</div>
          </div>
        </div>
      </Card>
      {typeof window !== 'undefined' && <ShareProgress />}
      {/* Today's workout card */}
      <Card cls="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Today's Workout</div>
            <div className="text-xl font-bold">{workout.name}</div>
          </div>
          <Pill color="orange">{workout.tag}</Pill>
        </div>
        <div className="space-y-2 mb-4">
          {workout.exercises.map((ex, i) => (
            <div key={ex.id + i} className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${checked.includes(i) ? 'bg-green-400' : 'bg-[#333]'}`} />
              <span className={`text-sm ${checked.includes(i) ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                {ex.name} <span className="text-gray-500">— {ex.detail}</span>
              </span>
            </div>
          ))}
        </div>
        {/* Progress bar */}
        <div className="bg-[#222] rounded-full h-2 mb-4">
          <div className="bg-orange-500 h-2 rounded-full transition-all duration-500" style={{ width: wPct + '%' }} />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTab('workout')}
            className="flex-1 bg-orange-500 text-white rounded-xl py-3.5 font-semibold text-base active:scale-95 transition-transform"
          >
            Open Checklist
          </button>
          {!isWorkoutDone && (
            <button
              onClick={completeWorkout}
              className="bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl px-4 py-3.5 font-semibold text-sm active:scale-95 transition-transform"
            >
              Done ✓
            </button>
          )}
          {isWorkoutDone && (
            <div className="bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl px-4 py-3.5 font-semibold text-sm flex items-center">
              ✓ Done
            </div>
          )}
        </div>
      </Card>

      {/* Emergency / lazy mode */}
      <Card cls="p-5 border-red-500/20">
        <div className="flex items-center gap-3 mb-3">
          <AlertIcon size={20} cls="text-red-400" />
          <div className="text-sm font-semibold text-red-400">Emergency Mode</div>
        </div>
        <button
          onClick={() => setTab('lazy')}
          className="w-full bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl py-3 font-semibold text-sm active:scale-95 transition-transform"
        >
          I feel lazy today 😩
        </button>
      </Card>
    </div>
  )
}

// ─── TAB: WORKOUT CHECKLIST ───────────────────────────────────────────────────
function WorkoutTab({ refresh }) {
  const today = getTodayKey()
  const workout = getTodayWorkout()
  const [checked, setCheckedState] = useState(() => getChecked(today))
  const doneDays = getDoneDays()
  const isWorkoutDone = doneDays.includes(today)

  function toggle(i) {
    const next = checked.includes(i) ? checked.filter(x => x !== i) : [...checked, i]
    setCheckedState(next)
    setChecked(today, next)
    if (next.length === workout.exercises.length) {
      markDayDone(today)
      fireConfetti()
      refresh()
    }
  }

  function markAll() {
    const all = workout.exercises.map((_, i) => i)
    setCheckedState(all)
    setChecked(today, all)
    markDayDone(today)
    fireConfetti()
    refresh()
  }

  const pct = workout.exercises.length > 0 ? Math.round((checked.length / workout.exercises.length) * 100) : 0

  return (
    <div className="flex flex-col gap-4 p-4 animate-slide-up">
      <Card cls="p-5">
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-orange-400 bg-orange-500/15 mb-3`}>
          {workout.tag}
        </div>
        <div className="text-2xl font-bold mb-1">{workout.name}</div>
        <div className="text-gray-400 text-sm mb-4">{checked.length} of {workout.exercises.length} exercises done</div>
        <div className="bg-[#222] rounded-full h-2 mb-5">
          <div className="bg-orange-500 h-2 rounded-full transition-all duration-500" style={{ width: pct + '%' }} />
        </div>
        {isWorkoutDone && (
          <div className="bg-green-500/15 border border-green-500/25 text-green-400 rounded-xl p-3 text-center text-sm font-semibold mb-4">
            🎉 Workout Complete! Amazing work today!
          </div>
        )}
        <div className="space-y-1">
          {workout.exercises.map((ex, i) => {
            const done = checked.includes(i)
            return (
              <button
                key={ex.id + i}
                onClick={() => toggle(i)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors text-left active:scale-[0.98] ${done ? 'bg-green-500/8 border border-green-500/15' : 'bg-[#222] border border-[#333] active:border-orange-500/40'}`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${done ? 'bg-green-500' : 'border-2 border-[#444]'}`}>
                  {done && <span className="text-white text-xs font-bold">✓</span>}
                </div>
                <div className="flex-1">
                  <div className={`font-semibold text-base ${done ? 'text-gray-500 line-through' : 'text-white'}`}>{ex.icon} {ex.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{ex.detail}</div>
                </div>
              </button>
            )
          })}
        </div>
        {!isWorkoutDone && (
          <button onClick={markAll} className="w-full mt-4 bg-orange-500 text-white rounded-xl py-4 font-bold text-base active:scale-95 transition-transform">
            Mark All Complete 🎯
          </button>
        )}
      </Card>

      {/* Walking info */}
      <Card cls="p-4">
        <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">Daily Walk</div>
        <div className="flex gap-3">
          <div className="flex-1 bg-[#222] rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-blue-400">1.5 km</div>
            <div className="text-xs text-gray-500 mt-0.5">To venue</div>
          </div>
          <div className="flex-1 bg-[#222] rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-blue-400">1.5 km</div>
            <div className="text-xs text-gray-500 mt-0.5">Back home</div>
          </div>
          <div className="flex-1 bg-[#222] rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-orange-400">3 km</div>
            <div className="text-xs text-gray-500 mt-0.5">Total</div>
          </div>
        </div>
      </Card>
    </div>
  )
}

// ─── TAB: TRACKERS (Run + Steps + Water) ──────────────────────────────────────
function TrackersTab({ refresh }) {
  const today = getTodayKey()

  // Run state
  const [dist, setDist] = useState('')
  const [sprints, setSprints] = useState('')
  const todayRun = getRunLog().filter(e => e.date === today)
  const todayKm = todayRun.filter(e => e.type === 'km').reduce((a, e) => a + e.val, 0)
  const todaySprints = todayRun.filter(e => e.type === 'sprints').reduce((a, e) => a + e.val, 0)
  const totalKm = getRunLog().filter(e => e.type === 'km').reduce((a, e) => a + e.val, 0)

  function saveRun() {
    if (dist) { addRunEntry({ date: today, type: 'km', val: parseFloat(dist) }); setDist('') }
    if (sprints) { addRunEntry({ date: today, type: 'sprints', val: parseInt(sprints) }); setSprints('') }
    refresh()
  }

  // Steps state
  const [steps, setSteps] = useState(() => String(getTodaySteps() || ''))
  function saveSteps() {
    if (!steps) return
    saveStepEntry(parseInt(steps))
    refresh()
  }

  // Water state
  const [water, setWater] = useState(() => String(getTodayWater() || ''))
  function saveWater() {
    if (!water) return
    saveWaterEntry(parseInt(water))
    refresh()
  }

  const stepsVal = parseInt(steps) || 0
  const stepsPct = Math.min(100, Math.round((stepsVal / 10000) * 100))
  const waterVal = parseInt(water) || 0
  const waterPct = Math.min(100, Math.round((waterVal / 12) * 100))

  return (
    <div className="flex flex-col gap-4 p-4 animate-slide-up">
      {/* Running */}
      <Card cls="p-5">
        <div className="flex items-center gap-2 mb-4">
          <RunIcon size={20} cls="text-orange-400" />
          <div className="text-lg font-bold">Running</div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-[#222] rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-orange-400">{todayKm.toFixed(1)}</div>
            <div className="text-xs text-gray-500 mt-0.5">km today</div>
          </div>
          <div className="bg-[#222] rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-orange-400">{todaySprints}</div>
            <div className="text-xs text-gray-500 mt-0.5">sprints today</div>
          </div>
          <div className="bg-[#222] rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-blue-400">{totalKm.toFixed(1)}</div>
            <div className="text-xs text-gray-500 mt-0.5">total km</div>
          </div>
        </div>
        <InputRow label="Distance" value={dist} onChange={setDist} onSave={saveRun} onReset={() => setDist('')} placeholder="km" unit="km" />
        <InputRow label="Sprint sets" value={sprints} onChange={setSprints} onSave={saveRun} onReset={() => setSprints('')} placeholder="sets" />
        {/* Recent log */}
        <div className="mt-2">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Recent</div>
          {getRunLog().slice(0, 5).map((e, i) => (
            <div key={i} className="flex justify-between py-2 border-b border-[#222] last:border-0">
              <span className="text-sm text-gray-400">{e.date} — {e.type === 'km' ? 'Run' : 'Sprints'}</span>
              <span className="text-sm font-semibold text-white">{e.val} {e.type === 'km' ? 'km' : 'sets'}</span>
            </div>
          ))}
          {!getRunLog().length && <div className="text-sm text-gray-600 py-2">No runs logged yet</div>}
        </div>
      </Card>

      {/* Steps */}
      <Card cls="p-5">
        <div className="flex items-center gap-2 mb-4">
          <StepsIcon size={20} cls="text-green-400" />
          <div className="text-lg font-bold">Steps</div>
          <div className="ml-auto text-sm text-gray-400">Goal: 8k–12k</div>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl font-bold text-green-400">{stepsVal.toLocaleString()}</div>
          <div className="flex-1">
            <div className="bg-[#222] rounded-full h-3 overflow-hidden">
              <div className="bg-green-500 h-3 rounded-full transition-all duration-500" style={{ width: stepsPct + '%' }} />
            </div>
            <div className="text-xs text-gray-500 mt-1">{stepsPct}% of 10,000</div>
          </div>
        </div>
        <InputRow label="Today's steps" value={steps} onChange={setSteps} onSave={saveSteps} onReset={() => { setSteps(''); saveStepEntry(0); refresh() }} placeholder="steps" />
        <div className="mt-2">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">History</div>
          {getStepLog().slice(0, 5).map((e, i) => (
            <div key={i} className="flex justify-between py-2 border-b border-[#222] last:border-0">
              <span className="text-sm text-gray-400">{e.date}</span>
              <span className="text-sm font-semibold text-white">{Number(e.steps).toLocaleString()} steps</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Water */}
      <Card cls="p-5">
        <div className="flex items-center gap-2 mb-4">
          <DropIcon size={20} cls="text-blue-400" />
          <div className="text-lg font-bold">Water</div>
          <div className="ml-auto text-sm text-gray-400">Goal: 10–14 glasses</div>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl font-bold text-blue-400">{waterVal}</div>
          <div className="flex-1">
            <div className="bg-[#222] rounded-full h-3 overflow-hidden">
              <div className="bg-blue-500 h-3 rounded-full transition-all duration-500" style={{ width: waterPct + '%' }} />
            </div>
            <div className="text-xs text-gray-500 mt-1">{waterPct}% of 12 glasses</div>
          </div>
        </div>
        {/* Glass tap grid */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Array.from({ length: 14 }, (_, i) => (
            <button key={i}
              onClick={() => { const v = String(i + 1); setWater(v); saveWaterEntry(i + 1); refresh() }}
              className={`w-10 h-10 rounded-xl text-base transition-all active:scale-90 ${i < waterVal ? 'bg-blue-500 text-white' : 'bg-[#222] text-gray-600 border border-[#333]'}`}
            >💧</button>
          ))}
        </div>
        <InputRow label="Glasses consumed" value={water} onChange={setWater} onSave={saveWater} onReset={() => { setWater('0'); saveWaterEntry(0); refresh() }} placeholder="glasses" />
      </Card>
    </div>
  )
}

// ─── TAB: STRENGTH + PHOTOS ───────────────────────────────────────────────────
function ProgressTab({ refresh }) {
  const [pushups, setPushups] = useState('')
  const [weight, setWeight] = useState('')
  const [photoLabel, setPhotoLabel] = useState('Week 1')
  const fileRef = useRef(null)
  const [photos, setPhotosState] = useState(() => getPhotos())
  const best = getBestPushups()
  const log = getStrengthLog().slice(0, 8)

  function savePushups() {
    if (!pushups) return
    addStrengthEntry({ pushups: parseInt(pushups) })
    setPushups('')
    refresh()
  }
  function saveWeight() {
    if (!weight) return
    addStrengthEntry({ weight: parseFloat(weight) })
    setWeight('')
    refresh()
  }
  function handlePhoto(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      addPhoto(ev.target.result, photoLabel)
      setPhotosState(getPhotos())
      refresh()
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }
  function removePhoto(ts) {
    deletePhoto(ts)
    setPhotosState(getPhotos())
    refresh()
  }

  return (
    <div className="flex flex-col gap-4 p-4 animate-slide-up">
      {/* Strength */}
      <Card cls="p-5">
        <div className="flex items-center gap-2 mb-4">
          <DumbellIcon size={20} cls="text-orange-400" />
          <div className="text-lg font-bold">Strength Tracker</div>
        </div>
        {best > 0 && (
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 mb-4 flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <div>
              <div className="text-xs text-gray-400">Pushup Record</div>
              <div className="text-xl font-bold text-orange-400">{best} reps</div>
            </div>
          </div>
        )}
        <InputRow label="Max pushups (today)" value={pushups} onChange={setPushups} onSave={savePushups} onReset={() => setPushups('')} placeholder="reps" />
        <InputRow label="Weight" value={weight} onChange={setWeight} onSave={saveWeight} onReset={() => setWeight('')} placeholder="kg" unit="kg" />
        <div className="mt-2">
          <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Log</div>
          {!log.length && <div className="text-sm text-gray-600 py-2">No entries yet</div>}
          {log.map((e, i) => (
            <div key={i} className="flex justify-between py-2.5 border-b border-[#222] last:border-0">
              <span className="text-sm text-gray-400">{e.date}</span>
              <div className="flex gap-3">
                {e.pushups && <span className="text-sm font-semibold text-orange-400">{e.pushups} pushups</span>}
                {e.weight && <span className="text-sm font-semibold text-blue-400">{e.weight} kg</span>}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Progress Photos */}
      <Card cls="p-5">
        <div className="flex items-center gap-2 mb-4">
          <CamIcon size={20} cls="text-pink-400" />
          <div className="text-lg font-bold">Progress Photos</div>
        </div>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={photoLabel}
            onChange={e => setPhotoLabel(e.target.value)}
            placeholder="Label (e.g. Week 1)"
            className="flex-1 bg-[#222] border border-[#333] rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-orange-500"
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="bg-orange-500 text-white rounded-xl px-4 py-2.5 font-semibold text-sm active:scale-95 transition-transform whitespace-nowrap"
          >
            + Add
          </button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />
        {!photos.length ? (
          <div className="border-2 border-dashed border-[#333] rounded-xl p-8 text-center">
            <div className="text-3xl mb-2">📸</div>
            <div className="text-gray-500 text-sm">Upload your first progress photo</div>
            <div className="text-gray-600 text-xs mt-1">Saved locally on your device</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {photos.map((p, i) => (
              <div key={p.ts} className="relative rounded-xl overflow-hidden aspect-[3/4] bg-[#222]">
                <img src={p.dataUrl} alt={p.label} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <div className="text-xs text-white font-semibold">{p.label}</div>
                  <div className="text-xs text-gray-400">{p.date}</div>
                </div>
                <button
                  onClick={() => removePhoto(p.ts)}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs active:scale-90"
                >×</button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

// ─── TAB: CALENDAR ────────────────────────────────────────────────────────────
function CalendarTab() {
  const days = buildCalendarDays()
  const done = days.filter(d => d.status === 'done').length
  const missed = days.filter(d => d.status === 'missed').length
  const remaining = days.filter(d => d.status === 'future' || d.status === 'today').length

  // Build calendar grid — need empty cells to align weekdays
  const startDow = new Date('2025-04-29T00:00:00').getDay() // 2 = Tuesday
  const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const cells = [...Array(startDow).fill(null), ...days]

  const statusStyle = {
    done: 'bg-green-500/20 text-green-400 border border-green-500/30',
    missed: 'bg-red-500/20 text-red-400 border border-red-500/30',
    today: 'bg-orange-500 text-white font-bold',
    future: 'bg-[#1e1e1e] text-gray-500',
  }

  return (
    <div className="flex flex-col gap-4 p-4 animate-slide-up">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-green-400">{done}</div>
          <div className="text-xs text-gray-400 mt-1">Done</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-red-400">{missed}</div>
          <div className="text-xs text-gray-400 mt-1">Missed</div>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-orange-400">{remaining}</div>
          <div className="text-xs text-gray-400 mt-1">Left</div>
        </div>
      </div>

      {/* Calendar grid */}
      <Card cls="p-4">
        <div className="text-sm font-semibold text-gray-300 mb-4">Apr 29 — Jun 17, 2025</div>
        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-2">
          {WEEKDAYS.map(d => (
            <div key={d} className="text-center text-xs text-gray-600 font-semibold py-1">{d}</div>
          ))}
        </div>
        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => (
            <div key={i} className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs ${day ? statusStyle[day.status] : ''}`}>
              {day && (
                <>
                  <div className="text-[11px] font-semibold leading-none">{day.date.getDate()}</div>
                  {day.status === 'done' && <div className="text-[8px] mt-0.5">✓</div>}
                  {day.status === 'today' && <div className="text-[8px] mt-0.5">●</div>}
                </>
              )}
            </div>
          ))}
        </div>
        {/* Legend */}
        <div className="flex gap-4 mt-4 justify-center">
          {[['bg-orange-500', 'Today'], ['bg-green-500/40', 'Done'], ['bg-red-500/40', 'Missed'], ['bg-[#1e1e1e]', 'Upcoming']].map(([bg, label]) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded ${bg}`} />
              <span className="text-xs text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* All workouts reference */}
      <Card cls="p-5">
        <div className="text-sm font-semibold text-gray-300 mb-3">Weekly Schedule</div>
        {Object.entries(WORKOUTS).map(([dow, wk]) => (
          <div key={dow} className="flex items-start gap-3 py-3 border-b border-[#222] last:border-0">
            <div className={`text-xs font-bold px-2 py-1 rounded-lg bg-gradient-to-r ${wk.color} text-white min-w-[52px] text-center flex-shrink-0`}>
              {wk.tag.slice(0, 3)}
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{wk.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">{wk.exercises.map(e => e.name).join(' · ')}</div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── TAB: LAZY MODE ──────────────────────────────────────────────────────────
function LazyTab({ setTab }) {
  return (
    <div className="flex flex-col gap-4 p-4 animate-bounce-in">
      <div className="bg-gradient-to-br from-red-500/15 to-orange-500/10 border border-red-500/25 rounded-2xl p-6 text-center">
        <div className="text-5xl mb-4">😤</div>
        <div className="text-2xl font-bold text-white mb-2">Feeling Lazy?</div>
        <div className="text-gray-400 text-sm leading-relaxed">That's okay. Here's all you have to do today.</div>
      </div>

      <Card cls="p-6 border-orange-500/20">
        <div className="text-center mb-5">
          <div className="text-4xl mb-3">🚶</div>
          <div className="text-xl font-bold text-orange-400 mb-2">Just go to the venue.</div>
          <div className="text-gray-300 text-base leading-relaxed">
            Once you get there, do <span className="text-orange-400 font-bold text-xl">10 pushups</span> and start.
          </div>
        </div>
        <div className="space-y-3">
          {[
            { step: '1', text: 'Put on your shoes', icon: '👟' },
            { step: '2', text: 'Walk 1.5 km to the venue', icon: '🚶' },
            { step: '3', text: 'Do 10 pushups — right now', icon: '💪' },
            { step: '4', text: "You've already started. Keep going!", icon: '🔥' },
          ].map(({ step, text, icon }) => (
            <div key={step} className="flex items-center gap-4 bg-[#222] rounded-xl p-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{step}</div>
              <div className="text-sm font-medium text-white">{icon} {text}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card cls="p-5">
        <div className="text-sm text-gray-400 italic text-center leading-relaxed">
          "The hardest part is starting. Once you're there, your body takes over."
        </div>
        <div className="text-xs text-gray-600 text-center mt-2">— Every athlete ever</div>
      </Card>

      <button
        onClick={() => setTab('workout')}
        className="w-full bg-orange-500 text-white rounded-2xl py-4 font-bold text-lg active:scale-95 transition-transform"
      >
        Let's Go! Open Workout 💪
      </button>
    </div>
  )
}

// ─── BOTTOM NAV ──────────────────────────────────────────────────────────────
const TABS = [
  { id: 'home',     label: 'Home',     Icon: HomeIcon },
  { id: 'workout',  label: 'Workout',  Icon: DumbellIcon },
  { id: 'trackers', label: 'Trackers', Icon: DropIcon },
  { id: 'progress', label: 'Progress', Icon: ChartIcon },
  { id: 'calendar', label: 'Calendar', Icon: CalIcon },
]

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTabRaw] = useState('home')
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])

  const refresh = useCallback(() => setTick(t => t + 1), [])
  const setTab = useCallback((t) => { setTabRaw(t); window.scrollTo(0, 0) }, [])

  const tabProps = { refresh, setTab, key: tick }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col max-w-[430px] mx-auto">
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto pb-20">
        {tab === 'home'     && <HomeTab     {...tabProps} />}
        {tab === 'workout'  && <WorkoutTab  {...tabProps} />}
        {tab === 'trackers' && <TrackersTab {...tabProps} />}
        {tab === 'progress' && <ProgressTab {...tabProps} />}
        {tab === 'calendar' && <CalendarTab {...tabProps} />}
        {tab === 'lazy'     && <LazyTab     {...tabProps} />}
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 inset-x-0 max-w-[430px] mx-auto bg-[#111]/95 backdrop-blur border-t border-[#2a2a2a] flex z-50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {TABS.map(({ id, label, Icon: Ic }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-colors active:scale-90 ${tab === id ? 'text-orange-400' : 'text-gray-600'}`}
          >
            <Ic size={22} />
            <span className="text-[10px] font-semibold tracking-wide">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
