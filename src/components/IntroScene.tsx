import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function IntroScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const ghostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = containerRef.current?.querySelectorAll('.intro-line')
      if (!lines) return

      // Ghost image fades in very slowly and subtly
      if (ghostRef.current) {
        gsap.fromTo(
          ghostRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 5, ease: 'power1.out', delay: 0.8 }
        )
      }

      gsap.fromTo(
        lines,
        { opacity: 0, y: 22, filter: 'blur(8px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 2.4,
          ease: 'power2.out',
          stagger: 0.55,
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
      {/* Ghost photo — barely visible, adds warmth and personal depth */}
      <div
        ref={ghostRef}
        aria-hidden
        style={{
          position: 'absolute',
          right: '-5%',
          top: '5%',
          width: '55%',
          height: '92%',
          backgroundImage: 'url(/images/bhy1.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          opacity: 0,
          filter: 'blur(32px) saturate(0.4)',
          maskImage:
            'radial-gradient(ellipse 75% 80% at 75% 50%, rgba(0,0,0,0.18) 0%, transparent 70%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 75% 80% at 75% 50%, rgba(0,0,0,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Warm centered bloom */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,122,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '700px',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <p
          className="intro-line text-display"
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 4.4rem)',
            color: 'var(--white)',
            marginBottom: '0.3em',
            fontStyle: 'italic',
            fontWeight: 300,
            opacity: 0,
          }}
        >
          Nine months of love.
        </p>
        <p
          className="intro-line text-display"
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 4.4rem)',
            color: 'var(--white)',
            marginBottom: '0.55em',
            fontStyle: 'italic',
            fontWeight: 300,
            opacity: 0,
          }}
        >
          Nine months of strength.
        </p>
        <p
          className="intro-line text-display"
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.8rem)',
            color: 'var(--champagne)',
            fontStyle: 'italic',
            fontWeight: 300,
            letterSpacing: '0.02em',
            textShadow: '0 0 40px rgba(201,168,122,0.3)',
            opacity: 0,
          }}
        >
          A lifetime of gratitude.
        </p>
      </div>
    </section>
  )
}
