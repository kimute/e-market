import getSession from "./session";

export default async function setSession(userId: number) {
    try {
        const session = await getSession();
        if (!session) {
            throw new Error("Failed to get session");
        }
        session.id = userId;
        await session.save();
    } catch (error) {
        console.error("Session error:", error);
        throw error;
    }
}