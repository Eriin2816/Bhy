import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface FinalInstructionProps {
  visible: boolean
}

export function FinalInstruction({ visible }: FinalInstructionProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (!visible) return

    const overlay = overlayRef.current
    const text = textRef.current
    if (!overlay || !text) return

    // Lock scroll while instruction is showing
    document.body.style.overflow = 'hidden'

    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.out' })
    gsap.fromTo(
      text,
      { opacity: 0, scale: 0.97 },
      { opacity: 1, scale: 1, duration: 2, ease: 'power2.out', delay: 0.5 }
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
      {/* Radial glow behind text */}
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

      <p
        ref={textRef}
        className="text-display final-instruction-text"
        style={{
          fontSize: 'clamp(1.8rem, 4.5vw, 4rem)',
          fontWeight: 400,
          fontStyle: 'italic',
          color: 'var(--champagne)',
          textAlign: 'center',
          maxWidth: '680px',
          lineHeight: 1.3,
          position: 'relative',
          zIndex: 1,
        }}
      >
        Now slowly close the MacBook screen, Bhy ❤️
      </p>
    </div>
  )
}
