export function GET() {
    const authUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      scope:
        "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
      response_type: "code",
      redirect_uri: "http://localhost:3000/google/callback",
    });
  
    const formattedParams = new URLSearchParams(params).toString();
    const finalUrl = `${authUrl}?${formattedParams}`;
    return Response.redirect(finalUrl);
  }
  