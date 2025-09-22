export default function EmailForm() {
  // Apply a `group` class to the parent container.
  // This enables the use of group-based state variants (e.g., `group-focus-within`),
  // allowing child element interactions to control the visibility or styling of sibling elements.

  return (
    <div className="bg-white shadow-lg max-w-screen-sm w-full rounded-3xl p-5 flex flex-col gap-2">
      <div className="group flex flex-col">
        <input className="bg-gray-100 w-full" placeholder="write your email" />
        <span className="group-focus-within:block hidden">
          Make sure it is valid email
        </span>
        <button>Submit</button>
      </div>
    </div>
  );
}
