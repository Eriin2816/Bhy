import { useRef, useEffect } from 'react'
import gsap from 'gsap'

const SENTENCES = [
  'I saw your strength.',
  'I saw your sacrifices.',
  'I saw how much love you gave\nbefore she was even born.',
]

// Explicit non-overlapping schedule (fraction of total scroll progress)
// Each sentence is fully hidden before the next one appears
const SCHEDULE = [
  { enter: 0.06, hold: 0.28, exit: 0.38 },
  { enter: 0.44, hold: 0.62, exit: 0.72 },
  { enter: 0.78, hold: 0.95, exit: 1.1 }, // last stays
]

export function AppreciationScene() {
  const sectionRef = useRef<HTMLElement>(null)

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

        // Fade in: blur-to-sharp, scale up
        tl.fromTo(
          el,
          { opacity: 0, scale: 0.94, filter: 'blur(6px)', y: 12 },
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

        // Fade out: only if not the last sentence
        if (i < sentences.length - 1) {
          tl.to(
            el,
            {
              opacity: 0,
              scale: 0.97,
              filter: 'blur(4px)',
              y: -10,
              duration: s.exit - s.hold,
              ease: 'power2.in',
            },
            s.hold
          )
        }
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="scene min-h-screen"
      style={{
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Warm centered glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 55% 45% at 50% 50%, rgba(201,168,122,0.07) 0%, transparent 68%)',
          pointerEvents: 'none',
          animation: 'haze-pulse-a 16s ease-in-out infinite',
        }}
      />
      {/* Container that holds absolutely-positioned sentences */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '760px',
          height: 'clamp(200px, 35vh, 340px)',
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
                  ? 'clamp(1.8rem, 4vw, 3.8rem)'
                  : 'clamp(2rem, 4.5vw, 4.2rem)',
              fontWeight: i === 2 ? 400 : 300,
              fontStyle: i === 2 ? 'italic' : 'normal',
              color: 'var(--white)',
              lineHeight: 1.2,
              whiteSpace: 'pre-line',
              opacity: 0,
              padding: '0 1rem',
            }}
          >
            {sentence}
          </p>
        ))}
      </div>
    </section>
  )
}
