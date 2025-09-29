import { HTMLInputTypeAttribute } from "react";

interface InputConfig {
  type: HTMLInputTypeAttribute;
  placeholder: string;
  required?: boolean;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
  errorMessage?: string;
  helperText?: string;
}

interface FormInputProps {
  type: string;
  placeholder: string;
  required: boolean;
  errors?: string[];
  name: string;
}

export default function FormInput({
  type,
  placeholder,
  required,
  errors=[],
  name,
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
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
