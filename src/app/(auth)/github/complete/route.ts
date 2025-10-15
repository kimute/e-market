


import getAccessToken from "@/lib/auth/github/getAccessToken";
import getEmailInfo from '@/lib/auth/github/getEmailInfo';
import db from "@/lib/db";
import setSession from "@/lib/session/setSession";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");
    if (!code) {
        return notFound();
    }


    const { error, access_token } = await getAccessToken(code);
    const emailInfo = await getEmailInfo(access_token); //todo: add email to DB
    console.log("Email info:", emailInfo);
    // error handling
    if (error) {
        return new Response(null, { status: 400 });
    }
    // response from github
    const userProfileResponse = await fetch("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    const { id, login, avatar_url } = await userProfileResponse.json();
    // check if user exists
    const user = await db.user.findUnique({
        where: {
            githubId: id + "", //make it a string
        },
        select: {
            id: true,
        },
    });
    if (user) {
        await setSession(user.id);
        return redirect("/profile");
    }

    const newUser = await db.user.create({
        data: {
            username: `${login}_${id}`, // Combine GitHub username with ID to ensure uniqueness
            githubId: id + "",
            avatar: avatar_url,
        },
        select: {
            id: true,
        },
    });
    await setSession(newUser.id);
    return redirect("/profile");
}
