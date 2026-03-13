import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ymdulabiaiyxbtknieby.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltZHVsYWJpYWl5eGJ0a25pZWJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMjc5ODgsImV4cCI6MjA4ODYwMzk4OH0.60qxXh_sD0UMu-6IG9PPFWngtNrf2sjCmVrelK6KEIU";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testQuery() {
    // Using an existing slug found in the database
    const slug = 'eeee'; 
    console.log("Testing query for slug:", slug);
    
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
        .maybeSingle(); // Use maybeSingle to avoid PGRST116 if not found

    if (pageError) {
        console.error("Query Error:", pageError.message);
        console.error("Error Hint:", pageError.hint);
        console.error("Error Code:", pageError.code);
    } else if (!linkPage) {
        console.log("No page found for slug:", slug);
    } else {
        console.log("Query Success:", linkPage);
    }
}

testQuery().catch(err => {
    console.error("Unexpected error:", err);
});
