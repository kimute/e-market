"use client";
import { useFormStatus } from "react-dom";

interface FormButtonProps {
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  text: string;
  type?: "button" | "submit" | "reset";
}

export default function FormButton({
  disabled = false,
  onClick,
  className = "",
  type = "button",
  text,
}: FormButtonProps) {
  const { pending } = useFormStatus();
  // if use useFormStatus , you must change to client component
  // because it is interactive
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={pending}
      className={`primary-btn h-10 flex justify-center items-center gap-2 ${className} ${
        disabled || pending ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {pending && (
        <svg
          className="animate-spin h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {text}
    </button>
  );
}
