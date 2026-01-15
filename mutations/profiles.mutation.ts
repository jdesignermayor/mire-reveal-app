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
  return useMutation({
    mutationFn: async (profile: TypeProfileValuesForm) => {

      const resp = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: profile.name, doc: profile.doc, age: profile.age, email: profile.email, phone: profile.phone }),
      })

      if (!resp.ok) {
        const errorBody = await resp.json().catch(() => null)
        throw new Error(
          errorBody?.message || "Error al crear el perfil"
        )
      }

      return resp.json();
    }
  })
}

export function getProfilesQuery(){
  return useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      
      const resp = await fetch("/api/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
      })
      
      if (!resp.ok) {
        const errorBody = await resp.json().catch(() => null)
        throw new Error(
          errorBody?.message || "Error al obtener los perfiles"
        )
      }

      return resp.json();
    }
  })
}