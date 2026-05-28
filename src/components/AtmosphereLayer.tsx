import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  baseOpacity: number
  currentOpacity: number
  speedY: number
  drift: number
  driftPhase: number
  driftSpeed: number
  twinkle: number
  twinkleSpeed: number
  isGold: boolean
}

const PARTICLE_COUNT = 22

function createParticle(width: number, height: number, randomY = true): Particle {
  const isGold = Math.random() < 0.35
  return {
    x: Math.random() * width,
    y: randomY ? Math.random() * height : height + Math.random() * 40,
    size: 0.7 + Math.random() * 1.6,
    baseOpacity: 0.05 + Math.random() * 0.12,
    currentOpacity: 0,
    speedY: 0.12 + Math.random() * 0.22,
    drift: (Math.random() - 0.5) * 0.06,
    driftPhase: Math.random() * Math.PI * 2,
    driftSpeed: 0.004 + Math.random() * 0.006,
    twinkle: Math.random() * Math.PI * 2,
    twinkleSpeed: 0.003 + Math.random() * 0.007,
    isGold,
  }
}

export function AtmosphereLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    let particles: Particle[] = []

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      const dpr = window.devicePixelRatio || 1
      canvas!.width = width * dpr
      canvas!.height = height * dpr
      canvas!.style.width = width + 'px'
      canvas!.style.height = height + 'px'
      ctx!.scale(dpr, dpr)
    }

    function init() {
      resize()
      particles = Array.from({ length: PARTICLE_COUNT }, () =>
        createParticle(width, height, true)
      )
      // Stagger initial opacities so they don't all appear at once
      particles.forEach((p, i) => {
        p.currentOpacity = (i / PARTICLE_COUNT) * p.baseOpacity
      })
    }

    function tick() {
      ctx!.clearRect(0, 0, width, height)

      particles.forEach((p) => {
        // Slow upward drift
        p.y -= p.speedY

        // Gentle horizontal sinusoidal drift
        p.driftPhase += p.driftSpeed
        p.x += Math.sin(p.driftPhase) * p.drift

        // Twinkle: slowly oscillates opacity
        p.twinkle += p.twinkleSpeed
        const twinkleFactor = 0.7 + 0.3 * Math.sin(p.twinkle)

        // Fade in at birth
        if (p.currentOpacity < p.baseOpacity) {
          p.currentOpacity = Math.min(p.currentOpacity + 0.0008, p.baseOpacity)
        }

        // Fade out near top
        const fadeZone = height * 0.12
        const fadeFactor = p.y < fadeZone ? p.y / fadeZone : 1

        const opacity = p.currentOpacity * twinkleFactor * fadeFactor

        // Draw soft glowing dot
        const color = p.isGold
          ? `rgba(201,168,122,${opacity})`
          : `rgba(248,245,240,${opacity})`

        // Soft blur: draw 3 concentric circles
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2)
        ctx!.fillStyle = p.isGold
          ? `rgba(201,168,122,${opacity * 0.15})`
          : `rgba(248,245,240,${opacity * 0.1})`
        ctx!.fill()

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fillStyle = color
        ctx!.fill()

        // Reset when off top
        if (p.y < -10) {
          const fresh = createParticle(width, height, false)
          fresh.x = Math.random() * width
          fresh.currentOpacity = 0
          Object.assign(p, fresh)
        }
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    init()
    tick()

    const handleResize = () => {
      resize()
      particles.forEach((p) => {
        if (p.x > width) p.x = Math.random() * width
      })
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <>
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Slow ambient warm haze — two overlapping radial gradients */}
      <div
        aria-hidden
        className="atm-haze-a"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 55% 45% at 50% 55%, rgba(201,168,122,0.055) 0%, rgba(180,130,80,0.02) 45%, transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="atm-haze-b"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 40% 35% at 48% 52%, rgba(248,245,240,0.03) 0%, transparent 65%)',
        }}
      />

      {/* Screen edge vignette */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 90% 85% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 85%, rgba(0,0,0,0.82) 100%)',
        }}
      />
    </>
  )
}
