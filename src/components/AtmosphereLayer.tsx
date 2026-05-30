// Premium Apple-style atmosphere: controlled light orbs, diagonal sweep, vignette.
// No particles — product-lighting mood, not dreamy haze.
export function AtmosphereLayer() {
  return (
    <>
      {/* Orb 1 — upper warm champagne bloom (main product light) */}
      <div aria-hidden className="atm-orb atm-orb-1" />

      {/* Orb 2 — lower right cool fill */}
      <div aria-hidden className="atm-orb atm-orb-2" />

      {/* Orb 3 — mid-left accent depth */}
      <div aria-hidden className="atm-orb atm-orb-3" />

      {/* Diagonal light sweep — premium metallic sheen */}
      <div aria-hidden className="atm-sweep" />

      {/* Screen edge vignette — focus puller */}
      <div aria-hidden className="atm-vignette" />
    </>
  )
}
