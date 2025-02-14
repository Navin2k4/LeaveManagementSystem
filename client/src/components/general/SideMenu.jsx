import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOutSuccess } from "../../redux/user/userSlice";
import { motion } from "framer-motion";
import { Home, User, LogOut, BookOpen, X, LayoutDashboard } from "lucide-react";

const SideMenu = ({ open, setOpen }) => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/auth/signout", {
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

  const isActive = (path) => location.pathname === path;

  const MenuItem = ({ to, icon: Icon, label }) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive(to)
          ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
          : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
      }`}
      onClick={() => setOpen(false)}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </Link>
  );

  const menuVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <motion.div
      initial="closed"
      animate={open ? "open" : "closed"}
      variants={menuVariants}
      className="lg:hidden fixed top-0 right-0 w-[280px] h-full bg-white dark:bg-gray-900 shadow-xl z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <div className="flex items-center gap-3">
          <img
            src="/vcet.jpeg"
            alt="VCET Logo"
            className="w-8 h-8 rounded-full"
          />
          <span className="font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-[#1f3a6e]">
            VCET Connect
          </span>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <X size={20} />
        </button>
      </div>

      {/* User Info */}
      {currentUser && (
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <User size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                {currentUser.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {currentUser.userType}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="p-4 space-y-2">
        <MenuItem to="/" icon={Home} label="Home" />
        <MenuItem to="/wardDetails" icon={BookOpen} label="Wards Detail" />

        {currentUser ? (
          <>
            <MenuItem
              to={
                currentUser.isHod
                  ? "/hoddash"
                  : currentUser.userType === "Staff"
                  ? "/staffdashboard"
                  : currentUser.userType === "Student"
                  ? "/profile"
                  : "/hoddash"
              }
              icon={LayoutDashboard}
              label={
                currentUser.userType === "Staff"
                  ? "Staff Dashboard"
                  : currentUser.userType === "Student"
                  ? "Student Dashboard"
                  : "HOD Dashboard"
              }
            />
          </>
        ) : (
          <MenuItem to="/signin" icon={User} label="Sign In" />
        )}
      </div>

      {/* Footer */}
      {currentUser && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t dark:border-gray-700">
          <button
            onClick={handleSignout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default SideMenu;
