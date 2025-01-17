import { Button, Modal, ModalBody, ModalHeader, Spinner } from "flowbite-react";
import { Info } from "lucide-react";
import React, { useEffect, useState } from "react";
import { MdOutlineDownloadDone } from "react-icons/md";
import { RxCross2, RxCrossCircled } from "react-icons/rx";
import { SiTicktick } from "react-icons/si";
import { TiTick } from "react-icons/ti";
import { useSelector } from "react-redux";
import StatusDot from "../../general/StatusDot";
import { GiMedicines } from "react-icons/gi";

export default function LeaveRequests({
  leaveRequestsAsMentor,
  leaveRequestsAsClassIncharge,
}) {
  const [classInchargemodalType, setClassInchargeModalType] = useState(null); // 'approve', 'reject', or 'taken'
  const [mentormodalType, setMentorModalType] = useState(null); // 'approve', 'reject', or 'taken'
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [menteeRequests, setMenteeRequests] = useState(leaveRequestsAsMentor);
  const [classInchargeRequests, setClassInchargeRequests] = useState(
    leaveRequestsAsClassIncharge
  );
  const [isFetching, setIsFetching] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [mentorComment, setmentorComment] = useState("");
  const [classInchargeComment, setclassInchargeComment] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month in two digits
    const day = date.getDate().toString().padStart(2, "0"); // Day in two digits
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    fetchLeaveRequestsMentor();
  }, []);

  useEffect(() => {
    fetchLeaveRequestsClassIncharge();
  }, []);

  const handleRequest = (type, id) => {
    setMentorModalType(type);
    setCurrentRequestId(id);
  };

  const handleClose = () => {
    setMentorModalType(null);
    setCurrentRequestId(null);
  };

  const fetchLeaveRequestsMentor = async () => {
    setIsFetching(true);
    try {
      const response = await fetch(
        `/api/getleaverequestbymentorid/${currentUser.userId}`
      );
      const data = await response.json();
      setMenteeRequests(data);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchLeaveRequestsClassIncharge = async () => {
    setIsFetching(true);
    try {
      const response = await fetch(
        `/api/getleaverequestbyclassinchargeid/${currentUser.userId}`
      );
      const data = await response.json();
      setClassInchargeRequests(data);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleRequestClassIncharge = (type, id) => {
    setClassInchargeModalType(type);
    setCurrentRequestId(id);
  };

  const handleCloseClassIncharge = () => {
    setClassInchargeModalType(null);
    setCurrentRequestId(null);
  };

  const confirmRequestMentor = async () => {
    setLoading(true);
    try {
      const backendUrl = `/api/leave-requestsbymentorid/${currentRequestId}/status`;
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: mentormodalType,
          mentorcomment: mentorComment,
        }),
      });

      if (response.ok) {
        await fetchLeaveRequestsMentor();
      } else {
        alert(`Failed to ${mentormodalType} request`);
      }
    } catch (error) {
      console.error("Error updating request:", error);
      alert(`Failed to ${mentormodalType} request`);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const confirmRequestClass = async () => {
    setLoading(true);
    try {
      const backendUrl = `/api/leave-requestsbyclassinchargeid/${currentRequestId}/status`;
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: classInchargemodalType,
          classInchargeComment: classInchargeComment,
        }),
      });

      if (response.ok) {
        await fetchLeaveRequestsClassIncharge();
      } else {
        alert(`Failed to ${classInchargemodalType} request`);
      }
    } catch (error) {
      console.error("Error updating request:", error);
      alert(`Failed to ${classInchargemodalType} request`);
    } finally {
      setLoading(false);
      handleCloseClassIncharge();
    }
  };

  const filteredMenteeRequests = menteeRequests.filter(
    (menteeReq) =>
      !classInchargeRequests.some((classReq) => classReq._id === menteeReq._id)
  );

  const renderRequestTable = (requests, role) => {
    return (
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
            {requests.map((req) => {
              const { status } = req.approvals[role];
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
                      <button
                        onClick={() => {
                          setSelectedRequest(req);
                          setShowDetails(true);
                        }}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <Info
                          size={16}
                          className="text-gray-400 hover:text-gray-600"
                        />
                      </button>
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
                    <CommentsCell
                      mentorComment={req.mentorcomment}
                      classInchargeComment={req.classInchargeComment}
                    />
                  </td>
                  <td className="px-6 py-4">
                    {status === "pending" ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            role === "mentor"
                              ? handleRequest("approved", req._id)
                              : handleRequestClassIncharge("approved", req._id)
                          }
                          className="bg-green-400 hover:bg-green-600 text-white p-1 rounded-full transition-all duration-300"
                        >
                          <TiTick size={30} />
                        </button>
                        <button
                          onClick={() =>
                            role === "mentor"
                              ? handleRequest("rejected", req._id)
                              : handleRequestClassIncharge("rejected", req._id)
                          }
                          className="bg-red-400 hover:bg-red-600 text-white p-1 rounded-full transition-all duration-300"
                        >
                          <RxCross2 size={30} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            role === "mentor"
                              ? handleRequest("taken", req._id)
                              : handleRequestClassIncharge("taken", req._id)
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      {/* Mentor Requests Section */}
      {menteeRequests?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="p-4 border-b dark:border-gray-700">
            <h2 className="text-lg font-semibold">
              Leave Requests From Your Class Mentees
            </h2>
          </div>
          {renderRequestTable(menteeRequests, "mentor")}
        </div>
      )}

      {/* Class Incharge Requests Section */}
      {classInchargeRequests?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b dark:border-gray-700">
            <h2 className="text-lg font-semibold">
              Leave Requests From Your Class Students
            </h2>
          </div>
          {renderRequestTable(classInchargeRequests, "classIncharge")}
        </div>
      )}

      {/* Mentor Modal */}
      <Modal
        show={mentormodalType !== null}
        size="md"
        onClose={handleClose}
        popup
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            {mentormodalType === "approved" ? (
              <SiTicktick className="mx-auto mb-4 h-14 w-14 text-green-400 dark:text-white" />
            ) : mentormodalType === "rejected" ? (
              <RxCrossCircled className="mx-auto mb-4 h-14 w-14 text-red-400 dark:text-white" />
            ) : (
              <MdOutlineDownloadDone className="mx-auto mb-4 h-14 w-14 text-secondary-blue dark:text-white" />
            )}

            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {mentormodalType === "approved" ? (
                <div>
                  Are you to approve this request?
                  <div className="w-full my-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                      <textarea
                        id="mentor_comment"
                        rows="4"
                        className="w-full px-0 text-sm text-gray-900 bg-white border-0  focus:ring-0 dark:text-white"
                        placeholder="Write your comments..."
                        onChange={(e) => setmentorComment(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>
              ) : mentormodalType === "rejected" ? (
                <div>
                  Are you sure you want to reject this request?
                  <div className="w-full my-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                      <textarea
                        id="mentor_comment"
                        rows="4"
                        className="w-full px-0 text-sm text-gray-900 bg-white border-0  focus:ring-0 dark:text-white"
                        placeholder="Write your comments..."
                        onChange={(e) => setmentorComment(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>
              ) : (
                "This action has already been taken."
              )}
            </h3>
            {mentormodalType !== "taken" && (
              <div className="flex justify-center gap-4">
                <Button
                  color={mentormodalType === "approved" ? "success" : "failure"}
                  className={`${
                    mentormodalType === "approved"
                      ? "bg-green-400 hover:bg-green-500"
                      : "bg-red-400 hover:bg-red-500"
                  }`}
                  onClick={confirmRequestMentor}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <Spinner size="sm" className="mr-2" />
                      <span className="text-white">Loading...</span>
                    </div>
                  ) : (
                    <span className="text-white">
                      {mentormodalType === "approved" ? "Approve" : "Reject"}
                    </span>
                  )}
                </Button>

                <Button color="gray" outline onClick={handleClose}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </ModalBody>
      </Modal>

      {/* Class Incharge Modal */}
      <Modal
        show={classInchargemodalType !== null}
        size="md"
        onClose={handleCloseClassIncharge}
        popup
      >
        <ModalHeader />
        <ModalBody className="pt-3">
          <div className="text-center">
            {classInchargemodalType === "approved" ? (
              <SiTicktick className="mx-auto mb-4 h-14 w-14 text-green-500 dark:text-white" />
            ) : classInchargemodalType === "rejected" ? (
              <RxCrossCircled className="mx-auto mb-4 h-14 w-14 text-red-500 dark:text-white" />
            ) : (
              <MdOutlineDownloadDone className="mx-auto mb-4 h-14 w-14 text-secondary-blue dark:text-white" />
            )}

            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {classInchargemodalType === "approved" ? (
                <div>
                  Are you to approve this request?
                  <div className="w-full my-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="px-4 py-2  rounded-t-lg dark:bg-gray-800">
                      <textarea
                        id="classIncharge_comment"
                        rows="4"
                        className="w-full px-0 text-sm text-gray-900 bg-white border-0  focus:ring-0 dark:text-white"
                        placeholder="Write your comments..."
                        onChange={(e) =>
                          setclassInchargeComment(e.target.value)
                        }
                      ></textarea>
                    </div>
                  </div>
                </div>
              ) : classInchargemodalType === "rejected" ? (
                <div>
                  Are you sure you want to reject this request?
                  <div className="w-full my-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                      <textarea
                        id="classIncharge_comment"
                        rows="4"
                        className="w-full px-0 text-sm text-gray-900 bg-white border-0  focus:ring-0 dark:text-white"
                        placeholder="Write your comments..."
                        onChange={(e) =>
                          setclassInchargeComment(e.target.value)
                        }
                      ></textarea>
                    </div>
                  </div>
                </div>
              ) : (
                "This action has already been taken."
              )}
            </h3>
            {classInchargemodalType !== "taken" && (
              <div className="flex justify-center gap-4">
                <Button
                  color={
                    classInchargemodalType === "approved"
                      ? "success"
                      : "failure"
                  }
                  className={`${
                    classInchargemodalType === "approved"
                      ? "bg-green-500 hover:bg-green-500"
                      : "bg-red-500 hover:bg-red-500"
                  }`}
                  onClick={confirmRequestClass}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <Spinner size="sm" className="mr-2" />
                      <span className="text-white">Loading...</span>
                    </div>
                  ) : (
                    <span className="text-white">
                      {classInchargemodalType === "approved"
                        ? "Approve"
                        : "Reject"}
                    </span>
                  )}
                </Button>
                <Button color="gray" onClick={handleCloseClassIncharge}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </ModalBody>
      </Modal>

      {/* Details Modal */}
      {selectedRequest && (
        <DetailsModal
          isOpen={showDetails}
          onClose={() => {
            setShowDetails(false);
            setSelectedRequest(null);
          }}
          request={selectedRequest}
        />
      )}
    </>
  );
}

// Helper Components
const CommentsCell = ({ mentorComment, classInchargeComment }) => (
  <div className="flex flex-col gap-1 max-w-xs">
    {mentorComment !== "No Comments" && (
      <div className="text-xs">
        <span className="font-medium text-gray-700">Mentor:</span>{" "}
        <span className="text-gray-600">{mentorComment}</span>
      </div>
    )}
    {classInchargeComment !== "No Comments" && (
      <div className="text-xs">
        <span className="font-medium text-gray-700">CI:</span>{" "}
        <span className="text-gray-600">{classInchargeComment}</span>
      </div>
    )}
  </div>
);

const DetailsModal = ({ isOpen, onClose, request }) => (
  <Modal show={isOpen} onClose={onClose} size="lg">
    <Modal.Header>Leave Request Details</Modal.Header>
    <Modal.Body>
      <div className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <DetailItem label="Student Name" value={request.name} />
          <DetailItem label="Section" value={request.section_name} />
          <DetailItem
            label="Leave Type"
            value={
              request.typeOfLeave ||
              (request.forMedical ? "Medical Leave" : "Regular Leave")
            }
          />
          <DetailItem label="No. of Days" value={request.noOfDays} />
          <DetailItem
            label="From Date"
            value={new Date(request.fromDate).toLocaleDateString()}
          />
          <DetailItem
            label="To Date"
            value={new Date(request.toDate).toLocaleDateString()}
          />
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* Leave Details */}
        <div>
          <h3 className="font-medium mb-2">Leave Details</h3>
          <DetailItem label="Reason" value={request.reason} />
          {request.isHalfDay && (
            <DetailItem
              label="Half Day"
              value={request.isHalfDay === "FN" ? "Forenoon" : "Afternoon"}
            />
          )}
          {request.forMedical && (
            <div className="mt-2 flex items-center gap-2 text-red-600">
              <span className="bg-red-50 p-1 rounded">
                <GiMedicines className="h-4 w-4" />
              </span>
              <span className="text-sm font-medium">Medical Leave</span>
            </div>
          )}
        </div>

        {/* Approval Status */}
        <div className="flex items-center gap-2">
          <h3 className="font-medium">Approval Status</h3>
          <div className="">
            <div className="flex">
              <StatusDot
                status={request.approvals.mentor.status}
                showLine={true}
                by="M"
                />
              <StatusDot
                status={request.approvals.classIncharge.status}
                showLine={false}
                by="CI"
              />
            </div>
          </div>
        </div>
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button color="gray" onClick={onClose}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
);

const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium">{value || "Not provided"}</p>
  </div>
);
