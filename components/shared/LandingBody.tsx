"use client"

import { BookDemoDialog } from "./BookDemoDialog"
import LightRays from './LightRays';

export const LandingBody = () => {
  return (
    <div className="relative min-h-screen">
      {/* LightRays Background - Bottom Layer */}
      <div className="absolute inset-0 z-0">
        <LightRays
          raysOrigin="top-left"
          raysColor="#ffffff"
          raysSpeed={1}
          lightSpread={1.2}
          rayLength={2}
          followMouse={false}
          mouseInfluence={0.3}
          noiseAmount={0}
          distortion={0}
          className="custom-rays"
          pulsating={false}
          fadeDistance={1.5}
          saturation={1.2}
        />
      </div>

      {/* Video Background - Middle Layer */}
      <div className="absolute inset-0 z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full md:h-full w-full object-cover object-center opacity-60 md:opacity-50 rounded-none border-0 shadow-2xl"
          onError={(e) => {
            console.error("Video failed to load:", e)
            const target = e.target as HTMLVideoElement
            if (target.src) {
              target.load()
            }
          }}
        >
          <source src="/demos/herovideo.webm" type="video/webm" />
          <source src="/demos/herovideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Main Content - Top Layer */}
      <main className="relative z-20 flex flex-col min-h-screen items-center justify-center font-sans w-full">
        <div className="flex w-full items-center h-[80dvh]">

          {/* TEXT */}
          <div className="flex flex-col items-center text-center gap-4 justify-center px-4 w-full">
            
            <h1 className="text-4xl font-medium md:text-5xl lg:text-5xl xl:text-5xl 2xl:text-7xl text-white relative z-10">
              <span>Hyper-realistic.</span> <br />
              <span className=" italic font-serif">Ultrasound.</span> <br />
              <span>Revolution.</span>
            </h1>

            <p className="text-md lg:text-xl 2xl:text-2xl max-w-md lg:max-w-lg text-white/90 relative z-10">
              Using cutting-edge technology, we capture your baby's most precious details before birth, creating a high-definition illustration in real time.
            </p>

            <p className="text-xs text-white/70 max-w-sm relative z-10">Generated images are fictional and should not be used for medical or diagnostic purposes.</p>

            <BookDemoDialog
              trigger={
                <button
                  type="button"
                  className="relative rounded-2xl w-full  max-w-sm lg:max-w-lg md:w-auto group bg-gradient-to-r from-[#3e62ff] to-[#6b8cff] text-white px-6 py-3 text-xl font-medium overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#3e62ff]/25 hover:scale-105 active:scale-95 z-10"
                >
                  Book a demo
                </button>
              }
            />
          </div>
        </div>
      </main>
    </div>
  )
}