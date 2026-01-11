import { DBTableList } from "@/lib/db.schema";
import { supabaseServer } from "@/lib/supabase/server";
import { Profile } from "@/models/profile.model";
import { getUserData } from "./auth";


export async function getProfiles() : Promise<Profile[]> {
    try {
        const user = await getUserData();

        if(!user || !user.id_company){
            return [];
        }

        const supabase = await supabaseServer();
        
        const { data, error } = await supabase
            .from(DBTableList.PROFILES)
            .select('*')
            .eq('id_company', user.id_company);

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