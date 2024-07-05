import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import SideMenu from "./SideMenu";
import { signOutSuccess } from "../redux/user/userSlice";
import { RiParentFill } from "react-icons/ri";

function Navbar() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
        navigate("/studentsignin");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

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
      <div className="hidden lg:flex gap-10 items-center justify-evenly text-lg text-gray-800 h-full">
        <a href="/" className="transition-all duration-200 hover:scale-105">
          Home
        </a>
        {!currentUser && (
          <div className="flex items-center">
            <a href="/to-do" className="block active:underline">
              Wards Detail
            </a>
          </div>
        )}

        {currentUser ? (
          <Link to="/profile" className="flex items-center">
            <div className="flex items-center">
              <span className="tracking-wider uppercase font-semibold">
                {currentUser.name.split(" ")[0]}
              </span>
            </div>
          </Link>
        ) : (
          <Link to="/studentsignin">
            <button className="px-6 py-2 rounded-md border border-gray-800 hover:scale-105 transition-all duration-200">
              Login
            </button>
          </Link>
        )}

        {currentUser && (
          <button
            onClick={handleSignout}
            className="px-6 py-2 rounded-md border border-gray-800 hover:scale-105 transition-all duration-200"
          >
            Logout
          </button>
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
      {open && (
        <div className="backdrop fixed inset-0 bg-black bg-opacity-50 z-40"></div>
      )}
      <SideMenu open={open} />
    </nav>
  );
}

export default Navbar;
