import { User } from "@supabase/supabase-js"

export type ComputedUser = User & {
  isAssigned: boolean
  isVerified: boolean
  idAssignedCompany: string | null
  role: string
}
