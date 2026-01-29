"use client"


export const LandingBody = () => {
    return (
        <>
         <main className="flex flex-col min-h-screen items-center justify-center font-sans dark:bg-black bg-white ">
         <div className="flex flex-col-reverse md:flex-row w-full max-w-7xl items-center justify-between h-[80dvh]">
    
    {/* TEXTO */}
    <div className="flex flex-col lg:items-start items-center text-center lg:text-left gap-4 lg:justify-center px-4 md:px-0 xl:w-1/2">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-poppins">
            Hiper-Realistic. <br />
            <span>Ultrasound.</span> <br />
            Revolution.
        </h1>

        <p className="text-lg md:text-xl lg:text-2xl font-poppins max-w-lg">
        Using cutting-edge technology, we capture your baby’s most precious details before birth, creating a high-definition illustration in real time.
        </p>

        <button className="relative group bg-gradient-to-r from-[#7e96ff] to-[#6b8cff] text-white px-6 py-3 rounded-2xl text-2xl font-medium overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#3e62ff]/25 hover:scale-105 active:scale-95">
            Book a demo
        </button>
    </div>

    {/* VIDEO */}
    <div className="flex flex-col px-4 md:px-0 xl:w-2/3 mt-10 md:mt-0">
        <div className="relative mx-auto aspect-square rounded-full overflow-hidden h-[30dvh] md:h-[40dvh] lg:h-[50dvh]">
            
            {/* VIDEO */}
            <video
                src="/demos/herovideo.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
            />

            {/* BORDE */}
            <div className="pointer-events-none absolute inset-0 rounded-full" />

            {/* SOFT WHITE FADE */}
            <div
                className="
                    pointer-events-none
                    absolute inset-0 rounded-full
                    shadow-[inset_0_0_28px_rgba(255,255,255,0.65)]
                "
            />
        </div>
    </div>

</div>
            {/* <div className="flex flex-col w-full h-[90dvh] bg-black">
                <div className="flex flex-col gap-15 items-center justify-center text-white py-[10rem]">
                  <div className="flex flex-col gap-4 items-center justify-center">
                    <h2 className="text-6xl font-medium font-poppins">Why choose us?</h2>
                    <p className="text-white/90 text-lg">We are the most realistic and accurate ultrasound images in the market.</p>
                  </div>
                    <div className="flex gap-4 items-stretch justify-center">
                        <SpotlightCard className="max-w-md min-h-[35dvh] flex flex-col bg-black">
                            <div className="flex flex-col gap-4 flex-1">
                                <CheckCheckIcon size={40} className="shrink-0" />
                                <p className="text-white font-semibold text-4xl shrink-0">Highest Quality</p>
                                <p className="text-white/90 text-lg">We use the latest technology to create the most realistic and accurate ultrasound images in the market.</p>
                            </div>
                        </SpotlightCard>
                        <SpotlightCard className="max-w-md min-h-[35dvh] flex flex-col">
                            <div className="flex flex-col gap-4 flex-1">
                                <StarIcon size={40} className="shrink-0" />
                                <p className="text-white font-semibold text-4xl shrink-0">Intuitive Interface</p>
                                <p className="text-white/90 text-lg">We use the latest technology to create the most realistic and accurate ultrasound images in the market.</p>
                                <p className="text-white/90 text-lg">We deliver the images to you in just a few minutes.</p>
                            </div>
                        </SpotlightCard>
                        <SpotlightCard className="max-w-md min-h-[35dvh] flex flex-col">
                            <div className="flex flex-col gap-4 flex-1">
                                <TimerIcon size={40} className="shrink-0" />
                                <p className="text-white font-semibold text-4xl shrink-0">Support 24/7</p>
                                <p className="text-white/90 text-lg">We use the latest technology to create the most realistic and accurate ultrasound images in the market.</p>
                                <p className="text-white/90 text-lg">We are available 24/7 to help you with any questions you may have.</p>
                            </div>
                        </SpotlightCard>
                    </div>
                </div>
            </div> */}
            </main>
        </>
    )
}