import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import SideMenu from "./SideMenu";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.classList.contains("backdrop")) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [open]);

  return (
    <nav className="h-24 flex justify-between items-center shadow-md px-4 lg:px-8">
      <div className="flex items-center flex-3">
        <a href="/" className="flex items-center font-bold text-xl gap-2">
          <img
            src="https://upload.wikimedia.org/wikipedia/ta/d/d0/Vcet_logo.jpg"
            alt="VCET Logo"
            className="w-16"
          />
          <span className="hidden md:inline">
            Velammal College of Engineering and Technology
          </span>
        </a>
      </div>
      <div className="hidden lg:flex gap-6 items-center justify-evenly text-lg text-gray-800 h-full">
        <a href="/" className="transition-all duration-200 hover:scale-105">
          Home
        </a>
        <a
          href="/studentdashboard"
          className="transition-all duration-200 hover:scale-105"
        >
          Dashboard
        </a>
        {isLoggedIn ? (
          <Link to="/studentdashboard" className="flex items-center font-bold">
            <div className="flex items-center">
              <img
                src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="User"
                className="w-10 h-10 rounded-full object-cover mr-2"
              />
              <span>John Doe</span>
            </div>
          </Link>
        ) : (
          <Link to="/login">
            <button className="px-6 py-2 rounded-md border border-gray-800 hover:scale-105 transition-all duration-200">
              Login
            </button>
          </Link>
        )}
      </div>
      <div className="lg:hidden">
        <button onClick={() => setOpen((prev) => !prev)} className="p-2">
          <svg
            className="w-9 h-9 cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>
      {open && <div className="backdrop fixed inset-0 bg-black bg-opacity-50 z-40"></div>}
      <SideMenu open={open} isLoggedIn={isLoggedIn} />
    </nav>
  );
}

export default Navbar;
