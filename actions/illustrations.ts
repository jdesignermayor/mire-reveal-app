"use server";

import { DBTableList } from "@/lib/db.schema";
import { supabaseServer } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/types";

type Illustration =
  Database['public']['Tables']['tbl_illustrations']['Row'] & { user_name: string }

async function getUserName(userId: string | null): Promise<string> {
    if (!userId) return "Usuario Desconocidos";
    const supabase = await supabaseServer();
    const { data, error } = await supabase.from(DBTableList.PROFILES).select("name").eq("uuid_user", userId).single();
    return data?.name || "Usuario Desconocidos";
}

export async function getIllustrations({ accountId, teamId }: { accountId: string, teamId: number }): Promise<Illustration[]> {
    try {
        const supabase = await supabaseServer();

        let query = supabase.from(DBTableList.ILLUSTRATIONS).select("*").eq("user_id", accountId).order("created_at", { ascending: false });
        if(teamId){
            query = query.eq("team_id", teamId);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching illustrations:", error);
            return [];
        }
        console.log('Illustrations fetched successfully:', data);

        const computedData = await Promise.all(
            data?.map(async (ill) => ({
                ...ill,
                user_name: await getUserName(ill.profile_id),
            })) || []
        )

        return computedData;
    }
    catch (error) {
        console.log("Error fetching illustrations:", error);
        return [];
    }
}
