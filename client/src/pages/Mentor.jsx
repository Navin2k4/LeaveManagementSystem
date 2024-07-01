import React, { useState } from "react";

const MentorApproval = () => {
  const departments = [
    { name: "Computer Science", batches: ["2021-2025", "2022-2026"] },
    { name: "Electrical Engineering", batches: ["2019-2023", "2020-2024"] },
  ];

  const batches = {
    "2021-2025": ["A", "B", "C", "D"],
    "2022-2026": ["A", "B"],
    "2019-2023": ["A", "B"],
    "2020-2024": ["A", "B", "C"],
  };

  const sections = {
    A: { mentors: ["John Doe", "Jane Smith"], classIncharge: "Prof. Johnson" },
    B: { mentors: ["Alice Johnson"], classIncharge: "Dr. Brown" },
    C: { mentors: ["Bob Williams"], classIncharge: "Ms. Davis" },
    D: { mentors: ["Emma White"], classIncharge: "Mr. Wilson" },
  };

  const leaveRequests = [
    {
      id: 1,
      requester: "John Doe",
      type: "Sick Leave",
      startDate: "2024-07-10",
      endDate: "2024-07-12",
      status: "Pending",
      department: "Computer Science",
      batch: "2021-2025",
      section: "A",
    },
    {
      id: 2,
      requester: "Jane Smith",
      type: "Vacation",
      startDate: "2024-08-01",
      endDate: "2024-08-15",
      status: "Approved",
      department: "Computer Science",
      batch: "2022-2026",
      section: "A",
    },
    {
      id: 3,
      requester: "Michael Brown",
      type: "Emergency Leave",
      startDate: "2024-09-05",
      endDate: "2024-09-06",
      status: "Rejected",
      department: "Electrical Engineering",
      batch: "2019-2023",
      section: "B",
    },
    {
      id: 4,
      requester: "Alice Johnson",
      type: "Sick Leave",
      startDate: "2024-07-20",
      endDate: "2024-07-25",
      status: "Pending",
      department: "Electrical Engineering",
      batch: "2020-2024",
      section: "A",
    },
    {
      id: 5,
      requester: "Bob Williams",
      type: "Vacation",
      startDate: "2024-08-10",
      endDate: "2024-08-20",
      status: "Pending",
      department: "Computer Science",
      batch: "2021-2025",
      section: "C",
    },
    {
      id: 6,
      requester: "Emma White",
      type: "Emergency Leave",
      startDate: "2024-09-15",
      endDate: "2024-09-16",
      status: "Pending",
      department: "Electrical Engineering",
      batch: "2020-2024",
      section: "D",
    },
  ];

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);

  const handleDepartmentSelect = (department) => {
    setSelectedDepartment(department);
    setSelectedBatch(null); // Reset batch selection when department changes
  };

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch === selectedBatch ? null : batch);
  };

  const approveRequest = (id) => {
    // Update the leaveRequests array with status change
    const updatedRequests = leaveRequests.map((req) =>
      req.id === id ? { ...req, status: "Approved" } : req
    );
    // Update state with the modified leaveRequests array
    // setLeaveRequests(updatedRequests);
  };

  const rejectRequest = (id) => {
    // Update the leaveRequests array with status change
    const updatedRequests = leaveRequests.map((req) =>
      req.id === id ? { ...req, status: "Rejected" } : req
    );
    // Update state with the modified leaveRequests array
    // setLeaveRequests(updatedRequests);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-200">
      {/* Sidebar for departments */}
      <div className="md:w-[20%] p-1 bg-linkedin-blue text-white lg:sticky top-0 md:h-screen overflow-y-auto ">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Departments</h2>
        </div>
        <ul className="space-y-2 px-1">
          {departments.map((dept, index) => (
            <li
              key={index}
              onClick={() => handleDepartmentSelect(dept.name)}
              className={`cursor-pointer py-2 px-4 transition-all duration-300 rounded-md
                ${
                  selectedDepartment === dept.name
                    ? "bg-white/60 text-black font-bold"
                    : "hover:bg-white/20 text-white font-bold"
                }
              `}
            >
              {dept.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Main content area */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        {selectedDepartment && (
          <>
            {/* Batch selection */}
            <div className="bg-linkedin-blue mb-4 md:mb-8 p-4 rounded-lg">
              <h2 className="text-lg text-white font-semibold mb-2">
                Batches for {selectedDepartment}
              </h2>
              <ul className="space-y-2">
                {departments
                  .find((dep) => dep.name === selectedDepartment)
                  ?.batches.map((batch, index) => (
                    <li
                      key={index}
                      onClick={() => handleBatchSelect(batch)}
                      className={`cursor-pointer py-2 px-4 rounded-md transition-all duration-300
                        ${
                          selectedBatch === batch
                            ? "bg-white/60 text-black font-bold"
                            : "hover:bg-white/20 text-white font-bold"
                        }
                      `}
                    >
                      {batch}
                    </li>
                  ))}
              </ul>
            </div>

            {/* Selected Batch Details */}
            {selectedBatch && (
              <div className="bg-white shadow-md p-4 rounded-lg">
                <h2 className="text-3xl uppercase tracking-wider text-center font-semibold mb-8">
                  Leave Requests for {selectedDepartment} {selectedBatch}
                </h2>
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
                      {leaveRequests
                        .filter(
                          (req) =>
                            req.department === selectedDepartment &&
                            req.batch === selectedBatch
                        )
                        .map((req) => (
                          <tr key={req.id} className="text-center">
                            <td className="border px-4 py-2">{req.requester}</td>
                            <td className="border px-4 py-2">{req.section}</td>
                            <td className="border px-4 py-2">{req.type}</td>
                            <td className="border px-4 py-2">{req.startDate}</td>
                            <td className="border px-4 py-2">{req.endDate}</td>
                            <td className="border px-4 py-2">
                              {Math.ceil(
                                (new Date(req.endDate) - new Date(req.startDate)) /
                                  (1000 * 60 * 60 * 24)
                              )}{" "}
                              days
                            </td>
                            <td className="border px-4 py-2">{req.status}</td>
                            <td className="border py-2">
                              {req.status === "Pending" ? (
                                <div className="flex items-center justify-center gap-2 ">
                                  <button
                                    onClick={() => approveRequest(req.id)}
                                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 min-w-[90px] rounded-lg transition-all duration-300"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => rejectRequest(req.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3  min-w-[90px] rounded-lg transition-all duration-300"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <h2 className="bg-linkedin-blue p-1 text-white rounded-full">
                                  Taken
                                </h2>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Placeholder when no batch is selected */}
            {selectedDepartment && !selectedBatch && (
              <div className="mt-8 text-center text-gray-600">
                Select a batch from {selectedDepartment} to view details.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MentorApproval;
