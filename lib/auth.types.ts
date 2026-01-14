import { User } from '@supabase/supabase-js';

// Supabase Auth user type (not database user)
export type AuthUser = User;

// Common auth-related types
export type AuthSession = {
  user: AuthUser | null;
  session: any | null;
};

export type AuthError = {
  message: string;
  status?: number;
};
