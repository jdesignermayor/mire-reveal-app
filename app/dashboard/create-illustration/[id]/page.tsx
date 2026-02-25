import RevealIllustrationPanel from "@/components/features/illustration/RevealIllustrationPanel";
import { SparklesIcon } from "lucide-react";

export default async function CreateIllustrationPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
    const { id } = await params;

    return (
        <div className="flex flex-col w-full min-h-screen">
          <div className="px-4 md:px-8 pt-16 pb-2 flex flex-col gap-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-2">
              Your ultrasound reveal
            </h1>
            <p className="text-muted-foreground text-sm max-w-md">
              Tap any image to see the full reveal, compare with the original, or watch the transition video.
            </p>
          </div>
          <div className="flex-1 w-full">
            <RevealIllustrationPanel illustrationId={id} />
          </div>
        </div>
    )
}