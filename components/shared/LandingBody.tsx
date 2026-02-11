"use client"

import { BookDemoDialog } from "./BookDemoDialog"

export const LandingBody = () => {
    return (
        <>
            <main className="flex flex-col min-h-screen items-center justify-center font-sans dark:bg-black bg-white ">
                <div className="flex flex-col-reverse md:flex-row w-full max-w-4xl 2xl:max-w-7xl items-center justify-between h-[80dvh]">
                    
                    {/* TEXT */}
                    <div className="flex flex-col lg:items-start items-center text-center lg:text-left gap-4 lg:justify-center px-4 md:px-0 xl:w-1/2">
                        <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-5xl 2xl:text-6xl font-bold font-poppins">
                            Hyper-Realistic. <br />
                            <span>Ultrasound.</span> <br />
                            Revolution.
                        </h1>

                        <p className="text-md 2xl:text-lg font-poppins max-w-sm">
                            Using cutting-edge technology, we capture your baby’s most precious details before birth, creating a high-definition illustration in real time.
                        </p>

                        <p className="text-xs text-muted-foreground max-w-sm">Generated images are fictional and should not be used for medical or diagnostic purposes.</p>

                        <BookDemoDialog
                            trigger={
                                <button
                                    type="button"
                                    className="relative rounded-2xl w-full md:w-auto group bg-gradient-to-r from-[#3e62ff] to-[#6b8cff] text-white px-6 py-3 text-xl font-medium overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#3e62ff]/25 hover:scale-105 active:scale-95"
                                >
                                    Book a demo
                                </button>
                            }
                        />
                    </div>

                    {/* VIDEO */}
                   <div className="flex flex-col px-4 md:px-0 xl:w-2/3 mt-10 md:mt-0">
  <div className="relative mx-auto aspect-square rounded-full overflow-hidden h-[30dvh] md:h-[40dvh] lg:h-[40dvh] xl:h-[60dvh]">
    <video
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className="absolute inset-0 h-full w-full object-cover"
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

    {/* BORDER (if you want one later) */}
    <div className="pointer-events-none absolute inset-0 rounded-full" />

    {/* SOFT BLACK FADE */}
    <div
      className="
        pointer-events-none
        absolute inset-0 rounded-full
        shadow-[inset_0_0_40px_rgba(0,0,0,0.75)]
      "
    />
  </div>
</div>

                </div>
            </main>
        </>
    )
}