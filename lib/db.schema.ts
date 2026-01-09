import { Database } from "./supabase/types"

export type Tables = keyof Database['public']['Tables']

export const DBTableList = {
  PROFILES: 'tbl_profiles',
  MODELS: 'tbl_models',
  ILLUSTRATIONS: 'tbl_illustrations',
  TEAMS: 'tbl_teams',
  COMPANY: 'tbl_company',
  EXPENSE_HISTORY: 'tbl_expense_model_history',
  USERS: 'tbl_users',
} as const satisfies Record<string, Tables>