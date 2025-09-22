export default function Skeleton() {
  return (
    <div className="bg-white shadow-lg max-w-screen-sm w-full rounded-3xl p-5 flex flex-col gap-2 *:animate-pulse">
      {["kim", "haru", "rin","you"].map((_, index) => (
        <div key={index} className="flex items-center gap-5">
          <div className="bg-blue-600 rounded-full size-10" />
          <div className="w-40 h-4 rounded-full bg-gray-400"/>
          <div className="w-10 h-4 rounded-full bg-gray-400"/>
        </div>
      ))}
    </div>
  );
}