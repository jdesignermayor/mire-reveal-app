'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Json } from '@/lib/supabase/types'
import { cn } from '@/lib/utils'
import { Illustration, ILLUSTRATION_STATUS, ImageDataFormat } from '@/models/illustration.model'
import { useIllustration } from '@/mutations/illustration.mutation'
import { AlertCircleIcon, CheckIcon, RefreshCcwIcon } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import UltrasoundViewer from './UltrasoundViewer'

const BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPk5uSuBwAA5gCg3ColJwAAAABJRU5ErkJggg==";

const MasonryCard = ({
  data,
  onRetry,
  onClick,
  heightClass,
}: {
  data: ImageDataFormat;
  onRetry: (image: ImageDataFormat) => void;
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
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-full border border-white/20">
              <CheckIcon className="size-3.5 text-emerald-400" />
              Revelada
            </span>
            <span className="text-white/60 text-xs">Click para ver</span>
          </div>
        ) : data.isFailed ? (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/40 text-white px-4 py-2 rounded-full text-sm">
              <AlertCircleIcon className="size-4 text-red-400" />
              Error al generar
            </div>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer border-white/30 text-white hover:bg-white/10 backdrop-blur-sm rounded-full"
              onClick={(e) => { e.stopPropagation(); onRetry(data); }}
            >
              <RefreshCcwIcon className="size-3.5" /> Reintentar
            </Button>
          </div>
        ) : (
          <div className="absolute bottom-3 left-3 z-20">
            <span className="flex items-center gap-2 bg-black/40 backdrop-blur-sm text-white/80 text-sm px-3 py-1.5 rounded-full border border-white/10">
              <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
              {data.isPending ? "Procesando..." : "Generando..."}
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
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
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
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerHeight, setContainerHeight] = useState<number | null>(null)

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
      setShowCelebration(true)

      const fire = (opts: confetti.Options) => confetti({ ...opts, zIndex: 9999 })

      fire({ particleCount: 120, spread: 70, origin: { x: 0.2, y: 0.6 } })
      fire({ particleCount: 120, spread: 70, origin: { x: 0.8, y: 0.6 } })
      setTimeout(() => fire({ particleCount: 80, spread: 100, origin: { x: 0.5, y: 0.4 } }), 300)
      setTimeout(() => fire({ particleCount: 60, spread: 120, origin: { x: 0.3, y: 0.5 } }), 600)
      setTimeout(() => fire({ particleCount: 60, spread: 120, origin: { x: 0.7, y: 0.5 } }), 900)

      setTimeout(() => setCelebrationFading(true), 3500)
      setTimeout(() => { setShowCelebration(false); setCelebrationFading(false) }, 4500)
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
          <div className="flex flex-col items-center justify-center gap-6 animate-in fade-in zoom-in duration-1000 text-center px-8">
            <span className="text-7xl animate-in zoom-in duration-1000">🎉</span>
            <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-[0_4px_24px_rgba(0,0,0,1)] leading-tight tracking-tight">
              ¡Ecografías reveladas!
            </h1>
            <p className="text-2xl md:text-3xl text-white/90 drop-shadow-[0_2px_12px_rgba(0,0,0,1)] max-w-xl font-medium leading-relaxed">
              Una ilusión antes del nacimiento,<br />¡te va a gustar! 💕
            </p>
          </div>
        </div>
      )}
      <div>
        {(updatedStatus === ILLUSTRATION_STATUS.PROCESSING ||
          updatedStatus === ILLUSTRATION_STATUS.PENDING) && (
            <p className="inline-flex text-lg items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
              <span>✨ Revealing images, please wait a moment...</span>
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
                  onRetry={() => {}}
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
                    onRetry={() => {}}
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
                  onRetry={() => {}}
                  onClick={() => setSelectedImage(images[0] as unknown as ImageDataFormat)}
                  heightClass="w-full md:w-1/2 h-[45dvh] md:h-full"
                />
                <div className="flex flex-col gap-3 md:gap-4 w-full md:w-1/2 h-full">
                  {images.slice(1).map((img: Json, idx) => (
                    <MasonryCard
                      key={idx + 1}
                      data={img as unknown as ImageDataFormat}
                      onRetry={() => {}}
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