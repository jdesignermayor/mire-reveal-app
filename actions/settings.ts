"use server";

import { SettingsFormValues } from "@/components/features/settings/SettingsForm";
import { getAuthData } from "@/lib/auth.utils";
import { DBTableList } from "@/lib/db.schema";
import { supabaseServer } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/types";

type User =
  Database['public']['Tables']['tbl_users']['Row'] & { email: string };

type Company =
  Database['public']['Tables']['tbl_company']['Row'];

export type GetSettingsType = {
    user: User,
    company: Company,
    watermark_public_url: string,
    logo_public_url: string,
}

// export async function loadAsset({ type }: { type: 'logo' | 'watermark' }): Promise<string | null>{
//     const supabase = await supabaseServer();

//     try {

//     } catch (error) {
//         return null;
//     }
// }

async function getCompanyAssets({ logo_path, watermark_path }: { logo_path: string, watermark_path: string }): Promise<string[]> {
    const supabase = await supabaseServer();
    const imagePaths = [logo_path, watermark_path]; // Array of paths

    // Generate signed URLs that expire in 60 seconds
    const { data: signedUrls, error } = await supabase
    .storage
    .from('company_assets')
    .createSignedUrls(imagePaths, 60); // 60 seconds expiry

    if (error) {
        console.error(error);
        return [];
    } else {
        const urls = signedUrls.map(item => item.signedUrl);
        return urls;
    }
}

export async function getSettings(): Promise<GetSettingsType | null>{
    const supabase = await supabaseServer();
    
    // get user information in the auth
    const { user } = await getAuthData();

    if(!user){
        return null;
    }

    try {
        const uuidUser = user.id;
        // get user information in the db

        const { data: userData, error: errorUser  } = await supabase.from(DBTableList.USERS)
        .select('*')
        .eq('uuid_user', uuidUser)
        .single();

        if (errorUser) {
            throw errorUser;
        }

        const { data: companyData, error: errorCompany } = await supabase.from(DBTableList.COMPANY)
        .select('*')
        .eq('id_principal_user', uuidUser)
        .single();

        if (errorCompany) {
            throw errorCompany;
        }

        const computedUser = {
            ...userData,
            email: user.email || ''
        }

        const [ logoAssetURL, watermarkAssetURL] = await getCompanyAssets({ logo_path: companyData.logo_url || './empty-image.jpg', watermark_path: companyData.watermark_url || './empty-image.jpg' });

        const computedResult : GetSettingsType = {
            user: computedUser,
            company: companyData,
            watermark_public_url: watermarkAssetURL,
            logo_public_url: logoAssetURL,
        }

        return computedResult;

    } catch (error) {
        return null
    }
}

export async function updateSettings({ settingFormValues, uuid_company }: { settingFormValues: SettingsFormValues, uuid_company: string  }) {
    const supabase = await supabaseServer();

    try {
        const { data ,error } = await supabase.from(DBTableList.COMPANY)
        .update({
            name: settingFormValues.name,
            phone: settingFormValues.phone,
            nit: settingFormValues.nit,
            logo_url: settingFormValues.logo,
            watermark_url: settingFormValues.watermark,
        })
        .eq('uuid_company', uuid_company)
        .single();

        if (error) {
            console.log('error', error);
            throw error;
        }

        return true;

    } catch (error) {
        return null;
    }
}