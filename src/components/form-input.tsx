import { InputHTMLAttributes } from "react";

interface FormInputProps {
  errors?: string[];
}

// InputHTMLAttributes<HTMLInputElement> lets you easily define input elements

export default function FormInput({
  name,
  errors = [],
  ...rest
}: FormInputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <input
        name={name}
        {...rest}
        className="bg-transparent rounded-md w-full h-10 outline-none ring-1 focus:ring-2 ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400"
      />
      {errors.map((error, index) => (
        <span className="text-red-500 font-medium" key={index}>
          {error}
        </span>
      ))}
    </div>
  );
}
