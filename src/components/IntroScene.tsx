import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function IntroScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = containerRef.current?.querySelectorAll('.intro-line')
      if (!lines) return

      gsap.fromTo(
        lines,
        { opacity: 0, y: 28, filter: 'blur(10px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 2.6,
          ease: 'power2.out',
          stagger: 0.65,
          delay: 0.4,
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="scene min-h-screen flex-col text-center"
      style={{ background: 'transparent' }}
    >
      {/* Warm radial glow behind text */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 65% 50% at 50% 50%, rgba(201,168,122,0.09) 0%, rgba(180,130,80,0.04) 40%, transparent 72%)',
          pointerEvents: 'none',
          animation: 'haze-pulse-b 12s ease-in-out infinite',
        }}
      />

      <div
        style={{
          maxWidth: '680px',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <p
          className="intro-line text-display"
          style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.8rem)',
            color: 'var(--white)',
            marginBottom: '0.6em',
            fontStyle: 'italic',
            fontWeight: 300,
          }}
        >
          This is for the nights you stayed strong,
        </p>
        <p
          className="intro-line text-display"
          style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.8rem)',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
            fontWeight: 300,
          }}
        >
          even when no one saw how hard it was.
        </p>
      </div>
    </section>
  )
}
