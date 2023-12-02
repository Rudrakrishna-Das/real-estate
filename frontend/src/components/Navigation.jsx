import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="bg-blue-200 flex justify-between px-1 sm:px-0 sm:justify-around py-4 w-full items-center">
      <Link to="/">
        <h1 className="font-extrabold text-sm sm:text-4xl">
          <span className="text-blue-500">Real</span>
          <span className="text-blue-700">Estate</span>
        </h1>
      </Link>
      <form className="bg-blue-100 rounded-lg flex justify-between p-3 w-3/6 sm:w-1/3 items-center ">
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent focus:outline-none w-24 sm:w-64"
        />
        <FaSearch className="text-blue-500 cursor-pointer hover:text-blue-800" />
      </form>
      <ul className="flex gap-4 font-extrabold">
        <Link to="/">
          <li className="hidden sm:inline text-blue-700 hover:underline">
            Home
          </li>
        </Link>
        <Link to="/about">
          <li className="hidden sm:inline text-blue-700 hover:underline">
            About
          </li>
        </Link>
        <Link to="/sign-in">
          <li className="text-blue-700 hover:underline">Sign In</li>
        </Link>
      </ul>
    </nav>
  );
};

export default Navigation;
