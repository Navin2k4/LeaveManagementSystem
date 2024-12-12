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
import StatusDot from "../components/StatusDot";
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";

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
    fetchClassIncharge();
  }, [selectedSection]); // Fetch class incharge when selectedSection changes

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

  useEffect(() => {
    fetchStaffLeaveRequests();
  }, []);

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
      const sectionsWithMentorNames = await Promise.all(
        data.map(async (section) => {
          const mentorsNames = await fetchMentorsNames(section.mentors);
          return { ...section, mentors: mentorsNames };
        })
      );
      setSections(sectionsWithMentorNames);
    } catch (error) {
      console.error("Error fetching sections:", error.message);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchMentorsNames = async (mentorIds) => {
    try {
      setIsFetching(true);
      const response = await fetch(`/api/mentors?ids=${mentorIds.join(",")}`);
      if (!response.ok) {
        throw new Error("Failed to fetch mentors");
      }
      const data = await response.json();
      return data.map((mentor) => mentor.staff_name);
    } catch (error) {
      console.error("Error fetching mentors:", error.message);
      return [];
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

  const fetchStaffLeaveRequests = async () => {
    try {
      setIsFetching(true);
      const response = await fetch(
        `/api/getStaffLeaveRequests?deptId=${currentUser.departmentId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch staff leave requests");
      }
      const data = await response.json();
      setStaffLeaveRequests(data);
    } catch (error) {
      console.error("Error fetching staff leave requests:", error.message);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchClassIncharge = async () => {
    try {
      setIsFetching(true);
      const response = await fetch(
        `/api/sections/${selectedSection?._id}/classIncharges`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch class incharge");
      }
      const data = await response.json();
      setClassIncharge(data);
    } catch (error) {
      console.error("Error fetching class incharge:", error.message);
      setError(error.message);
    } finally {
      setIsFetching(false);
    }
  };

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

  return (
    <div className="flex flex-col md:flex-row h-screen bg-ternary-blue">
      <div className="md:w-[20%] px-2 bg-[#1f3a6e] text-white lg:sticky top-0 md:h-screen overflow-y-auto">
        <div className="p-4 flex items-center justify-between">
          <h2 className={`text-3xl tracking-wider text-white font-semibold`}>
            Your DashBoard
          </h2>
          {isMobileView && (
            <div
              className={`bg-white/80 p-2 rounded-full ${
                isMobileView ? "cursor-pointer" : ""
              } ${
                isProfileMenuOpen
                  ? "rotate-180 transition-all duration-500"
                  : "rotate-0 transition-all duration-500"
              } `}
              onClick={isMobileView ? toggleProfileMenu : null}
            >
              <svg
                stroke="currentColor"
                fill="black"
                strokeWidth="0"
                viewBox="0 0 448 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"></path>
              </svg>
            </div>
          )}
        </div>
        <ul
          className={`space-y-2 transition-all duration-300 overflow-hidden ${
            isMobileView
              ? isProfileMenuOpen
                ? "max-h-96 mb-3"
                : "max-h-0"
              : "max-h-full"
          }`}
        >
          <li
            className={`cursor-pointer py-2 px-4 transition-all duration-300 rounded-md font-bold ${
              studentRequest
                ? "bg-white/60 text-black"
                : "hover:bg-white/60 hover:text-black"
            }`}
            onClick={handleStudentLeaveRequest}
          >
            Student's Leave Requests
          </li>
          <li
            className={`cursor-pointer py-2 px-4 transition-all duration-300 rounded-md font-bold ${
              staffRequest
                ? "bg-white/60 text-black"
                : "hover:bg-white/60 hover:text-black"
            }`}
            onClick={handleStaffLeaveRequest}
          >
            Staff's Leave Requests
          </li>
        </ul>
      </div>
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        {studentRequest && (
          <>
            <div className="bg-[#1f3a6e] mb-4 md:mb-8 p-4 rounded-lg">
              <h2 className="text-lg text-white font-semibold mb-2">
                Batches for {deptName}
              </h2>
              <ul className="space-y-2">
                {batches.map((batch, index) => (
                  <li
                    key={index}
                    onClick={() => handleBatchSelect(batch)}
                    className={`cursor-pointer py-2 px-4 rounded-md transition-all duration-300 ${
                      selectedBatch && selectedBatch._id === batch._id
                        ? "bg-white/60 text-black font-bold"
                        : "hover:bg-white/20 text-white font-bold"
                    }`}
                  >
                    {batch.batch_name}
                  </li>
                ))}
              </ul>
            </div>

            {selectedBatch && (
              <div className=" my-4 md:my-8 rounded-lg p-4">
                <h2 className="text-3xl text-center capitalize tracking-wider mb-6">
                  Sections for {deptName} {selectedBatch.batch_name}
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
                      <div className="flex items-center justify-center gap-4">
                        <h3 className="text-lg font-semibold">
                          Section {section.section_name}
                        </h3>
                        <button
                          className="bg-gradient-to-br from-blue-500 to-[#0f172a]
 hover:bg-[#1c559b] text-white py-1 px-3 min-w-[90px] rounded-lg transition-all duration-300"
                          onClick={() => handleSectionSelect(section)}
                        >
                          View Requests
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedSection && (
              <div className="bg-white shadow-md px-6 py-4 rounded-lg mt-4">
                <h2 className="text-lg font-semibold mb-4 text-center">
                  Leave Requests for Section {selectedSection.section_name}
                </h2>
                <div className="overflow-x-auto">
                  {leaveRequests.length > 0 ? (
                    <Table className="bg-white rounded-md">
                      <TableHead>
                        <TableHeadCell className="p-4 bg-[#1f3a6e] text-center text-white">
                          Student Name
                        </TableHeadCell>

                        <TableHeadCell className="p-4 bg-[#1f3a6e] text-center text-white">
                          Reason
                        </TableHeadCell>
                        <TableHeadCell
                          className="p-4 bg-[#1f3a6e] min-w-max text-center text-white"
                        >
                          From - To
                        </TableHeadCell>
                        <TableHeadCell className="p-4 bg-[#1f3a6e] text-center text-white">
                          Days
                        </TableHeadCell>
                        <TableHeadCell className="p-4 bg-[#1f3a6e] text-center text-white">
                          Status
                        </TableHeadCell>
                        <TableHeadCell className="p-4 bg-[#1f3a6e] text-center text-white">
                          Comments
                        </TableHeadCell>
                        <TableHeadCell className="p-4 bg-[#1f3a6e] text-center text-white">
                          Actions
                        </TableHeadCell>
                      </TableHead>
                      <TableBody className="divide-y">
                        {leaveRequests.map((req) => {
                          const { status : hodstatus } = req.approvals.hod;
                          const { status : classInchargeStatus } = req.approvals.classIncharge;
                          const { status : mentorStatus } = req.approvals.mentor;

                          return (
                            <TableRow key={req._id}>
                              <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                                {req.name}
                              </TableCell>

                              <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                                {req.reason}
                              </TableCell>
                              <TableCell
                                className=" border text-center border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide"
                              >
                                <div className="flex flex-col items-center min-w-max justify-center gap-2">
                                  <div>{formatDate(req.fromDate)}</div>
                                  <div>{formatDate(req.toDate)}</div>
                                </div>
                              </TableCell>
                              <TableCell className="border text-center border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                                {req.noOfDays}
                              </TableCell>
                              <TableCell className="flex  justify-center items-center border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                                <div className="status-dots mt-4 ">
                                  <StatusDot
                                    status={req.approvals.mentor.status}
                                    role="mentor"
                                    showLine={true}
                                  />
                                  <StatusDot
                                    status={req.approvals.classIncharge.status}
                                    role="classIncharge"
                                    showLine={true}
                                  />
                                  <StatusDot
                                    status={req.approvals.hod.status}
                                    role="hod"
                                    showLine={false}
                                  />
                                </div>
                              </TableCell>
                              <TableCell className="border min-w-[250px] border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide capitalize">
                                <div className="flex flex-col">
                                  {req.mentorcomment !== "No Comments" && (
                                    <div className="flex gap-2">
                                      <h2 className="">Mentor:</h2>
                                      <div className="text-gray-600 text-sm">
                                        {req.mentorcomment}
                                      </div>
                                    </div>
                                  )}
                                  {req.classInchargeComment !==
                                    "No Comments" && (
                                      <div className="flex gap-2">
                                      <h2 className="">Class Incharge:</h2>
                                      <div className="text-gray-600">
                                        {req.classInchargeComment}
                                      </div>
                                    </div>
                                  )}
                                 {req.hodComment !==
                                    "No Comments" && (
                                    <div className="flex gap-2">
                                      <h2 className="">Hod:</h2>
                                      <div className="text-gray-600">
                                        {req.hodComment}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </TableCell>

                              <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                                {hodstatus === "pending" && classInchargeStatus === "approved" ? (
                                  <div className="flex items-center gap-4 justify-center">
                                    <button
                                      onClick={() =>
                                        handleRequest("approved", req._id)
                                      }
                                      className="bg-green-500 hover:bg-green-600 text-white  rounded-full transition-all duration-300"
                                      disabled={loading}
                                    >
                                      <TiTick size={30} />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleRequest("rejected", req._id)
                                      }
                                      className="bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-300"
                                      disabled={loading}
                                    >
                                      <RxCross2 size={30} />
                                    </button>
                                  </div>
                                ) : classInchargeStatus === "pending" ? (
                                        <h1>ClassIncharge and Mentor status is in pending!</h1>
                                ) : (
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={() =>
                                        handleRequest("taken", req._id)
                                      }
                                      className={`text-white py-1 px-3 min-w-[90px] rounded-lg transition-all duration-300 ${
                                        status === "approved"
                                          ? "bg-green-400"
                                          : status === "rejected"
                                          ? "bg-red-400"
                                          : ""
                                      }`}
                                    >
                                      {status === "approved"
                                        ? "Approved"
                                        : status === "rejected"
                                        ? "Rejected"
                                        : "Taken"}
                                    </button>
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="flex items-center justify-center h-48">
                      <p className="text-gray-500">
                        No Leave from this section
                      </p>
                    </div>
                  )}

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
                                    className="w-full px-0 text-sm text-gray-900 bg-white border-0  focus:ring-0 dark:text-white"
                                    placeholder="Write your comments..."
                                    onChange={(e) =>
                                      sethodComment(e.target.value)
                                    }
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
                                    className="w-full px-0 text-sm text-gray-900 bg-white border-0  focus:ring-0 dark:text-white"
                                    placeholder="Write your comments..."
                                    onChange={(e) =>
                                      sethodComment(e.target.value)
                                    }
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
                              color={
                                modalType === "approved" ? "success" : "failure"
                              }
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
                                  {modalType === "approved"
                                    ? "Approve"
                                    : "Reject"}
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
                            <Button
                              className="bg-primary-blue"
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
        {staffRequest && (
          <>
            <div className="overflow-x-auto">
              {staffLeaveRequests.length > 0 ? (
                <Table className="bg-white rounded-md">
                  <TableHead>
                    <TableHeadCell className="p-4 bg-[#1f3a6e] text-center text-white">
                      Staff Name
                    </TableHeadCell>
                    <TableHeadCell className="p-4 bg-[#1f3a6e] text-center text-white">
                      Reason
                    </TableHeadCell>
                    <TableHeadCell className="p-4 bg-[#1f3a6e] text-center text-white">
                      From - To
                    </TableHeadCell>
                    <TableHeadCell className="p-4 bg-[#1f3a6e] text-center text-white">
                      Duration
                    </TableHeadCell>
                    <TableHeadCell className="p-4 bg-[#1f3a6e] text-center text-white">
                      Status
                    </TableHeadCell>
                    <TableHeadCell className="p-4 bg-[#1f3a6e] text-center text-white">
                      Actions
                    </TableHeadCell>
                  </TableHead>
                  <TableBody className="divide-y">
                    {staffLeaveRequests.map((req) => {
                      const { status } = req.approvals.hod;

                      return (
                        <TableRow key={req._id}>
                          <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                            {req.name}
                          </TableCell>
                          <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                            {req.reason}
                          </TableCell>
                          <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                            <div className="flex flex-col items-center min-w-max justify-center gap-2">
                              <div>{formatDate(req.fromDate)}</div>
                              <div>{formatDate(req.toDate)}</div>
                            </div>
                          </TableCell>
                          <TableCell className=" text-center border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                            {req.noOfDays} days
                          </TableCell>
                          <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide capitalize">
                            <div className="flex flex-col">
                              <div>{req.status}</div>
                              <div>{req.comment}</div>
                            </div>
                          </TableCell>
                          <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                            {status === "pending" ? (
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() =>
                                    handleRequest("approved", req._id)
                                  }
                                  className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 min-w-[90px] rounded-lg transition-all duration-300"
                                  disabled={loading}
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() =>
                                    handleRequest("rejected", req._id)
                                  }
                                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 min-w-[90px] rounded-lg transition-all duration-300"
                                  disabled={loading}
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() =>
                                    handleRequest("taken", req._id)
                                  }
                                  className={`text-white py-1 px-3 min-w-[90px] rounded-lg transition-all duration-300 ${
                                    status === "approved"
                                      ? "bg-green-400"
                                      : status === "rejected"
                                      ? "bg-red-400"
                                      : ""
                                  }`}
                                >
                                  {status === "approved"
                                    ? "Approved"
                                    : status === "rejected"
                                    ? "Rejected"
                                    : "Taken"}
                                </button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex items-center justify-center h-48">
                  <p className="text-gray-500">No Leave</p>
                </div>
              )}

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
                      <MdOutlineDownloadDone className="mx-auto mb-4 h-14 w-14 text-primary-blue dark:text-white" />
                    )}

                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                      {modalType === "approved" ? (
                        <div>
                          Are you to approve this request?
                          <div className="w-full my-4 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                              <textarea
                                id="comment"
                                rows="4"
                                className="w-full px-0 text-sm text-gray-900 bg-white border-0  focus:ring-0 dark:text-white"
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
                                className="w-full px-0 text-sm text-gray-900 bg-white border-0  focus:ring-0 dark:text-white"
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
                          color={
                            modalType === "approved" ? "success" : "failure"
                          }
                          onClick={confirmRequest}
                          disabled={loading}
                        >
                          <h1 className="text-white font-semibold">
                            Yes,{" "}
                            {modalType === "approved" ? "Approve" : "Reject"}
                          </h1>
                        </Button>
                        <Button
                          className="bg-primary-blue"
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
                          className="bg-primary-blue"
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
          </>
        )}
        {!studentRequest && !staffRequest && (
          <div className="mt-8 text-center text-gray-600">
            Select Leave Request to Approve.
          </div>
        )}
      </div>
    </div>
  );
};

export default Hoddashboard;
