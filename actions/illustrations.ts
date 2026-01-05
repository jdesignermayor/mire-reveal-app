"use server";

import { DBTableList } from "@/lib/db.schema";
import { supabaseServer } from "@/lib/supabase/server";
import { IllustrationSchema } from "@/models/illustration.model";


async function getUserName(userId: string): Promise<string> {
    const supabase = await supabaseServer();
    const { data, error } = await supabase.from(DBTableList.PROFILES).select("name").eq("id", userId).single();
    return data?.name || "Usuario Desconocidos";
}


export async function getIllustrations({ accountId, teamId }: { accountId: string, teamId: string }): Promise<IllustrationSchema[]> {
    try {
        const supabase = await supabaseServer();

        let query = supabase.from(DBTableList.ILLUSTRATIONS).select("*").eq("user_id", accountId).order("created_at", { ascending: false });
        if(teamId){
            query = query.eq("team_id", teamId);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching illustrations:", error);
        }
        console.log('Illustrations fetched successfully:', data);

        const computedData = data?.map((ill) => ({
            ...ill,
            user_name: getUserName(ill.profile_id),
        }))

        return computedData as IllustrationSchema[];
    }
    catch (error) {
        console.log("Error fetching illustrations:", error);
        return [];
    }

}
