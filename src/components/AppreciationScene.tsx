import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { MemoryImage } from './MemoryImage'

const SENTENCES = [
  'I saw your strength.',
  'I saw your love.',
  'I saw the quiet sacrifices\nyou made every single day.',
]

const SCHEDULE = [
  { enter: 0.06, hold: 0.28, exit: 0.38 },
  { enter: 0.44, hold: 0.62, exit: 0.72 },
  { enter: 0.78, hold: 0.95, exit: 1.1 },
]

export function AppreciationScene() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const sentences = Array.from(
      section.querySelectorAll<HTMLElement>('.appreciation-sentence')
    )
    const isMobile = window.innerWidth < 768
    const scrollEnd = isMobile ? '+=1400' : '+=2200'

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: scrollEnd,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
        },
      })

      sentences.forEach((el, i) => {
        const s = SCHEDULE[i]
        tl.fromTo(
          el,
          { opacity: 0, scale: 0.95, filter: 'blur(5px)', y: 10 },
          {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            y: 0,
            duration: s.hold - s.enter,
            ease: 'power2.out',
          },
          s.enter
        )
        if (i < sentences.length - 1) {
          tl.to(
            el,
            {
              opacity: 0,
              scale: 0.97,
              filter: 'blur(3px)',
              y: -8,
              duration: s.exit - s.hold,
              ease: 'power2.in',
            },
            s.hold
          )
        }
      })

      // Image entrance — separate, not scrubbed
      if (imageRef.current && !isMobile) {
        gsap.fromTo(
          imageRef.current,
          { opacity: 0, x: 40, scale: 0.93, filter: 'blur(12px)' },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.8,
            ease: 'power3.out',
            delay: 0.4,
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="scene min-h-screen scene-split"
      style={{ background: 'transparent' }}
    >
      {/* Centered warm glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 55% 48% at 50% 50%, rgba(201,168,122,0.07) 0%, transparent 68%)',
          pointerEvents: 'none',
        }}
      />

      {/* Left: text sentences — one at a time via scrub */}
      <div
        className="split-text"
        style={{
          position: 'relative',
          height: 'clamp(200px, 38vh, 360px)',
          maxWidth: '480px',
        }}
      >
        {SENTENCES.map((sentence, i) => (
          <p
            key={i}
            className="appreciation-sentence text-display"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              textAlign: 'center',
              fontSize:
                i === 2
                  ? 'clamp(1.7rem, 3.6vw, 3.4rem)'
                  : 'clamp(2rem, 4.2vw, 4rem)',
              fontWeight: i === 2 ? 400 : 300,
              fontStyle: i === 2 ? 'italic' : 'normal',
              color: i === 1 ? 'var(--champagne)' : 'var(--white)',
              lineHeight: 1.2,
              whiteSpace: 'pre-line',
              opacity: 0,
              padding: '0 1rem',
              textShadow: i === 1 ? '0 0 35px rgba(201,168,122,0.25)' : 'none',
            }}
          >
            {sentence}
          </p>
        ))}
      </div>

      {/* Right: image — desktop only */}
      <div className="split-image" style={{ position: 'relative', zIndex: 1 }}>
        <MemoryImage
          ref={imageRef}
          src="/images/bhy2.jpg"
          alt="Wife in wheelchair before delivery"
          aspectRatio="3/4"
          objectPosition="center 20%"
          glowStrength="soft"
        />
      </div>
    </section>
  )
}
