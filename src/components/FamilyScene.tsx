import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { MemoryImage } from './MemoryImage'

const LINES = [
  { text: 'Our family is growing again.',      size: 'large'     },
  { text: '',                                   size: 'spacer'    },
  { text: 'Another little princess',            size: 'medium'    },
  { text: 'is coming into our lives.',          size: 'medium'    },
  { text: '',                                   size: 'spacer'    },
  { text: 'And because of you,',               size: 'medium'    },
  { text: 'she already knows',                  size: 'medium'    },
  { text: 'what love feels like.',              size: 'medium-em' },
]

export function FamilyScene() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const lines = section.querySelectorAll<HTMLElement>('.family-line')

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          stagger: 0.16,
          scrollTrigger: {
            trigger: section,
            start: 'top 68%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Image entrance — slides in from left
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { opacity: 0, x: -48, scale: 0.93, filter: 'blur(12px)' },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        )

        // Slow parallax while scrolling through the section
        gsap.to(imageRef.current, {
          yPercent: -10,
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
      {/* Right-side ambient */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 55% 65% at 72% 42%, rgba(201,168,122,0.06) 0%, transparent 68%)',
          pointerEvents: 'none',
        }}
      />

      {/* Left: image (reversed on mobile — image goes below via CSS) */}
      <div className="split-image split-image-reverse" style={{ position: 'relative', zIndex: 1 }}>
        <MemoryImage
          ref={imageRef}
          src="/images/bhy3.jpg"
          alt="Family together at the hospital"
          aspectRatio="4/3"
          objectPosition="center 55%"
          glowStrength="strong"
        />
      </div>

      {/* Right: text */}
      <div className="split-text" style={{ position: 'relative', zIndex: 1, maxWidth: '480px' }}>
        {LINES.map((line, i) =>
          line.size === 'spacer' ? (
            <div key={i} style={{ height: '1.5em' }} />
          ) : (
            <p
              key={i}
              className="family-line text-display"
              style={{
                fontSize:
                  line.size === 'large'
                    ? 'clamp(2rem, 4.2vw, 3.8rem)'
                    : 'clamp(1.4rem, 2.8vw, 2.4rem)',
                fontWeight: line.size === 'large' ? 500 : line.size === 'medium-em' ? 400 : 300,
                fontStyle: line.size === 'medium-em' ? 'italic' : 'normal',
                color:
                  line.size === 'medium-em'
                    ? 'var(--champagne)'
                    : 'var(--white)',
                lineHeight: 1.25,
                marginBottom: '0.08em',
                opacity: 0,
                textShadow:
                  line.size === 'medium-em'
                    ? '0 0 30px rgba(201,168,122,0.28)'
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
