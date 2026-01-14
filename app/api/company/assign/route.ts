import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { DBTableList } from "@/lib/db.schema";
import { validateRequest } from "../route";

export async function PUT(req: NextRequest) {
    const supabase = await supabaseServer();
    const origin = req.headers.get("origin")
    const host = req.headers.get("host");

    validateRequest({ origin, host, req })

    try {
        const body = await req.json();
        const { companyId, userId, email } = body;

        if (!companyId || !userId || !email) {
            return NextResponse.json(
                { error: "All fields are required: companyId, userId, email" },
                { status: 400 }
            )
        }

        const { data, error } = await supabase
            .from(DBTableList.COMPANY)
            .update({ 
                id_principal_user: userId,
                email: email
            })
            .eq('id', companyId)
            .select()
            .single();

        const { data: userData, error: userError } = await supabase
            .from(DBTableList.USERS)
            .update({ 
                id_company: companyId
            })
            .eq('uuid_user', userId)
            .select()
            .single();

        if (error) {
            console.error("Error assigning user to company:", error);
            throw error;
        }

        if(userError) {
            console.error("Error updating user:", userError);
            throw userError;
        }

        return NextResponse.json(
            { message: "User assigned to company successfully", company: data },
            { status: 200 }
        )

    } catch {
        return NextResponse.json(
            { error: "Invalid JSON body" },
            { status: 400 }
        )
    }
}
