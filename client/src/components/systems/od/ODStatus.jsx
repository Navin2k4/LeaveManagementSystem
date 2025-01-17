import { Modal, Select } from "flowbite-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ScaleLoader } from "react-spinners";
import {
  Calendar,
  Clock,
  Trash2,
  AlertCircle,
  MessageCircle,
  CheckCircle2,
  XCircle,
  History,
  Filter,
  FileText,
} from "lucide-react";
import StatusDot from "../../general/StatusDot";

const ODStatus = ({ ODRequests }) => {
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("pending");
  const [openModal, setOpenModal] = useState(false);
  const [deletingOD, setDeletingOD] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  if (!Array.isArray(ODRequests)) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500 dark:text-gray-400">
          No OD requests found.
        </p>
      </div>
    );
  }

  const filteredRequests = ODRequests.filter((request) => {
    const toDate = new Date(request.toDate);
    const today = new Date();
    switch (filter) {
      case "past7days":
        return toDate >= new Date(today.setDate(today.getDate() - 7));
      case "past1month":
        return toDate >= new Date(today.setMonth(today.getMonth() - 1));
      default:
        return true;
    }
  });

  const pendingRequests = filteredRequests.filter((request) => {
    return (
      (request.approvals.mentor.status === "pending" ||
        request.approvals.classIncharge.status === "pending") &&
      request.approvals.mentor.status !== "rejected" &&
      request.approvals.classIncharge.status !== "rejected"
    );
  });

  const approvedRequests = filteredRequests.filter((request) => {
    return (
      request.approvals.mentor.status === "rejected" ||
      request.approvals.classIncharge.status === "rejected" ||
      (request.approvals.mentor.status === "approved" &&
        request.approvals.classIncharge.status === "approved")
    );
  });

  const handleDeleteOD = async (id) => {
    setDeletingOD(true);
    try {
      const response = await fetch(`/api/deleteod/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting OD request:", error);
    } finally {
      setDeletingOD(false);
      setOpenModal(false);
    }
  };

  const ODRequestCard = ({ request, isPending }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border-b dark:border-gray-700">
        <div className="space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <Calendar size={16} />
            From Date
          </p>
          <p className="font-medium">
            {new Date(request.fromDate).toLocaleDateString()}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <Calendar size={16} />
            To Date
          </p>
          <p className="font-medium">
            {new Date(request.toDate).toLocaleDateString()}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <FileText size={16} />
            OD Type
          </p>
          <p className="font-medium">{request.odType}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Status:
          </span>
          <div className="flex-1">
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

      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {request.noOfDays} {request.noOfDays === 1 ? "day" : "days"}
            </span>
          </div>
          <span className="text-xs text-gray-400">
            Applied on {new Date(request.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="mt-4 space-y-3 grid grid-cols-2 gap-4">
          {request.mentorcomment !== "No Comments" && (
            <CommentBox
              title="Mentor Comment"
              comment={request.mentorcomment}
            />
          )}
          {request.classInchargeComment !== "No Comments" && (
            <CommentBox
              title="Class Incharge Comment"
              comment={request.classInchargeComment}
            />
          )}
        </div>

        <div className="flex justify-between items-center pt-2">
          <StatusBadge status={request.status} />
          {isPending && (
            <button
              onClick={() => {
                setSelectedRequest(request);
                setOpenModal(true);
              }}
              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-center gap-4 mb-6">
        <ViewToggleButton
          active={view === "pending"}
          onClick={() => setView("pending")}
          icon={<History size={18} />}
          text="Pending Requests"
        />
        <ViewToggleButton
          active={view === "approved"}
          onClick={() => setView("approved")}
          icon={<CheckCircle2 size={18} />}
          text="Completed Requests"
        />
      </div>

      <div className="flex items-center justify-end gap-3 mb-6">
        <Filter size={16} className="text-gray-400" />
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-40"
        >
          <option value="all">All Time</option>
          <option value="past7days">Past 7 Days</option>
          <option value="past1month">Past Month</option>
        </Select>
      </div>

      <div className="space-y-4">
        {view === "pending" ? (
          pendingRequests.length > 0 ? (
            pendingRequests.map((request) => (
              <ODRequestCard
                key={request._id}
                request={request}
                isPending={true}
              />
            ))
          ) : (
            <EmptyState text="No pending requests" />
          )
        ) : approvedRequests.length > 0 ? (
          approvedRequests.map((request) => (
            <ODRequestCard
              key={request._id}
              request={request}
              isPending={false}
            />
          ))
        ) : (
          <EmptyState text="No completed requests" />
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={() => handleDeleteOD(selectedRequest?._id)}
        isLoading={deletingOD}
      />
    </div>
  );
};

const ViewToggleButton = ({ active, onClick, icon, text }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
      active
        ? "bg-blue-200 text-black"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
  >
    {icon}
    <span className="font-medium">{text}</span>
  </button>
);

const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-yellow-50 text-yellow-600 border-yellow-200",
    approved: "bg-green-50 text-green-600 border-green-200",
    rejected: "bg-red-50 text-red-600 border-red-200",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const CommentBox = ({ title, comment }) => (
  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
    <div className="flex items-center gap-2 mb-1">
      <MessageCircle size={14} className="text-gray-400" />
      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
        {title}
      </p>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400">{comment}</p>
  </div>
);

const EmptyState = ({ text }) => (
  <div className="flex flex-col items-center justify-center py-8">
    <History size={48} className="text-gray-300 mb-2" />
    <p className="text-gray-500 dark:text-gray-400">{text}</p>
  </div>
);

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, isLoading }) => (
  <Modal show={isOpen} onClose={onClose} size="sm">
    <Modal.Header className="border-b border-gray-200 dark:border-gray-700">
      Delete OD Request
    </Modal.Header>
    <Modal.Body>
      <div className="flex items-center gap-3 text-gray-600">
        <AlertCircle size={20} className="text-red-500" />
        <p>Are you sure you want to delete this OD request?</p>
      </div>
    </Modal.Body>
    <Modal.Footer>
      <button
        onClick={onConfirm}
        disabled={isLoading}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
      >
        {isLoading ? (
          <ScaleLoader color="white" height={15} />
        ) : (
          "Delete Request"
        )}
      </button>
      <button
        onClick={onClose}
        className="px-4 py-2 text-gray-500 hover:text-gray-700"
      >
        Cancel
      </button>
    </Modal.Footer>
  </Modal>
);

export default ODStatus;
