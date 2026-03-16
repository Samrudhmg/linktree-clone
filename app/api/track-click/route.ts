import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Initialize service role client for server-side insertions if needed,
// but for RLS compliance and simple insertions, anon key is sufficient
// as we've allowed public inserts for click_events.
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { linkId } = body;

        if (!linkId) {
            return NextResponse.json({ error: "linkId is required" }, { status: 400 });
        }

        const referrer = req.headers.get("referer") || "";
        const userAgent = req.headers.get("user-agent") || "";

        const { error } = await supabase
            .from("click_events")
            .insert([
                {
                    link_id: linkId,
                    referrer: referrer,
                    user_agent: userAgent,
                },
            ]);

        if (error) {
            console.error("Error recording click:", error);
            return NextResponse.json({ error: "Failed to record click" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Unexpected error in track-click API:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
