'use client'

import { ImageDataFormat } from '@/models/illustration.model'
import { XIcon } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import UltrasoundTabs, { UltrasoundTab } from './UltrasoundTabs'

export default function UltrasoundViewer({
  image,
  onClose,
}: {
  image: ImageDataFormat
  onClose: () => void
}) {
  const [activeTab, setActiveTab] = useState<UltrasoundTab>('reveal')

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const processedUrl = image.images.processed.publicUrl
  const originalUrl = image.images.unprocessed.publicUrl

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-black animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4 shrink-0">
        <UltrasoundTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <button
          onClick={onClose}
          className="flex items-center justify-center size-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all duration-200 backdrop-blur-sm"
        >
          <XIcon className="size-5" />
        </button>
      </div>

      {/* Content */}
      <div className="relative flex-1 w-full overflow-hidden">
        {activeTab === 'reveal' && (
          <Image
            src={processedUrl}
            alt="Ecografía hiperrealista"
            fill
            priority
            sizes="100vw"
            className="object-contain"
          />
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
