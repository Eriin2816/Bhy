import { useRef, useEffect } from 'react'
import gsap from 'gsap'

const LINES = [
  { text: 'No gift can ever match', em: false, glow: false },
  { text: "what you've done.", em: false, glow: false },
  { text: '', spacer: true },
  { text: 'But this is my little way of saying…', em: false, glow: false, muted: true },
  { text: '', spacer: true },
  { text: 'thank you,', em: false, glow: false },
  { text: 'I love you,', em: true, glow: true },
  { text: 'and I appreciate you more than words can say.', em: false, glow: false },
]

export function GiftMeaningScene() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const lines = section.querySelectorAll<HTMLElement>('.gift-line')

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          stagger: 0.22,
          scrollTrigger: {
            trigger: section,
            start: 'top 65%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="scene min-h-screen flex-col justify-center"
      style={{ background: 'transparent' }}
    >
      {/* Fade to black at the bottom for transition into video */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '30%',
          background: 'linear-gradient(to bottom, transparent, #000)',
          pointerEvents: 'none',
          zIndex: 2,
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
          line.spacer ? (
            <div key={i} style={{ height: '1.4em' }} />
          ) : (
            <p
              key={i}
              className="gift-line text-display"
              style={{
                fontSize: line.glow
                  ? 'clamp(2.4rem, 5vw, 4.5rem)'
                  : 'clamp(1.5rem, 3vw, 2.6rem)',
                fontWeight: line.glow ? 500 : line.em ? 400 : 300,
                fontStyle: line.em || line.glow ? 'italic' : 'normal',
                color: line.muted
                  ? 'var(--text-muted)'
                  : line.glow
                  ? 'var(--champagne)'
                  : 'var(--white)',
                lineHeight: 1.2,
                marginBottom: '0.1em',
                opacity: 0,
                ...(line.glow
                  ? {
                      textShadow:
                        '0 0 40px rgba(201,168,122,0.4), 0 0 100px rgba(201,168,122,0.15)',
                    }
                  : {}),
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
