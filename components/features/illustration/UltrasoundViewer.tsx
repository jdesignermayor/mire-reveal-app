'use client'

import { ImageDataFormat } from '@/models/illustration.model'
import { XIcon } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import { Player, PlayerRef } from '@remotion/player'
import { RotateCcwIcon } from 'lucide-react'
import UltrasoundTabs, { UltrasoundTab } from './UltrasoundTabs'
import UltrasoundRevealComposition from './UltrasoundRevealComposition'

export default function UltrasoundViewer({
  image,
  onClose,
}: {
  image: ImageDataFormat
  onClose: () => void
}) {
  const [activeTab, setActiveTab] = useState<UltrasoundTab>('reveal')
  const [videoEnded, setVideoEnded] = useState(false)
  const playerRef = useRef<PlayerRef>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  useEffect(() => {
    const player = playerRef.current
    if (!player) return
    const onEnded = () => setVideoEnded(true)
    player.addEventListener('ended', onEnded)
    return () => player.removeEventListener('ended', onEnded)
  }, [])

  const handleReplay = () => {
    setVideoEnded(false)
    playerRef.current?.seekTo(0)
    playerRef.current?.play()
  }

  const processedUrl = image.images.processed.publicUrl
  const originalUrl = image.images.unprocessed.publicUrl

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-black animate-in fade-in duration-300">
      {/* Header */}
      <div className="relative flex items-center justify-center px-4 md:px-8 py-4 shrink-0">
        <UltrasoundTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <button
          onClick={onClose}
          className="absolute right-4 md:right-8 flex items-center justify-center size-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all duration-200 backdrop-blur-sm"
        >
          <XIcon className="size-5" />
        </button>
      </div>

      {/* Content */}
      <div className="relative flex-1 w-full overflow-hidden">
        {activeTab === 'reveal' && (
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            {/* Sized wrapper — 100vw square on mobile, capped by vh on desktop */}
            <div
              style={{
                width: 'min(100vw, 100vh)',
                height: 'min(100vw, 100vh)',
                display: videoEnded ? 'none' : 'block',
                flexShrink: 0,
              }}
            >
              <Player
                ref={playerRef}
                component={UltrasoundRevealComposition}
                inputProps={{ originalUrl, processedUrl }}
                durationInFrames={150}
                compositionWidth={1080}
                compositionHeight={1080}
                fps={30}
                style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
                autoPlay
              />
            </div>
            {/* Static processed image shown once video ends */}
            {videoEnded && (
              <>
                <Image
                  src={processedUrl}
                  alt="Ecografía hiperrealista"
                  fill
                  priority
                  sizes="100vw"
                  className="object-contain"
                />
                <button
                  onClick={handleReplay}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all animate-in fade-in zoom-in duration-500"
                >
                  <RotateCcwIcon className="size-4" />
                  Reproducir de nuevo
                </button>
              </>
            )}
          </div>
        )}

        {activeTab === 'original' && (
          <Image
            src={originalUrl}
            alt="Ecografía original"
            fill
            priority
            sizes="100vw"
            className="object-contain"
          />
        )}

        {activeTab === 'compare' && (
          <div className="w-full h-full flex items-center justify-center">
            <ReactCompareSlider
              style={{ width: '100%', height: '100%' }}
              itemOne={
                <ReactCompareSliderImage
                  src={originalUrl}
                  alt="Original"
                  style={{ objectFit: 'contain', background: 'black' }}
                />
              }
              itemTwo={
                <ReactCompareSliderImage
                  src={processedUrl}
                  alt="Revelada"
                  style={{ objectFit: 'contain', background: 'black' }}
                />
              }
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-6 pointer-events-none">
              <span className="bg-black/60 backdrop-blur-sm text-white/80 text-xs px-3 py-1.5 rounded-full border border-white/20">
                📷 Original
              </span>
              <span className="bg-black/60 backdrop-blur-sm text-white/80 text-xs px-3 py-1.5 rounded-full border border-white/20">
                ✨ Revelada
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
