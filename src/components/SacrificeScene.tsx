import { useRef, useEffect } from 'react'
import gsap from 'gsap'

const LINES = [
  { text: 'For 9 months,',                   em: false },
  { text: 'you carried our second daughter.', em: false },
  { text: '',                                  spacer: true },
  { text: 'With so much love,',               em: false },
  { text: 'so much strength,',                em: false },
  { text: 'so much patience,',                em: false },
  { text: 'and so much grace.',               em: true  },
]

export function SacrificeScene() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const lines = section.querySelectorAll<HTMLElement>('.sacrifice-line')
    const isMobile = window.innerWidth < 768
    const scrollEnd = isMobile ? '+=1400' : '+=2200'

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
        tl.fromTo(
          line,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          (i / lines.length) * 0.82
        )
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="scene min-h-screen flex-col justify-center"
      style={{ background: 'transparent', overflow: 'hidden' }}
    >
      {/* Warm ambient behind text */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 65% 50% at 30% 55%, rgba(201,168,122,0.055) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '640px', width: '100%', position: 'relative', zIndex: 1 }}>
        {LINES.map((line, i) =>
          (line as { spacer?: boolean }).spacer ? (
            <div key={i} style={{ height: '1.5em' }} />
          ) : (
            <p
              key={i}
              className="sacrifice-line text-display"
              style={{
                fontSize: 'clamp(1.7rem, 3.6vw, 3.2rem)',
                fontWeight: line.em ? 400 : 300,
                fontStyle: line.em ? 'italic' : 'normal',
                color: line.em ? 'var(--champagne)' : 'var(--white)',
                lineHeight: 1.25,
                marginBottom: '0.12em',
                opacity: 0,
                textShadow: line.em
                  ? '0 0 30px rgba(201,168,122,0.25)'
                  : 'none',
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
