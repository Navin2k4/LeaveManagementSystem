import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Textarea,
  TextInput,
} from "flowbite-react";
import { SiTicktick } from "react-icons/si";
import { RxCrossCircled } from "react-icons/rx";
import { MdOutlineDownloadDone } from "react-icons/md";
import { useSelector } from "react-redux";
import TableSkeleton from "./ui/TableSkeleton";
import { GiMedicines } from "react-icons/gi";
import StatusDot from "./StatusDot";
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
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

  return (
    <>
      <>
        {isFetching ? (
          <div className="p-4 rounded-lg mb-4">
            <TableSkeleton />
          </div>
        ) : menteeRequests.length > 0 ? (
          <div>
            <div className=" mb-4">
              <h2 className="text-xl md:text-2xl uppercase tracking-wider font-semibold">
                Mentee requests
              </h2>
            </div>
            <div className="overflow-x-auto">
              <Table className="bg-white rounded-md">
                <TableHead>
                  <TableHeadCell className="bg-[#244784] text-center text-white">
                    Student Name
                  </TableHeadCell>
                  <TableHeadCell className="p-4 bg-[#244784] text-center text-white">
                    Section
                  </TableHeadCell>
                  <TableHeadCell className="p-4 bg-[#244784] text-center text-white">
                    Reason
                  </TableHeadCell>
                  <TableHeadCell className="p-4 bg-[#244784] text-center text-white">
                    From - To
                  </TableHeadCell>
                  <TableHeadCell className="p-4 bg-[#244784] text-center text-white">
                    Days
                  </TableHeadCell>
                  <TableHeadCell className="p-4 bg-[#244784] text-center text-white">
                    Status Bar
                  </TableHeadCell>
                  <TableHeadCell className="p-4 bg-[#244784] text-center text-white">
                    Comments
                  </TableHeadCell>
                  <TableHeadCell className="p-4 bg-[#244784] text-center text-white">
                    Actions
                  </TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                  {menteeRequests.map((req) => {
                    const { status } = req.approvals.mentor;
                    return (
                      <TableRow key={req._id}>
                        <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                          {req.name}
                        </TableCell>
                        <TableCell className="text-center border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                          {req.section_name}
                        </TableCell>
                        <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                          {req.reason}
                        </TableCell>
                        <TableCell
                          className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide"
                          style={{ width: "100px" }}
                        >
                          <div className="flex flex-col items-center min-w-max justify-center gap-2">
                            <div>{formatDate(req.fromDate)}</div>
                            <div>{formatDate(req.toDate)}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                          {req.noOfDays}
                        </TableCell>
                        <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                          <div className="status-dots">
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
                        <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide capitalize">
                          <div className="flex flex-col">
                            {req.mentorcomment !== "No Comments" && (
                              <div className="flex gap-1">
                                <h2 className="">Mentor</h2>
                                <div className="text-gray-600 text-sm">
                                  {req.mentorcomment}
                                </div>
                              </div>
                            )}
                            {req.classInchargeComment !== "No Comments" && (
                              <div className="flex gap-1">
                                <h2 className="">ClassIncharge :</h2>
                                <div className="text-gray-600">
                                  {req.classInchargeComment}
                                </div>
                              </div>
                            )}
                            {req.hodComment !== "No Comments" && (
                              <div className="flex gap-1">
                                <h2 className="">Hod : </h2>
                                <div className="text-gray-600">
                                  {req.hodComment}
                                </div>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                          {status === "pending" ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() =>
                                  handleRequest("approved", req._id)
                                }
                                className="bg-green-400 hover:bg-green-600 text-white p-1 rounded-full transition-all duration-300"
                              >
                                <TiTick size={30} />
                              </button>
                              <button
                                onClick={() =>
                                  handleRequest("rejected", req._id)
                                }
                                className="bg-red-400 hover:bg-red-600 text-white p-1  rounded-full transition-all duration-300"
                              >
                                <RxCross2 size={30} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleRequest("taken", req._id)}
                                className={` text-white py-1 px-3 min-w-[90px] rounded-lg transition-all duration-300 ${
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
                                onChange={(e) =>
                                  setmentorComment(e.target.value)
                                }
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
                                onChange={(e) =>
                                  setmentorComment(e.target.value)
                                }
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
                          color={
                            mentormodalType === "approved"
                              ? "success"
                              : "failure"
                          }
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
                              {mentormodalType === "approved"
                                ? "Approve"
                                : "Reject"}
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
            </div>
          </div>
        ) : (
          <div className="text-center text-lg font-semibold">
            No Leave Requests from Mentee
          </div>
        )}
      </>
      <>
        {isFetching ? (
          <div className="flex justify-center items-center mt-6">
            <TableSkeleton />
          </div>
        ) : classInchargeRequests.length > 0 ? (
          <div className="mt-4">
            <h2 className="text-xl md:text-2xl uppercase tracking-wider font-semibold">
              All requests
            </h2>
            <div className="overflow-x-auto mt-4">
              <Table className="bg-white rounded-md">
                <TableHead>
                  <TableHeadCell className="p-4 bg-[#244784] text-center text-white">
                    Student Name
                  </TableHeadCell>
                  <TableHeadCell className="p-4 bg-[#244784] text-center text-white">
                    Section
                  </TableHeadCell>
                  <TableHeadCell className="p-4 bg-[#244784] text-center text-white">
                    Reason
                  </TableHeadCell>
                  <TableHeadCell className="p-4 bg-[#244784] text-center text-white">
                    From - To
                  </TableHeadCell>

                  <TableHeadCell className="p-4 bg-[#244784] text-center text-white">
                    Days
                  </TableHeadCell>
                  <TableHeadCell className="p-4 bg-[#244784] text-center text-white">
                    Status Bar
                  </TableHeadCell>
                  <TableHeadCell className="p-4 bg-[#244784] text-center text-white">
                    Comments
                  </TableHeadCell>
                  <TableHeadCell className="p-4 bg-[#244784] text-center text-white">
                    Actions
                  </TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                  {classInchargeRequests.map((req) => {
                    const { status } = req.approvals.classIncharge;

                    return (
                      <TableRow key={req._id}>
                        <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                          {req.name}
                        </TableCell>
                        <TableCell className="text-center border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                          {req.section_name}
                        </TableCell>
                        <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                          <div className="flex items-center gap-2 ">
                            <div className="">{req.reason}</div>
                            <div>
                              {req.forMedical ? (
                                <GiMedicines color="green" size={20} />
                              ) : null}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell
                          className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide"
                          style={{ width: "100px" }}
                        >
                          {req.fromDate === req.toDate ? (
                            <div className="flex flex-col items-center min-w-max justify-center gap-2">
                              <div>{formatDate(req.fromDate)}</div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center  min-w-max justify-center gap-2">
                              <div>{formatDate(req.fromDate)}</div>
                              <div>{formatDate(req.toDate)}</div>
                            </div>
                          )}
                        </TableCell>

                        <TableCell className="text-center border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                          {req.noOfDays}
                        </TableCell>
                        <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                          <div className="status-dots">
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
                        <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide capitalize">
                          <div className="flex flex-col">
                            {req.mentorcomment !== "No Comments" && (
                              <div className="flex gap-1">
                                <h2 className="">Mentor</h2>
                                <div className="text-gray-600 text-sm">
                                  {req.mentorcomment}
                                </div>
                              </div>
                            )}
                            {req.classInchargeComment !== "No Comments" && (
                              <div className="flex gap-1">
                                <h2 className="">ClassIncharge :</h2>
                                <div className="text-gray-600">
                                  {req.classInchargeComment}
                                </div>
                              </div>
                            )}
                            {req.hodComment !== "No Comments" && (
                              <div className="flex gap-1">
                                <h2 className="">Hod : </h2>
                                <div className="text-gray-600">
                                  {req.hodComment}
                                </div>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                          {status === "pending" ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() =>
                                  handleRequestClassIncharge(
                                    "approved",
                                    req._id
                                  )
                                }
                                className="bg-green-500 hover:bg-green-600 text-white p-1  rounded-full transition-all duration-300"
                              >
                                <TiTick size={30} />
                              </button>
                              <button
                                onClick={() =>
                                  handleRequestClassIncharge(
                                    "rejected",
                                    req._id
                                  )
                                }
                                className="bg-red-500 hover:bg-red-600 text-white p-1   rounded-full transition-all duration-300"
                              >
                                <RxCross2 size={30} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() =>
                                  handleRequestClassIncharge("taken", req._id)
                                }
                                className={` text-white py-1 px-3 min-w-[90px] rounded-lg transition-all duration-300 ${
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
            </div>
          </div>
        ) : (
          <div className="text-center text-lg font-semibold mt-4">
            No requests from Class Students
          </div>
        )}
      </>
    </>
  );
}
