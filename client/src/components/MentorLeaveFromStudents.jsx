import React, { useState } from "react";
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

export default function MentorLeaveFromStudents({ leaveRequestsAsMentor }) {
  const [modalType, setModalType] = useState(null); // 'approve', 'reject', or 'taken'
  const [currentRequestId, setCurrentRequestId] = useState(null);

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

  const confirmRequest = () => {
    if (modalType === "approve") {
      // Approval backend
      alert(`Approve request with id ${currentRequestId}`);
    } else if (modalType === "reject") {
      // Reject backend
      alert(`Reject request with id ${currentRequestId}`);
    }
    handleClose();
  };

  return (
    <>
      {leaveRequestsAsMentor.length > 0 ? (
        <div>
          <div className="bg-white shadow-md p-4 rounded-lg mb-4">
            <h2 className="text-3xl uppercase tracking-wider text-center font-semibold">
              Leave Requests as Mentor
            </h2>
          </div>
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
                {leaveRequestsAsMentor.map((req) => {
                  const { status } = req.approvals.mentor;

                  return (
                    <TableRow key={req._id}>
                      <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">{req.name}</TableCell>
                      <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">{req.sectionName}</TableCell>
                      <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">{req.reason}</TableCell>
                      <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">{formatDate(req.fromDate)}</TableCell>
                      <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">{formatDate(req.toDate)}</TableCell>
                      <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">{req.noOfDays} days</TableCell>
                      <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide capitalize">{req.status}</TableCell>
                      <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                        {status === "pending" ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleRequest("approve", req._id)}
                              className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 min-w-[90px] rounded-lg transition-all duration-300"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRequest("reject", req._id)}
                              className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 min-w-[90px] rounded-lg transition-all duration-300"
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
                  {modalType === "approve" ? (
                    <SiTicktick className="mx-auto mb-4 h-14 w-14 text-green-400 dark:text-white" />
                  ) : modalType === "reject" ? (
                    <RxCrossCircled className="mx-auto mb-4 h-14 w-14 text-red-400 dark:text-white" />
                  ) : (
                    <MdOutlineDownloadDone className="mx-auto mb-4 h-14 w-14 text-linkedin-blue dark:text-white" />
                  )}

                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    {modalType === "approve"
                      ? "Are you sure you want to approve this request?"
                      : modalType === "reject"
                      ? "Are you sure you want to reject this request?"
                      : "This action has already been taken."}
                  </h3>
                  {modalType !== "taken" && (
                    <div className="flex justify-center gap-4">
                      <Button
                        color={modalType === "approve" ? "success" : "failure"}
                        onClick={confirmRequest}
                      >
                        <h1 className="text-white font-semibold">
                          Yes, {modalType === "approve" ? "Approve" : "Reject"}
                        </h1>
                      </Button>
                      <Button
                        className="bg-linkedin-blue"
                        onClick={handleClose}
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
      ) : (
        <div className="flex items-center justify-center h-screen">
          <h2 className="text-2xl uppercase tracking-wider text-center font-semibold">
            You are not currently handling any classes as a mentor
          </h2>
        </div>
      )}
    </>
  );
}
