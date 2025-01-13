import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import EditProfile from "../components/EditProfile";
import LeaveRequestForm from "../components/LeaveRequestForm";
import ODRequestForm from "../components/ODRequestForm";
import DashBoard from "./DashBoard";
import { CiCirclePlus } from "react-icons/ci";
import { FiEdit3 } from "react-icons/fi";
import { IoDocumentOutline } from "react-icons/io5";
import { FaChalkboardTeacher } from "react-icons/fa";
import { MdSupervisorAccount } from "react-icons/md";

const ProfilePage = () => {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);
  const [mentor, setMentor] = useState({});
  const [classIncharge, setClassIncharge] = useState({});
  
  useEffect(() => {
    const fetchData = async () => {
      const mentorRes = await fetch(`/api/fetch/mentor/${currentUser.mentorId}`).then(
        (res) => res.json()
      );
      const classInchargeRes = await fetch(`/api/fetch/class-incharge/${currentUser.sectionId}`).then(
        (res) => res.json()
      );
      setMentor(mentorRes);
      setClassIncharge(classInchargeRes);
    };
    fetchData();
  }, [currentUser]);

  const [tab, setTab] = useState("EditProfile");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  const renderComponent = () => {
    switch (tab) {
      case "LeaveRequestForm":
        return <LeaveRequestForm setTab={setTab} mentor={mentor} classIncharge={classIncharge} />;
      case "ODRequestForm":
        return <ODRequestForm setTab={setTab} mentor={mentor} classIncharge={classIncharge} />;
      case "EditProfile":
        return <EditProfile setTab={setTab} />;
      case "Your Leave Requests":
        return <DashBoard setTab={setTab} />;
      default:
        return <LeaveRequestForm setTab={setTab} />;
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
    <div className="flex flex-col md:flex-row h-screen ">
      <div className="md:w-[20%] bg-[#1f3a6e] text-white lg:sticky top-0 md:h-screen overflow-y-auto ">
        <div className="p-4 flex items-center justify-between">
          {isMobileView && (
            <div
              className={`bg-white/80 p-2 rounded-full ${
                isMobileView ? "cursor-pointer" : ""
              } ${
                isProfileMenuOpen
                  ? "rotate-180 transition-all duration-500"
                  : "rotate-0 transition-all duration-500"
              } `}
              onClick={isMobileView ? toggleProfileMenu : null}
            >
              <svg
                stroke="currentColor"
                fill="black"
                strokeWidth="0"
                viewBox="0 0 448 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"></path>
              </svg>
            </div>
          )}
        </div>
        <ul
          className={`space-y-2 transition-all duration-300 overflow-hidden ${
            isMobileView
              ? isProfileMenuOpen
                ? "max-h-96 mb-3"
                : "max-h-0"
              : "max-h-full"
          }`}
        >
          <li
            onClick={() => setTab("EditProfile")}
            className={`cursor-pointer py-2 px-3 mx-2 transition-all duration-300 rounded-md ${
              tab === "EditProfile"
                ? "bg-ternary-blue/80 text-black font-bold"
                : "hover:bg-white/20 text-white font-bold"
            }`}
          >
            <div className="flex items-center gap-3">
              <FiEdit3 size={20} className="ml-1" />
              Edit Profile
            </div>
          </li>
          <li
            onClick={() => setTab("LeaveRequestForm")}
            className={`cursor-pointer py-2 px-3 mx-2 transition-all duration-300 rounded-md ${
              tab === "LeaveRequestForm"
                ? "bg-ternary-blue/80 text-black font-bold"
                : "hover:bg-white/20 text-white font-bold"
            }`}
          >
            <div className="flex items-center gap-3">
              <CiCirclePlus size={25} />
              Request Leave
            </div>
          </li>
          <li
            onClick={() => setTab("ODRequestForm")}
            className={`cursor-pointer py-2 px-3 mx-2 transition-all duration-300 rounded-md ${
              tab === "ODRequestForm"
                ? "bg-ternary-blue/80 text-black font-bold"
                : "hover:bg-white/20 text-white font-bold"
            }`}
          >
            <div className="flex items-center gap-3">
              <CiCirclePlus size={25} />
              Request OD
            </div>
          </li>

          <li
            onClick={() => setTab("Your Leave Requests")}
            className={`cursor-pointer py-2 px-3 mx-2 transition-all duration-300 rounded-md ${
              tab === "Your Leave Requests"
                ? "bg-ternary-blue/80 text-black font-bold"
                : "hover:bg-white/20 text-white font-bold"
            }`}
          >
            <div className="flex items-center gap-3">
              <IoDocumentOutline size={20} className="ml-1" />
              Your Leave Requests
            </div>
          </li>
        </ul>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex gap-4">
          <div className="flex items-center gap-2">
            <FaChalkboardTeacher className="text-2xl text-[#1f3a6e]" />
            <div>
              <p className="text-sm text-gray-500">Class Incharge</p>
              <p className="font-medium">{classIncharge ? classIncharge.staff_name : "Loading..."}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MdSupervisorAccount className="text-2xl text-[#1f3a6e]" />
            <div>
              <p className="text-sm text-gray-500">Mentor</p>
              <p className="font-medium">{mentor ? mentor.staff_name : "Loading..."}</p>
            </div>
          </div>
        </div>
        {renderComponent()}
      </div>
    </div>
  );
};

export default ProfilePage;
