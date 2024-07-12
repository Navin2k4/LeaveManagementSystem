import React, { useState } from "react";
import "./LeaveStatus.scss";
import StatusDot from "./StatusDot";
import { Button, Select } from "flowbite-react";
import { useSelector } from "react-redux";

const LeaveStatus = ({ leaveRequests }) => {
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("pending");

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

  return (
    <div className="leave-status p-5">
      <div className="button-group">
        <button
          className={`${
            view === "pending" ? "active " : ""
          }bg-gradient-to-r from-primary-blue via-secondary-blue/85 to-primary-blue hover:bg-primary-blue`}
          onClick={() => setView("pending")}
        >
          <h2 className="text-white">Pending Requests</h2>
        </button>

        <button
          className={` ring-1 ring-primary-blue bg-gradient-to-r from-primary-blue  via-secondary-blue/85 to-primary-blue  hover:bg-primary-blue  ${
            view === "approved" ? "active" : ""
          }`}
          onClick={() => setView("approved")}
        >
          <h2 className="text-white">Approved / Rejected Requests</h2>
        </button>
      </div>

      <div className={`container ${view === "pending" ? "active" : ""} `}>
        <div className="filter-dropdown justify-between flex gap-3 items-center mb-6">
          <label>Filter by:</label>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="past7days">Past 7 Days</option>
            <option value="past1month">Past 1 Month</option>
          </Select>
        </div>

        {pendingRequests.length > 0 ? (
          pendingRequests.map((request) => (
            <div key={request._id} className="leave-status-item">
              <div className="grid grid-cols-2">
                <p className="p-3 border">
                  Leave From: <br />{" "}
                  <span>{new Date(request.fromDate).toLocaleDateString()}</span>
                </p>
                <p className="p-3 border">
                  Leave To: <br />{" "}
                  <span>{new Date(request.toDate).toLocaleDateString()}</span>
                </p>
              </div>
              <div className="grid grid-cols-2">
                <p className="p-3 border">
                  Apply Date: <br />{" "}
                  <span>
                    {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                </p>
                <p className="p-3 border">
                  No. of Days: <br /> <span>{request.noOfDays}</span>
                </p>
              </div>
              <div className="flex items-center gap-2 my-2 mt-6">
                <div className="font-bold">Status :</div>
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
                ) }
              </div>
              <div className="pending-status">Pending</div>
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
              <div className="grid grid-cols-2">
                <p className="p-3 border">
                  Leave From: <br />{" "}
                  <span>{new Date(request.fromDate).toLocaleDateString()}</span>
                </p>
                <p className="p-3 border">
                  Leave To: <br />{" "}
                  <span>{new Date(request.toDate).toLocaleDateString()}</span>
                </p>
              </div>
              <div className="grid grid-cols-2">
                <p className="p-3 border">
                  Apply Date: <br />{" "}
                  <span>
                    {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                </p>
                <p className="p-3 border">
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
                ) }
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
                <div>

                Comments : {request.comment}
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
  );
};

export default LeaveStatus;
