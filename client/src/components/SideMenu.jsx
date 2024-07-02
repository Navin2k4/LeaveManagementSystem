import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { CiLogin } from "react-icons/ci";

const SideMenu = ({ open, isLoggedIn }) => (
  <div
    className={`lg:hidden fixed top-0 right-0 bg-gray-800 bg-opacity-30 backdrop-blur-md text-white h-full w-1/2 transition-transform duration-500 transform ${
      open ? "translate-x-0" : "translate-x-full"
    } flex flex-col items-center text-xl p-4 shadow-lg z-50`}
  >
    <div className="mt-10 flex flex-col gap-3 px-3 w-full">
      <div className="flex items-center mb-4">
        <FaHome className="mr-2" />
        <a href="/" className="block active:underline">
          Home
        </a>
      </div>
      <div className="flex items-center mb-4">
        <MdDashboard className="mr-2" />
        <a href="/studentdashboard" className="block">
          Dashboard
        </a>
      </div>
      {isLoggedIn ? (
        <div className="flex items-center mb-4">
          <Link to="/studentdashboard" className="block">
            John Doe
          </Link>
        </div>
      ) : (
        <div className="flex items-center mb-4">
          <CiLogin className="mr-2" />
          <Link to="/login" className="block">
            Login
          </Link>
        </div>
      )}
    </div>
  </div>
);

export default SideMenu;
