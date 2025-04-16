import { LayoutDashboard, LogIn } from "lucide-react";
import { Link } from "react-router";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[20vh]">
      <div className="mt-4">
        <h2 className="text-center text-4xl font-bold">
          Hi there!! Welcome to <span className="dark:bg-yellow-50 rounded-full dark:text-black px-4 bg-yellow-900 text-white">cloud canvas.</span>
        </h2>
      </div>
      <div className="mt-10 space-y-2">
        <div className="w-48 dark:bg-zinc-300 bg-zinc-900 text-white rounded-full dark:text-black justify-center flex h-8 items-center">
          <Link to={"/signin"} className="font-bold flex items-center">
            Signin <LogIn className="ml-1" size={20}/>
          </Link>
        </div>

        <div className="w-48 dark:bg-zinc-300 bg-zinc-900 text-white rounded-full dark:text-black justify-center flex h-8 items-center">
          <Link to={"/dashboard"} className="font-bold flex items-center">
            Go to dashboard <LayoutDashboard  className="ml-1" size={20}/>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
