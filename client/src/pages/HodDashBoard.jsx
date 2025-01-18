import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Table,
  TableBody,
  Spinner,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { SiTicktick } from "react-icons/si";
import { RxCrossCircled } from "react-icons/rx";
import { MdOutlineDownloadDone } from "react-icons/md";
import { useSelector } from "react-redux";
import StatusDot from "../components/general/StatusDot";
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import { User, ClipboardList, BookOpen } from "lucide-react";
import DashboardSidebar from "../components/layout/DashboardSidebar";

const Hoddashboard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [deptName, setDeptName] = useState(null);
  const [classIncharge, setClassIncharge] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([]);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [studentRequest, setStudentRequest] = useState(false);
  const [staffRequest, setStaffRequest] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [error, setError] = useState(null);
  const [staffLeaveRequests, setStaffLeaveRequests] = useState([]);
  const [hodComment, sethodComment] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month in two digits
    const day = date.getDate().toString().padStart(2, "0"); // Day in two digits
    return `${day}-${month}-${year}`;
  };
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [isFetching, setIsFetching] = useState(false);

  const handleRequest = (type, id) => {
    setModalType(type);
    setCurrentRequestId(id);
  };

  const handleClose = () => {
    setModalType(null);
    setCurrentRequestId(null);
  };

  useEffect(() => {
    if (currentUser && currentUser.departmentId) {
      fetchDepartmentName();
      fetchBatches(currentUser.departmentId);
    }
  }, [currentUser]);

  useEffect(() => {
    if (deptName) {
      fetchBatches(currentUser.departmentId);
    }
  }, [deptName, currentUser.departmentId]);

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

  // useEffect(() => {
  //   fetchStaffLeaveRequests();
  // }, []);

  const fetchDepartmentName = async () => {
    try {
      setIsFetching(true);
      const response = await fetch(
        `/api/getDepartmentNameByCurrentUserId?deptId=${currentUser.departmentId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch departments");
      }
      const data = await response.json();
      setDeptName(data.name); // set deptName to data.name, assuming data returns an object with 'name' field
    } catch (error) {
      console.error("Error fetching departments:", error.message);
    } finally {
      setIsFetching(false);
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

  const fetchLeaveRequests = async (sectionId) => {
    try {
      setIsFetching(true);
      const response = await fetch(
        `/api/leaverequestsbysectionid/${sectionId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch leave requests");
      }
      const data = await response.json();
      setLeaveRequests(data);
    } catch (error) {
      console.error("Error fetching leave requests:", error.message);
    } finally {
      setIsFetching(false);
    }
  };

  // const fetchStaffLeaveRequests = async () => {
  //   try {
  //     setIsFetching(true);
  //     const response = await fetch(
  //       `/api/getStaffLeaveRequests?deptId=${currentUser.departmentId}`
  //     );
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch staff leave requests");
  //     }
  //     const data = await response.json();
  //     setStaffLeaveRequests(data);
  //   } catch (error) {
  //     console.error("Error fetching staff leave requests:", error.message);
  //   } finally {
  //     setIsFetching(false);
  //   }
  // };

  const handleStudentLeaveRequest = () => {
    setStudentRequest(true);
    setStaffRequest(false);
  };

  const handleBatchSelect = (batch) => {
    setSelectedBatch((prevBatch) => (prevBatch === batch ? null : batch));
    setSelectedSection(null); // No need to reset sections and leaveRequests here
  };

  const handleSectionSelect = (section) => {
    setSelectedSection((prevSection) =>
      prevSection === section ? null : section
    );
  };

  const confirmRequest = async () => {
    setLoading(true);
    try {
      const backendUrl = `/api/leave-requestsbyhodid/${currentRequestId}/status`;
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: modalType,
          hodComment: hodComment,
        }),
      });

      if (response.ok) {
        setLeaveRequests((prevRequests) =>
          prevRequests.map((req) =>
            req._id === currentRequestId
              ? {
                  ...req,
                  approvals: { ...req.approvals, hod: { status: modalType } },
                }
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

  const handleStaffLeaveRequest = () => {
    setStudentRequest(false);
    setStaffRequest(true);
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

  const id =
    currentUser.userType === "Student" ? currentUser.id : currentUser.userId;

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const res = await fetch(`/api/getleaverequest/${id}`);
        const data = await res.json();
        if (res.ok) {
          setLeaveRequests(data);
        }
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      }
    };

    fetchLeaveRequests();
  }, [currentUser.id]);

  // Define menu items for the sidebar
  const menuItems = [
    {
      id: "student_requests",
      icon: <ClipboardList size={18} />,
      label: "Student's Leave Requests",
      active: studentRequest,
    },
  ];

  // Add this function to handle tab changes
  const handleTabChange = (tabId) => {
    if (tabId === "student_requests") {
      handleStudentLeaveRequest();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Replace the old sidebar with DashboardSidebar */}
      <DashboardSidebar
        menuItems={menuItems}
        currentTab={studentRequest ? "student_requests" : ""}
        onTabChange={handleTabChange}
        userInfo={currentUser}
        title={`HOD Dashboard - ${deptName || "Loading..."}`}
        onSidebarToggle={setIsSidebarOpen}
      />

      {/* Main Content - Update the wrapper div to match StaffDashBoard.jsx */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        <div className="p-4">
          {studentRequest && (
            <>
              {/* Batch Selection Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-[#1f3a6e]" />
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Select Batch
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {batches.map((batch, index) => (
                    <div
                      key={index}
                      onClick={() => handleBatchSelect(batch)}
                      className={`cursor-pointer p-4 rounded-lg transition-all duration-300 ${
                        selectedBatch && selectedBatch._id === batch._id
                          ? "bg-[#1f3a6e] text-white"
                          : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {batch.batch_name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Section Selection */}
              {selectedBatch && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Sections for {selectedBatch.batch_name}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {sections.map((section, index) => (
                      <div
                        key={index}
                        className={`bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border-l-4 transition-all duration-300 ${
                          selectedSection && selectedSection._id === section._id
                            ? "border-[#1f3a6e]"
                            : "border-transparent"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">
                            Section {section.section_name}
                          </h3>
                          <button
                            onClick={() => handleSectionSelect(section)}
                            className="bg-[#1f3a6e] hover:bg-[#162951] text-white px-4 py-2 rounded-lg transition-all duration-300"
                          >
                            View Requests
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Leave Requests Table */}
              {selectedSection && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                      Leave Requests - Section {selectedSection.section_name}
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                          <th className="px-6 py-4 w-[18%]">Student</th>
                          <th className="px-6 py-4 w-[20%]">Reason</th>
                          <th className="px-6 py-4 w-[15%]">Dates</th>
                          <th className="px-6 py-4 w-[8%] text-center">Days</th>
                          <th className="px-6 py-4 w-[12%]">Status</th>
                          <th className="px-6 py-4 w-[15%]">Comments</th>
                          <th className="px-6 py-4 w-[10%]">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-gray-700">
                        {leaveRequests.map((req) => {
                          const { status: classInchargeStatus } =
                            req.approvals.classIncharge;
                          const { status: mentorStatus } = req.approvals.mentor;

                          return (
                            <tr
                              key={req._id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            >
                              <td className="px-6 py-4 text-gray-900 dark:text-gray-200">
                                {req.name}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`text-gray-600 dark:text-gray-300 line-clamp-2 capitalize ${
                                      req.forMedical === true
                                        ? "text-red-600"
                                        : "text-blue-600"
                                    }`}
                                  >
                                    {req.reason}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                <div className="flex flex-col items-center min-w-max justify-center gap-2">
                                  <div>{formatDate(req.fromDate)}</div>
                                  <div>{formatDate(req.toDate)}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-300">
                                {req.noOfDays}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-center">
                                  <StatusDot
                                    status={req.approvals.mentor.status}
                                    showLine={true}
                                    by="M"
                                  />
                                  <StatusDot
                                    status={req.approvals.classIncharge.status}
                                    showLine={false}
                                    by="CI"
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col gap-1 max-w-xs">
                                  {req.mentorcomment !== "No Comments" && (
                                    <div className="text-xs">
                                      <span className="font-medium text-gray-700">
                                        Mentor:
                                      </span>{" "}
                                      <span className="text-gray-600">
                                        {req.mentorcomment}
                                      </span>
                                    </div>
                                  )}
                                  {req.classInchargeComment !==
                                    "No Comments" && (
                                    <div className="text-xs">
                                      <span className="font-medium text-gray-700">
                                        CI:
                                      </span>{" "}
                                      <span className="text-gray-600">
                                        {req.classInchargeComment}
                                      </span>
                                    </div>
                                  )}
                                  {req.hodComment !== "No Comments" && (
                                    <div className="text-xs">
                                      <span className="font-medium text-gray-700">
                                        HOD:
                                      </span>{" "}
                                      <span className="text-gray-600">
                                        {req.hodComment}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                {(() => {
                                  const baseClasses =
                                    "text-white text-center rounded-full p-1";
                                  if (
                                    mentorStatus === "approved" &&
                                    classInchargeStatus === "approved"
                                  ) {
                                    return (
                                      <div
                                        className={`bg-green-400 ${baseClasses}`}
                                      >
                                        Approved
                                      </div>
                                    );
                                  }
                                  if (
                                    mentorStatus === "rejected" ||
                                    classInchargeStatus === "rejected"
                                  ) {
                                    return (
                                      <div
                                        className={`bg-red-400 ${baseClasses}`}
                                      >
                                        Rejected
                                      </div>
                                    );
                                  }
                                  return (
                                    <div
                                      className={`bg-yellow-400 ${baseClasses}`}
                                    >
                                      Pending
                                    </div>
                                  );
                                })()}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {!studentRequest && !staffRequest && (
            <div className="flex items-center justify-center h-[calc(100vh-2rem)]">
              <div className="text-center">
                <User size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Select Leave Request type to view requests
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Existing Modal remains the same */}
      <Modal show={modalType !== null} size="md" onClose={handleClose} popup>
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            {modalType === "approved" ? (
              <SiTicktick className="mx-auto mb-4 h-14 w-14 text-green-400 dark:text-white" />
            ) : modalType === "rejected" ? (
              <RxCrossCircled className="mx-auto mb-4 h-14 w-14 text-red-400 dark:text-white" />
            ) : (
              <MdOutlineDownloadDone className="mx-auto mb-4 h-14 w-14 text-primary-blue dark:text-white" />
            )}

            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {modalType === "approved" ? (
                <div>
                  Are you to approve this request?
                  <div className="w-full my-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                      <textarea
                        id="hod_comment"
                        rows="4"
                        className="w-full px-0 text-sm text-gray-900 bg-white border-0 focus:ring-0 dark:text-white"
                        placeholder="Write your comments..."
                        onChange={(e) => sethodComment(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>
              ) : modalType === "rejected" ? (
                <div>
                  Are you sure you want to reject this request?
                  <div className="w-full my-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                      <textarea
                        id="comment"
                        rows="4"
                        className="w-full px-0 text-sm text-gray-900 bg-white border-0 focus:ring-0 dark:text-white"
                        placeholder="Write your comments..."
                        onChange={(e) => sethodComment(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>
              ) : (
                "This action has already been taken."
              )}
            </h3>
            {modalType !== "taken" && (
              <div className="flex justify-center gap-4">
                <Button
                  color={modalType === "approved" ? "success" : "failure"}
                  className={`${
                    modalType === "approved"
                      ? "bg-green-400 hover:bg-green-500"
                      : "bg-red-400 hover:bg-red-500"
                  }`}
                  onClick={confirmRequest}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <Spinner size="sm" className="mr-2" />
                      <span className="text-white">Loading...</span>
                    </div>
                  ) : (
                    <span className="text-white">
                      {modalType === "approved" ? "Approve" : "Reject"}
                    </span>
                  )}
                </Button>
                <Button color="gray" onClick={handleClose}>
                  Cancel
                </Button>
              </div>
            )}
            {modalType === "taken" && (
              <div className="flex justify-center gap-4">
                <Button className="bg-primary-blue" onClick={handleClose}>
                  <h1 className="text-white">Close</h1>
                </Button>
              </div>
            )}
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Hoddashboard;
