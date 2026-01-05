import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonRecentList(){
    return <section className="flex gap-5">
        <Skeleton className=" w-[18rem] h-62.5" />
        <Skeleton className=" w-[18rem] h-62.5" />
        <Skeleton className=" w-[18rem] h-62.5" />
        <Skeleton className=" w-[18rem] h-62.5" />
        <Skeleton className=" w-[18rem] h-62.5" />
        <Skeleton className=" w-[18rem] h-62.5" />
    </section>
}