import { DBTableList } from "@/lib/db.schema";
import { supabaseServer } from "@/lib/supabase/server";
import { Profile } from "@/models/profile.model";


export async function getProfiles() : Promise<Profile[]> {
    try {
        const supabase = await supabaseServer();

        const { data, error } = await supabase
            .from(DBTableList.PROFILES)
            .select('*')

        if (error) {
            throw error;
        }

        return data;

    } catch(error){
        return []
    }
}

export async function getProfileById(id: number): Promise<Profile | null> {
    try {
        const supabase = await supabaseServer();

        const { data, error } = await supabase
            .from(DBTableList.PROFILES)
            .select('*')
            .eq('id', id).single();

        if (error) {
            throw error;
        }

        const profileData = data;
        return profileData as Profile;

    } catch(error){
        return null;
    }
}