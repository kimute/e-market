//import getGoogleAcessToken from "@/app/lib/auth/google/getGoogleAcessToken";

import db from "@/lib/db";
import getSession from "@/lib/session/session";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get("code");
    if (!code) {
      return notFound();
    }

    const accessTokenParams = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      code,
      grant_type: "authorization_code",
      redirect_uri: "http://localhost:3000/google/callback",
    }).toString();

    const accessTokenUrl = `https://oauth2.googleapis.com/token?${accessTokenParams}`;

    const tokenResponse = await fetch(accessTokenUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

    if (!tokenResponse.ok) {
      return new Response(null, { status: 400 });
    }

    const tokenData = await tokenResponse.json();
    // get access token
    const { error, access_token } = tokenData;
    if (error) {
      return new Response(null, { status: 400 });
    }

    const userProfileResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!userProfileResponse.ok) {
      return new Response(null, { status: 400 });
    }

    const userData = await userProfileResponse.json();
    const {
      sub: id,
      name,
      picture: avatar_url,
      email,
    } = userData;

    let userId: number;

    // First check by Google ID
    let existingUser = await db.user.findUnique({
      where: {
        googleId: id + "",
      },
      select: {
        id: true,
      },
    });

    // If not found by Google ID, check by email
    if (!existingUser) {
      existingUser = await db.user.findUnique({
        where: {
          email: email,
        },
        select: {
          id: true,
        },
      });

      // If user exists with this email, update their Google ID
      if (existingUser) {
        await db.user.update({
          where: {
            id: existingUser.id,
          },
          data: {
            googleId: id + "",
          },
        });
        console.log("Updated existing user with Google ID");
      }
    }

    if (existingUser) {
      userId = existingUser.id;
    } else {
      const newUser = await db.user.create({
        data: {
          googleId: id + "",
          email,
          username: name,
          avatar: avatar_url,
        },
        select: {
          id: true,
        },
      });
      userId = newUser.id;
    }

    // Set session
 
    const session = await getSession();
    session.id = userId;
    await session.save();
    
    return redirect("/profile");

  } catch (err) {
    // Handle Next.js redirect errors (these are not actual errors)
    if (err instanceof Error && err.message === "NEXT_REDIRECT") {
      throw err; // Re-throw redirect errors to let Next.js handle them
    }
    
    return new Response(JSON.stringify({ error: "Internal server error" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
