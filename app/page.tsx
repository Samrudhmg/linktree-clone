"use client";

import { supabase } from "@/lib/supabase";
import Login from "./login/page";

export default function Home(){
  const handleLogin = async () => {
await supabase.auth.signInWithOAuth({
  provider: "google"
})
  };

  return (
    <div>
    <Login />    
     </div>
  )
}