import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { MemoryImage } from './MemoryImage'

const LINES = [
  { text: 'The moment she arrived,',                  size: 'large'     },
  { text: 'our hearts changed again.',                size: 'large'     },
  { text: '',                                          size: 'spacer'    },
  { text: 'A new little life.',                        size: 'medium'    },
  { text: 'A new little miracle.',                     size: 'medium'    },
  { text: '',                                          size: 'spacer'    },
  { text: 'Another reason to love you',               size: 'medium'    },
  { text: 'even more.',                               size: 'medium-em' },
]

export function NewDaughterScene() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const lines = section.querySelectorAll<HTMLElement>('.daughter-line')

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 1.3,
          ease: 'power3.out',
          stagger: 0.18,
          scrollTrigger: {
            trigger: section,
            start: 'top 68%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Image entrance — slides in from right
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { opacity: 0, x: 50, scale: 0.93, filter: 'blur(12px)' },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 2,
            ease: 'power3.out',
            delay: 0.2,
            scrollTrigger: {
              trigger: section,
              start: 'top 72%',
              toggleActions: 'play none none reverse',
            },
          }
        )

        // Gentle parallax
        gsap.to(imageRef.current, {
          yPercent: -8,
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
      {/* Warm centered glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 70% 60% at 60% 50%, rgba(201,168,122,0.06) 0%, transparent 68%)',
          pointerEvents: 'none',
        }}
      />

      {/* Left: text */}
      <div className="split-text" style={{ position: 'relative', zIndex: 1, maxWidth: '460px' }}>
        {LINES.map((line, i) =>
          line.size === 'spacer' ? (
            <div key={i} style={{ height: '1.2em' }} />
          ) : (
            <p
              key={i}
              className="daughter-line text-display"
              style={{
                fontSize:
                  line.size === 'large'
                    ? 'clamp(1.9rem, 3.8vw, 3.4rem)'
                    : 'clamp(1.3rem, 2.5vw, 2.2rem)',
                fontWeight: line.size === 'large' ? 400 : line.size === 'medium-em' ? 500 : 300,
                fontStyle: line.size === 'medium-em' ? 'italic' : 'normal',
                color: line.size === 'medium-em' ? 'var(--champagne)' : 'var(--white)',
                lineHeight: 1.22,
                marginBottom: '0.1em',
                opacity: 0,
                textShadow:
                  line.size === 'medium-em'
                    ? '0 0 35px rgba(201,168,122,0.32)'
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
          src="/images/babydaddy.jpg"
          alt="Father with newborn daughter"
          aspectRatio="3/4"
          objectPosition="center 35%"
          glowStrength="medium"
        />
      </div>
    </section>
  )
}
