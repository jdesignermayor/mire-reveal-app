import RevealIllustrationPanel from "@/components/features/illustration/RevealIllustrationPanel";
import { EyeIcon } from "lucide-react";

export default async function CreateIllustrationPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
    const { id } = await params;

    return (
        <div className={`flex justify-center items-center py-5 px-[10%]`}>
          <div className={`grid w-full`}>
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <p className="font-bold text-lg">
                  <EyeIcon className="size-6" />
                  Reveal hyper-realistic ultrasound
                </p>
              </div>
              <p className="text-muted-foreground text-sm">
                Reveal your created hyper-realistic ultrasound. Once generation is complete, you can view it and share it with your friends and family.
              </p>
            </div>
            <div className="pt-6 w-full">
              <RevealIllustrationPanel illustrationId={id} />
            </div>
          </div>
        </div>
    )
}