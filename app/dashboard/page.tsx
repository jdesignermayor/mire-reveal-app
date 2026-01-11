import RecentIllustrationList from '@/components/features/illustration/RecentIllustrationList';
import SkeletonRecentList from '@/components/features/illustration/SkeletonRecentList';
import { Suspense } from 'react';

export default async function DashboardPage() {
  return <section className="flex flex-col gap-8 w-full p-5">
      <div className="grid gap-8">
        <div>
          <h3 className="text-4xl font-bold">Tus Ilustraciones</h3>
          <p className="text-muted-foreground leading-relaxed">
            Aqui podras ver las ilustraciones recientes, filtrarlas y gestionarlas.
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