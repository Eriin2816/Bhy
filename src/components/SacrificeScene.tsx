import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { MemoryImage } from './MemoryImage'

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
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const lines = section.querySelectorAll<HTMLElement>('.sacrifice-line')
    const isMobile = window.innerWidth < 768
    const scrollEnd = isMobile ? '+=1400' : '+=2200'

    const ctx = gsap.context(() => {
      // Scrubbed text reveal
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

      // Image entrance — separate, fires as section enters viewport
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { opacity: 0, x: 48, scale: 0.93, filter: 'blur(12px)' },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.8,
            ease: 'power3.out',
            delay: 0.2,
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
      style={{ background: 'transparent', overflow: 'hidden' }}
    >
      {/* Warm ambient */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 65% 50% at 28% 55%, rgba(201,168,122,0.055) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      {/* Left: text */}
      <div className="split-text" style={{ position: 'relative', zIndex: 1, maxWidth: '480px' }}>
        {LINES.map((line, i) =>
          (line as { spacer?: boolean }).spacer ? (
            <div key={i} style={{ height: '1.5em' }} />
          ) : (
            <p
              key={i}
              className="sacrifice-line text-display"
              style={{
                fontSize: 'clamp(1.7rem, 3.2vw, 3rem)',
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

      {/* Right: image */}
      <div className="split-image" style={{ position: 'relative', zIndex: 1 }}>
        <MemoryImage
          ref={imageRef}
          src="/images/bhy1.jpg"
          alt="Wife resting in hospital bed"
          aspectRatio="3/4"
          objectPosition="center 25%"
          glowStrength="medium"
        />
      </div>
    </section>
  )
}
