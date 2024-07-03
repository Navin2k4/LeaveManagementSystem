import { Link, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { CiLogin } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { useSelector, useDispatch } from "react-redux";
import { signOutSuccess } from "../redux/user/userSlice";
import { RiParentFill } from "react-icons/ri";

import { current } from "@reduxjs/toolkit";

const SideMenu = ({ open }) => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div
      className={`lg:hidden fixed top-0 right-0 bg-gray-800 bg-opacity-30 backdrop-blur-md text-white h-full w-[60%] transition-transform duration-500 transform ${
        open ? "translate-x-0" : "translate-x-full"
      } flex flex-col items-center text-xl p-4 shadow-lg z-50`}
    >
      <div className="mt-10 flex flex-col gap-3 px-3 w-full">
        {currentUser ? (
          <>
            <div className="flex items-center mb-4">
              <h2 className="text-3xl">
                Hello!
                <span className="text-4xl font-semibold">
                  {" "}
                  {currentUser.student.name.split(" ")[0]}
                </span>
              </h2>
            </div>
          </>
        ) : (
          <div className="flex items-center mb-4">
            <CiLogin className="mr-2" />
            <Link to="/signin" className="block">
              Login
            </Link>
          </div>
        )}
        <div className="flex items-center mb-4">
          <FaHome className="mr-2" />
          <a href="/" className="block active:underline">
            Home
          </a>
        </div>
        {!currentUser && (
          <div className="flex items-center mb-4">
            <RiParentFill className="mr-2" />
            <a href="/to-do" className="block active:underline">
              Wards Detail
            </a>
          </div>
        )}
        {currentUser && (
          <>
            <div className="flex items-center mb-4">
              <MdDashboard className="mr-2" />
              <a href="/studentdashboard" className="block">
                Dashboard
              </a>
            </div>
            <div className="flex items-center mb-4">
              <CgProfile className="mr-2" />
              <a href="/profile" className="block">
                Profile
              </a>
            </div>
          </>
        )}
      </div>

      {currentUser && (
        <button
          onClick={handleSignout}
          className="mt-auto px-6 py-2 mb-4 rounded-md border border-gray-800 hover:scale-105 transition-all duration-200"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default SideMenu;
