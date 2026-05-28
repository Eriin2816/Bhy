import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const FRAME_COUNT = 150
const FRAME_PATH = (i: number) =>
  `/frames/frame_${String(i).padStart(4, '0')}.webp`

interface OverlayLine {
  text: string
  enterAt: number
  leaveAt: number
  large?: boolean
}

const OVERLAY_LINES: OverlayLine[] = [
  { text: 'You deserve something beautiful.', enterAt: 0.08, leaveAt: 0.25 },
  { text: 'Something just for you.', enterAt: 0.35, leaveAt: 0.52 },
  { text: 'Surprise, Bhy.', enterAt: 0.60, leaveAt: 0.76, large: true },
  { text: 'This is for you!', enterAt: 0.82, leaveAt: 0.95, large: true },
]

export function VideoRevealScene() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([])
  const framesRef = useRef<HTMLImageElement[]>([])
  const currentFrameRef = useRef(-1)
  const lineVisibleRef = useRef<boolean[]>([false, false, false, false])
  const [loadProgress, setLoadProgress] = useState(0)
  const [ready, setReady] = useState(false)

  // Load all frames
  useEffect(() => {
    let loaded = 0
    const images: HTMLImageElement[] = new Array(FRAME_COUNT)
    framesRef.current = images

    // Load first 15 frames immediately for fast first paint
    const loadFrame = (i: number): Promise<void> =>
      new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
          images[i] = img
          loaded++
          setLoadProgress(Math.round((loaded / FRAME_COUNT) * 100))
          if (loaded === FRAME_COUNT) setReady(true)
          resolve()
        }
        img.onerror = () => {
          loaded++
          setLoadProgress(Math.round((loaded / FRAME_COUNT) * 100))
          if (loaded === FRAME_COUNT) setReady(true)
          resolve()
        }
        img.src = FRAME_PATH(i + 1)
      })

    // Load all frames
    for (let i = 0; i < FRAME_COUNT; i++) {
      loadFrame(i)
    }
  }, [])

  // Draw frame on canvas
  function drawFrame(index: number) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const img = framesRef.current[index]
    if (!img) return

    const cw = canvas.width
    const ch = canvas.height
    const iw = img.naturalWidth
    const ih = img.naturalHeight

    // Padded cover: fills viewport but keeps a little breathing room
    const scale = Math.max(cw / iw, ch / ih) * 0.88
    const dw = iw * scale
    const dh = ih * scale
    const dx = (cw - dw) / 2
    const dy = (ch - dh) / 2

    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, cw, ch)
    ctx.drawImage(img, dx, dy, dw, dh)
  }

  // Setup canvas resize
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    function resize() {
      if (!canvas) return
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.scale(dpr, dpr)
      drawFrame(currentFrameRef.current >= 0 ? currentFrameRef.current : 0)
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // Setup ScrollTrigger once ready
  useEffect(() => {
    if (!ready) return

    const section = sectionRef.current
    if (!section) return

    // Draw first frame immediately
    drawFrame(0)
    currentFrameRef.current = 0

    const isMobile = window.innerWidth < 768
    const scrollDistance = isMobile ? '+=3000' : '+=5000'

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: scrollDistance,
      pin: true,
      scrub: true,
      anticipatePin: 1,
      onUpdate(self) {
        const p = self.progress

        // Frame scrub
        const frameIndex = Math.min(
          Math.floor(p * FRAME_COUNT),
          FRAME_COUNT - 1
        )
        if (frameIndex !== currentFrameRef.current) {
          currentFrameRef.current = frameIndex
          requestAnimationFrame(() => drawFrame(frameIndex))
        }

        // Overlay text: only ONE line visible at a time, clean transitions
        OVERLAY_LINES.forEach((line, i) => {
          const el = lineRefs.current[i]
          if (!el) return
          const shouldBeVisible = p >= line.enterAt && p <= line.leaveAt

          if (shouldBeVisible && !lineVisibleRef.current[i]) {
            // Hide all other lines immediately
            OVERLAY_LINES.forEach((_, j) => {
              if (j !== i && lineVisibleRef.current[j]) {
                lineVisibleRef.current[j] = false
                const other = lineRefs.current[j]
                if (other) {
                  gsap.killTweensOf(other)
                  gsap.set(other, { opacity: 0, y: -20 })
                }
              }
            })
            lineVisibleRef.current[i] = true
            gsap.killTweensOf(el)
            gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' })
          } else if (!shouldBeVisible && lineVisibleRef.current[i]) {
            lineVisibleRef.current[i] = false
            gsap.killTweensOf(el)
            gsap.to(el, {
              opacity: 0,
              y: p > line.leaveAt ? -22 : 22,
              duration: 0.5,
              ease: 'power2.in',
            })
          }
        })
      },
    })

    return () => st.kill()
  }, [ready])

  return (
    <div
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: '#000',
        overflow: 'hidden',
      }}
    >
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'block',
          background: '#000',
        }}
      />

      {/* Loading overlay */}
      {!ready && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5,
            background: '#000',
            gap: '1.5rem',
          }}
        >
          <div
            style={{
              width: '160px',
              height: '1px',
              background: 'rgba(201,168,122,0.2)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${loadProgress}%`,
                background: 'var(--champagne)',
                transition: 'width 0.1s linear',
              }}
            />
          </div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(201,168,122,0.4)',
            }}
          >
            {loadProgress}%
          </p>
        </div>
      )}

      {/* Subtle vignette */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 45%, rgba(0,0,0,0.5) 100%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Overlay text lines — ONE visible at a time */}
      {OVERLAY_LINES.map((line, i) => (
        <p
          key={i}
          ref={(el) => {
            lineRefs.current[i] = el
          }}
          className="video-overlay-line text-display"
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '88%',
            maxWidth: '680px',
            textAlign: 'center',
            fontSize: line.large
              ? 'clamp(2.4rem, 5.5vw, 5rem)'
              : 'clamp(1.4rem, 2.8vw, 2.6rem)',
            fontWeight: line.large ? 500 : 300,
            fontStyle: 'italic',
            color: line.large ? 'var(--champagne)' : 'rgba(248,245,240,0.92)',
            zIndex: 3,
            pointerEvents: 'none',
            textShadow: line.large
              ? '0 0 50px rgba(201,168,122,0.5), 0 0 120px rgba(201,168,122,0.2)'
              : '0 2px 40px rgba(0,0,0,0.9)',
            letterSpacing: line.large ? '-0.01em' : '0',
          }}
        >
          {line.text}
        </p>
      ))}
    </div>
  )
}
