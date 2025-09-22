export default function PersonListWithEmpty() {
  // show skeleton when empty data exists
  return (
    <div className="bg-white shadow-lg max-w-screen-sm w-full rounded-3xl p-5 flex flex-col gap-2">
      {["kim", "haru", "rin","you",""].map((person, index) => (
        <div key={index} className="flex items-center gap-5">
          <div className="bg-blue-600 rounded-full size-10" />
          <span className="text-lg font-medium empty:w-24 empty:h-5 empty:rounded-full empty:animate-pulse empty:bg-gray-300">{person}</span>
          <div className="size-6 bg-red-500 text-white flex items-center justify-center rounded-full animate-bounce">
            <span>{index}</span>
          </div>
        </div>
      ))}
    </div>
  );
}