import { useRef, useEffect } from 'react'
import gsap from 'gsap'

const LINES = [
  { text: 'For 9 months,', em: false },
  { text: 'you carried our second daughter.', em: false },
  { text: '', em: false },
  { text: 'Through the tired days,', em: false },
  { text: 'the uncomfortable nights,', em: false },
  { text: 'the changes,', em: false },
  { text: 'the pain,', em: false },
  { text: 'the patience,', em: false },
  { text: 'and the love…', em: true },
]

export function SacrificeScene() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const lines = section.querySelectorAll<HTMLElement>('.sacrifice-line')
    const isMobile = window.innerWidth < 768
    const scrollEnd = isMobile ? '+=1200' : '+=2000'

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: scrollEnd,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      })

      lines.forEach((line, i) => {
        const position = i / lines.length
        tl.fromTo(
          line,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          position * 0.85
        )
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="scene min-h-screen flex-col justify-center"
      style={{
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      {/* Champagne ambient */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 70% 50% at 30% 60%, rgba(201,168,122,0.05) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '620px',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {LINES.map((line, i) =>
          line.text === '' ? (
            <div key={i} style={{ height: '1.4em' }} />
          ) : (
            <p
              key={i}
              className="sacrifice-line text-display"
              style={{
                fontSize: 'clamp(1.6rem, 3.5vw, 3rem)',
                fontWeight: line.em ? 400 : 300,
                fontStyle: line.em ? 'italic' : 'normal',
                color: line.em ? 'var(--champagne)' : 'var(--white)',
                lineHeight: 1.3,
                marginBottom: '0.15em',
                opacity: 0,
              }}
            >
              {line.text}
            </p>
          )
        )}
      </div>
    </section>
  )
}
