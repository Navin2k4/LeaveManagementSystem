import React, { useState } from "react";
import LeaveStatsCard from "../components/LeaveStatsCard";

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
              <LeaveStatsCard
                selectedDepartment={selectedDepartment}
                selectedBatch={selectedBatch}
                leaveRequests={leaveRequests}
              />
            )}

            {/* Section details */}
            {selectedBatch && (
              <div className="bg-slate-200 my-4 md:my-8">
                <h2 className="text-3xl text-center capitalize tracking-wider mb-6">
                  Sections for {selectedDepartment} {selectedBatch}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {batches[selectedBatch].map((section, index) => (
                    <div
                      key={index}
                      className="bg-white shadow-md px-6 py-4 rounded-lg border-l-4 border-gray-800"
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
                      <div className="flex items-center justify-between text-md text-gray-800">
                        <div>
                          <span className="font-semibold">Students:</span> 30
                        </div>
                        <div>
                          <span className="font-semibold">Leave Requests:</span>{" "}
                          5
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
            )}

            {/* Placeholder when no batch is selected */}
            {selectedDepartment && !selectedBatch && (
              <div className="mt-8 text-center text-gray-600">
                Select a batch from {selectedDepartment} to view details.
              </div>
            )}
          </>
        )}
        {!selectedDepartment && (
          <LeaveStatsCard
            selectedDepartment={selectedDepartment}
            selectedBatch={selectedBatch}
            leaveRequests={leaveRequests}
          />
        )}
      </div>
    </div>
  );
};

export default SuperAdmin;
