import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface FinalInstructionProps {
  visible: boolean
}

export function FinalInstruction({ visible }: FinalInstructionProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const bloomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!visible) return

    const overlay = overlayRef.current
    const text = textRef.current
    const bloom = bloomRef.current
    if (!overlay || !text || !bloom) return

    document.body.style.overflow = 'hidden'

    // Full overlay fades in
    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power2.out' })

    // Bloom expands softly
    gsap.fromTo(
      bloom,
      { opacity: 0, scale: 0.6 },
      { opacity: 1, scale: 1, duration: 2.5, ease: 'power2.out', delay: 0.4 }
    )

    // Text arrives last
    gsap.fromTo(
      text,
      { opacity: 0, y: 14, filter: 'blur(6px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 2,
        ease: 'power2.out',
        delay: 0.8,
      }
    )

    return () => {
      document.body.style.overflow = ''
    }
  }, [visible])

  if (!visible) return null

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      {/* Premium centered bloom */}
      <div
        ref={bloomRef}
        aria-hidden
        style={{
          position: 'absolute',
          width: '70vw',
          height: '70vw',
          maxWidth: '700px',
          maxHeight: '700px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(201,168,122,0.1) 0%, rgba(201,168,122,0.04) 40%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <p
        ref={textRef}
        className="text-display final-instruction-text"
        style={{
          fontSize: 'clamp(1.9rem, 4.8vw, 4.2rem)',
          fontWeight: 400,
          fontStyle: 'italic',
          color: 'var(--champagne)',
          textAlign: 'center',
          maxWidth: '700px',
          lineHeight: 1.3,
          position: 'relative',
          zIndex: 1,
          letterSpacing: '-0.01em',
        }}
      >
        Now slowly close the MacBook screen, Bhy ❤️
      </p>
    </div>
  )
}
