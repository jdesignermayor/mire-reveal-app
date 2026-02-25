'use client'

import { Card } from '@/components/ui/card'
import { Json } from '@/lib/supabase/types'
import { cn } from '@/lib/utils'
import { ILLUSTRATION_STATUS, ImageDataFormat } from '@/models/illustration.model'
import { useIllustration } from '@/mutations/illustration.mutation'
import { AlertCircleIcon, SparklesIcon } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import UltrasoundViewer from './UltrasoundViewer'

const MasonryCard = ({
  data,
  onClick,
  heightClass,
}: {
  data: ImageDataFormat;
  onClick: () => void;
  heightClass: string;
}) => {
  return (
    <Card
      className={cn(
        "border-none p-0 overflow-hidden rounded-2xl transition-all duration-500",
        "shadow-[0_4px_24px_rgba(0,0,0,0.4)]",
        heightClass,
        data.isFinished && "cursor-pointer hover:shadow-[0_8px_40px_rgba(0,0,0,0.6)] hover:scale-[1.02]",
      )}
      onClick={data.isFinished ? onClick : undefined}
    >
      <div
        className={cn(
          "relative group w-full h-full overflow-hidden rounded-2xl transition-all duration-500",
          data.isFinished && "ring-2 ring-white/20",
          data.isFailed && "ring-2 ring-red-500/60",
        )}
      >
        {/* Gradient overlay bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10 pointer-events-none" />

        {data.isFinished && !data.isPending && !data.isFailed ? (
          <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between">
            <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/10">
              <SparklesIcon className="size-3 text-violet-300" />
              Revealed
            </span>
            <span className="text-white/40 text-xs tracking-wide">Tap to view</span>
          </div>
        ) : data.isFailed ? (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/40 text-white px-4 py-2 rounded-full text-sm">
              <AlertCircleIcon className="size-4 text-red-400" />
              Generation failed
            </div>
          </div>
        ) : (
          <div className="absolute bottom-3 left-3 z-20">
            <span className="flex items-center gap-2 bg-black/40 backdrop-blur-sm text-white/70 text-xs px-3 py-1.5 rounded-full border border-white/10">
              <span className="size-1.5 rounded-full bg-violet-400 animate-pulse" />
              {data.isPending ? "Processing..." : "Generating..."}
            </span>
          </div>
        )}

        <Image
          className={cn(
            "w-full h-full object-cover transition-all duration-700",
            data.isPending || data.isFailed
              ? "opacity-40 blur-md scale-105"
              : "opacity-100 blur-0 scale-100 group-hover:scale-105",
          )}
          priority={true}
          fetchPriority="high"
          loading="eager"
          src={data.images.unprocessed.publicUrl}
          alt={data.id}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ objectFit: 'cover' }}
        />
      </div>
    </Card>
  );
};

export default function RevealIllustrationPanel({
  illustrationId,
}: {
  illustrationId?: number
}) {
  if (!illustrationId) return null;

  const { data } = useIllustration(illustrationId);
  const prevStatusRef = useRef<string | undefined>(undefined)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationFading, setCelebrationFading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<ImageDataFormat | null>(null)
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerHeight, setContainerHeight] = useState<number | null>(null)

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout)
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setContainerHeight(window.innerHeight - rect.top)

    const handleResize = () => {
      if (!containerRef.current) return
      const r = containerRef.current.getBoundingClientRect()
      setContainerHeight(window.innerHeight - r.top)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const updatedStatus = data?.process_status
  const images = data?.images as Array<Json> || []

  useEffect(() => {
    const prev = prevStatusRef.current
    const isTransitionToCompleted =
      prev !== undefined &&
      prev !== ILLUSTRATION_STATUS.COMPLETED &&
      updatedStatus === ILLUSTRATION_STATUS.COMPLETED

    if (isTransitionToCompleted) {
      timeoutRefs.current.forEach(clearTimeout)
      timeoutRefs.current = []

      setShowCelebration(true)

      const fire = (opts: confetti.Options) => confetti({ ...opts, zIndex: 9999 })

      fire({ particleCount: 120, spread: 70, origin: { x: 0.2, y: 0.6 } })
      fire({ particleCount: 120, spread: 70, origin: { x: 0.8, y: 0.6 } })

      timeoutRefs.current = [
        setTimeout(() => fire({ particleCount: 80, spread: 100, origin: { x: 0.5, y: 0.4 } }), 300),
        setTimeout(() => fire({ particleCount: 60, spread: 120, origin: { x: 0.3, y: 0.5 } }), 600),
        setTimeout(() => fire({ particleCount: 60, spread: 120, origin: { x: 0.7, y: 0.5 } }), 900),
        setTimeout(() => setCelebrationFading(true), 3500),
        setTimeout(() => { setShowCelebration(false); setCelebrationFading(false) }, 4500),
      ]
    }

    prevStatusRef.current = updatedStatus ?? undefined
  }, [updatedStatus])

  return (
    <div className='dark'>
      {selectedImage && (
        <UltrasoundViewer
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
      {showCelebration && (
        <div className={cn(
          "fixed inset-0 z-[9998] flex items-center justify-center backdrop-blur-md bg-black/60",
          celebrationFading ? "animate-out fade-out duration-1000" : "animate-in fade-in duration-700"
        )}>
          <div className="flex flex-col items-center justify-center gap-5 animate-in fade-in zoom-in duration-700 text-center px-6 max-w-lg">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/70 text-xs tracking-widest uppercase px-4 py-2 rounded-full">
              <SparklesIcon className="size-3 text-violet-300" />
              Mire Reveal
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight">
              Your baby has<br />been revealed ✨
            </h1>
            <p className="text-base md:text-lg text-white/60 max-w-sm leading-relaxed">
              Tap any image to see the full reveal
            </p>
          </div>
        </div>
      )}
      <div>
        {(updatedStatus === ILLUSTRATION_STATUS.PROCESSING ||
          updatedStatus === ILLUSTRATION_STATUS.PENDING) && (
            <p className="inline-flex items-center gap-2 text-sm text-white/50 px-4 py-2">
              <span className="size-1.5 rounded-full bg-violet-400 animate-pulse" />
              Processing your ultrasound...
            </p>
          )}
        {images?.length > 0 && (
          <div
            ref={containerRef}
            className="w-full p-3 md:p-4"
            style={{ height: containerHeight ? `${containerHeight}px` : 'calc(100dvh - 180px)', overflow: 'hidden' }}
          >
            {images.length === 1 && (
              <div className="h-full w-full">
                <MasonryCard
                  data={images[0] as unknown as ImageDataFormat}
                  onClick={() => setSelectedImage(images[0] as unknown as ImageDataFormat)}
                  heightClass="w-full h-full"
                />
              </div>
            )}
            {images.length === 2 && (
              <div className="flex flex-col md:flex-row gap-3 md:gap-4 h-full">
                {images.map((img: Json, idx) => (
                  <MasonryCard
                    key={idx}
                    data={img as unknown as ImageDataFormat}
                    onClick={() => setSelectedImage(img as unknown as ImageDataFormat)}
                    heightClass="w-full md:w-1/2 h-1/2 md:h-full"
                  />
                ))}
              </div>
            )}
            {images.length >= 3 && (
              <div className="flex flex-col md:flex-row gap-3 md:gap-4 h-full">
                <MasonryCard
                  data={images[0] as unknown as ImageDataFormat}
                  onClick={() => setSelectedImage(images[0] as unknown as ImageDataFormat)}
                  heightClass="w-full md:w-1/2 h-[45dvh] md:h-full"
                />
                <div className="flex flex-col gap-3 md:gap-4 w-full md:w-1/2 h-full">
                  {images.slice(1).map((img: Json, idx) => (
                    <MasonryCard
                      key={idx + 1}
                      data={img as unknown as ImageDataFormat}
                      onClick={() => setSelectedImage(img as unknown as ImageDataFormat)}
                      heightClass={cn(
                        "w-full",
                        idx === 0 ? "flex-[2]" : "flex-[1]",
                      )}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}