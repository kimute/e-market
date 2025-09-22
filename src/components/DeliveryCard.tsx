export default function DeliveryCard() {
  return (
    <div className="bg-white shadow-lg rounded-2xl w-full p-5 max-w-screen-sm dark:bg-gray-400">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-gray-600 font-semibold -mb-1">In transit</span>
          <span className="text-4xl font-semibold">Coollblue</span>
        </div>
        <div className="bg-orange-400 size-12 rounded-full"/>
      </div>
      <div className="my-2 flex items-center gap-2">
        <span className="bg-green-500 font-medium text-white px-2 py-1 rounded-full">Today</span>
        <span>9:30-10:30</span>
      </div>
      <div className="relative">
        <div className="bg-gray-200 absolute w-full h-2 rounded-full"></div>
        <div className="bg-green-400 absolute w-1/2 h-2 rounded-full"></div>
      </div>
      <div className="mt-5 flex justify-between text-gray-500 dark:text-gray-100">
        <span>Expected</span>
        <span>Sorting Center</span>
        <span>In transit</span>
        <span>Delivered</span>
      </div>
    </div>
  );
}