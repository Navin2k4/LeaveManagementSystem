import React, { useEffect, useState } from "react";
import { FaCalendarDay } from "react-icons/fa6";
import { TbBrandDaysCounter } from "react-icons/tb";
import { useSelector } from "react-redux";

import { FiEdit3 } from "react-icons/fi";
import { IoDocumentOutline } from "react-icons/io5";
import DashboardSidebar from "../components/layout/DashboardSidebar";
import PendingWorks from "../components/systems/defaulter/PendingWorks";
import LeaveRequestForm from "../components/systems/leave/LeaveRequestForm";
import ODRequestForm from "../components/systems/od/ODRequestForm";
import EditProfile from "../components/user/EditProfile";
import DashBoard from "./DashBoard";
import ODDashBoard from "./ODDashBoard";
import Academics from "../components/systems/studentacademics/Academics";
import { FaChalkboardTeacher, FaCheckCircle } from "react-icons/fa";
import BonafiedRequestForm from "../components/systems/bonafieds/BonafiedRequestForm";

const ProfilePage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [mentor, setMentor] = useState({});
  const [classIncharge, setClassIncharge] = useState({});
  const [tab, setTab] = useState("EditProfile");
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
        return (
          <EditProfile
            setTab={setTab}
            mentor={mentor}
            classIncharge={classIncharge}
          />
        );
      case "Bonafied":
        return <BonafiedRequestForm setTab={setTab} />;
      case "Your Leave Requests":
        return <DashBoard setTab={setTab} />;
      case "Your OD Requests":
        return <ODDashBoard setTab={setTab} />;
      case "Academics":
        return <Academics setTab={setTab} student={currentUser} />;
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
      id: "Academics",
      icon: <FaChalkboardTeacher size={20} />,
      label: "Academics",
      submenu: false,
    },
    {
      id: "Bonafied",
      icon: <FaCheckCircle size={18} />,
      label: "Bonafied Application",
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
        <div className="p-4">{renderComponent()}</div>
      </div>
    </div>
  );
};

export default ProfilePage;
