import { supabaseServer } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = supabaseServer();
  const { auth } = await supabase;
  const { data } = await auth.getUser();

  return <div>Welcome, {data.user?.email}</div>;
}