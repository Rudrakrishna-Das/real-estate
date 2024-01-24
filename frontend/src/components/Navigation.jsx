import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const Navigation = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const searchHandler = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromURL = urlParams.get("searchTerm");
    if (searchTermFromURL) {
      setSearchTerm(searchTermFromURL);
    }
  }, [window.location.search]);

  return (
    <nav className="bg-blue-200 flex justify-between px-1 sm:px-0 sm:justify-around py-4 w-full items-center">
      <Link to="/">
        <h1 className="font-extrabold text-sm sm:text-4xl">
          <span className="text-blue-500">Real</span>
          <span className="text-blue-700">Estate</span>
        </h1>
      </Link>
      <form
        onSubmit={searchHandler}
        className="bg-blue-100 rounded-lg flex justify-between p-3 w-3/6 sm:w-1/3 items-center "
      >
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent focus:outline-none w-24 sm:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button>
          <FaSearch className="text-blue-500 cursor-pointer hover:text-blue-800" />
        </button>
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
        <Link to="/profile">
          {currentUser ? (
            <img
              className="rounded-full h-7 w-7 object-cover"
              src={currentUser.avatar}
              alt="profile"
            />
          ) : (
            <li className="text-blue-700 hover:underline">Sign In</li>
          )}
        </Link>
      </ul>
    </nav>
  );
};

export default Navigation;
