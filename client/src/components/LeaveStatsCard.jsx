import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { parseISO, format, isValid} from "date-fns";


const LeaveStatsCard = ({ leaveRequestsAsMentor, leaveRequestsAsClassIncharge }) => {
  const [mentorRequests, setMentorRequests] = useState([]);
  const [classInchargeRequests, setClassInchargeRequests] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [recentLeaveRequests, setRecentLeaveRequests] = useState([]);

  useEffect(() => {
    if (leaveRequestsAsMentor) {
      setMentorRequests(leaveRequestsAsMentor);
    }
    if (leaveRequestsAsClassIncharge) {
      setClassInchargeRequests(leaveRequestsAsClassIncharge);
    }
    fetchRecentLeaveRequests();
  }, [leaveRequestsAsMentor, leaveRequestsAsClassIncharge]);

  console.log(mentorRequests)
  const fetchRecentLeaveRequests = () => {
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const recentRequests = [
      ...leaveRequestsAsMentor,
      ...leaveRequestsAsClassIncharge
    ].filter(request => new Date(request.date) >= oneMonthAgo);
    setRecentLeaveRequests(recentRequests);
  };

  const countRequestsByMentorStatus = (requests, status) => {
    return requests.filter(request => request.approvals.mentor.status === status).length;
  };

  const countRequestsByClassInchargeStatus = (requests, status) => {
    return requests.filter(request => request.approvals.classIncharge.status === status).length;
  };

  const totalRequestsByMentor = mentorRequests.length;
  const pendingRequestsByMentor = countRequestsByMentorStatus(mentorRequests, "pending");
  const approvedRequestsByMentor = countRequestsByMentorStatus(mentorRequests, "approved");
  const rejectedRequestsByMentor = countRequestsByMentorStatus(mentorRequests, "rejected");

  const totalRequestsByClassIncharge = classInchargeRequests.length;
  const pendingRequestsByClassIncharge = countRequestsByClassInchargeStatus(classInchargeRequests, "pending");
  const approvedRequestsByClassIncharge = countRequestsByClassInchargeStatus(classInchargeRequests, "approved");
  const rejectedRequestsByClassIncharge = countRequestsByClassInchargeStatus(classInchargeRequests, "rejected");

  const formatDate = (date) => {
    const parsedDate = parseISO(date);
    return isValid(parsedDate) ? format(parsedDate, "dd/MM/yyyy") : "Invalid Date";
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Recent Leave Requests (Past Month)", 14, 20);
    doc.autoTable({
      head: [["S.No","Student Name","Section", "Reason","No.Of.Days", "From Date", "To Date", "Status"]],
      body: leaveRequestsAsMentor.map((request,index) => [
        index+1,
        request.name,
        request.sectionName,
        request.reason,
        request.noOfDays,
        formatDate(request.fromDate),
        formatDate(request.toDate),
        request.status  
      ])
    });
    doc.save("recent_leave_requests.pdf");
  };

  const downloadExcel = () => {
    const formattedRequests = leaveRequestsAsMentor.map((request,index) => ({
      "S.No":index+1,
      "Student Name": request.name,
      "Section": request.sectionName,
      "Reason": request.reason,
      "No.Of.Days": request.noOfDays,
      "From Date": formatDate(request.fromDate),
      "To Date": formatDate(request.toDate),
      "Status": request.status
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(formattedRequests);
  
    const header = ["S.No","Student Name", "Section", "Reason", "No.of.Days","From Date","To Date", "Status"];
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
      { wch: 20 }
    ];

    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[cell_address]) continue;
      worksheet[cell_address].s = {
        font: {
          bold: true,
          color: { rgb: "FFFFFF" }
        },
        fill: {
          fgColor: { rgb: "000000" }
        },
        alignment: {
          horizontal: "center",
          vertical: "center"
        }
      };
    }
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Recent Leave Requests");
    XLSX.writeFile(workbook, "recent_leave_requests.xlsx");
  };
  
  return (
    <div className="bg-white shadow-md p-4 rounded-lg">
      <div>      
        <h2 className="text-3xl uppercase tracking-wider text-center font-semibold mb-8">
        Leave Statistics
        </h2>
      
      <div className="mb-8 ">
        <h1 className="text-black font-semibold">Today: {new Date().toLocaleDateString()}</h1>
        <br />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentUser.isMentor && (
            <div className="bg-primary-blue shadow-lg p-4 rounded-lg hover:-translate-y-2 duration-500 transition-all">
              <h1 className="my-2 text-lg font-semibold text-white p-3 bg-blue-500 rounded-lg">As a Mentor</h1>
              <div className="my-2 text-lg font-semibold">
                <span className="text-white">Total Requests: {totalRequestsByMentor}</span>
              </div>
              <div className="mb-2 ">
                <span className="font-semibold text-white">Pending: {pendingRequestsByMentor}</span>
              </div>
              <div className="mb-2 ">
                <span className="font-semibold text-white">Approved: {approvedRequestsByMentor}</span>
              </div>
              <div className="mb-2 ">
                <span className="font-semibold text-white">Rejected: {rejectedRequestsByMentor}</span>
              </div>
            </div>
          )}
          {currentUser.isClassIncharge && (
            <div className="bg-primary-blue shadow-lg p-4 rounded-lg hover:-translate-y-2 duration-500 transition-all">
              <h1 className="my-2 text-lg font-semibold text-white p-3 bg-blue-500 rounded-lg">As a ClassIncharge</h1>
              <div className="my-2 text-lg font-semibold">
                <span className="text-white">Total Requests: {totalRequestsByClassIncharge}</span>
              </div>
              <div className="mb-2 ">
                <span className="font-semibold text-white">Pending: {pendingRequestsByClassIncharge}</span>
              </div>
              <div className="mb-2 ">
                <span className="font-semibold text-white">Approved: {approvedRequestsByClassIncharge}</span>
              </div>
              <div className="mb-2 ">
                <span className="font-semibold text-white">Rejected: {rejectedRequestsByClassIncharge}</span>
              </div>
            </div>
            
          )}
        </div>
      </div>
      </div>
      
    <h2 className="text-xl font-semibold mb-4">Recent Leave Requests (Past Month)</h2>

    <div className="bg-white shadow-md p-4 rounded-lg overflow-x-auto">
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
            <td className="py-2 px-4 border">{index+1}</td>
            <td className="py-2 px-4 border">{request.name}</td>
            <td className="py-2 px-4 border">{request.sectionName}</td>
            <td className="py-2 px-4 border">{request.reason}</td>
            <td className="py-2 px-4 border">{new Date(request.fromDate).toLocaleDateString()}</td>
            <td className="py-2 px-4 border">{new Date(request.toDate).toLocaleDateString()}</td>
            <td className="py-2 px-4 border">{request.approvals.mentor.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="flex justify-end mt-4">
      <button
        onClick={downloadPDF}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg mr-2"
      >
        Download as PDF
      </button>
      <button
        onClick={downloadExcel}
        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
      >
        Download as Excel
      </button>
    </div>
  </div>
  </div>
    
  );
};

export default LeaveStatsCard;