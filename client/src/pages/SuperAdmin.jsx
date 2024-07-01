import React, { useState } from "react";

const SuperAdmin = () => {
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

  // Sample leave data (for illustration)
  const leaveRequests = [
    {
      id: 1,
      requester: "John Doe",
      type: "Sick Leave",
      startDate: "2024-07-10",
      endDate: "2024-07-12",
      status: "Pending",
    },
    {
      id: 2,
      requester: "Jane Smith",
      type: "Vacation",
      startDate: "2024-08-01",
      endDate: "2024-08-15",
      status: "Approved",
    },
    {
      id: 3,
      requester: "Michael Brown",
      type: "Emergency Leave",
      startDate: "2024-09-05",
      endDate: "2024-09-06",
      status: "Rejected",
    },
  ];

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);

  const handleDepartmentSelect = (department) => {
    setSelectedDepartment(department);
    setSelectedBatch(null);
  };

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch === selectedBatch ? null : batch);
  };

  return (
    <div className="flex h-screen bg-gray-200">
      {/* Sidebar for departments and batches */}
      <div className="w-1/4 bg-gray-800 text-white sticky top-0 h-screen overflow-y-auto">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Departments</h2>
        </div>
        <ul className="space-y-2">
          {departments.map((dept, index) => (
            <li
              key={index}
              onClick={() => handleDepartmentSelect(dept.name)}
              className={`cursor-pointer py-2 px-4 
                ${
                  selectedDepartment === dept.name
                    ? "bg-gray-700 text-white"
                    : "hover:bg-gray-700 hover:text-white"
                }
              `}
            >
              {dept.name}
            </li>
          ))}
        </ul>
        {selectedDepartment && (
          <>
            <div className="p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Batches</h2>
            </div>
            <ul className="space-y-2">
              {departments
                .find((dep) => dep.name === selectedDepartment)
                ?.batches.map((batch, index) => (
                  <li
                    key={index}
                    onClick={() => handleBatchSelect(batch)}
                    className={`cursor-pointer py-2 px-4 
                    ${
                      selectedBatch === batch
                        ? "bg-gray-700 text-white"
                        : "hover:bg-gray-700 hover:text-white"
                    }
                  `}
                  >
                    {batch}
                  </li>
                ))}
            </ul>
          </>
        )}
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        {selectedBatch && (
          <>
            <div className="mb-8">
              <h2 className="text-3xl uppercase tracking-wider text-center font-semibold mb-6">Leave Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white shadow-md p-4 rounded-lg">
                  <div className="mb-2">
                    <span className="font-semibold">Total Requests:</span>{" "}
                    {leaveRequests.length}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Pending:</span>{" "}
                    {
                      leaveRequests.filter((req) => req.status === "Pending")
                        .length
                    }
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Approved:</span>{" "}
                    {
                      leaveRequests.filter((req) => req.status === "Approved")
                        .length
                    }
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Rejected:</span>{" "}
                    {
                      leaveRequests.filter((req) => req.status === "Rejected")
                        .length
                    }
                  </div>
                </div>
                <div className="bg-white shadow-md p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">
                        Policies and Balances
                      </h3>{" "}
                      <p className="text-gray-600">
                        ** Policy change: <br /> Sick leave now requires medical
                        certificate for leaves exceeding 3 days.
                      </p>
                </div>
                <div className="bg-white shadow-md p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Leave Approval Workflow
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                        <svg
                          className="h-5 w-5 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 2a8 8 0 100 16 8 8 0 000-16zM5 10a5 5 0 1110 0 5 5 0 01-10 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="font-semibold">
                        John Doe requested Sick Leave - 2024-07-10 to 2024-07-12
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <svg
                          className="h-5 w-5 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 2a8 8 0 100 16 8 8 0 000-16zM5 10a5 5 0 1110 0 5 5 0 01-10 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="font-semibold">
                        Jane Smith requested Vacation - 2024-08-01 to 2024-08-15
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section details */}
            <div className="bg-slate-200 pb-6">
              <h2 className="text-3xl text-center capitalize tracking-wider mb-6">
                Sections for {selectedDepartment} {selectedBatch}
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {batches[selectedBatch].map((section, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-md p-4 rounded-lg border-l-4 border-gray-800"
                  >
                    <h3 className="text-lg font-semibold mb-2">
                      Section {section}
                    </h3>
                    <div className="mb-4">
                      <span className="font-semibold">Mentors:</span>{" "}
                      {sections[section].mentors.length > 0
                        ? sections[section].mentors.join(", ")
                        : "No mentors assigned"}
                    </div>
                    <div className="mb-4">
                      <span className="font-semibold">Class Incharge:</span>{" "}
                      {sections[section].classIncharge ||
                        "No class incharge assigned"}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div>
                        <span className="font-semibold">Students:</span> 30
                      </div>
                      <div>
                        <span className="font-semibold">Leave Requests:</span> 5
                      </div>
                      <div>
                        <span className="font-semibold">Absentees:</span> 2
                      </div>
                    </div>
                    <div className="mt-4">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {!selectedBatch && (
          <div className="text-gray-600 text-center mt-8">
            Select a batch to view sections and details.
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdmin;

