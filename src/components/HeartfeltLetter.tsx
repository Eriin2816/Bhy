import { useRef, useEffect } from 'react'
import gsap from 'gsap'

export function HeartfeltLetter() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const lines = section.querySelectorAll<HTMLElement>('.letter-line')

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: 'power2.out',
          stagger: 0.26,
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="scene min-h-screen flex-col justify-center text-center"
      style={{ background: 'transparent' }}
    >
      {/* Warm bloom behind letter */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 62% 55% at 50% 50%, rgba(201,168,122,0.09) 0%, rgba(180,130,80,0.03) 45%, transparent 72%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '600px',
          width: '100%',
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
        }}
      >
        {/* Label */}
        <p
          className="letter-line"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.7rem, 1.1vw, 0.82rem)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--champagne)',
            marginBottom: '1.8rem',
            opacity: 0,
          }}
        >
          To my beautiful wife
        </p>

        {/* Name */}
        <p
          className="letter-line text-display"
          style={{
            fontSize: 'clamp(2rem, 4.2vw, 3.5rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'var(--white)',
            marginBottom: '2.2rem',
            lineHeight: 1.2,
            opacity: 0,
          }}
        >
          Ericka Marcelo Marcelo
        </p>

        {/* Divider line */}
        <div
          className="letter-line"
          style={{
            width: '36px',
            height: '1px',
            background: 'rgba(201,168,122,0.4)',
            margin: '0 auto 2.2rem',
            opacity: 0,
          }}
        />

        {/* Body lines */}
        {[
          'thank you for carrying our baby,',
          'thank you for loving our family,',
          'thank you for being strong\neven when it was hard.',
        ].map((line, i) => (
          <p
            key={i}
            className="letter-line text-display"
            style={{
              fontSize: 'clamp(1.25rem, 2.4vw, 2.1rem)',
              fontWeight: 300,
              color: 'var(--white-dim)',
              lineHeight: 1.6,
              marginBottom: '0.45em',
              whiteSpace: 'pre-line',
              opacity: 0,
            }}
          >
            {line}
          </p>
        ))}

        <div style={{ height: '2.2rem' }} />

        {/* I love you — premium highlight */}
        <p
          className="letter-line text-display"
          style={{
            fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
            fontWeight: 500,
            fontStyle: 'italic',
            color: 'var(--champagne)',
            letterSpacing: '-0.01em',
            textShadow:
              '0 0 50px rgba(201,168,122,0.5), 0 0 120px rgba(201,168,122,0.18)',
            opacity: 0,
          }}
        >
          I love you.
        </p>
      </div>
    </section>
  )
}
