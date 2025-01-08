import { type NextRequest } from "next/server";
import { authMiddleware } from "./middleware/auth";

export async function middleware(request: NextRequest) {
  return await authMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
