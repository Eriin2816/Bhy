import { useRef, useEffect } from 'react'
import gsap from 'gsap'

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
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="scene min-h-screen flex-col"
      style={{ background: 'transparent', overflow: 'hidden' }}
    >
      {/* Right-side ambient */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 55% 65% at 72% 42%, rgba(201,168,122,0.05) 0%, transparent 68%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '660px', width: '100%', position: 'relative', zIndex: 1 }}>
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
                    ? 'clamp(2.1rem, 4.8vw, 4.2rem)'
                    : 'clamp(1.5rem, 3.1vw, 2.7rem)',
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
