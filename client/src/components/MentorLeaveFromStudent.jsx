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
} from "flowbite-react";
import { SiTicktick } from "react-icons/si";
import { RxCrossCircled } from "react-icons/rx";
import { MdOutlineDownloadDone } from "react-icons/md";
import { useSelector } from "react-redux";

// TODO: Make a Loading Screen when fetching the data from the DB
// TOFIX:Refresh on Update

export default function MentorLeaveFromStudent({ leaveRequestsAsMentor }) {
  const [modalType, setModalType] = useState(null); // 'approve', 'reject', or 'taken'
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState(leaveRequestsAsMentor);
  const [isFetching, setIsFetching] = useState(false);
console.log(requests);
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleRequest = (type, id) => {
    setModalType(type);
    setCurrentRequestId(id);
  };

  const { currentUser } = useSelector((state) => state.user);

  const handleClose = () => {
    setModalType(null);
    setCurrentRequestId(null);
  };

  const fetchLeaveRequests = async () => {
    setIsFetching(true);
    try {
      const response = await fetch(
        `/api/getleaverequestbymentorid/${currentUser.userId}`
      );
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const confirmRequest = async () => {
    setLoading(true);
    try {
      const backendUrl = `/api/leave-requestsbymentorid/${currentRequestId}/status`;
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: modalType }),
      });

      if (response.ok) {
        await fetchLeaveRequests(); // Refetch requests after updating
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
    <>
      {isFetching ? (
        <div className="flex justify-center items-center">
          <Spinner size="xl"
          color="purple" />
        </div>
      ) : requests.length > 0 ? (
        <div>
          <div className="bg-white shadow-md p-4 rounded-lg mb-4">
            <h2 className="text-xl md:text-3xl uppercase tracking-wider text-center font-semibold">
              Leave Requests as Mentor
            </h2>
          </div>
          <div className="overflow-x-auto">
            <Table className="bg-white rounded-md">
              <TableHead>
                <TableHeadCell className="p-4 bg-secondary-blue text-center text-white">
                  Student Name
                </TableHeadCell>
                <TableHeadCell className="p-4 bg-secondary-blue text-center text-white">
                  Section
                </TableHeadCell>
                <TableHeadCell className="p-4 bg-secondary-blue text-center text-white">
                  Reason
                </TableHeadCell>
                <TableHeadCell className="p-4 bg-secondary-blue text-center text-white">
                  Start Date
                </TableHeadCell>
                <TableHeadCell className="p-4 bg-secondary-blue text-center text-white">
                  End Date
                </TableHeadCell>
                <TableHeadCell className="p-4 bg-secondary-blue text-center text-white">
                  Duration
                </TableHeadCell>
                <TableHeadCell className="p-4 bg-secondary-blue text-center text-white">
                  Status
                </TableHeadCell>
                <TableHeadCell className="p-4 bg-secondary-blue text-center text-white">
                  Actions
                </TableHeadCell>
              </TableHead>
              <TableBody className="divide-y">
                {requests.map((req) => {
                  const { status } = req.approvals.mentor;

                  return (
                    <TableRow key={req._id}>
                      <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                        {req.name}
                      </TableCell>
                      <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                        {req.section_name}
                      </TableCell>
                      <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                        {req.reason}
                      </TableCell>
                      <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                        {formatDate(req.fromDate)}
                      </TableCell>
                      <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                        {formatDate(req.toDate)}
                      </TableCell>
                      <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                        {req.noOfDays} days
                      </TableCell>
                      <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide capitalize">
                        {req.status}
                      </TableCell>
                      <TableCell className="border border-gray-400/20 p-4 text-black font-semibold sm:tracking-normal lg:tracking-wide">
                        {status === "pending" ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleRequest("approved", req._id)}
                              className="bg-green-400 hover:bg-green-600 text-white py-1 px-3 min-w-[90px] rounded-lg transition-all duration-300"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRequest("rejected", req._id)}
                              className="bg-red-400 hover:bg-red-600 text-white py-1 px-3 min-w-[90px] rounded-lg transition-all duration-300"
                            >
                              Reject
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
                    <MdOutlineDownloadDone className="mx-auto mb-4 h-14 w-14 text-secondary-blue dark:text-white" />
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
          No Leave Requests as Mentor
        </div>
      )}
    </>
  );
}
