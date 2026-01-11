import { getAuthData } from "@/lib/auth.utils";
import { DBTableList } from "@/lib/db.schema";
import { supabaseServer } from "@/lib/supabase/server";

export async function getUserData() {
    const supabase = await supabaseServer();

    // get user information in the auth
    const { user } = await getAuthData();

    if (!user) {
        return null;
    }

    try {

        const uuidUser = user.id;
        // get user information in the db

        const { data: userData, error: errorUser } = await supabase.from(DBTableList.USERS)
            .select('*')
            .eq('uuid_user', uuidUser)
            .single();

        if (errorUser) {
            throw errorUser;
        }

        return userData;

    } catch (error) {
        return null;
    }
}