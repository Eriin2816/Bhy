import { useRef, useEffect } from 'react'
import gsap from 'gsap'

const LINES = [
  { text: 'Our family is growing again.', size: 'large' },
  { text: '', size: 'spacer' },
  { text: 'Another little princess', size: 'medium' },
  { text: 'is coming into our lives.', size: 'medium' },
  { text: '', size: 'spacer' },
  { text: 'And because of you,', size: 'medium' },
  { text: 'she already knows what love feels like.', size: 'medium-em' },
]

const PARTICLES = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  left: `${15 + i * 13}%`,
  delay: `${i * 0.8}s`,
  duration: `${5 + i * 0.7}s`,
  drift: `${(i % 2 === 0 ? 1 : -1) * (8 + i * 3)}px`,
  size: `${2 + (i % 3)}px`,
}))

export function FamilyScene() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const lines = section.querySelectorAll<HTMLElement>('.family-line')

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: 'power3.out',
          stagger: 0.18,
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
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
      className="scene min-h-screen flex-col"
      style={{ background: 'transparent', overflow: 'hidden' }}
    >
      {/* Ambient light */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 50% 60% at 70% 40%, rgba(201,168,122,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Floating particles */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          aria-hidden
          style={{
            position: 'absolute',
            bottom: '15%',
            left: p.left,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: 'rgba(201,168,122,0.5)',
            animation: `float-particle ${p.duration} ${p.delay} ease-in-out infinite`,
            ['--drift' as string]: p.drift,
          }}
        />
      ))}

      <div
        style={{
          maxWidth: '640px',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {LINES.map((line, i) =>
          line.size === 'spacer' ? (
            <div key={i} style={{ height: '1.6em' }} />
          ) : (
            <p
              key={i}
              className="family-line text-display"
              style={{
                fontSize:
                  line.size === 'large'
                    ? 'clamp(2rem, 4.5vw, 4rem)'
                    : 'clamp(1.5rem, 3vw, 2.6rem)',
                fontWeight:
                  line.size === 'large' ? 500 : line.size === 'medium-em' ? 400 : 300,
                fontStyle: line.size === 'medium-em' ? 'italic' : 'normal',
                color:
                  line.size === 'medium-em' ? 'var(--champagne)' : 'var(--white)',
                lineHeight: 1.25,
                marginBottom: '0.1em',
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
