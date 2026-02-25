'use client'

import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'

export type UltrasoundRevealCompositionProps = {
  originalUrl: string
  processedUrl: string
}

// Canvas: 1080x1080 (square) — matches compositionWidth/Height in Player

export default function UltrasoundRevealComposition({
  originalUrl,
  processedUrl,
}: UltrasoundRevealCompositionProps) {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()

  // Phase breakpoints (at 30 fps, total = 150 frames = 5s)
  // 0–40:   hold original (clear)
  // 40–110: blur-dissolve transition
  // 110–150: hold processed (clear) with subtle zoom
  const fadeStart = 40
  const fadeEnd = 110
  const holdEnd = durationInFrames

  // Original: fades out + blurs up
  const originalOpacity = interpolate(frame, [fadeStart, fadeEnd], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => t * t * (3 - 2 * t), // smoothstep
  })
  const originalBlur = interpolate(frame, [fadeStart, fadeEnd], [0, 28], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => t * t,
  })

  // Processed: blurs in → clears up
  const processedOpacity = interpolate(frame, [fadeStart, fadeEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => t * t * (3 - 2 * t), // smoothstep
  })
  const processedBlur = interpolate(frame, [fadeStart, fadeEnd], [28, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - (1 - t) * (1 - t),
  })

  const scale = interpolate(frame, [fadeEnd, holdEnd], [1, 1.04], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {/* Original image — blurs out and fades */}
      <AbsoluteFill
        style={{
          opacity: originalOpacity,
          filter: `blur(${originalBlur}px)`,
        }}
      >
        <Img
          src={originalUrl}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
          }}
        />
      </AbsoluteFill>

      {/* Processed image — unblurs and fades in with subtle zoom */}
      <AbsoluteFill
        style={{
          opacity: processedOpacity,
          filter: `blur(${processedBlur}px)`,
          transform: `scale(${scale})`,
        }}
      >
        <Img
          src={processedUrl}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
