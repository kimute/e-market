export default async function getAccessToken(code: string) {
    const accessTokenUrl = "https://github.com/login/oauth/access_token";
    const accessTokenParams = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        code,
    }).toString();
    const acessTokenURL = `${accessTokenUrl}?${accessTokenParams}`;
    const accessTokenResponse = await fetch(acessTokenURL, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
        },
    });
    const { error, access_token } = await accessTokenResponse.json();

    return {
        error,
        access_token,
    };
}
