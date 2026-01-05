import { DBTableList } from "@/lib/db.schema";
import { supabaseServer } from "@/lib/supabase/server";
import { ProfileSchema } from "@/models/profile.model";

export async function getProfiles() : Promise<ProfileSchema[]> {
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

export async function getProfileById(id: string): Promise<ProfileSchema | null> {
    try {
        const supabase = await supabaseServer();

        const { data, error } = await supabase
            .from(DBTableList.PROFILES)
            .select('*')
            .eq('id', id).single();

        if (error) {
            throw error;
        }

        const profileData = data as ProfileSchema;
        return profileData;

    } catch(error){
        return null;
    }
}

export async function updateProfile(profile: ProfileSchema) {
    try {
        // const supabase = await supabaseServer();
        console.log('profile;', profile)
        // const { data, error } = await supabase
        //     .from(DBTableList.PROFILES)
        //     .upsert({...profile})
        //     .eq('id', profile.id).single();

        // if (error) {
        //     throw error;
        // }

    } catch (error) {
        throw Error('Error')
    }
}