// import { createClient } from "@/db/supabase/server";
// import { NextResponse } from "next/server";

// export async function GET(request: Request) {
//   // The `/auth/callback` route is required for the server-side auth flow implemented
//   // by the SSR package. It exchanges an auth code for the user's session.
//   // https://supabase.com/docs/guides/auth/server-side/nextjs
//   const requestUrl = new URL(request.url);
//   const code = requestUrl.searchParams.get("code");
//   const origin = requestUrl.origin;

//   if (code) {
//     const supabase = createClient();
//     await supabase.auth.exchangeCodeForSession(code);
//   }

//   // URL to redirect to after sign up process completes
//   return NextResponse.redirect(`${origin}`);
// }

import { NextResponse } from "next/server"
import { createClient } from "@/db/supabase/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next")

  if (code) {
    const supabase = createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  if (next) {
    return NextResponse.redirect(requestUrl.origin + next)
  } else {
    return NextResponse.redirect(requestUrl.origin)
  }
}
