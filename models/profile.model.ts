import { Database } from "@/lib/supabase/types";

export type Profile =
  Database['public']['Tables']['tbl_profiles']['Row']