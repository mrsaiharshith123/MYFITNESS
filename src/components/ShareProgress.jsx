'use client'

import { useRef, useState, useEffect } from 'react'
import { generateShareCard } from '../hooks/useShareProgress'
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
]

export default function ShareProgress() {
  const cardRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [showCard, setShowCard] = useState(false)
  const [cardData, setCardData] = useState(null)
  const [mounted, setMounted] = useState(false)

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

    await new Promise((r) => setTimeout(r, 300))

    try {
      const { blob, dataUrl } = await generateShareCard(cardRef.current)

      const file = new File([blob], 'progress.png', {
        type: 'image/png',
      })

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
        className="bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl px-4 py-3 font-semibold text-sm active:scale-95 transition-transform mb-4"
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
            background:
              'linear-gradient(180deg, #0a0a0a 0%, #111827 50%, #000000 100%)',
            color: 'white',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRadius: '30px',
            fontFamily: 'Arial',
            overflow: 'hidden',
          }}
        >
          {/* Orange Glow */}
          <div
            style={{
              position: 'absolute',
              top: '-100px',
              right: '-100px',
              width: '300px',
              height: '300px',
              background: 'rgba(249,115,22,0.25)',
              borderRadius: '50%',
              filter: 'blur(100px)',
            }}
          />

          {/* Pink Glow */}
          <div
            style={{
              position: 'absolute',
              bottom: '-100px',
              left: '-100px',
              width: '250px',
              height: '250px',
              background: 'rgba(236,72,153,0.2)',
              borderRadius: '50%',
              filter: 'blur(100px)',
            }}
          />

          {/* Header */}
          <div style={{ zIndex: 2 }}>
            <div
              style={{
                fontSize: '16px',
                color: '#9ca3af',
                letterSpacing: '4px',
                textTransform: 'uppercase',
                fontWeight: 'bold',
              }}
            >
              50 DAY TRANSFORM
            </div>

            <h1
              style={{
                fontSize: '85px',
                fontWeight: '900',
                marginTop: '20px',
                marginBottom: '10px',
                color: '#f97316',
                lineHeight: 1,
              }}
            >
              DAY {cardData.day}
            </h1>

            <div
              style={{
                fontSize: '26px',
                color: '#d1d5db',
              }}
            >
              {cardData.daysLeft} Days Left
            </div>
          </div>

          {/* Workout Status */}
          <div
            style={{
              background: cardData.workoutDone ? '#16a34a' : '#374151',
              padding: '12px 24px',
              borderRadius: '999px',
              width: 'fit-content',
              fontWeight: 'bold',
              fontSize: '18px',
              zIndex: 2,
            }}
          >
            {cardData.workoutDone
              ? 'Workout Complete ✅'
              : 'Rest Day'}
          </div>

          {/* Stats Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              zIndex: 2,
            }}
          >
            {[
              ['🔥', cardData.streak, 'Streak'],
              ['👟', cardData.steps, 'Steps'],
              ['💧', cardData.water, 'Water'],
              ['💪', cardData.pushupPR, 'Pushups'],
            ].map(([emoji, value, label]) => (
              <div
                key={label}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  padding: '25px',
                  borderRadius: '20px',
                }}
              >
                <div style={{ fontSize: '28px' }}>
                  {emoji}
                </div>

                <div
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    marginTop: '10px',
                  }}
                >
                  {value}
                </div>

                <div
                  style={{
                    color: '#9ca3af',
                    fontSize: '14px',
                    marginTop: '6px',
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div style={{ zIndex: 2 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px',
                fontSize: '14px',
                color: '#9ca3af',
              }}
            >
              <span>Challenge Progress</span>
              <span>
                {Math.round(
                  (cardData.day / cardData.totalDays) * 100
                )}
                %
              </span>
            </div>

            <div
              style={{
                height: '14px',
                background: '#1f2937',
                borderRadius: '20px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${
                    (cardData.day / cardData.totalDays) * 100
                  }%`,
                  height: '100%',
                  background:
                    'linear-gradient(90deg, #f97316, #ec4899)',
                }}
              />
            </div>
          </div>

          {/* Quote */}
          <div
            style={{
              textAlign: 'center',
              color: '#d1d5db',
              fontStyle: 'italic',
              fontSize: '22px',
              zIndex: 2,
              lineHeight: 1.5,
            }}
          >
            "{cardData.quote}"
          </div>
        </div>
      )}
    </>
  )
}
