import RevealIllustrationForm from "@/components/features/illustration/RevealIllustrationForm";

export default function IllustrationPage() {
    return <section className="flex w-full dark justify-center h-dvh">
          <div className="flex flex-col gap-2 dark max-w-7xl mx-auto py-5">
            <div>
              <h3 className="text-xl font-bold">Reveal ultrasound</h3>
              <p className="text-muted-foreground leading-relaxed">
                Here you can create a hyper-realistic ultrasound.
              </p>
            </div>
            <div>
                <RevealIllustrationForm />
            </div>
          </div>
        </section>
}