import React, { useState, useEffect } from "react";
import LeaveRequestForm from "../components/systems/leave/LeaveRequestForm";
import DashBoard from "./DashBoard";
import { useSelector } from "react-redux";
import {
  useFetchLeaveRequestForClassIncharge,
  useFetchLeaveRequestForMentor,
  useFetchODRequestForMentor,
  useFetchODRequestForClassIncharge,
} from "../../hooks/useFetchData";
import { ChevronDown, User, UserRoundPlus } from "lucide-react";
import { ClipboardList, FileBarChart, UserCheck, FileText } from "lucide-react";
import LeaveStatsCard from "../components/systems/leave/LeaveStatsCard";
import LeaveRequests from "../components/systems/leave/LeaveRequests";
import MarkDefaulterandLate from "../components/systems/defaulter/MarkDefaulter";
import GenerateReport from "../components/systems/defaulter/PTGenerateReport";
import MenteeList from "../components/systems/MenteeList";
import StaffProfile from "../components/user/StaffProfile";
import ODRequests from "../components/systems/od/ODRequests";
import DashboardSidebar from "../components/layout/DashboardSidebar";

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
  const mentorODRequests = useFetchODRequestForMentor(currentUser.userId);
  const classInchargeODRequests = useFetchODRequestForClassIncharge(
    currentUser.userId,
    currentUser.classInchargeSectionId
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
            <ODRequests
              odRequestsAsClassIncharge={classInchargeODRequests}
              odRequestsAsMentor={mentorODRequests}
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar
        menuItems={menuItems}
        currentTab={tab}
        onTabChange={setTab}
        userInfo={currentUser}
        title={currentUser.isPEStaff ? "PE Staff Dashboard" : "Staff Dashboard"}
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

export default StaffDashBoard;
