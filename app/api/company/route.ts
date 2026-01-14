import { DBTableList } from "@/lib/db.schema";
import { supabaseServer } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { NO_COMPANY_ID } from "../user/route";

const isDev = process.env.NODE_ENV === "development"

export function validateRequest({ origin, host, req }: { origin: string | null; host: string | null; req: NextRequest }) {
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

export async function GET(req: NextRequest) {
    const supabase = await supabaseServer();
    const origin = req.headers.get("origin")
    const host = req.headers.get("host");

    validateRequest({ origin, host, req })
    
    const { data, error } = await supabase
        .from(DBTableList.COMPANY)
        .select("*")
        .order("created_at", { ascending: false })
        .not("id", "eq", NO_COMPANY_ID);

    if (error) {
        return NextResponse.json(
            { message: "Error fetching companies", error: error.message },
            { status: 500 }
        )
    }

    return NextResponse.json(
        { message: "Companies fetched successfully", companies: data || [] },
        { status: 200 }
    )
}

export async function POST(req: NextRequest) {
    const supabase = await supabaseServer();
    const origin = req.headers.get("origin")
    const host = req.headers.get("host");

    validateRequest({ origin, host, req })

    try {
        const body = await req.json();
        const { name, email, phone, nit, billingPlan } = body;

        if (!name || !email || !phone || !nit || !billingPlan) {
            return NextResponse.json(
                { error: "All fields are required: name, email, phone, nit, billingPlan" },
                { status: 400 }
            )
        }

        const { data, error } = await supabase
            .from(DBTableList.COMPANY)
            .insert({ name, email, phone, nit, id_plan: billingPlan })
            .select()
            .single();

        if (error) {
            console.error("Error creating company:", error);
            throw error;
        }

        return NextResponse.json(
            { message: "Company created successfully", company: data },
            { status: 201 }
        )

    } catch {
        return NextResponse.json(
            { error: "Invalid JSON body" },
            { status: 400 }
        )
    }
}

export async function PUT(req: NextRequest) {
    const supabase = await supabaseServer();
    const origin = req.headers.get("origin")
    const host = req.headers.get("host");

    validateRequest({ origin, host, req })

    try {
        const body = await req.json();
        const { id, name, email, phone, nit, billingPlan } = body;

        if (!id || !name || !email || !phone || !nit || !billingPlan) {
            return NextResponse.json(
                { error: "All fields are required: id, name, email, phone, nit, billingPlan" },
                { status: 400 }
            )
        }

        const { data, error } = await supabase
            .from(DBTableList.COMPANY)
            .update({ name, email, phone, nit, id_plan: billingPlan })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error("Error updating company:", error);
            throw error;
        }

        return NextResponse.json(
            { message: "Company updated successfully", company: data },
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
    const host = req.headers.get("host");

    validateRequest({ origin, host, req })

    try {
        const body = await req.json();
        const companyId = body.companyId;

        if (!companyId) {
            return NextResponse.json(
                { error: "Company ID is required" },
                { status: 400 }
            )
        }

        await supabase
            .from(DBTableList.COMPANY)
            .delete()
            .eq("id", companyId);

        return NextResponse.json(
            { message: `Company ${companyId} deleted successfully` },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting company:', error);
        return NextResponse.json(
            { message: 'Error deleting company' },
            { status: 500 }
        );
    }
}
