export default function SearchForm() {
  // reapted -> outline none
// change position from input, button  to div like this *:outline-none
// has-[:]<- not tailwind , it is sudo class css. check child exist then do something
  return (
    <div className="bg-white max-w-screen-sm w-full rounded-3xl p-5 flex flex-col gap-2 md:flex-row *:outline-none has-[:invalid]:ring-red-500 has-[:invalid]:ring">
      <input
        className="w-full bg-gray-200 h-12 pl-5 rounded-full ring focus:ring-green-500 transition-shado placeholder:drop-shadow-2xl invalid:focus:ring-red-500 peer"
        type="email"
        placeholder="Search here..."
      />
      <span className="text-red-500 hidden peer-invalid:block">
        Email is required
      </span>
      <button className="bg-black/80 rounded-full active:scale-90 transition-transform font-medium text-white py-2 md:px-10 peer-invalid:bg-red-500">
        Search
      </button>
    </div>
  );
}