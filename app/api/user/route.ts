import { DBTableList } from "@/lib/db.schema";
import { supabaseServer } from "@/lib/supabase/server"
import { User } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server"

const isDev = process.env.NODE_ENV === "development"
export const NO_COMPANY_ID = 6;

export type UserWithComputed = User & ReturnType<typeof getUserDatabaseComputed>;

function validateRequest({ origin, host, req }: { origin: string | null; host: string | null; req: NextRequest }) {
    if (!isDev) {
        if (!origin || !host) {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            )
        }

        const proto = req.headers.get("x-forwarded-proto") ?? "https"
        const expectedOrigin = `${proto}://${host}`

        if (origin !== expectedOrigin) {
            return NextResponse.json(
                { error: "Invalid origin" },
                { status: 403 }
            )
        }
    }

    const contentType = req.headers.get("content-type")

    if (!contentType?.includes("application/json")) {
        return NextResponse.json(
            { error: "Only application/json is allowed" },
            { status: 415 }
        )
    }
}

async function getUserDatabaseComputed() {
    const supabase = await supabaseServer();
    const { data, error } = await supabase
        .from(DBTableList.USERS)
        .select(`
            id,
            id_company,
            is_active,
            email,
            name_role,
            uuid_user,
            tbl_company:id_company (
            name
            )
        `)

    if (error || !data) {
        return [];
    }

    const compoundData = data?.map((user) => {
        return {
            ...user,
            isAssigned: user.id_company !== NO_COMPANY_ID,
            isAssignedToCompany: user.id_company,
            role: user.name_role,
            companyId: user.id_company,
            uuid_user: user.uuid_user,
            companyName: user.tbl_company?.name || ""
        }
    })
    
    return compoundData;
}

export async function POST(req: NextRequest) {
    const supabase = await supabaseServer();
    const origin = req.headers.get("origin")
    const host = req.headers.get("host")

    validateRequest({ origin, host, req })

    try {
        const body = await req.json();
        const name = body.fullName;
        const nit = body.nit;
        const email = body.email;

        if (!name || !nit || !email) {
            return NextResponse.json(
                { error: "Please, check the information..." },
                { status: 400 }
            )
        }

        const { data, error } = await supabase
            .auth.admin.createUser({
                email,
                password: "password123",
                email_confirm: true,
        });

        if (error || !data.user?.id) {
            console.error("User creation error:", error);
            throw error;
        }
      
        const { data: userData, error: userError } = await supabase.from(DBTableList.USERS).insert({
            uuid_user: data.user.id,
            name: name,
            nit: nit,
            email: email,
            id_company: NO_COMPANY_ID,
            is_active: false,
            name_role: "COMPANY"
        });

        if (userError) {
            console.error("User creation error:", userError);
            throw userError;
        }

        return NextResponse.json(
            { message: "email: " + email },
            { status: 200 }
        )

    } catch {
        return NextResponse.json(
            { error: "Invalid JSON body" },
            { status: 400 }
        )
    }
}

export async function DELETE(req: NextRequest) {
    const supabase = await supabaseServer();

    const origin = req.headers.get("origin")
    const host = req.headers.get("host")

    validateRequest({ origin, host, req })

    try {

        const body = await req.json();
        const userId = body.userId;

        if (!userId) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            )
        }

        const { error } = await supabase.auth.admin.deleteUser(userId);

        if (error) {
            console.error("User deletion error:", error);
            throw error;
        }

        await supabase.from(DBTableList.USERS).delete().eq('uuid_user', userId);

        // Return a response indicating success
        return NextResponse.json(
            { message: `User ${userId} deleted successfully` },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { message: 'Error deleting user' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    const origin = req.headers.get("origin")
    const host = req.headers.get("host");

    validateRequest({ origin, host, req })
    
    const computedUser = await getUserDatabaseComputed();

    return NextResponse.json(
        { message: "Users fetched successfully", users: computedUser },
        { status: 200 }
    )
}