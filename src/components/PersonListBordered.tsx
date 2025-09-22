export default function PersonListBordered() {
  // first, last example : border
  return (
    <div className="bg-white shadow-lg max-w-screen-sm w-full rounded-3xl p-5 flex flex-col gap-2">
      {["kim", "haru", "rin","you"].map((person, index) => (
        <div key={index} className="flex items-center gap-5 border-b-2 pb-5 last:border-0">
          <div className="bg-blue-600 rounded-full size-10" />
          <span className="text-lg font-medium">{person}</span>
          <div className="size-6 bg-red-500 text-white flex items-center justify-center rounded-full animate-bounce">
            <span>{index}</span>
          </div>
        </div>
      ))}
    </div>
  );
}