export default function Home() {
  return (
    <main className="bg-gray-500 h-screen flex items-center justify-center p-5 dark:bg-gray-700">
      <div className="bg-white shadow-lg max-w-screen-sm w-full rounded-3xl p-5 flex flex-col gap-2">
        <div className="group flex flex-col">
          <input
            className="bg-gray-100 w-full"
            placeholder="write your email"
          />
          <span className="group-focus-within:block hidden">
            Make sure it is valid email
          </span>
          <button className="btn">Submit</button>
        </div>
      </div>
    </main>
  );
}
