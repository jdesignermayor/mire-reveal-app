"use server";

import { User } from "@supabase/supabase-js";
import { supabaseServer } from "./supabase/server";

type AuthResponse = {
  isAuthenticated: boolean;
  user: User | null;
};

export async function getAuthData(): Promise<AuthResponse> {
    const supabase = supabaseServer();
    const { auth } = await supabase;
    const { data } = await auth.getUser();

    const response: AuthResponse =  {
      isAuthenticated: data?.user ? true : false,
      user: data?.user || null,
    };

    return response;
}

export async function onSignOut(){
  const supabase = supabaseServer();
  const { auth } = await supabase;
  await auth.signOut();
}