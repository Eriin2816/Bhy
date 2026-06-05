import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { MemoryImage } from './MemoryImage'

const LINES = [
  { text: 'No gift could ever equal',                  glow: false, muted: false },
  { text: "what you've done.",                          glow: false, muted: false },
  { text: '',                                            spacer: true },
  { text: 'But this is my small way of saying…',       glow: false, muted: true  },
  { text: '',                                            spacer: true },
  { text: 'thank you,',                                 glow: false, muted: false },
  { text: 'I love you,',                                glow: true,  muted: false },
  { text: 'and I appreciate you',                       glow: false, muted: false },
  { text: 'more than words can say.',                   glow: false, muted: false },
]

export function GiftMeaningScene() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const lines = section.querySelectorAll<HTMLElement>('.gift-line')

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 1.3,
          ease: 'power3.out',
          stagger: 0.18,
          scrollTrigger: {
            trigger: section,
            start: 'top 63%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Image: fades in softly as the emotional anchor for this section
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { opacity: 0, y: 40, scale: 0.95, filter: 'blur(12px)' },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 2.2,
            ease: 'power2.out',
            delay: 0.5,
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        )

        // Gentle parallax
        gsap.to(imageRef.current, {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
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
      {/* Fade to black at bottom — blends into video */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '35%',
          background: 'linear-gradient(to bottom, transparent, #000)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Left: text */}
      <div
        className="split-text"
        style={{ maxWidth: '520px', position: 'relative', zIndex: 3 }}
      >
        {LINES.map((line, i) =>
          (line as { spacer?: boolean }).spacer ? (
            <div key={i} style={{ height: '1.3em' }} />
          ) : (
            <p
              key={i}
              className="gift-line text-display"
              style={{
                fontSize: line.glow
                  ? 'clamp(2.6rem, 5.5vw, 5rem)'
                  : 'clamp(1.4rem, 2.8vw, 2.5rem)',
                fontWeight: line.glow ? 500 : 300,
                fontStyle: line.glow ? 'italic' : 'normal',
                color: line.muted
                  ? 'var(--text-muted)'
                  : line.glow
                  ? 'var(--champagne)'
                  : 'var(--white)',
                lineHeight: line.glow ? 1.1 : 1.3,
                marginBottom: line.glow ? '0.05em' : '0.08em',
                opacity: 0,
                ...(line.glow
                  ? {
                      textShadow:
                        '0 0 50px rgba(201,168,122,0.45), 0 0 120px rgba(201,168,122,0.18)',
                    }
                  : {}),
              }}
            >
              {line.text}
            </p>
          )
        )}
      </div>

      {/* Right: baby solo — emotional bridge into the iPhone reveal */}
      <div className="split-image" style={{ position: 'relative', zIndex: 1 }}>
        <MemoryImage
          ref={imageRef}
          src="/images/baby.jpg"
          alt="Newborn daughter resting peacefully"
          aspectRatio="3/4"
          objectPosition="center 55%"
          glowStrength="strong"
        />
      </div>
    </section>
  )
}
