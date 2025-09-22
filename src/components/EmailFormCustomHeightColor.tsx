export default function EmailFormAmber() {
  // custom height -> h-[px]
  // custom color -> bg-[#543cb8]
  return (
    <div className="bg-white shadow-lg max-w-screen-sm w-full rounded-3xl p-5 flex flex-col gap-2">
      <div className="group flex flex-col">
        <input
          className="bg-gray-100 w-full"
          placeholder="write your email"
        />
        <span className="group-focus-within:block hidden">
          Make sure it is valid email
        </span>
        <button className=" w-full h-[24.345px] bg-amber-300">Submit</button>
      </div>
    </div>
  );
}