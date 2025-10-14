import FormButton from "@/components/form-button";
import db from "@/lib/db";
import clearSession from "@/lib/session/clearSeeeion";
import getSession from "@/lib/session/session";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: Number(session.id),
      },
    });
    if (user) {
      return user;
    }
  }
  notFound(); // do not need return notFound()
}

// You don't need to make everything static for performance
// The function below is an example of this
// Using fallback allows you to show alternative content when data is not available
async function UserName() {
  const user = await getUser();
  return (
    <>
      <h1 className="text-4xl">Profile Page</h1>
      <h2 className="text-2xl"> Welcome ! {user?.username}</h2>
    </>
  );
}

// You don't need to use "use client" - create the function below and put it in the logout form
const logOut = async () => {
  "use server";
  await clearSession();
  redirect("/");
};

export default function Profile() {
  return (
    <div>
      <Suspense fallback={<div>Hello !</div>}>
        <UserName />
      </Suspense>
      <form action={logOut} className="mt-2">
        <FormButton type="submit" text="Log Out" />
      </form>
    </div>
  );
}
