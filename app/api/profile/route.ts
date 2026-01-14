import { DBTableList } from "@/lib/db.schema";
import { supabaseServer } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { validateRequest } from "../company/route";
import { getSettings } from "@/actions/settings";

export async function GET(req: NextRequest) {
    const supabase = await supabaseServer();
    const origin = req.headers.get("origin")
    const host = req.headers.get("host");
    const settings = await getSettings();

    if(!settings?.company){
        return NextResponse.json(
            { message: "Company not found" },
            { status: 404 }
        )
    }

    const { company } = settings;

    const result = validateRequest({ origin, host, req })
    
    if (result) {
        return result
    }

    const { data, error } = await supabase
        .from(DBTableList.PROFILES)
        .select('*')
        .eq('is_active', true)
        .eq('id_company', company.id);

    console.log('getProfiles', data, error)

    if (error) {
        return NextResponse.json(
            { message: "Error fetching profiles", error: error.message },
            { status: 500 }
        )
    }

    return NextResponse.json(
        { message: "Profiles fetched successfully", profiles: data || [] },
        { status: 200 }
    )
}

export async function POST(req: NextRequest) {
    const supabase = await supabaseServer();
    const origin = req.headers.get("origin")
    const host = req.headers.get("host");
    const settings = await getSettings();

    if(!settings?.company){
        return NextResponse.json(
            { message: "Company not found" },
            { status: 404 }
        )
    }

    const { company } = settings;

    const result = validateRequest({ origin, host, req })
    
    if (result) {
        return result
    }

    try {
        const body = await req.json();
        const { name, doc, age, email, phone } = body;

        if (!name || !doc || !age || !email || !phone) {
            return NextResponse.json(
                { error: "All fields are required: name, doc, age, email, phone" },
                { status: 400 }
            )
        }

        const { data, error } = await supabase
            .from(DBTableList.PROFILES)
            .insert({
                name,
                doc,
                age,
                email,
                phone,
                id_company: company.id,
                is_active: true
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating profile:", error);
            throw error;
        }

        return NextResponse.json(
            { message: "Profile created successfully", profile: data },
            { status: 201 }
        )

    } catch {
        return NextResponse.json(
            { error: "Invalid JSON body" },
            { status: 400 }
        )
    }
}