
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function testQuery() {
    const slug = 'default'; // Or any slug you found
    const { data: linkPage, error: pageError } = await supabase
        .from("link_pages")
        .select(`
            id, 
            user_id, 
            slug, 
            display_name, 
            bio, 
            avatar_url, 
            avatar_shape,
            page_bg_type,
            page_bg_color,
            page_bg_gradient_start,
            page_bg_gradient_end,
            page_bg_image,
            card_bg_color,
            card_text_color,
            card_border_radius,
            card_style,
            page_font
        `)
        .eq("slug", slug)
        .single();

    if (pageError) {
        console.error("Query Error:", pageError.message);
        console.error("Error Hint:", pageError.hint);
        console.error("Error Code:", pageError.code);
    } else {
        console.log("Query Success:", linkPage);
    }
}

testQuery();
