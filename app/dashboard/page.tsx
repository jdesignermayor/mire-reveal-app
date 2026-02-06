import RecentIllustrationList from '@/components/features/illustration/RecentIllustrationList';
import SkeletonRecentList from '@/components/features/illustration/SkeletonRecentList';
import { Suspense } from 'react';

export default async function DashboardPage() {
  return <section className="flex flex-col gap-8 w-full p-5 dark dark:bg-black">
      <div className="grid gap-8">
        <div>
          <h3 className="text-2xl font-bold">Your illustrations</h3>
          <p className="text-muted-foreground leading-relaxed">
            Here you can see your recent illustrations, filter them and manage them.
          </p>
        </div>
        <div>
          <Suspense fallback={<SkeletonRecentList />}>
            <RecentIllustrationList />
          </Suspense>
        </div>
      </div>
    </section>;
}