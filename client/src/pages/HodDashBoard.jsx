import React, { useState, useEffect } from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeadCell,
    TableRow,
  } from "flowbite-react";
  import { SiTicktick } from "react-icons/si";
  import { RxCrossCircled } from "react-icons/rx";
  import { MdOutlineDownloadDone } from "react-icons/md";

const Hoddashboard = () => {
  const [departments, setDepartments] = useState([]);
  const [classincharge,setClassincharge] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([]);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleRequest = (type, id) => {
    console.log("Opening modal:", type, id); // Added console log
    setModalType(type);
    setCurrentRequestId(id);
  };

  const handleClose = () => {
    console.log("Closing modal"); // Added console log
    setModalType(null);
    setCurrentRequestId(null);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchClassIncharge();
  }, []);

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
      fetchLeaveRequests(selectedSection._id);
    }
  }, [selectedSection]);

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/departments");
      if (!response.ok) {
        throw new Error('Failed to fetch departments');
      }
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error.message);
    }
  };

  const fetchBatches = async (departmentId) => {
    try {
      const response = await fetch(`/api/departments/${departmentId}/batches`);
      if (!response.ok) {
        throw new Error('Failed to fetch batches');
      }
      const data = await response.json();
      setBatches(data);
    } catch (error) {
      console.error('Error fetching batches:', error.message);
    }
  };

  const fetchSections = async (batchId) => {
    try {
      const response = await fetch(`/api/batches/${batchId}/sections`);
      if (!response.ok) {
        throw new Error('Failed to fetch sections');
      }
      const data = await response.json();
      const sectionsWithMentorNames = await Promise.all(data.map(async (section) => {
        const mentorsNames = await fetchMentorsNames(section.mentors);
        return { ...section, mentors: mentorsNames };
      }));
      setSections(sectionsWithMentorNames);
    } catch (error) {
      console.error('Error fetching sections:', error.message);
    }
  };

  const fetchMentorsNames = async (mentorIds) => {
    try {
      const response = await fetch(`/api/mentors?ids=${mentorIds.join(',')}`);
      if (!response.ok) {
        throw new Error('Failed to fetch mentors');
      }
      const data = await response.json();
      return data.map(mentor => mentor.staff_name);
    } catch (error) {
      console.error('Error fetching mentors:', error.message);
      return [];
    }
  };

  const fetchLeaveRequests = async (sectionId) => {
    try {
      const response = await fetch(`/api/leaverequestsbysectionid/${sectionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch leave requests');
      }
      const data = await response.json();
      setLeaveRequests(data);
    } catch (error) {
      console.error('Error fetching leave requests:', error.message);
    }
  };

  useEffect((sectionId) => {
    if (sectionId) {
      fetchClassIncharge(sectionId);
    }
  }, []);

  const fetchClassIncharge = async (sectionId) => {
    try {
      const response = await fetch(`/api/sections/${sectionId}/classIncharges`);
      if (!response.ok) {
        throw new Error("Failed to fetch class incharge");
      }
      const data = await response.json();
      setClassincharge(data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching class incharge:", error.message);
    }
  };

  const handleDepartmentSelect = (department) => {
    setSelectedDepartment(department);
    setSelectedBatch(null); // Reset batch selection when department changes
    setSelectedSection(null); // Reset section selection when department changes
    setBatches([]);
    setSections([]);
    setLeaveRequests([]);
  };

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch === selectedBatch ? null : batch);
    setSelectedSection(null); // Reset section selection when batch changes
    setSections([]);
    setLeaveRequests([]);
  };

  const handleSectionSelect = (section) => {
    setSelectedSection(section === selectedSection ? null : section);
  };

  const confirmRequest = async () => {
    setLoading(true);
    try {
      const backendUrl = `/api/leave-requestsbyhodid/${currentRequestId}/status`;
      console.log(currentRequestId);
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },  
        body: JSON.stringify({ status: modalType }),
      });
  
      if (response.ok) {
        setLeaveRequests((prevRequests) =>
          prevRequests.map((req) =>
            req._id === currentRequestId
              ? { ...req, approvals: { ...req.approvals, hod: { status: modalType } } }
              : req
          )
        );
      } else {
        alert(`Failed to ${modalType} request`);
      }
    } catch (error) {
      console.error("Error updating request:", error);
      alert(`Failed to ${modalType} request`);
    } finally {
      setLoading(false);
      handleClose();
    }
  };
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-200">
      <div className="md:w-[20%] p-1 bg-linkedin-blue text-white lg:sticky top-0 md:h-screen overflow-y-auto">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Departments</h2>
        </div>
        <ul className="space-y-2 px-1">
          {departments.map((dept, index) => (
            <li
              key={index}
              onClick={() => handleDepartmentSelect(dept)}
              className={`cursor-pointer py-2 px-4 transition-all duration-300 rounded-md
                ${
                  selectedDepartment && selectedDepartment._id === dept._id
                    ? "bg-white/60 text-black font-bold"
                    : "hover:bg-white/20 text-white font-bold"
                }
              `}
            >
              {dept.dept_name}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        {selectedDepartment && (
          <>
            <div className="bg-linkedin-blue mb-4 md:mb-8 p-4 rounded-lg">
              <h2 className="text-lg text-white font-semibold mb-2">
                Batches for {selectedDepartment.dept_name}
              </h2>
              <ul className="space-y-2">
                {batches.map((batch, index) => (
                  <li
                    key={index}
                    onClick={() => handleBatchSelect(batch)}
                    className={`cursor-pointer py-2 px-4 rounded-md transition-all duration-300
                        ${
                          selectedBatch && selectedBatch._id === batch._id
                            ? "bg-white/60 text-black font-bold"
                            : "hover:bg-white/20 text-white font-bold"
                        }
                      `}
                  >
                    {batch.batch_name}
                  </li>
                ))}
              </ul>
            </div>

            {selectedBatch && (
              <div className="bg-slate-200 my-4 md:my-8">
                <h2 className="text-3xl text-center capitalize tracking-wider mb-6">
                  Sections for {selectedDepartment.dept_name} {selectedBatch.batch_name}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {sections.map((section, index) => (
                    <div
                      key={index}
                      className={`bg-white shadow-md px-6 py-4 rounded-lg border-l-4 transition-all duration-300 ${
                        selectedSection && selectedSection._id === section._id
                          ? "border-gray-800"
                          : "border-transparent"
                      }`}
                      
                    >

                      <h3 className="text-lg font-semibold mb-2">
                        Section {section.section_name}
                      </h3>
                      {/* <div className="mb-4">
                        <span className="font-semibold">Mentors:</span>{" "}
                        {section.mentors.length > 0
                          ? section.mentors.join(", ")
                          : "No mentors assigned"}
                      </div> */}
                      {/* <div className="mb-4">
                        <span className="font-semibold">Class Incharge:</span>{" "}
                        {error ? (
                        <div className="text-red-500">{error}</div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {classincharge.map((incharge) => (
                            <div key={incharge._id} className="bg-gray-100 p-4 rounded shadow">
                              <h4 className="text-md font-semibold">{incharge.staff_name}</h4>
                            </div>
                          ))}
                        </div>
                      )}
                      </div> */}
                      <button className=" bg-linkedin-blue hover:bg-[#1c559b] text-white py-1 px-3 min-w-[90px] rounded-lg transition-all duration-300" onClick={() => handleSectionSelect(section)}> View Requests</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedSection && (
              <div className="bg-white shadow-md px-6 py-4 rounded-lg mt-4">
                <h2 className="text-lg font-semibold mb-2">
                  Leave Requests for Section {selectedSection.section_name}
                </h2>
                <div className="overflow-x-auto">
            <Table className="bg-white rounded-md">
              <TableHead>
                <TableHeadCell className="p-4 bg-linkedin-blue text-center text-white">Student Name</TableHeadCell>
                <TableHeadCell className="p-4 bg-linkedin-blue text-center text-white">Section</TableHeadCell>
                <TableHeadCell className="p-4 bg-linkedin-blue text-center text-white">Reason</TableHeadCell>
                <TableHeadCell className="p-4 bg-linkedin-blue text-center text-white">Start Date</TableHeadCell>
                <TableHeadCell className="p-4 bg-linkedin-blue text-center text-white">End Date</TableHeadCell>
                <TableHeadCell className="p-4 bg-linkedin-blue text-center text-white">Duration</TableHeadCell>
                <TableHeadCell className="p-4 bg-linkedin-blue text-center text-white">Status</TableHeadCell>
                <TableHeadCell className="p-4 bg-linkedin-blue text-center text-white">Actions</TableHeadCell>
              </TableHead>
              <TableBody className="divide-y">
                {leaveRequests.map((req) => {
                  const { status } = req.approvals.hod;

                  return (
                    <TableRow key={req._id}>
                      <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">{req.name}</TableCell>
                      <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">{selectedSection.section_name}</TableCell>
                      <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">{req.reason}</TableCell>
                      <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">{formatDate(req.fromDate)}</TableCell>
                      <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">{formatDate(req.toDate)}</TableCell>
                      <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">{req.noOfDays} days</TableCell>
                      <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide capitalize">{req.status}</TableCell>
                      <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                        {status === "pending" ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleRequest("approved", req._id)}
                              className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 min-w-[90px] rounded-lg transition-all duration-300"
                              disabled={loading}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRequest("rejected", req._id)}
                              className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 min-w-[90px] rounded-lg transition-all duration-300"
                              disabled={loading}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleRequest("taken", req._id)}
                              className="bg-linkedin-blue hover:bg-[#1c559b] text-white py-1 px-3 min-w-[90px] rounded-lg transition-all duration-300"
                            >
                              Taken
                            </button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <Modal
              show={modalType !== null}
              size="md"
              onClose={handleClose}
              popup
            >
              <ModalHeader />
              <ModalBody>
                <div className="text-center">
                  {modalType === "approved" ? (
                    <SiTicktick className="mx-auto mb-4 h-14 w-14 text-green-400 dark:text-white" />
                  ) : modalType === "rejected" ? (
                    <RxCrossCircled className="mx-auto mb-4 h-14 w-14 text-red-400 dark:text-white" />
                  ) : (
                    <MdOutlineDownloadDone className="mx-auto mb-4 h-14 w-14 text-linkedin-blue dark:text-white" />
                  )}

                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    {modalType === "approved"
                      ? "Are you sure you want to approve this request?"
                      : modalType === "rejected"
                      ? "Are you sure you want to reject this request?"
                      : "This action has already been taken."}
                  </h3>
                  {modalType !== "taken" && (
                    <div className="flex justify-center gap-4">
                      <Button
                        color={modalType === "approved" ? "success" : "failure"}
                        onClick={confirmRequest}
                        disabled={loading}
                      >
                        <h1 className="text-white font-semibold">
                          Yes, {modalType === "approved" ? "Approve" : "Reject"}
                        </h1>
                      </Button>
                      <Button
                        className="bg-linkedin-blue"
                        onClick={handleClose}
                        disabled={loading}
                      >
                        <h1 className="text-white">Cancel</h1>
                      </Button>
                    </div>
                  )}
                  {modalType === "taken" && (
                    <div className="flex justify-center gap-4">
                      <Button
                        className="bg-linkedin-blue"
                        onClick={handleClose}
                      >
                        <h1 className="text-white">Close</h1>
                      </Button>
                    </div>
                  )}
                </div>
              </ModalBody>
            </Modal>
          </div>
              </div>
            )}
          </>
        )}

        {!selectedDepartment && (
          <div className="mt-8 text-center text-gray-600">
            Select a department to start.
          </div>
        )}
      </div>
    </div>
  );
};

export default Hoddashboard;
