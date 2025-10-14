import getSession from "./session";

export default async function clearSession() {
    const session = await getSession();
    await session.destroy();
}