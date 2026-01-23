import { getIllustrationById } from "@/actions/illustrations";
import RevealIllustrationPanel from "@/components/features/illustration/RevealIllustrationPanel";
import { Illustration } from "@/models/illustration.model";
import { EyeIcon } from "lucide-react";
import { notFound } from "next/navigation";

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
                  Revelar ecografía hiperrealista
                </p>
              </div>
              <p className="text-muted-foreground text-sm">
                Revela tu ecografía hiperrealista creada, una ves finalizada la
                generación, puedes verla y compartirla con tus amigos y
                familiares.
              </p>
            </div>
            <div className="pt-6 w-full">
              <RevealIllustrationPanel illustrationId={id} />
            </div>
          </div>
        </div>
    )
}