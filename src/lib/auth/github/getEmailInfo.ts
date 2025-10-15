interface GitHubEmail {
    email: string;
    primary: boolean;
    verified: boolean;
    visibility: string | null;
}

export default async function getEmailInfo(
    accessToken: string
): Promise<string> {
    const emailInfoUrl = "https://api.github.com/user/emails";
    const emailInfoResponse = await fetch(emailInfoUrl, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const emailInfo: GitHubEmail[] = await emailInfoResponse.json();

    const primaryEmail = emailInfo.find(
        (email) => email.primary && email.visibility === "public"
    );

    if (!primaryEmail) {
        throw new Error("No primary public email found");
    }

    return primaryEmail.email;
}
