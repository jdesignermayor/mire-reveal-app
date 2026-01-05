"use client";

import { TypeProfileValuesForm } from "@/components/features/profiles/ProfileForm";
import { DBTableList } from "@/lib/db.schema";
import { supabaseBrowser } from "@/lib/supabase/client";
import { ProfileSchema } from "@/models/profile.model";
import { useMutation } from "@tanstack/react-query";

export function updateProfileMutation() {
  const supabase = supabaseBrowser();
  return useMutation({
    mutationFn: async (profile: ProfileSchema) => {
      const { data, error } = await supabase
        .from(DBTableList.PROFILES)
        .update({ name: profile.name, doc: profile.doc, age: profile.age, email: profile.email , phone: profile.phone })
        .eq('id', profile.id)

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
      .insert({ name: profile.name, doc: profile.doc, age: profile.age, email: profile.email, phone: profile.phone })

      if (error) {
        throw error;
      }

      return data;
    }
  })
}