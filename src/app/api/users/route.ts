import { NextRequest } from "next/server";

// this is route handler

// can see http://localhost:3000/api/users
// API endpoint for user operations
// The name can be whatever you like — for example, www or api.

export async function GET(request: NextRequest) {
    console.log(request);
    return Response.json({
        ok: true,
    })
} 

// It’s still useful when working with APIs or older versions of Next.js.
// But if you’re using Server Actions, you don’t need it anymore.(for form)
export async function POST(request: NextRequest){
    const data = await request.json()
    console.log("log the uer in");
    return Response.json(data);
}