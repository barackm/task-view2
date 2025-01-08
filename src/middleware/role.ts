import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { UserStatus } from "@/types/users";

export async function roleMiddleware(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.next();
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  if (profileData?.status === UserStatus.PENDING) {
    console.log("Redirecting to account-pending");
    const url = request.nextUrl.clone();
    url.pathname = "/account-pending";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
