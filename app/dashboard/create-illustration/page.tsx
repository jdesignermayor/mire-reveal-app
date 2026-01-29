import RevealIllustrationForm from "@/components/features/illustration/RevealIllustrationForm";

export default function IllustrationPage() {
    return <section className="flex flex-col gap-8 w-full p-5">
          <div className="grid gap-8">
            <div>
              <h3 className="text-4xl font-bold">Reveal ultrasound</h3>
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