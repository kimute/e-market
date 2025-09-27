import FormButton from "@/components/form-button";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";

export default function LogIn() {
  return (
    <div className="flex flex-col gap-10 px-6 py-8">
      {/* welcome */}
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">Welcome!</h1>
        <h2 className="text-xl">Verify your phone number!</h2>
      </div>
      {/* form */}
      <form action="" className="flex flex-col gap-3">
        <FormInput name="number" type="number" placeholder="Phone number" required errors={[]} />
        <FormInput
          name="number"
          type="number"
          placeholder="Verification code"
          required
          errors={[]}
        />
        <FormButton text="Verify" />
      </form>
    </div>
  );
}
