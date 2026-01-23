"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Database } from "@/lib/supabase/types";
import { ILLUSTRATION_STATUS } from "@/models/illustration.model";
import { UIIllustrationAtom } from "@/store/ui-illustration.store";
import { useAtom } from "jotai";
import Image from "next/image";
import { useRouter } from "next/navigation";

function formatDate(date: string) {
    const formatted = new Date(date)
        .toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });

    return formatted
}

interface StatusImageComponentProps {
    processedUrl: string;
    unprocessedUrl: string;
    status: ILLUSTRATION_STATUS;
}

type Illustration = Database['public']['Tables']['tbl_illustrations']['Row'] & { user_name: string };

const StatusImageComponent = ({ processedUrl, unprocessedUrl, status }: StatusImageComponentProps) => {
    if (status === ILLUSTRATION_STATUS.PROCESSING || status === ILLUSTRATION_STATUS.PENDING) {
        return {
            component: <Image
                src={unprocessedUrl}
                alt="Processing"
                fill
                className="object-cover blur-sm filter grayscale hue-rotate-180 saturate-50 brightness-105"
            />,
            label: "Procesando, click para ver."
        }
    }

    if (status === ILLUSTRATION_STATUS.FAILED) {
        return {
            component: <Image
                src={unprocessedUrl}
                alt="Processing"
                fill
                className="object-cover blur-sm brightness-75 red hue-rotate-330"
            />,
            label: "Error, click para ver."
        }
    }

    if (status === ILLUSTRATION_STATUS.COMPLETED) {
        return {
            component: <Image
                src={processedUrl}
                alt="Processed"
                fill
                className="object-cover"
            />,
            label: "Completada."
        }
    }

    return {
        component: <Image
            src={unprocessedUrl}
            alt="Default"
            fill
            className="object-cover"
        />,
        label: "Procesando, click para ver..."
    }
}

export default function IllustrationCard({ illustration }: { illustration: Illustration }) {
    const router = useRouter();
    const [, setIllustration] = useAtom(UIIllustrationAtom);
    const illustrationStatus = illustration.process_status as ILLUSTRATION_STATUS;

    // @ts-ignore ignoring ts error because images is json type
    const firstIllustration = illustration.images?.[0];

    const firstImageProcessed = firstIllustration?.images?.processed?.publicUrl;
    const firstImageUnprocessed = firstIllustration?.images?.unprocessed?.publicUrl;

    const statusResult = StatusImageComponent({
        processedUrl: firstImageProcessed || "",
        unprocessedUrl: firstImageUnprocessed || "",
        status: illustrationStatus
    });

    const handleIllustrationClick = (illustration: Illustration) => {
        router.push(`/dashboard/create-illustration/${illustration.id}`);
        setIllustration({
            illustration,
            updatedImages: [],
            updatedStatus: ILLUSTRATION_STATUS.PENDING,
        });
    };

    return <Card
        key={illustration.id}
        className="min-w-72 border rounded-md p-2 cursor-pointer hover:bg-gray-100 transition-all shadow-none"
        onClick={() => handleIllustrationClick(illustration)}
    >
        <CardContent className="p-0">
            <div className="relative grid grid-cols-2 w-full aspect-square overflow-hidden rounded-md border">
                {/* Processed */}
                <div className="relative">
                    {statusResult.component}
                    <span className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                        {illustrationStatus === ILLUSTRATION_STATUS.PROCESSING || illustrationStatus === ILLUSTRATION_STATUS.PENDING ? (
                            <div className="flex items-center gap-1">
                                <Spinner /> {statusResult.label}
                            </div>
                        ) : (
                            statusResult.label
                        )}
                    </span>
                </div>
                <div className="relative">
                    <Image
                        src={firstImageUnprocessed}
                        alt="Unprocessed"
                        fill
                        className="object-cover"
                    />
                    <span className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                        Original
                    </span>
                </div>

                {/* Divider */}
                <div className="absolute inset-y-0 left-1/2 w-px bg-white/70" />
            </div>
            <div className="flex flex-col gap-1 text-sm pt-2">
                <p className="font-medium capitalize">{illustration.baby_name || "Sin nombre"}</p>
                <p>{formatDate(illustration.created_at)}</p>
            </div>
        </CardContent>
    </Card>
}