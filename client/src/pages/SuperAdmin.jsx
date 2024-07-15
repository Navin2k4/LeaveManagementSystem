import React, { useState, useEffect } from "react";
import LeaveStatsCard from "../components/LeaveStatsCard";
import { useFetchDepartments } from "../../hooks/useFetchData";

const SuperAdmin = () => {
  const departments = useFetchDepartments();
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [classDetails, setClassDetails] = useState({
    mentors: [],
    classIncharges: [],
  });
  const [newMentorName, setNewMentorName] = useState("");
  const [newSection, setNewSection] = useState("");
  const [newDepartment, setNewDepartment] = useState("");
  const [sectionAlertMessage, setSectionAlertMessage] = useState("");
  const [departmentAlertMessage, setDepartmentAlertMessage] = useState("");
  const [MentorAlertMessage, setMentorAlertMessage] = useState("");
  const [classInchargeMessage, setClassInchargeMessage] = useState("");
  const [newBatchName, setNewBatchName] = useState("");
  const [batchAlertMessage, setBatchAlertMessage] = useState("");

  useEffect(() => {
    if (selectedDepartment) {
      fetchBatches(selectedDepartment._id);
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (selectedBatch) {
      fetchSections(selectedBatch._id);
    }
  }, [selectedBatch]);

  useEffect(() => {
    if (selectedSection) {
      fetchClassDetails(selectedSection._id);
    }
  }, [selectedSection]);

  useEffect(() => {
    if (sectionAlertMessage) {
      const timer = setTimeout(() => {
        setSectionAlertMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [sectionAlertMessage]);

  useEffect(() => {
    if (departmentAlertMessage) {
      const timer = setTimeout(() => {
        setDepartmentAlertMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [departmentAlertMessage]);

  useEffect(() => {
    if (MentorAlertMessage) {
      const timer = setTimeout(() => {
        setMentorAlertMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [MentorAlertMessage]);

  const handleDepartmentSelect = (department) => {
    setSelectedDepartment(department);
    setSelectedBatch(null);
    setSelectedSection(null); // Reset section selection
  };

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch === selectedBatch ? null : batch);
    setSelectedSection(null); // Reset section selection
  };

  const handleSectionSelect = (section) => {
    setSelectedSection(section === selectedSection ? null : section);
  };

  const handleAddSection = async () => {
    try {
      const response = await fetch(`/api/addSection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          batchId: selectedBatch._id,
          section_name: newSection,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add Section");
      }
      setSectionAlertMessage("added successfully");
      setNewSection("");
    } catch (error) {
      console.error("Error adding section:", error.message);
      setSectionAlertMessage("failed to Add!");
    }
  };

  const handleAddDepartment = async () => {
    try {
      const response = await fetch(`/api/departments/addDepartment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dept_name: newDepartment }),
      });
      setDepartmentAlertMessage(`Added Successfullly`);
      setNewDepartment("");
    } catch (error) {
      console.error("Error adding department:", error.message);
      setDepartmentAlertMessage("failed to Add!");
    }
  };

  const handleAddBatch = async () => {
    try {
      const response = await fetch(`/api/batches/addBatch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dept_id: selectedDepartment._id,
          batch_name: newBatchName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add Batch");
      }
      setBatchAlertMessage("Batch added successfully");
      setNewBatchName("");
    } catch (error) {
      console.error("Error adding batch:", error.message);
      setBatchAlertMessage("Failed to add Batch!");
    }
  };

  const handleDeleteClass = async (sectionId) => {
    try {
      const response = await fetch(`/api/sections/deleteSection/${sectionId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete class");
      }
    } catch (error) {
      console.error("Error deleting class:", error.message);
    }
  };

  const handleDeleteBatch = async (batchId) => {
    try {
      const response = await fetch(`/api/batches/deleteBatch/${batchId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete class");
      }
    } catch (error) {
      console.error("Error deleting class:", error.message);
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    alert("Sure to delete");
    try {
      const response = await fetch(
        `/api/departments/deleteDepartment/${departmentId}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error("Failed to delete class");
      }
    } catch (error) {
      console.error("Error deleting class:", error.message);
    }
  };

  const fetchBatches = async (departmentId) => {
    try {
      setIsFetching(true);
      const response = await fetch(`/api/departments/${departmentId}/batches`);
      if (!response.ok) {
        throw new Error("Failed to fetch batches");
      }
      const data = await response.json();
      setBatches(data);
    } catch (error) {
      console.error("Error fetching batches:", error.message);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchSections = async (batchId) => {
    try {
      setIsFetching(true);
      const response = await fetch(`/api/batches/${batchId}/sections`);
      if (!response.ok) {
        throw new Error("Failed to fetch sections");
      }
      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error("Error fetching sections:", error.message);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchClassDetails = async (sectionId) => {
    try {
      setIsFetching(true);

      const mentorResponse = await fetch(`/api/sections/${sectionId}/mentors`);
      if (!mentorResponse.ok) {
        throw new Error("Failed to fetch mentors");
      }
      const mentors = await mentorResponse.json();

      const classInchargeResponse = await fetch(
        `/api/sections/${sectionId}/classIncharges`
      );
      if (!classInchargeResponse.ok) {
        throw new Error("Failed to fetch class in-charges");
      }
      const classIncharges = await classInchargeResponse.json();

      setClassDetails({ mentors, classIncharges });
      setIsFetching(false);
    } catch (error) {
      console.error("Error fetching class details:", error.message);
      setIsFetching(false);
    }
  };

  const handleDeleteMentor = async (mentorId) => {
    try {
      const response = await fetch(`/api/deletementors/${mentorId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete mentor");
      }
      setMentorAlertMessage("Mentor deleted successfully");
      fetchClassDetails(selectedSection._id);
    } catch (error) {
      console.error("Error deleting mentor:", error.message);
      setMentorAlertMessage("Failed to delete mentor");
    }
  };

  const handleDeleteClassIncharge = async (inchargeId) => {
    try {
      const response = await fetch(`/api/deleteClassIncharge/${inchargeId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete Class Incharge");
      }
      setClassInchargeMessage("ClassIncharge deleted successfully");
      fetchClassDetails(selectedSection._id);
    } catch (error) {
      console.error("Error deleting ClassIncharge:", error.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-200">
      {/* Sidebar for departments */}
      <div className="bg-primary-blue text-white lg:sticky top-0 md:h-screen overflow-y-auto p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">All Departments</h2>
        </div>

        <div className="flex items-center justify-center gap-3">
          <input
            type="text"
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)}
            placeholder="Department Name"
            className="text-black px-4 py-2 border rounded-md"
          />
          <button
            onClick={handleAddDepartment}
            className="bg-secondary-blue text-white hover:bg-ternary-blue hover:text-black transition-all duration-300 px-4 py-2 rounded-md"
          >
            Add Department
          </button>
          {departmentAlertMessage &&
            window.alert(`Department ${departmentAlertMessage}`)}
        </div>

        <ul className="space-y-2">
          {departments.map((dept, index) => (
            <li
              key={index}
              onClick={() => handleDepartmentSelect(dept)}
              className={`flex items-center justify-between cursor-pointer py-2 px-4 transition-all duration-300 rounded-md ${
                selectedDepartment === dept
                  ? "bg-white/60 text-black font-bold"
                  : "hover:bg-white/20 text-white font-bold"
              }`}
            >
              {dept.dept_name}
              <button
                className="bg-red-500 text-white hover:bg-red-600 px-2 py-1 rounded-md"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteDepartment(dept._id);
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        {selectedDepartment && (
          <>
            <div className="bg-primary-blue mb-4 md:mb-8 p-6 rounded-lg">
              <div className="flex flex-row items-center justify-between mb-5 ">
                <h2 className="text-lg text-white font-semibold">
                  Batches for {selectedDepartment.dept_name}
                </h2>
                <div className="">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newBatchName}
                      onChange={(e) => setNewBatchName(e.target.value)}
                      placeholder="New Batch Name"
                      className="border rounded-md"
                    />
                    <button
                      onClick={handleAddBatch}
                      className="bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-md"
                    >
                      Add Batch
                    </button>
                  </div>
                  {batchAlertMessage && (
                    <div className="mt-2 text-sm text-red-500">
                      {batchAlertMessage}
                    </div>
                  )}
                </div>
              </div>
              <ul className="space-y-3">
                {batches.map((batch, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <li
                      onClick={() => handleBatchSelect(batch)}
                      className={`cursor-pointer py-2 px-4 rounded-md transition-all duration-300 flex-1 ${
                        selectedBatch === batch
                          ? "bg-white/60 text-black font-bold"
                          : "hover:bg-white/20 text-white font-bold"
                      }`}
                    >
                      {batch.batch_name}
                    </li>
                    <button
                      className="bg-red-500 text-white hover:bg-red-600 px-3 py-1 rounded-md ml-3"
                      onClick={() => handleDeleteBatch(batch._id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </ul>
            </div>

            {/* Sections list */}
            {selectedBatch && (
              <div className="bg-gray-100 mb-4 md:mb-8 p-4 rounded-lg">
              <div className="flex flex-row items-center justify-between mb-5 ">
              <h2 className="text-lg text-gray-800 font-semibold ">
                  Sections for {selectedBatch.batch_name} Batch
                </h2>

                <div className="flex gap-3">
                <input
                      type="text"
                      value={newSection}
                      onChange={(e) => setNewSection(e.target.value)}
                      placeholder="New Section"
                      className="border rounded-md"
                    />
                    <button
                      onClick={handleAddSection}
                      className="bg-primary-blue text-white hover:bg-secondary-blue/80 transition-all duration-300  hover: px-4 py-2 rounded-md"
                    >
                      Add Section
                    </button>
                    {sectionAlertMessage && (
                      <div className="text-sm text-red-500">{`Section ${sectionAlertMessage}`}</div>
                    )}
                  </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {sections.map((section, index) => (
                    <div
                      key={index}
                      className={`bg-white shadow-md px-6 py-4 rounded-lg border-l-4 transition-all duration-300
                        ${
                          selectedSection && selectedSection._id === section._id
                            ? "border-gray-800"
                            : "border-transparent"
                        }
                      `}
                    >
                      <div className="flex items-center justify-center gap-4">
                        <h3 className="text-lg font-semibold">
                          Section {section.section_name}
                        </h3>
                        <button
                          className="bg-blue-200 shadow-md px-3 py-3 rounded-lg border-l-4 transition-all duration-300"
                          onClick={() => handleSectionSelect(section)}
                        >
                          View {section.section_name} Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section details */}
            {selectedSection && (
              <div className="bg-gray-100 mb-4 md:mb-8 p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg text-gray-800 font-semibold">
                  Details for {selectedSection.section_name}
                </h2>
                <button
                  className="bg-red-500 text-white hover:bg-red-600 px-3 py-2 rounded-md"
                  onClick={() => handleDeleteClass(selectedSection._id)}
                >
                  Delete Section
                </button>
              </div>
            
              {MentorAlertMessage && (
                <div className="text-green-600 mb-4">
                  {MentorAlertMessage}
                </div>
              )}
            
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Mentors:</h3>
                <ul className="space-y-2">
                  {classDetails.mentors.map((mentor, index) => (
                    <li key={index} className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm">
                      <span>{mentor.staff_name}</span>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Are you sure you want to delete ${mentor.staff_name}?`
                            )
                          ) {
                            handleDeleteMentor(mentor._id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            
              {classInchargeMessage && (
                <div className="text-green-600 mb-4">
                  {classInchargeMessage}
                </div>
              )}
            
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Class Incharges:</h3>
                <ul className="space-y-2">
                  {classDetails.classIncharges.map((incharge, index) => (
                    <li key={index} className="flex justify-between items-center bg-white p-2 rounded-md shadow-sm">
                      <span>{incharge.staff_name}</span>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Are you sure you want to delete ${incharge.staff_name}?`
                            )
                          ) {
                            handleDeleteClassIncharge(incharge._id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SuperAdmin;
