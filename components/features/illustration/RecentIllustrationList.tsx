import { getIllustrations } from "@/actions/illustrations";

export default async function RecentIllustrationList() {
    const illustrations = await getIllustrations({ accountId: "94e49535-fc86-4b50-9271-18ad74f54c0c", teamId: 1 });

    return <div className="flex gap-3 ">
        {illustrations.map((illustration) => (
            <div key={illustration.id} className="w-[18rem] h-62.5 bg-gray-300 rounded-md">
                <p>{illustration.user_name}</p>
                <p>{illustration.description} desc </p>
            </div>
        ))}
    </div>
}