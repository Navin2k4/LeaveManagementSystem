import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
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
    setModalType(type);
    setCurrentRequestId(id);
  };

  const handleClose = () => {
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
          {leaveRequestsAsMentor.map((req) => {
            const { status } = req.approvals.classIncharge;

            return (
              <tr key={req._id} className="text-center">
                <td className="border px-4 py-2">{req.name}</td>
                <td className="border px-4 py-2">{req.sectionName}</td>
                <td className="border px-4 py-2">{req.reason}</td>
                <td className="border px-4 py-2">{formatDate(req.fromDate)}</td>
                <td className="border px-4 py-2">{formatDate(req.toDate)}</td>
                <td className="border px-4 py-2">{req.noOfDays} days</td>
                <td className="border px-4 py-2">{req.status}</td>
                <td className="border py-2">
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Modal show={modalType !== null} size="md" onClose={handleClose} popup>
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
                <Button className="bg-linkedin-blue" onClick={handleClose}>
                  <h1 className="text-white">Cancel</h1>
                </Button>
              </div>
            )}
            {modalType === "taken" && (
              <div className="flex justify-center gap-4">
                <Button className="bg-linkedin-blue" onClick={handleClose}>
                  <h1 className="text-white">Close</h1>
                </Button>
              </div>
            )}
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
