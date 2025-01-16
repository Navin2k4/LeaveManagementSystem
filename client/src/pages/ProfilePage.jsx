import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import EditProfile from "../components/user/EditProfile";
import LeaveRequestForm from "../components/systems/leave/LeaveRequestForm";
import ODRequestForm from "../components/systems/od/ODRequestForm";
import DashBoard from "./DashBoard";
import ODDashBoard from "./ODDashBoard";
import { CiCirclePlus } from "react-icons/ci";
import { FiEdit3 } from "react-icons/fi";
import { IoDocumentOutline } from "react-icons/io5";
import { FaChalkboardTeacher } from "react-icons/fa";
import { MdSupervisorAccount } from "react-icons/md";
import { ChevronDown } from "lucide-react";
import PendingWorks from "../components/systems/defaulter/PendingWorks";

const ProfilePage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [mentor, setMentor] = useState({});
  const [classIncharge, setClassIncharge] = useState({});
  const [tab, setTab] = useState("EditProfile");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [pendingWorksCount, setPendingWorksCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const mentorRes = await fetch(
        `/api/fetch/mentor/${currentUser.mentorId}`
      ).then((res) => res.json());
      const classInchargeRes = await fetch(
        `/api/fetch/class-incharge/${currentUser.sectionId}`
      ).then((res) => res.json());
      setMentor(mentorRes);
      setClassIncharge(classInchargeRes);
    };
    fetchData();
  }, [currentUser]);

  useEffect(() => {
    const fetchPendingWorksCount = async () => {
      try {
        const response = await fetch(
          `/api/defaulter/pendingworks/${currentUser.id}`
        );
        const data = await response.json();
        if (data.success) {
          setPendingWorksCount(data.pendingWorks.length);
        }
      } catch (error) {
        console.error("Error fetching pending works count:", error);
      }
    };

    fetchPendingWorksCount();
  }, [currentUser.id]);

  const renderComponent = () => {
    switch (tab) {
      case "LeaveRequestForm":
        return (
          <LeaveRequestForm
            setTab={setTab}
            mentor={mentor}
            classIncharge={classIncharge}
          />
        );
      case "Your Pending Works":
        return <PendingWorks />;
      case "ODRequestForm":
        return (
          <ODRequestForm
            setTab={setTab}
            mentor={mentor}
            classIncharge={classIncharge}
          />
        );
      case "EditProfile":
        return <EditProfile setTab={setTab} />;
      case "Your Leave Requests":
        return <DashBoard setTab={setTab} />;
      case "Your OD Requests":
        return <ODDashBoard setTab={setTab} />;
      default:
        return <LeaveRequestForm setTab={setTab} />;
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { id: "EditProfile", icon: <FiEdit3 size={18} />, label: "Edit Profile" },
    {
      id: "Your Pending Works",
      icon: <IoDocumentOutline size={18} />,
      label: "Your Pending Work",
      badge: pendingWorksCount > 0 ? pendingWorksCount : null,
    },
    {
      id: "LeaveRequestForm",
      icon: <CiCirclePlus size={20} />,
      label: "Request Leave",
    },
    {
      id: "Your Leave Requests",
      icon: <IoDocumentOutline size={18} />,
      label: "Your Leave Requests",
    },
    {
      id: "ODRequestForm",
      icon: <CiCirclePlus size={20} />,
      label: "Request OD",
    },
    {
      id: "Your OD Requests",
      icon: <IoDocumentOutline size={18} />,
      label: "Your OD Requests",
    },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="md:w-64 bg-white dark:bg-gray-800 shadow-md md:sticky top-0 md:h-screen">
        {/* Mobile Toggle */}
        {isMobileView && (
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="w-full p-4 flex items-center justify-between text-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <span className="font-medium">Menu</span>
            <ChevronDown
              className={`transition-transform duration-200 ${
                isProfileMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        )}

        {/* Menu Items */}
        <nav
          className={`overflow-hidden transition-all duration-200 ${
            isMobileView
              ? isProfileMenuOpen
                ? "max-h-96"
                : "max-h-0"
              : "max-h-full"
          }`}
        >
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full p-4 flex items-center justify-between text-sm ${
                tab === item.id
                  ? "bg-blue-200 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              } transition-all duration-300`}
            >
              <div className="flex items-center space-x-3">
                <span className="w-5">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="flex items-center justify-center w-6 h-6 text-xs font-medium text-white bg-red-500 rounded-full animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {/* Staff Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                <FaChalkboardTeacher size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Your Class Incharge
                </p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {classIncharge ? classIncharge.staff_name : "Loading..."}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                <MdSupervisorAccount size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Your Mentor
                </p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {mentor ? mentor.staff_name : "Loading..."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rendered Component */}
        {renderComponent()}
      </div>
    </div>
  );
};

export default ProfilePage;
