export default function loading() {
  return (
    <div className="flex flex-col gap-5 animate-pulse p-5">
      {[...Array(10)].map((_, index) => (
        <div key={index} className="*:rounded-md flex gap-5">
          <div className="size-28 bg-neutral-700 " />
          <div className=" flex flex-col gap-2 *:rounded-md">
            <div className="bg-neutral-700 h-4 w-40" />
            <div className="bg-neutral-700 h-4 w-30" />
            <div className="bg-neutral-700 h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
