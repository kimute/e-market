import FormButton from "@/components/form-button";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";

export default function CreateAccount() {
  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      {/* welcome */}
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">Welcome!</h1>
        <h2 className="text-xl">Fill in the form below to join!</h2>
      </div>
      {/* form */}
      <form action="" className="flex flex-col gap-3">
        <FormInput name="text" type="text" placeholder="Username" required errors={[]} />
        <FormInput name="email" type="email" placeholder="Email" required errors={[]} />
        <FormInput
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={[]}
        />
        <FormInput
          name="passeord"
          type="password"
          placeholder="Confirm Password"
          required
          errors={[]}
        />
        <FormButton text="Create Account" />
      </form>
      <div className="w-full h-px bg-neutral-500" />
      <SocialLogin />
    </div>
  );
}
