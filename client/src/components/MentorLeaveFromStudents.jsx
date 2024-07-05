import React, { useEffect, useState } from "react";

export default function MentorLeaveFromStudents({ leaveRequestsAsMentor }) {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  const approveRequest = (id) => {
    // Implement approval logic if needed
  };

  const rejectRequest = (id) => {
    // Implement rejection logic if needed
  };
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Student Name</th>
            <th className="border px-4 py-2">Section</th>
            <th className="border px-4 py-2">Reason</th>
            <th className="border px-4 py-2">Start Date</th>
            <th className="border px-4 py-2">End Date</th>
            <th className="border px-4 py-2">Duration</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequestsAsMentor.map((req) => {
            
            const { status } = req.approvals.mentor;

            return(
              <tr key={req._id} className="text-center">
                <td className="border px-4 py-2">{req.name}</td>
                <td className="border px-4 py-2">{req.sectionName}</td>
                <td className="border px-4 py-2">{req.reason}</td>
                <td className="border px-4 py-2">{formatDate(req.fromDate)}</td>
                <td className="border px-4 py-2">{formatDate(req.toDate)}</td>
                <td className="border px-4 py-2">{req.noOfDays} days</td>
                <td className="border px-4 py-2">{req.status}</td>
                <td className="border py-2">

                  {status === "pending" ? (
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => approveRequest(req._id)}
                        className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 min-w-[90px] rounded-lg transition-all duration-300"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectRequest(req._id)}
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 min-w-[90px] rounded-lg transition-all duration-300"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <button className="bg-linkedin-blue hover:bg-[#1c559b] text-white py-1 px-3 min-w-[90px] rounded-lg transition-all duration-300">
                        Taken
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
