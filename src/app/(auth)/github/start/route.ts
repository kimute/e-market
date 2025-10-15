// Route Handlers
// Route Handlers allow you to create custom request handlers for specific routes using the Web Request and Response APIs.
// HTTP methods like GET, POST, PUT, PATCH, DELETE, HEAD, and OPTIONS are supported.
// If an unsupported method is called, Next.js will return a 405 Method Not Allowed response.

export function GET() {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const params = {
        client_id: process.env.GITHUB_CLIENT_ID!,
        scope: "read:user,user:email",
        redirect_uri: "http://localhost:3000/github/complete",
        allow_signup: "true",
    };
    const formattedParams = new URLSearchParams(params).toString();
    const finalUrl = `${baseUrl}?${formattedParams}`;
    return Response.redirect(finalUrl);
}