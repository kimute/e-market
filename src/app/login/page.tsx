"use client";

import FormButton from "@/components/form-button";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";
import { useActionState } from "react";

import { handleForm } from "./actions";

export default function LogIn() {
  // test for route handler
  //   const onClick = async () => {
  //     const res = await fetch("/api/users", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         username: "test user",
  //         password: "1234",
  //       }),
  //     });
  //     console.log(await res.json());
  //   };

  const [state, action] = useActionState(handleForm, null);

  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      {/* welcome */}
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">Welcome!</h1>
        <h2 className="text-xl">Log in with Email and password.</h2>
      </div>
      {/* form */}
      {/* When using an action function, don’t forget to add a name to each input */}
      <form action={action} className="flex flex-col gap-3">
        <FormInput
          name="email"
          type="email"
          placeholder="Email"
          required
          errors={[]}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={state?.errors ?? []}
        />
        <FormButton type="submit" text="LogIn" />
      </form>
      {/* api route test TODO: delete */}
      {/* <span onClick={onClick}>
        <FormButton text="route handler test" />
      </span> */}
      <div className="w-full h-px bg-neutral-500" />
      <SocialLogin />
    </div>
  );
}
