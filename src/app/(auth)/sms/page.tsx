"use client";
import FormButton from "@/components/form-button";
import FormInput from "@/components/form-input";
import { useActionState } from "react";
import { smsLogin } from "./actions";

const initialState = {
  token: false,
  phoneNumber: "",
};

export default function SMSLogin() {
  const [state, action] = useActionState(smsLogin, initialState);
  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      {/* welcome */}
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">Welcome!</h1>
        <h2 className="text-xl">Verify your phone number!</h2>
      </div>
      {/* form */}
      <form action={action} className="flex flex-col gap-3">
        <FormInput
          name="phone"
          type="text"
          placeholder="Phone number"
          required
          defaultValue={state.phoneNumber || ""}
        />
        
        {state.token ? <FormInput
          name="token"
          type="number"
          placeholder="Verification code"
          required
          min={100000}
          max={999999}
        />: null}
        <FormButton text="Verify" type="submit"/> 
      </form>
    </div>
  );
}
