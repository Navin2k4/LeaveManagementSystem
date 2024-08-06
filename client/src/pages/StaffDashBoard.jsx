import React, { useState, useEffect } from "react";
import LeaveRequestForm from "../components/LeaveRequestForm";
import DashBoard from "./DashBoard";
import { useSelector } from "react-redux";
import { useFetchLeaveRequestForClassIncharge, useFetchLeaveRequestForMentor } from "../../hooks/useFetchData";
import { FaArrowDown } from "react-icons/fa6";
import LeaveStatsCard from "../components/LeaveStatsCard";
import LeaveRequests from "../components/LeaveRequests";

const StaffDashBoard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState("Leave Requests");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const mentorRequests = useFetchLeaveRequestForMentor(currentUser.userId);
  const classInchargeRequest = useFetchLeaveRequestForClassIncharge(currentUser.userId,currentUser.classInchargeSectionId);

  const renderComponent = () => {
    switch (tab) {
      case "Leave Requests":
        return <LeaveRequests leaveRequestsAsClassIncharge={classInchargeRequest} leaveRequestsAsMentor={mentorRequests} />;
      case "Leave Reports":
        return <LeaveStatsCard leaveRequestsAsMentor={mentorRequests} leaveRequestsAsClassIncharge={classInchargeRequest} />;
      case "Request Leave":
        return <LeaveRequestForm setTab={setTab} />;
      case "Your Leave Requests":
        return <DashBoard />;
      default:
        return <LeaveRequestForm />;
    }
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-trenary-blue">
      <div className="md:w-[20%] p-1 bg-[#1f3a6e] text-white lg:sticky top-0 md:h-screen overflow-y-auto">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-3xl tracking-wider text-white">DashBoard</h2>
          {isMobileView && (
            <div
              className={`bg-ternary-blue/80 p-2 rounded-full ${
                isMobileView ? "cursor-pointer" : ""
              } ${isProfileMenuOpen ? "rotate-180 transition-all duration-500" : "rotate-0 transition-all duration-500"}`}
              onClick={isMobileView ? toggleProfileMenu : null}
            >
<FaArrowDown className="text-black"/>

            </div>
          )}
        </div>
        <ul
          className={`space-y-2 px-1  transition-all duration-300 overflow-hidden ${
            isMobileView ? (isProfileMenuOpen ? "max-h-96  mb-3" : "max-h-0") : "max-h-full"
          }`} 
        >
          <li
            onClick={() => setTab("Leave Requests")}
            className={`cursor-pointer py-2 px-4 transition-all duration-300 rounded-md ${
              tab === "Leave Requests" ? "bg-white/60 text-black font-bold" : "hover:bg-white/20 text-white font-bold"
            }`}
          >
            Student's Leave Requests
          </li>
          <li
            onClick={() => setTab("Leave Reports")}
            className={`cursor-pointer py-2 px-4 transition-all duration-300 rounded-md ${
              tab === "Leave Reports" ? "bg-white/60 text-black font-bold" : "hover:bg-white/20 text-white font-bold"
            }`}
          >
            Reports
          </li>
          <li
            onClick={() => setTab("Request Leave")}
            className={`cursor-pointer py-2 px-4 transition-all duration-300 rounded-md ${
              tab === "Request Leave" ? "bg-white/60 text-black font-bold" : "hover:bg-white/20 text-white font-bold"
            }`}
          >
            Request Leave
          </li>
          <li
            onClick={() => setTab("Your Leave Requests")}
            className={`cursor-pointer py-2 px-4 transition-all duration-300 rounded-md ${
              tab === "Your Leave Requests" ? "bg-white/60 text-black font-bold" : "hover:bg-white/20 text-white font-bold"
            }`}
          >
            Your Leave Requests
          </li>
         
        </ul>
      </div>
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">{renderComponent()}</div>
    </div>
  );
};

export default StaffDashBoard;
