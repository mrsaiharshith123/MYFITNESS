'use client';

import { useRef, useState, useEffect } from 'react';
import { generateShareCard } from '../hooks/useShareProgress';
import {
  getDayNumber,
  TOTAL_DAYS,
  getStreak,
  getTodaySteps,
  getTodayWater,
  getBestPushups,
  getCountdownDays,
  getDoneDays,
  getTodayKey
} from '../lib/data'

const QUOTES = [
  "Pain is temporary. Glory is forever.",
  "Every rep counts. Every day matters.",
  "You're building a version of yourself you've never met.",
  "Discipline beats motivation every single time.",
  "50 days. One decision. Infinite results.",
  "The grind is the goal.",
  "Show up. Do the work. Repeat.",
];

export default function ShareProgress() {
  const cardRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [cardData, setCardData] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true)
  }, [])

  const loadData = () => {
    const todayKey = getTodayKey()
    const doneDays = getDoneDays()

    return {
      day: getDayNumber(),
      totalDays: TOTAL_DAYS,
      streak: getStreak(),
      steps: getTodaySteps(),
      water: getTodayWater(),
      pushupPR: getBestPushups(),
      workoutDone: doneDays.includes(todayKey),
      daysLeft: getCountdownDays(),
      quote: QUOTES[Math.floor(Math.random() * QUOTES.length)],
    }
  }

  const handleShare = async () => {
    if (!mounted) return

    setLoading(true)
    const data = loadData()
    setCardData(data)
    setShowCard(true)

    await new Promise(r => setTimeout(r, 300))

    try {
      const { blob, dataUrl } = await generateShareCard(cardRef.current)

      const file = new File([blob], 'progress.png', { type: 'image/png' })

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
  files: [file],
})
      } else {
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = `day-${data.day}-progress.png`
        a.click()
      }

    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error(err)
      }
    } finally {
      setLoading(false)
      setShowCard(false)
    }
  }

  if (!mounted) return null

  return (
    <>
      {/* Share Button */}
      <button
        onClick={handleShare}
        disabled={loading}
        className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl py-4 font-bold text-base active:scale-95 transition-transform mb-4"
      >
        {loading ? 'Generating Story...' : '📤 Share Progress'}
      </button>

      {/* Hidden Share Card */}
      {showCard && cardData && (
        <div
          ref={cardRef}
          style={{
            position: 'fixed',
            left: '-9999px',
            width: '540px',
            height: '960px',
            background: '#111',
            color: 'white',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRadius: '20px'
          }}
        >
          <div>
            <h1 style={{ fontSize: '60px', color: '#f97316' }}>
              Day {cardData.day}/{cardData.totalDays}
            </h1>
            <p>{cardData.daysLeft} days left</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>🔥 Streak: {cardData.streak}</div>
            <div>👟 Steps: {cardData.steps}</div>
            <div>💧 Water: {cardData.water}</div>
            <div>💪 Pushups: {cardData.pushupPR}</div>
          </div>

          <div>
            <p style={{ fontStyle: 'italic' }}>
              "{cardData.quote}"
            </p>
          </div>
        </div>
      )}
    </>
  )
}