import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { parseISO, format, isValid } from "date-fns";
import { TbFileTypePdf } from "react-icons/tb";
import { RiFileExcel2Line } from "react-icons/ri";
import { IoIosCloseCircleOutline } from "react-icons/io";

const LeaveStatsCard = ({
  leaveRequestsAsMentor,
  leaveRequestsAsClassIncharge,
}) => {
  const [mentorRequests, setMentorRequests] = useState([]);
  const [classInchargeRequests, setClassInchargeRequests] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [recentLeaveRequests, setRecentLeaveRequests] = useState([]);
  const [mentorStats, setMentorStats] = useState(false);
  const [classInchargeStats, setClassInchargeStats] = useState(false);

  console.log(mentorRequests);

  useEffect(() => {
    if (leaveRequestsAsMentor) {
      setMentorRequests(leaveRequestsAsMentor);
    }
    if (leaveRequestsAsClassIncharge) {
      setClassInchargeRequests(leaveRequestsAsClassIncharge);
    }
    fetchRecentLeaveRequests();
  }, [leaveRequestsAsMentor, leaveRequestsAsClassIncharge]);

  const handlementorStats = () => {
    setMentorStats(true);
    setClassInchargeStats(false);
  };

  const handleClassInchargeStats = () => {
    setClassInchargeStats(true);
    setMentorStats(false);
  };

  const handleCloseButton = () => {
    setMentorStats(false);
    setClassInchargeStats(false);
  };

  const fetchRecentLeaveRequests = () => {
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const recentRequests = [
      ...leaveRequestsAsMentor,
      ...leaveRequestsAsClassIncharge,
    ].filter((request) => new Date(request.date) >= oneMonthAgo);
    setRecentLeaveRequests(recentRequests);
  };

  const countRequestsByMentorStatus = (requests, status) => {
    return requests.filter(
      (request) => request.approvals.mentor.status === status
    ).length;
  };

  const countRequestsByClassInchargeStatus = (requests, status) => {
    return requests.filter(
      (request) => request.approvals.classIncharge.status === status
    ).length;
  };

  const totalRequestsByMentor = mentorRequests.length;
  const pendingRequestsByMentor = countRequestsByMentorStatus(
    mentorRequests,
    "pending"
  );
  const approvedRequestsByMentor = countRequestsByMentorStatus(
    mentorRequests,
    "approved"
  );
  const rejectedRequestsByMentor = countRequestsByMentorStatus(
    mentorRequests,
    "rejected"
  );

  const totalRequestsByClassIncharge = classInchargeRequests.length;
  const pendingRequestsByClassIncharge = countRequestsByClassInchargeStatus(
    classInchargeRequests,
    "pending"
  );
  const approvedRequestsByClassIncharge = countRequestsByClassInchargeStatus(
    classInchargeRequests,
    "approved"
  );
  const rejectedRequestsByClassIncharge = countRequestsByClassInchargeStatus(
    classInchargeRequests,
    "rejected"
  );

  const formatDate = (date) => {
    const parsedDate = parseISO(date);
    return isValid(parsedDate)
      ? format(parsedDate, "dd/MM/yyyy")
      : "Invalid Date";
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Recent Leave Requests (Past Month)", 14, 20);
    doc.autoTable({
      head: [
        [
          "S.No",
          "Student Name",
          "Section",
          "Reason",
          "No.Of.Days",
          "From Date",
          "To Date",
          "Status",
        ],
      ],
      body: leaveRequestsAsMentor.map((request, index) => [
        index + 1,
        request.name,
        request.section_name,
        request.reason,
        request.noOfDays,
        formatDate(request.fromDate),
        formatDate(request.toDate),
        request.status,
      ]),
    });
    doc.save("recent_leave_requests.pdf");
  };

  const downloadExcel = () => {
    const formattedRequests = leaveRequestsAsMentor.map((request, index) => ({
      "S.No": index + 1,
      "Student Name": request.name,
      Section: request.section_name,
      Reason: request.reason,
      "No.Of.Days": request.noOfDays,
      "From Date": formatDate(request.fromDate),
      "To Date": formatDate(request.toDate),
      Status: request.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedRequests);

    const header = [
      "S.No",
      "Student Name",
      "Section",
      "Reason",
      "No.of.Days",
      "From Date",
      "To Date",
      "Status",
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: "A1" });
    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    worksheet["!cols"] = [
      { wch: 5 },
      { wch: 30 },
      { wch: 15 },
      { wch: 30 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
    ];

    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[cell_address]) continue;
      worksheet[cell_address].s = {
        font: {
          bold: true,
          color: { rgb: "FFFFFF" },
        },
        fill: {
          fgColor: { rgb: "000000" },
        },
        alignment: {
          horizontal: "center",
          vertical: "center",
        },
      };
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Recent Leave Requests");
    XLSX.writeFile(workbook, "recent_leave_requests.xlsx");
  };

  return (
    <div>
      <div className="bg-white shadow-md p-4 rounded-lg">
        <div className="">
          <h2 className="text-3xl uppercase tracking-wider text-center font-semibold mb-8">
            Leave Statistics
          </h2>

          <div className="mb-8 ">
            <br />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
              {currentUser.isMentor && (
                <div>
                  <div className="bg-primary-blue shadow-lg p-4 rounded-lg hover:-translate-y-2 duration-500 transition-all">
                    <h1 className="my-2  mb-4 text-lg text-center font-semibold text-white p-3 bg-blue-500 rounded-lg">
                      As a Mentor
                    </h1>
                    <div className="my-2 text-lg font-semibold">
                      <span className="text-white">
                        Total Requests: {totalRequestsByMentor}
                      </span>
                    </div>
                    <div className="mb-2 ">
                      <span className="font-semibold text-white">
                        Pending: {pendingRequestsByMentor}
                      </span>
                    </div>
                    <div className="mb-2 ">
                      <span className="font-semibold text-white">
                        Approved: {approvedRequestsByMentor}
                      </span>
                    </div>
                    <div className="mb-2 ">
                      <span className="font-semibold text-white">
                        Rejected: {rejectedRequestsByMentor}
                      </span>
                    </div>
                    <div className="flex items-center justify-center">
                      <button
                        className="text-white  px-3 py-2  rounded-md bg-secondary-blue border border-ternary-blue hover:bg-blue-500 transition-all duration-300"
                        onClick={handlementorStats}
                      >
                        Show Stats of Leave For This Month
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {currentUser.isClassIncharge && (
                <div>
                  <div className="bg-primary-blue shadow-lg p-4 rounded-lg hover:-translate-y-2 duration-500 transition-all">
                    <h1 className="my-2 mb-4 text-lg font-semibold text-center text-white p-3 bg-blue-500 rounded-lg">
                      As a ClassIncharge
                    </h1>
                    <div className="my-2 text-lg font-semibold">
                      <span className="text-white">
                        Total Requests: {totalRequestsByClassIncharge}
                      </span>
                    </div>
                    <div className="mb-2 ">
                      <span className="font-semibold text-white">
                        Pending: {pendingRequestsByClassIncharge}
                      </span>
                    </div>
                    <div className="mb-2 ">
                      <span className="font-semibold text-white">
                        Approved: {approvedRequestsByClassIncharge}
                      </span>
                    </div>
                    <div className="mb-2 ">
                      <span className="font-semibold text-white">
                        Rejected: {rejectedRequestsByClassIncharge}
                      </span>
                    </div>
                    <div className="flex items-center justify-center">
                      <button
                        className="text-white px-3 py-2 rounded-md bg-secondary-blue border border-ternary-blue hover:bg-blue-500 transition-all duration-300"
                        onClick={handleClassInchargeStats}
                      >
                        Show Stats of Leave For This Month
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div>
        {mentorStats && (
          <div className=" bg-white shadow-md p-4 rounded-lg mt-2">
            <div className="relative bg-white shadow-md p-4 rounded-lg overflow-x-auto">
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold mb-4">
                  This Month Stats: (As a Mentor)
                </h2>
                <button
                  className="md:bg-gray-500 bg-transparent md:hover:bg-gray-600 text-white font-semibold rounded-lg py-1 px-2 md:px-6 "
                  onClick={handleCloseButton}
                >
                  <div className="flex gap-3 items-center justify-center">
                  <span className="hidden sm:inline text-white">Close</span>
                  <IoIosCloseCircleOutline size={20} />
                  </div>
                  {/* <span className="absolute top-3 right-4 sm:hidden">
                    <svg
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="0"
                      viewBox="0 0 24 24"
                      height="4em"
                      width="2em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.3394 9.32245C16.7434 8.94589 16.7657 8.31312 16.3891 7.90911C16.0126 7.50509 15.3798 7.48283 14.9758 7.85938L12.0497 10.5866L9.32245 7.66048C8.94589 7.25647 8.31312 7.23421 7.90911 7.61076C7.50509 7.98731 7.48283 8.62008 7.85938 9.0241L10.5866 11.9502L7.66048 14.6775C7.25647 15.054 7.23421 15.6868 7.61076 16.0908C7.98731 16.4948 8.62008 16.5171 9.0241 16.1405L11.9502 13.4133L14.6775 16.3394C15.054 16.7434 15.6868 16.7657 16.0908 16.3891C16.4948 16.0126 16.5171 15.3798 16.1405 14.9758L13.4133 12.0497L16.3394 9.32245Z"
                        fill="currentColor"
                      ></path>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </span> */}
                </button>
              </div>
              <br />
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border overflow-x-auto">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border">S.No</th>
                      <th className="py-2 px-4 border">Student Name</th>
                      <th className="py-2 px-4 border">Section</th>
                      <th className="py-2 px-4 border">Reason</th>
                      <th className="py-2 px-4 border">From Date</th>
                      <th className="py-2 px-4 border">To Date</th>
                      <th className="py-2 px-4 border">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRequestsAsMentor.map((request, index) => (
                      <tr key={index} className="font-semibold">
                        <td className="py-2 px-4 border">{index + 1}</td>
                        <td className="py-2 px-4 border">{request.name}</td>
                        <td className="py-2 px-4 border">
                          {request.section_name}
                        </td>
                        <td className="py-2 px-4 border">{request.reason}</td>
                        <td className="py-2 px-4 border">
                          {new Date(request.fromDate).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4 border">
                          {new Date(request.toDate).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4 border">
                          {request.approvals.mentor.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={downloadPDF}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg mr-2"
                >
                  <div className="flex items-center justify-center gap-2">
                    <TbFileTypePdf size={20} />
                    Download as PDF
                  </div>
                </button>
                <button
                  onClick={downloadExcel}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  <div className="flex items-center justify-center gap-2">
                    <RiFileExcel2Line size={20} />
                    Download as Excel
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
        {classInchargeStats && (
          <div className=" bg-white shadow-md p-4 rounded-lg mt-2">
            <div className="relative bg-white shadow-md p-4 rounded-lg ">
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold mb-4">
                  This Month Stats: (As a ClassIncharge)
                </h2>
                <button
                  className="md:bg-gray-500 bg-transparent md:hover:bg-gray-600 text-white font-semibold rounded-lg py-1 px-2 md:px-6 "
                  onClick={handleCloseButton}
                >
                  <div className="flex gap-3 items-center justify-center">
                  <span className="hidden sm:inline text-white">Close</span>
                  <IoIosCloseCircleOutline size={20} />
                  </div>                  
                  {/* <span className="absolute top-3 right-4 sm:hidden">
                    <svg
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="0"
                      viewBox="0 0 24 24"
                      height="4em"
                      width="2em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.3394 9.32245C16.7434 8.94589 16.7657 8.31312 16.3891 7.90911C16.0126 7.50509 15.3798 7.48283 14.9758 7.85938L12.0497 10.5866L9.32245 7.66048C8.94589 7.25647 8.31312 7.23421 7.90911 7.61076C7.50509 7.98731 7.48283 8.62008 7.85938 9.0241L10.5866 11.9502L7.66048 14.6775C7.25647 15.054 7.23421 15.6868 7.61076 16.0908C7.98731 16.4948 8.62008 16.5171 9.0241 16.1405L11.9502 13.4133L14.6775 16.3394C15.054 16.7434 15.6868 16.7657 16.0908 16.3891C16.4948 16.0126 16.5171 15.3798 16.1405 14.9758L13.4133 12.0497L16.3394 9.32245Z"
                        fill="currentColor"
                      ></path>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </span> */}
                </button>
              </div>
              <br />
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border">S.No</th>
                      <th className="py-2 px-4 border">Student Name</th>
                      <th className="py-2 px-4 border">Section</th>
                      <th className="py-2 px-4 border">Reason</th>
                      <th className="py-2 px-4 border">From Date</th>
                      <th className="py-2 px-4 border">To Date</th>
                      <th className="py-2 px-4 border">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRequestsAsMentor.map((request, index) => (
                      <tr key={index} className="font-semibold">
                        <td className="py-2 px-4 border">{index + 1}</td>
                        <td className="py-2 px-4 border">{request.name}</td>
                        <td className="py-2 px-4 border">
                          {request.section_name}
                        </td>
                        <td className="py-2 px-4 border">{request.reason}</td>
                        <td className="py-2 px-4 border">
                          {new Date(request.fromDate).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4 border">
                          {new Date(request.toDate).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4 border">
                          {request.approvals.mentor.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={downloadPDF}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg mr-2"
                >
                  <div className="flex items-center justify-center gap-2">
                    <TbFileTypePdf size={20} />
                    Download as PDF
                  </div>
                </button>
                <button
                  onClick={downloadExcel}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  <div className="flex items-center justify-center gap-2">
                    <RiFileExcel2Line size={20} />
                    Download as Excel
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveStatsCard;
