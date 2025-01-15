import React, { useState, useEffect } from "react";
import LeaveRequestForm from "../components/LeaveRequestForm";
import DashBoard from "./DashBoard";
import { useSelector } from "react-redux";
import {
  useFetchLeaveRequestForClassIncharge,
  useFetchLeaveRequestForMentor,
} from "../../hooks/useFetchData";
import { ChevronDown, User, UserRoundPlus } from "lucide-react";
import { ClipboardList, FileBarChart, UserCheck, FileText } from "lucide-react";
import LeaveStatsCard from "../components/LeaveStatsCard";
import LeaveRequests from "../components/LeaveRequests";
import MarkDefaulterandLate from "../components/MarkDefaulter";
import GenerateReport from "../components/PTGenerateReport";
import MenteeList from "../components/MenteeList";
import StaffProfile from "../components/StaffProfile";

const StaffDashBoard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState("Leave Requests");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const mentorRequests = useFetchLeaveRequestForMentor(currentUser.userId);
  const classInchargeRequest = useFetchLeaveRequestForClassIncharge(
    currentUser.userId,
    currentUser.classInchargeSectionId
  );
  const renderComponent = () => {
    if (currentUser.isPEStaff === true) {
      switch (tab) {
        case "Mark Defaulter":
          return <MarkDefaulterandLate />;
        case "Generate Report":
          return <GenerateReport />;
        default:
          return <MarkDefaulterandLate />;
      }
    } else {
      switch (tab) {
        case "Profile":
          return <StaffProfile />;
        case "Leave Requests":
          return (
            <LeaveRequests
              leaveRequestsAsClassIncharge={classInchargeRequest}
              leaveRequestsAsMentor={mentorRequests}
            />
          );
        case "OD Requests":
          return (
            <LeaveRequests
              leaveRequestsAsClassIncharge={classInchargeRequest}
              leaveRequestsAsMentor={mentorRequests}
            />
          );
        case "Defaulter":
          return <MarkDefaulterandLate />;
        case "Leave Reports":
          return (
            <LeaveStatsCard
              leaveRequestsAsClassIncharge={classInchargeRequest}
              leaveRequestsAsMentor={mentorRequests}
            />
          );
        case "Mentee List":
          return <MenteeList />;
        default:
          return <LeaveRequestForm />;
      }
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    {
      id: "Leave Requests",
      icon: <ClipboardList size={18} />,
      label: `Student's Leave Requests`,
    },
    {
      id: "OD Requests",
      icon: <FileText size={18} />,
      label: "Student's OD Requests",
    },
    {
      id: "Defaulter",
      icon: <UserCheck size={18} />,
      label: "Defaulter",
    },
    {
      id: "Leave Reports",
      icon: <FileBarChart size={18} />,
      label: "Reports",
    },
    {
      id: "Mentee List",
      icon: <UserRoundPlus size={18} />,
      label: "Mentee List",
    },
    {
      id: "Profile",
      icon: <User size={18} />,
      label: "Profile",
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
            <span className="font-medium">Dashboard Menu</span>
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
              className={`w-full p-4 flex items-center space-x-3 text-sm ${
                tab === item.id
                  ? "bg-blue-100 text-[#1f3a6e] dark:bg-blue-900/20 dark:text-blue-400 font-medium"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              } transition-all duration-200`}
            >
              <span className="w-5">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {/* Header Card */}
        {/* <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {currentUser.isPEStaff ? "PE Staff Dashboard" : "Staff Dashboard"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage and monitor student activities
          </p>
        </div> */}

        {/* Rendered Component */}
        {renderComponent()}
      </div>
    </div>
  );
};

export default StaffDashBoard;
