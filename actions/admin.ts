import { DBTableList } from "@/lib/db.schema";
import { supabaseServer } from "@/lib/supabase/server";

export const getAuthUsers = async () => {
    const supabase = await supabaseServer();

    const { data, error } = await supabase.auth.admin.listUsers({});

    if (error) {
        throw error;
    }

    return data;
};


export const getAllUsersInfo = async () => {
    const supabase = await supabaseServer();

    const { data, error } = await supabase.from(DBTableList.USERS).select('*');

    if (error) {
        throw error;
    }

    return data;
};