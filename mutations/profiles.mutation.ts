"use client";

import {  TypeProfileValuesForm } from "@/components/features/profiles/ProfileForm";
import { DBTableList } from "@/lib/db.schema";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Profile } from "@/models/profile.model";

export function updateProfileMutation() {
  const supabase = supabaseBrowser();
  return useMutation({
    mutationFn: async (profile: Profile) => {
      const { data, error } = await supabase
        .from(DBTableList.PROFILES)
        .update({ name: profile.name, doc: profile.doc, age: profile.age, email: profile.email, phone: profile.phone })
        .eq('id', profile.id)
        .select()
        .single()

      if (error) {
        throw error;
      }

      return data;
    },
  });
}

export function createProfileMutation(){
  const supabase = supabaseBrowser();
  return useMutation({
    mutationFn: async (profile: TypeProfileValuesForm) => {
      const { data, error } = await supabase
        .from(DBTableList.PROFILES)
        // @ts-ignore no error identified
        .insert({ name: profile.name, doc: profile.doc, age: profile.age, email: profile.email, phone: profile.phone })
        .select()
        .single()

      if (error) {
        throw error;
      }

      return data;
    }
  })
}

export function getProfilesQuery(){
  const supabase = supabaseBrowser();
  return useQuery({
    queryKey: ["profiles"],
    staleTime: 60 * 60 * 1000, // 1 hour
    queryFn: async () => {
      const resp = await supabase.from(DBTableList.PROFILES).select('*')

      if (resp.error) {
        throw resp.error;
      }

      return resp.data;
    }
  })
}