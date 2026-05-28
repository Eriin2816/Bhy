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
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          ease: 'power2.out',
          stagger: 0.28,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
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
      {/* Warm champagne aura — pulses gently */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 60% 55% at 50% 48%, rgba(201,168,122,0.1) 0%, rgba(180,130,80,0.04) 40%, transparent 72%)',
          pointerEvents: 'none',
          animation: 'haze-pulse-b 10s ease-in-out infinite',
        }}
      />

      <div
        style={{
          maxWidth: '580px',
          width: '100%',
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
        }}
      >
        {/* Salutation */}
        <p
          className="letter-line"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--champagne)',
            marginBottom: '2rem',
            opacity: 0,
          }}
        >
          To my beautiful wife
        </p>

        <p
          className="letter-line text-display"
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'var(--white)',
            marginBottom: '2.4rem',
            lineHeight: 1.25,
            opacity: 0,
          }}
        >
          Ericka Marcelo Marcelo
        </p>

        <div
          className="letter-line"
          style={{
            width: '40px',
            height: '1px',
            background: 'rgba(201,168,122,0.35)',
            margin: '0 auto 2.4rem',
            opacity: 0,
          }}
        />

        {[
          'thank you for carrying our baby,',
          'thank you for loving our family,',
          'thank you for being strong\neven when it was hard.',
        ].map((line, i) => (
          <p
            key={i}
            className="letter-line text-display"
            style={{
              fontSize: 'clamp(1.3rem, 2.5vw, 2.2rem)',
              fontWeight: 300,
              color: 'var(--white)',
              lineHeight: 1.5,
              marginBottom: '0.5em',
              whiteSpace: 'pre-line',
              opacity: 0,
            }}
          >
            {line}
          </p>
        ))}

        <div style={{ height: '2rem' }} />

        <p
          className="letter-line text-display"
          style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 500,
            fontStyle: 'italic',
            color: 'var(--champagne)',
            textShadow:
              '0 0 40px rgba(201,168,122,0.4), 0 0 100px rgba(201,168,122,0.15)',
            opacity: 0,
          }}
        >
          I love you.
        </p>
      </div>
    </section>
  )
}
