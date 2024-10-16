import { Button, Select, Modal } from "flowbite-react";
import React, { useState } from "react";
import { CgTrash } from "react-icons/cg";
import { useSelector } from "react-redux";
import "./LeaveStatus.scss";
import StatusDot from "./StatusDot";
import { BeatLoader, SyncLoader } from "react-spinners";

const LeaveStatus = ({ leaveRequests }) => {
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("pending");
  const [openModal, setOpenModal] = useState(false);
  const [deletingLeave, setdeletingLeave] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  if (!Array.isArray(leaveRequests)) {
    return (
      <div className="flex items-center justify-center">
        <h1 className="text-center">No leave requests found.</h1>
      </div>
    );
  }

  const filteredRequests = leaveRequests.filter((request) => {
    const toDate = new Date(request.toDate);
    const today = new Date();
    switch (filter) {
      case "past7days":
        return toDate >= new Date(today.setDate(today.getDate() - 7));
      case "past1month":
        return toDate >= new Date(today.setMonth(today.getMonth() - 1));
      default:
        return true;
    }
  });

  const pendingRequests = filteredRequests.filter(
    (request) =>
      (request.approvals.mentor.status === "pending" ||
        request.approvals.classIncharge.status === "pending" ||
        request.approvals.hod.status === "pending") &&
      request.approvals.mentor.status !== "rejected" &&
      request.approvals.classIncharge.status !== "rejected" &&
      request.approvals.hod.status !== "rejected"
  );

  const approvedRequests = filteredRequests.filter(
    (request) =>
      request.approvals.mentor.status === "rejected" ||
      request.approvals.classIncharge.status === "rejected" ||
      request.approvals.hod.status === "rejected" ||
      (request.approvals.mentor.status === "approved" &&
        request.approvals.classIncharge.status === "approved" &&
        request.approvals.hod.status === "approved")
  );

  const getStartOfWeek = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(start.setDate(diff));
  };

  const getStartOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1);

  const getStartOfSemester = (date) => {
    const month = date.getMonth();
    const semesterStartMonth = month < 6 ? 0 : 6;
    return new Date(date.getFullYear(), semesterStartMonth, 1);
  };

  const getStartOfYear = (date) => new Date(date.getFullYear(), 0, 1);

  const getTotalApprovedDays = (requests, startDateFunction) => {
    const now = new Date();
    return requests
      .filter((request) => new Date(request.toDate) >= startDateFunction(now))
      .reduce((total, request) => total + request.noOfDays, 0);
  };

  const allotedLeave = filteredRequests.filter(
    (request) => request.status === "approved"
  );

  const totalApprovedDaysThisWeek = getTotalApprovedDays(
    allotedLeave,
    getStartOfWeek
  );
  const totalApprovedDaysThisMonth = getTotalApprovedDays(
    allotedLeave,
    getStartOfMonth
  );
  const totalApprovedDaysThisSemester = getTotalApprovedDays(
    allotedLeave,
    getStartOfSemester
  );
  const totalApprovedDaysThisYear = getTotalApprovedDays(
    allotedLeave,
    getStartOfYear
  );

  const handleDeleteLeave = async (id) => {
    setdeletingLeave(true);
    try {
      const response = await fetch(`/api/deleteleave/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        console.log("Leave request deleted successfully");
        window.location.reload(); 
      } else {
        console.log("Failed to delete leave request");
      }
    } catch (error) {
      console.log("Error deleting leave request:", error);
    } finally {
      setdeletingLeave(false);
    }
  };
  

  return (
    <>
      <div
        className="flex flex-col items-start justify-start bg-[#244784]
 text-white p-8 m-4 rounded-2xl "
      >
        <div className="flex flex-row items-center">
          <h1 className="text-3xl font-semibold mb-6">Leave Summary </h1>
          <h1 className="mb-4 mx-4">
            Max Per month : 3<span className="text-red-200">*</span>
          </h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          <div className="bg-ternary-blue p-6 rounded-lg shadow-md shadow-slate-700">
            <h2 className="text-black text-xl font-medium mb-1">This Week</h2>
            <p className="text-3xl text-dark-blue font-semibold">
              {totalApprovedDaysThisWeek}
            </p>
          </div>
          <div className="bg-ternary-blue p-6 rounded-lg shadow-md shadow-slate-700">
            <h2 className="text-black text-xl font-medium mb-1">This Month</h2>
            <p
              className={`text-3xl font-semibold ${
                totalApprovedDaysThisMonth > 3
                  ? "text-red-500"
                  : "text-dark-blue"
              }`}
            >
              {totalApprovedDaysThisMonth}
            </p>
          </div>
          <div className="bg-ternary-blue p-6 rounded-lg shadow-md shadow-slate-700">
            <h2 className="text-black text-xl font-medium mb-1">
              This Semester
            </h2>
            <p className="text-3xl text-dark-blue font-semibold">
              {totalApprovedDaysThisSemester}
            </p>
          </div>
          <div className="bg-ternary-blue p-6 rounded-lg shadow-md shadow-slate-700">
            <h2 className="text-black text-xl font-medium mb-1">This Year</h2>
            <p className="text-3xl text-dark-blue font-semibold">
              {totalApprovedDaysThisYear}
            </p>
          </div>
        </div>
      </div>

      <div className="leave-status p-5">
        <div className="flex gap-2">
          <button
            className={`${
              view === "pending" ? "active bg-green-500 " : "bg-[#244784]"
            } transition-all duration-500 p-3 rounded-lg`}
            onClick={() => setView("pending")}
          >
            <h2 className="text-white">Pending Requests</h2>
          </button>

          <button
            className={` ${
              view === "approved" ? "active bg-green-500 " : "bg-[#244784]"
            } transition-all duration-500 p-3 rounded-lg`}
            onClick={() => setView("approved")}
          >
            <h2 className="text-white">Approved / Rejected Requests</h2>
          </button>
        </div>

        <div className={`container ${view === "pending" ? "active" : ""} `}>
          <div className="filter-dropdown justify-between flex gap-3 items-center mb-6">
            <label>Filter by:</label>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="ring-0 focus:ring"
            >
              <option value="all">All</option>
              <option value="past7days">Past 7 Days</option>
              <option value="past1month">Past 1 Month</option>
            </Select>
          </div>

          {pendingRequests.length > 0 ? (
            pendingRequests.map((request) => (
              <div key={request._id} className="leave-status-item">
                <div className="grid grid-cols-2 gap-2">
                  <p className="p-3  border rounded-xl text-black font-bold">
                    Leave From: <br />{" "}
                    <span className="font-medium text-black">
                      {new Date(request.fromDate).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="p-3  border rounded-xl text-black font-bold">
                    Leave To: <br />{" "}
                    <span className="font-medium text-black">
                      {new Date(request.toDate).toLocaleDateString()}
                    </span>
                  </p>

                  <p className="p-3  border rounded-xl text-black font-bold">
                    Apply Date: <br />{" "}
                    <span className="font-medium text-black">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="p-3  border rounded-xl text-black font-bold">
                    No. of Days: <br />{" "}
                    <span className="font-medium text-black">
                      {request.noOfDays}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2 my-2 mt-6">
                  <div className="font-bold text-black">Status :</div>
                  {currentUser.userType === "Staff" ? (
                    <div className="status-dots">
                      <StatusDot
                        status={request.approvals.hod.status}
                        role="hod"
                        showLine={false}
                      />
                    </div>
                  ) : (
                    <div className="status-dots">
                      <StatusDot
                        status={request.approvals.mentor.status}
                        role="mentor"
                        showLine={true}
                      />
                      <StatusDot
                        status={request.approvals.classIncharge.status}
                        role="classIncharge"
                        showLine={true}
                      />
                      <StatusDot
                        status={request.approvals.hod.status}
                        role="hod"
                        showLine={false}
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="pending-status">Pending</div>{" "}
                  <button
                    onClick={() => setOpenModal(true)}
                    className="p-2 mt-2 hover:bg-red-600 transition-colors duration-300 bg-red-400 rounded-full text-white"
                  >
                    <CgTrash />
                  </button>
                  <Modal show={openModal} onClose={() => setOpenModal(false)}>
                    <Modal.Header>Delete Leave Request</Modal.Header>
                    <Modal.Body>
                      <div className="">
                        <h2>Sure to delete submitted leave ?</h2>
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <button
                        className=" p-2 rounded-lg hover:bg-red-800 transition-colors duration-300 bg-red-600"
                        onClick={() => handleDeleteLeave(request._id)}
                      >
                        <h1 className="text-white ">
                          {deletingLeave ? <BeatLoader color="white" size={5} /> : "Yes Delete"}
                        </h1>
                      </button>
                      <button
                        className=" p-2 rounded-lg hover:underline transition-all duration-300"
                        color="gray"
                        onClick={() => setOpenModal(false)}
                      >
                        Cancel
                      </button>
                    </Modal.Footer>
                  </Modal>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center">
              <h1 className="text-center mb-7">No Pending requests found.</h1>
            </div>
          )}
        </div>

        <div className={`container ${view === "approved" ? "active" : ""}`}>
          <div className="filter-dropdown justify-between flex gap-3 items-center mb-6">
            <label>Filter by:</label>
            <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="past7days">Past 7 Days</option>
              <option value="past1month">Past 1 Month</option>
            </Select>
          </div>

          {approvedRequests.length > 0 ? (
            approvedRequests.map((request) => (
              <div key={request._id} className="leave-status-item max-w-xl">
                <div className="grid grid-cols-2 ">
                  <p className="p-3  border rounded-xl text-black font-bold">
                    Leave From: <br />{" "}
                    <span>
                      {new Date(request.fromDate).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="p-3  border rounded-xl text-black font-bold">
                    Leave To: <br />{" "}
                    <span>{new Date(request.toDate).toLocaleDateString()}</span>
                  </p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="p-3  border rounded-xl text-black font-bold">
                    Apply Date: <br />{" "}
                    <span>
                      {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="p-3  border rounded-xl text-black font-bold">
                    No. of Days: <br /> <span>{request.noOfDays}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 my-2 mt-6">
                  <div className="font-bold">Status :</div>

                  <div className="status-dots">
                    {currentUser.userType === "Staff" ? (
                      <div className="status-dots">
                        <StatusDot
                          status={request.approvals.hod.status}
                          role="hod"
                          showLine={false}
                        />
                      </div>
                    ) : (
                      <div className="status-dots">
                        <StatusDot
                          status={request.approvals.mentor.status}
                          role="mentor"
                          showLine={true}
                          comment={request.mentorcomment}
                        />
                        <StatusDot
                          status={request.approvals.classIncharge.status}
                          role="classIncharge"
                          showLine={true}
                          comment={request.classIncharge}
                        />
                        <StatusDot
                          status={request.approvals.hod.status}
                          role="hod"
                          showLine={false}
                          comment={request.hodComment}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    {request.approvals.mentor.status === "rejected" ||
                    request.approvals.classIncharge.status === "rejected" ||
                    request.approvals.hod.status === "rejected" ? (
                      <div className="rejected-status">Rejected</div>
                    ) : (
                      <div className="accepted-status">Approved</div>
                    )}
                  </div>
                  <div className="bg-gray-100 px-3 py-3 rounded-2xl">
                    {request.mentorcomment !== "No Comments" && (
                      <div className="comments">
                        <p className="font-bold">Mentor Comment</p>
                        <p>{request.mentorcomment}</p>
                      </div>
                    )}
                    {request.classInchargeComment !== "No Comments" && (
                      <div className="comments">
                        <p className="font-bold">ClassIncharge Comment</p>
                        <p>{request.classInchargeComment}</p>
                      </div>
                    )}
                    {request.hodComment !== "No Comments" && (
                      <div className="comments">
                        <p className="font-bold">Hod Comment</p>
                        <p>{request.hodComment}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center">
              <h1 className="text-center mb-3">No Approved requests found.</h1>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LeaveStatus;
