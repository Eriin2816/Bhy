import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

import { AtmosphereLayer } from './components/AtmosphereLayer'
import { IntroScene } from './components/IntroScene'
import { SacrificeScene } from './components/SacrificeScene'
import { AppreciationScene } from './components/AppreciationScene'
import { FamilyScene } from './components/FamilyScene'
import { NewDaughterScene } from './components/NewDaughterScene'
import { GiftMeaningScene } from './components/GiftMeaningScene'
import { VideoRevealScene } from './components/VideoRevealScene'
import { HeartfeltLetter } from './components/HeartfeltLetter'
import { FinalCTA } from './components/FinalCTA'
import { FinalInstruction } from './components/FinalInstruction'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [showInstruction, setShowInstruction] = useState(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) return

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time: number) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove((time: number) => {
        lenis.raf(time * 1000)
      })
    }
  }, [])

  return (
    <>
      <AtmosphereLayer />
      <main style={{ background: 'transparent', overflowX: 'hidden', position: 'relative', zIndex: 2 }}>
        <IntroScene />
        <SacrificeScene />
        <AppreciationScene />
        <FamilyScene />
        <NewDaughterScene />
        <GiftMeaningScene />
        <VideoRevealScene />
        <HeartfeltLetter />
        <FinalCTA onReveal={() => setShowInstruction(true)} />
      </main>

      <FinalInstruction visible={showInstruction} />
    </>
  )
}
