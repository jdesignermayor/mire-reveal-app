import { getIllustrations } from "@/actions/illustrations";
import IllustrationCard from "./IllustrationCard";

export default async function RecentIllustrationList() {
    const illustrations = await getIllustrations();

    return (
        <div className="flex gap-3  flex-wrap py-2">
            {illustrations.map((illustration) => {
                return (
                    <IllustrationCard illustration={illustration} key={illustration.id} />
                );
            })}
        </div>
    );
}