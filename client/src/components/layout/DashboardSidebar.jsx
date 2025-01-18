import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Home,
  Users,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOutSuccess } from "../../redux/user/userSlice";

const DashboardSidebar = ({
  menuItems,
  currentTab,
  onTabChange,
  userInfo,
  title = "Dashboard",
  onSidebarToggle,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showText, setShowText] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      setShowText(false);
    } else {
      const timer = setTimeout(() => {
        setShowText(true);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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

  const handleToggle = () => {
    setIsOpen(!isOpen);
    onSidebarToggle?.(!isOpen);
  };

  // Common navigation items that appear at the top of the sidebar
  const commonNavItems = [
    { id: "home", label: "Home", path: "/", icon: <Home size={20} /> },
    {
      id: "wards",
      label: "Wards Detail",
      path: "/wardDetails",
      icon: <Users size={20} />,
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <div
          className={`fixed top-0 left-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 
                     transition-all duration-300 ease-in-out z-40
                     ${isOpen ? "w-64" : "w-20"}`}
        >
          <div className="flex flex-col h-full">
            {/* Top Section */}
            <div className="flex-shrink-0">
              {/* Toggle Button */}
              <button
                onClick={handleToggle}
                className="w-full flex items-center justify-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200"
              >
                {isOpen ? (
                  <ChevronLeft size={20} />
                ) : (
                  <ChevronRight size={20} />
                )}
              </button>

              {/* Logo/Header */}
              <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <Link to="/" className="flex items-center">
                  <img
                    src="/vcet.jpeg"
                    alt="VCET Logo"
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />
                  <span
                    className={`ml-3 font-semibold text-sm text-gray-800 dark:text-white whitespace-nowrap
                             transition-all duration-200 ${
                               isOpen && showText
                                 ? "opacity-100"
                                 : "opacity-0 w-0"
                             }`}
                  >
                    VCET Connect
                  </span>
                </Link>
              </div>

              {/* Common Navigation Links */}
              <nav className="px-2 py-2 border-b border-gray-200 dark:border-gray-700">
                {commonNavItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    className="flex items-center px-5 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <span className="w-5 flex-shrink-0">{item.icon}</span>
                    <span
                      className={`ml-3 text-sm whitespace-nowrap transition-all duration-200 
                               ${
                                 isOpen && showText
                                   ? "opacity-100"
                                   : "opacity-0 w-0"
                               }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Scrollable Menu Section */}
            <div className="flex-1">
              <nav className="px-4 py-4">
                {menuItems.map((item) => (
                  <div key={item.id}>
                    {item.submenu ? (
                      <div className="mb-1">
                        <button
                          className="w-full flex items-center p-3 text-sm text-gray-600 dark:text-gray-300 
                                   hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-md"
                        >
                          <span className="w-5 flex-shrink-0">{item.icon}</span>
                          <span
                            className={`ml-3 whitespace-nowrap transition-all duration-200 
                                     ${
                                       isOpen && showText
                                         ? "opacity-100"
                                         : "opacity-0 w-0"
                                     }`}
                          >
                            {item.label}
                          </span>
                          {isOpen && showText && (
                            <ChevronRight className="w-4 h-4 ml-auto" />
                          )}
                        </button>
                        {isOpen && showText && (
                          <div className="ml-4 space-y-1">
                            {item.submenuItems.map((subItem) => (
                              <button
                                key={subItem.id}
                                onClick={() => {
                                  onTabChange(subItem.id);
                                  setIsMobileMenuOpen(false);
                                }}
                                className={`w-full px-3 py-2 text-sm rounded-md ${
                                  currentTab === subItem.id
                                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20"
                                    : "text-gray-600 dark:text-gray-300"
                                }`}
                              >
                                {subItem.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => onTabChange(item.id)}
                        className="w-full flex items-center p-3 rounded-md text-sm text-gray-600 dark:text-gray-300 
                                 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <span className="w-5 flex-shrink-0">{item.icon}</span>
                        <span
                          className={`ml-3 whitespace-nowrap transition-all duration-200 
                                   ${
                                     isOpen && showText
                                       ? "opacity-100"
                                       : "opacity-0 w-0"
                                   }`}
                        >
                          {item.label}
                        </span>
                        {item.badge && isOpen && showText && (
                          <span className="ml-auto flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-red-500 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Bottom Section */}
            <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700">
              <div className="p-4">
                {isOpen ? (
                  <div
                    className={`transition-all duration-200 ${
                      showText ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="truncate mr-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                          {userInfo?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {userInfo?.email}
                        </p>
                      </div>
                      <button
                        onClick={handleSignout}
                        className="flex-shrink-0 p-2 hover:text-gray-600 transition-all duration-300 bg-red-400 text-white hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-md"
                      >
                        <LogOut size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleSignout}
                    className="w-full flex justify-center p-2  hover:text-gray-600 bg-red-400 text-white transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-md"
                  >
                    <LogOut size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed right-4 top-4 lg:hidden z-40 p-4 bg-blue-300 text-black rounded-full shadow-lg hover:bg-blue-400 hover:text-white transition-colors duration-300"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Slide-out Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed  inset-y-0 right-0  w-[280px] bg-white dark:bg-gray-800 shadow-xl z-50 lg:hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <img
                  src="/vcet.jpeg"
                  alt="VCET Logo"
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-semibold text-sm">VCET Connect</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Info */}
            {userInfo && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <p className="font-medium text-sm">{userInfo.name}</p>
                <p className="text-xs text-gray-500">{userInfo.email}</p>
              </div>
            )}

            {/* Menu */}
            <div className="overflow-y-auto h-[calc(100vh-200px)]">
              <nav className="px-2 py-4">
                {/* Common Navigation Links */}
                {commonNavItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="w-5">{item.icon}</span>
                    <span className="text-sm">{item.label}</span>
                  </Link>
                ))}

                {/* Divider */}
                <div className="my-2 border-t border-gray-200 dark:border-gray-700" />

                {/* Menu Items */}
                {menuItems.map((item) => (
                  <div key={item.id}>
                    {item.submenu ? (
                      <div className="mb-1">
                        <div className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                          {item.label}
                        </div>
                        <div className="ml-4">
                          {item.submenuItems.map((subItem) => (
                            <button
                              key={subItem.id}
                              onClick={() => {
                                onTabChange(subItem.id);
                                setIsMobileMenuOpen(false);
                              }}
                              className={`w-full px-3 py-2 text-sm rounded-md ${
                                currentTab === subItem.id
                                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20"
                                  : "text-gray-600 dark:text-gray-300"
                              }`}
                            >
                              {subItem.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          onTabChange(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md ${
                          currentTab === item.id
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20"
                            : "text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="w-5">{item.icon}</span>
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-red-500 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Logout Button */}
            <div className="absolute bottom-0 bg-red-300 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleSignout}
                className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DashboardSidebar;
