import { getIllustrations } from "@/actions/illustrations";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

function formatDate(date: string) {
    const formatted = new Date(date)
        .toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });

    return formatted
}

export default async function RecentIllustrationList() {
    const illustrations = await getIllustrations();

    return <div className="flex gap-3 overflow-x-auto py-2">
        {illustrations.map((illustration) => {
            // @ts-ignore ignoring ts error because images is json type
            const firstIllustration = illustration.images?.[0];

            const firstImageProccessed =
                firstIllustration?.images?.processed?.publicUrl ||
                "/demos/realistic_1.png";

            const firstImageUnprocessed =
                firstIllustration?.images?.unprocessed?.publicUrl ||
                "/demos/realistic_1.png";

            return (
                <Card
                    key={illustration.id}
                    className="min-w-[280px] border rounded-md p-2 cursor-pointer hover:bg-gray-100"
                >
                    <CardContent className="p-0">
                        {/* Comparison container */}
                        <div className="relative grid grid-cols-2 w-full aspect-square overflow-hidden rounded-md border">
                            {/* Processed */}
                            <div className="relative">
                                <Image
                                    src={firstImageProccessed}
                                    alt="Processed"
                                    fill
                                    className="object-cover"
                                />

                                {/* Label */}
                                <span className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                                    Procesada
                                </span>
                            </div>

                            {/* Unprocessed */}
                            <div className="relative">
                                <Image
                                    src={firstImageUnprocessed}
                                    alt="Unprocessed"
                                    fill
                                    className="object-cover"
                                />

                                {/* Label */}
                                <span className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                                    Original
                                </span>
                            </div>

                            {/* Divider */}
                            <div className="absolute inset-y-0 left-1/2 w-px bg-white/70" />
                        </div>
                        <div className="flex flex-col gap-1 text-sm pt-2">
                            <p className="font-medium capitalize">{illustration.baby_name}</p>
                            <p>{formatDate(illustration.created_at)}</p>
                        </div>
                    </CardContent>
                </Card>
            );
        })}
    </div>
}