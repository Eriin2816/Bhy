import { useRef, useEffect } from 'react'
import gsap from 'gsap'

interface FinalCTAProps {
  onReveal: () => void
}

export function FinalCTA({ onReveal }: FinalCTAProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const button = buttonRef.current
    if (!section || !button) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        button,
        { opacity: 0, scale: 0.94 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  function handleClick() {
    const button = buttonRef.current
    if (!button) return

    gsap.to(button, {
      opacity: 0,
      scale: 0.92,
      duration: 0.6,
      ease: 'power2.in',
      onComplete: onReveal,
    })
  }

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        padding: '4rem 2rem',
      }}
    >
      <button
        ref={buttonRef}
        className="cta-button"
        onClick={handleClick}
        style={{ opacity: 0 }}
        aria-label="Tap when you're ready to see your surprise"
      >
        Tap when you're ready
      </button>
    </section>
  )
}
