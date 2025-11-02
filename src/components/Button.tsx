import { useFormStatus } from "react-dom";

interface ButtonProps {
  text: string;
}

export default function Button({ text }: ButtonProps) {
  // 이건 자식 안에 서만 있어야한다
  // useFormStatus는 부모 컴포넌트에서 사용ㅣ안된다
  const { pending } = useFormStatus();
  return (
    <button className="bg-orange-500 text-white hover:bg-blue-900 rounded-md  h-10 disabled:bg-neutral-400 disabled:cursor-not-allowed">
      {pending ? "loading.." : text}
    </button>
  );
}
