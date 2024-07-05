import React, { useEffect, useState } from "react";
import LeaveStatsCard from "../components/LeaveStatsCard";
import LeaveRequestForm from "../components/LeaveRequestForm"
import { useSelector } from "react-redux";
import MentorLeaveFromStudents from "../components/MentorLeaveFromStudents";
import ClassInchargeLeaveFromStudent from "../components/ClassInchargeLeaveFromStudent";
import { useFetchLeaveRequestForClassIncharge, useFetchLeaveRequestForMentor } from "../../hooks/useFetchData";

const StaffDashBoard = () => {

  const { currentUser } = useSelector((state)=>state.user);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  
  const mentorRequests = useFetchLeaveRequestForMentor(currentUser._id);
  const classInchargeRequest = useFetchLeaveRequestForClassIncharge(currentUser._id);




console.log(mentorRequests);

  const handleDepartmentSelect = (department) => {
    setSelectedDepartment(department);
    setSelectedBatch(null); // Reset batch selection when department changes
    setSelectedMenu(null); // Reset selected menu
  };

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch === selectedBatch ? null : batch);
    setSelectedMenu(null); // Reset selected menu
  };

  const handleMenuSelect = (menu) => {
    setSelectedMenu(menu);
  };


  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-200">
      <div className="md:w-[20%] p-1 bg-linkedin-blue text-white lg:sticky top-0 md:h-screen overflow-y-auto">
        <div className="p-4 flex items-center justify-between border-b-2 mb-3">
          <h2 className="text-3xl tracking-wider">Departments</h2>
        </div>
        <ul className="space-y-2 px-1">
          {/* Render departments list or menu items */}
          <li
            onClick={() => handleMenuSelect("Request Leave")}
            className={`cursor-pointer py-2 px-4 transition-all duration-300 rounded-md`}
          >
            Request Leave
          </li>
          <li
            onClick={() => handleMenuSelect("As Mentor")}
            className={`cursor-pointer py-2 px-4 transition-all duration-300 rounded-md`}
          >
            As Mentor
          </li>
          <li
            onClick={() => handleMenuSelect("My Class Incharge")}
            className={`cursor-pointer py-2 px-4 transition-all duration-300 rounded-md`}
          >
            My Class Incharge
          </li>
        </ul>
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Conditionally render content based on selectedMenu */}
        {selectedMenu === "Request Leave" && (
            <LeaveRequestForm />
        )}
        {(selectedMenu === "As Mentor") && (
          <div className="bg-white shadow-md p-4 rounded-lg">
            <h2 className="text-3xl uppercase tracking-wider text-center font-semibold mb-8">
              {selectedMenu === "Leave Requests as Mentor"}
            </h2>
            <MentorLeaveFromStudents leaveRequestsAsMentor={mentorRequests} />
          </div>
        )}
        {(selectedMenu === "My Class Incharge") && (
          <div className="bg-white shadow-md p-4 rounded-lg">
            <h2 className="text-3xl uppercase tracking-wider text-center font-semibold mb-8">
              {selectedMenu === "Leave Requests as Class Incharge"}
            </h2>
            <ClassInchargeLeaveFromStudent leaveRequestsAsMentor={classInchargeRequest} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashBoard;
