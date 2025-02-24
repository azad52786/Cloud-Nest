import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const unauthenticatedPath: Array<string> = ["/sign-in", "/sign-up"];

// Exclude static assets and Next.js internal paths
const excludedPaths = [
  "/_next", // Next.js assets
  "/static", // Static assets
  "/public", // Public assets
  "/favicon.ico"
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Exclude static files like SVGs, images, CSS, JS, etc.
  if (
    excludedPaths.some((p) => path.startsWith(p)) || 
    path.match(/\.(svg|png|jpg|css|js|ico)$/)
  ) {
    return NextResponse.next();
  }

  console.log("Middleware called for:", path);
  
  const session = (await cookies()).get("appwrite-session");

  if (!session || !session.value) {
    if (!unauthenticatedPath.includes(path)) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  } else if (unauthenticatedPath.includes(path)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Matcher for all routes but avoids `_next/static`
export const config = {
  matcher: "/((?!_next|static|public).*)",
};
