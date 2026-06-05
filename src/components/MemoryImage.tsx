import { forwardRef } from 'react'

interface MemoryImageProps {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
  glowStrength?: 'soft' | 'medium' | 'strong'
  aspectRatio?: string
  objectPosition?: string
}

export const MemoryImage = forwardRef<HTMLDivElement, MemoryImageProps>(
  (
    {
      src,
      alt,
      className = '',
      style,
      glowStrength = 'medium',
      aspectRatio = '4/5',
      objectPosition = 'center top',
    },
    ref
  ) => {
    const glowOpacity =
      glowStrength === 'soft' ? 0.13 : glowStrength === 'strong' ? 0.32 : 0.21

    return (
      <div
        ref={ref}
        className={className}
        style={{ position: 'relative', ...style }}
      >
        {/* Champagne glow halo behind the frame */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: '-28%',
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(201,168,122,${glowOpacity}) 0%, transparent 65%)`,
            filter: 'blur(55px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Frame */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            borderRadius: '28px',
            overflow: 'hidden',
            aspectRatio,
            border: '1px solid rgba(201,168,122,0.22)',
            boxShadow: [
              '0 0 0 1px rgba(255,255,255,0.04)',
              '0 8px 28px rgba(0,0,0,0.58)',
              '0 28px 72px rgba(0,0,0,0.40)',
              '0 0 80px rgba(201,168,122,0.08)',
            ].join(', '),
          }}
        >
          <img
            src={src}
            alt={alt}
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition,
            }}
            loading="lazy"
          />

          {/* Glass reflection */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: 0,
              left: '-20%',
              width: '55%',
              height: '100%',
              background:
                'linear-gradient(108deg, rgba(255,255,255,0.055) 0%, transparent 48%)',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />

          {/* Animated light sweep */}
          <div aria-hidden className="memory-image-sweep" />

          {/* Bottom vignette */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '28%',
              background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.28))',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />
        </div>
      </div>
    )
  }
)
MemoryImage.displayName = 'MemoryImage'
