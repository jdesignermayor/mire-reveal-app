import { getIllustrations } from "@/actions/illustrations";
import IllustrationCard from "./IllustrationCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function RecentIllustrationList() {
    const illustrations = await getIllustrations();

    return (
        <>
            {illustrations && illustrations?.length > 0 ? (
                <div className="flex gap-3 flex-wrap py-2">
                    {illustrations.map((illustration) => {
                        return (
                            <IllustrationCard illustration={illustration} key={illustration.id} />
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className=" flex flex-col justify-center max-w-md space-y-4">
                        <h3 className="text-2xl font-semibold text-foreground">No illustrations yet</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Start creating beautiful hyper-realistic ultrasound illustrations to share with others.
                        </p>
                        <Link href="/dashboard/create-illustration">
                            <Button size="lg" className="mt-2">
                                Create Your First Illustration
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}