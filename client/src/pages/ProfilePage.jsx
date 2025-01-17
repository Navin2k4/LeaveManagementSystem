import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FcLeave } from "react-icons/fc";
import { TbBrandDaysCounter } from "react-icons/tb";
import { FaCalendarDay } from "react-icons/fa6";

import { Menu, X, ChevronRight } from "lucide-react";
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
import DashboardSidebar from "../components/layout/DashboardSidebar";

const ProfilePage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [mentor, setMentor] = useState({});
  const [classIncharge, setClassIncharge] = useState({});
  const [tab, setTab] = useState("EditProfile");
  const [isOpen, setIsOpen] = useState(true);
  const [pendingWorksCount, setPendingWorksCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
          const pendingWorks = data.pendingWorks.filter((work) => !work.isDone);
          setPendingWorksCount(pendingWorks.length);
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

  const menuItems = [
    {
      id: "EditProfile",
      icon: <FiEdit3 size={18} />,
      label: "Profile",
      submenu: false,
    },
    {
      id: "Your Pending Works",
      icon: <IoDocumentOutline size={18} />,
      label: "Your Pending Work",
      badge: pendingWorksCount > 0 ? pendingWorksCount : null,
      submenu: false,
    },
    {
      id: "leave",
      icon: <FaCalendarDay size={20} />,
      label: "Leave Management",
      submenu: true,
      submenuItems: [
        { id: "LeaveRequestForm", label: "Request Leave" },
        { id: "Your Leave Requests", label: "Your Leave Requests" },
      ],
    },
    {
      id: "od",
      icon: <TbBrandDaysCounter size={20} />,
      label: "OD Management",
      submenu: true,
      submenuItems: [
        { id: "ODRequestForm", label: "Request OD" },
        { id: "Your OD Requests", label: "Your OD Requests" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar
        menuItems={menuItems}
        currentTab={tab}
        onTabChange={setTab}
        userInfo={currentUser}
        title="Profile"
        onSidebarToggle={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        <div className="p-4">
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
    </div>
  );
};

export default ProfilePage;
