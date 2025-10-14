import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session/session";



interface Routes {
  [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
  "/": true,
  "/login": true,
  "/sms": true,
  "/create/account": true,
  "/github/start": true,
  "/github/complete": true,
  "/google/start": true,
  "/google/callback": true,
};

export async function middleware(request: NextRequest) {
  try {
    const session = await getSession();
    const exists = publicOnlyUrls[request.nextUrl.pathname];
    
    if (!session.id) {
      if (!exists) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } else {
      if (exists) {
        return NextResponse.redirect(new URL("/home", request.url));
      }
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/error", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};