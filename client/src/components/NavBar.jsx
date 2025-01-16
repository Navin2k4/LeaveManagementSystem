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
        navigate("/signin");
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
    <nav className="bg-slate-100 flex justify-between items-center  p-4 lg:px-8">
      <div className="flex items-center flex-3">
        <a
          href="/"
          className="flex items-center font-bold text-xl text-black  gap-2"
        >
          <img
            src="/vcet.jpeg"
            alt="VCET Logo"
            className="w-12 h-12 rounded-full"
          />
          <span className="hidden md:inline md:text-xl text-black sm:text-sm">
            Velammal College of Engineering and Technology
          </span>
        </a>
      </div>
      <div className="hidden lg:flex gap-10 items-center justify-evenly text-lg text-black h-full">
        <Link to="/" className="transition-all duration-200 hover:scale-105">
          Home
        </Link>
        {!currentUser && 
        <Link
        to="/signin"
        className="transition-all duration-200 text-black hover:scale-105"
        >
          Sign In
        </Link>
        }
        <Link
          to="/wardDetails"
          className="transition-all duration-200 text-black hover:scale-105"
        >
          Wards Detail
        </Link>

        {currentUser ? (
          currentUser.userType === "Staff" ? (
            <Link
              to="/staffdashboard"
              className="flex items-center transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center">
                <span className="tracking-wider uppercase  text-black font-semibold">
                  {currentUser.name.split(" ")[0]}
                </span>
              </div>
            </Link>
          ) : currentUser.userType === "Student" ? (
            <Link
              to="/profile"
              className="flex items-center transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center">
                <span className="tracking-wider uppercase text-black font-semibold">
                  {currentUser.name.split(" ")[0]}
                </span>
              </div>
            </Link>
          ) : (
            <Link
              to="/hoddash"
              className="flex items-center transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center">
                <span className="tracking-wider uppercase text-black font-semibold">
                  {currentUser.name.split(" ")[0]}
                </span>
              </div>
            </Link>
          )
        ) : null}
        {currentUser && (
          <button
            onClick={handleSignout}
            className="px-3 py-1 rounded-md border text-black bg-white border-primary-blue hover:bg-primary-blue hover:text-white transition-all duration-200"
          >
            Logout
          </button>
        )}
      </div>
      <div className="lg:hidden">
        <button onClick={() => setOpen((prev) => !prev)} className="p-2 ">
          <svg
            className="w-9 h-9 cursor-pointer text-black"
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
