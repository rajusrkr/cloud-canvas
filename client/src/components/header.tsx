import { Link } from "react-router";
import { ThemeToggle } from "./theme-toggle";

export default function Header() {
  return (
    <div className=" bg-gray-100 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl flex justify-between px-4 items-center h-14">
        <div>
          <h2 className="text-3xl font-bold">Cloud Canvas</h2>
        </div>
        <div className="space-x-4">
          <Link
            to={"/signin"}
            className="border p-2 rounded-full bg-orange-200 border-none px-4 hover:bg-amber-600 transition-all dark:bg-gray-500 text-xl font-semibold dark:hover:bg-gray-800"
          >
            Signin
          </Link>
          <Link
            to={"/dashboard"}
            className="border p-2 rounded-full bg-orange-200 border-none px-4 hover:bg-amber-600 transition-all dark:bg-gray-500 text-xl font-semibold dark:hover:bg-gray-800"
          >
            Dashboard
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
