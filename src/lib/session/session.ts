import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
  id?: number;
}

export default async function getSession() {
  const cookieName = process.env.NODE_ENV === "development" 
    ? `e-market_${process.env.PORT || 3000}` 
    : "e-market";
    
  return getIronSession<SessionContent>(await cookies(), {
    cookieName,
    password: process.env.COOKIE_PASSWORD!,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    },
  });
}
