import axios from "axios";
import React, { useEffect, useState } from "react";
import { formatDate } from "../../utils/formatDate";
import { ChevronLeft, ChevronRight, Calendar, Download } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const HODGenerativeSummary = ({ currentUser }) => {
  const [summaryData, setSummaryData] = useState({
    leaveRequests: [],
    odRequests: [],
    defaulters: [],
    loading: true,
    error: null,
  });

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const navigateDate = (direction) => {
    const currentDate = new Date(selectedDate);
    const newDate = new Date(currentDate);

    if (direction === "prev") {
      newDate.setDate(currentDate.getDate() - 1);
    } else if (direction === "next") {
      newDate.setDate(currentDate.getDate() + 1);
    }

    setSelectedDate(newDate.toISOString().split("T")[0]);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?.departmentId) return;

      try {
        const [leaveRes, odRes, defaultersRes] = await Promise.all([
          axios.get(
            `/api/department/${currentUser.departmentId}/leaveRequests`
          ),
          axios.get(`/api/department/${currentUser.departmentId}/odRequests`),
          axios.get(`/api/department/${currentUser.departmentId}/defaulters`),
        ]);

        setSummaryData({
          leaveRequests: leaveRes.data || [],
          odRequests: odRes.data || [],
          defaulters: defaultersRes.data || [],
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setSummaryData((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to fetch data",
        }));
      }
    };

    fetchData();
  }, [currentUser?.departmentId, selectedDate]);

  if (summaryData.loading) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-400">
        Loading department summary...
      </div>
    );
  }

  if (summaryData.error) {
    return (
      <div className="text-center text-red-600 dark:text-red-400">
        {summaryData.error}
      </div>
    );
  }

  // Helper function to get start and end of day in UTC
  const getDateBounds = (dateString) => {
    const date = new Date(dateString + "T00:00:00");

    // Start of day - set to midnight (00:00:00)
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    // End of day - set to last millisecond of the day (23:59:59.999)
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return { startOfDay, endOfDay };
  };

  // Filter requests for selected date based on createdAt
  const todayRequests = summaryData.leaveRequests.filter((request) => {
    const { startOfDay, endOfDay } = getDateBounds(selectedDate);
    const createdAt = new Date(request.createdAt);
    return createdAt >= startOfDay && createdAt <= endOfDay;
  });

  const todayODRequests = summaryData.odRequests.filter((request) => {
    const { startOfDay, endOfDay } = getDateBounds(selectedDate);
    const createdAt = new Date(request.createdAt);

    return createdAt >= startOfDay && createdAt <= endOfDay;
  });

  // Format time to show in local timezone
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper function to group requests by batch and section
  const groupRequestsByBatchAndSection = (requests) => {
    return requests.reduce((acc, request) => {
      // Get batch and section info from the populated data
      const batchName = request.sectionId?.Batch?.batch_name || "Unknown Batch";
      const sectionName = request.sectionId?.section_name || "Unknown Section";
      const key = `${batchName}-${sectionName}`;

      if (!acc[key]) {
        acc[key] = {
          batchName,
          sectionName,
          requests: [],
        };
      }
      acc[key].requests.push(request);
      return acc;
    }, {});
  };

  const renderRequestsTable = (requests, type) => {
    const groupedRequests = groupRequestsByBatchAndSection(requests);

    // Sort groups by batch name and section name
    const sortedGroups = Object.values(groupedRequests).sort((a, b) => {
      if (a.batchName === b.batchName) {
        return a.sectionName.localeCompare(b.sectionName);
      }
      return a.batchName.localeCompare(b.batchName);
    });

    return sortedGroups.map((group, index) => (
      <div key={index} className="mb-4 last:mb-0">
        <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {group.batchName}
            </span>
            <span className="text-gray-400 dark:text-gray-500">•</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {group.sectionName}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {group.requests.length} {type === "leave" ? "Leave" : "OD"} Request
            {group.requests.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {group.requests.map((request, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium">{request.name}</div>
                    <div className="text-xs text-gray-500">
                      {request.regNo || request.rollNo}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      {type === "leave" ? request.reason : request.purpose}
                      {type === "leave" && request.forMedical && (
                        <span className="ml-2 text-xs text-red-500">
                          (Medical)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    {formatDate(request.fromDate)} -{" "}
                    {formatDate(request.toDate)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        request.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : request.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {request.status?.charAt(0).toUpperCase() +
                        request.status?.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ));
  };

  // Add this function to generate the report
  const downloadDayReport = () => {
    // Filter approved requests and active defaulters
    const approvedLeaves = todayRequests.filter(
      (req) => req.status === "approved"
    );
    const approvedOD = todayODRequests.filter(
      (req) => req.status === "approved"
    );
    const activeDefaulters = summaryData.defaulters.filter(
      (def) => !def.isDone
    );

    // Create PDF document
    const doc = new jsPDF();

    // Add college header
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(
      "VELAMMAL COLLEGE OF ENGINEERING AND TECHNOLOGY",
      doc.internal.pageSize.width / 2,
      15,
      { align: "center" }
    );
    doc.setFontSize(12);
    doc.text("An Autonomous Institution", doc.internal.pageSize.width / 2, 22, {
      align: "center",
    });
    doc.setFontSize(11);
    doc.text(
      "Madurai - Rameshwaram Highway, Madurai - 625009",
      doc.internal.pageSize.width / 2,
      29,
      { align: "center" }
    );

    // Add report title
    doc.setFontSize(12);
    doc.text(`Computer Science and Engineering Department`, 15, 42);
    doc.text(`Date: ${formatDisplayDate(selectedDate)}`, 15, 49);
    doc.text("Daily Department Report", doc.internal.pageSize.width / 2, 56, {
      align: "center",
    });

    let currentY = 71;

    // Leave Requests Table
    if (approvedLeaves.length > 0) {
      doc.setFontSize(11);
      doc.text("Approved Leave Requests:", 15, currentY - 5);

      doc.autoTable({
        startY: currentY,
        head: [
          [
            "S.No",
            "Name",
            "Register No",
            "Batch",
            "Section",
            "Reason",
            "Duration",
            "Type",
          ],
        ],
        body: approvedLeaves.map((req, index) => [
          index + 1,
          req.name,
          req.regNo || req.rollNo,
          req.sectionId?.Batch?.batch_name || "Unknown",
          req.sectionId?.section_name || "Unknown",
          req.reason,
          `${formatDate(req.fromDate)} - ${formatDate(req.toDate)}`,
          req.forMedical ? "Medical Leave" : "Regular Leave",
        ]),
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [71, 85, 105] },
      });
      currentY = doc.previousAutoTable.finalY + 15;
    }

    // OD Requests Table
    if (approvedOD.length > 0) {
      doc.setFontSize(11);
      doc.text("Approved OD Requests:", 15, currentY - 5);

      doc.autoTable({
        startY: currentY,
        head: [
          [
            "S.No",
            "Name",
            "Register No",
            "Batch",
            "Section",
            "Purpose",
            "Duration",
            "Type",
          ],
        ],
        body: approvedOD.map((req, index) => [
          index + 1,
          req.name,
          req.regNo || req.rollNo,
          req.sectionId?.Batch?.batch_name || "Unknown",
          req.sectionId?.section_name || "Unknown",
          req.purpose,
          `${formatDate(req.fromDate)} - ${formatDate(req.toDate)}`,
          req.odType,
        ]),
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [71, 85, 105] },
      });
      currentY = doc.previousAutoTable.finalY + 15;
    }

    // Defaulters Table
    if (activeDefaulters.length > 0) {
      doc.setFontSize(11);
      doc.text("Active Defaulters:", 15, currentY - 5);

      doc.autoTable({
        startY: currentY,
        head: [
          [
            "S.No",
            "Name",
            "Register No",
            "Batch",
            "Section",
            "Type",
            "Reason",
            "Entry Date",
          ],
        ],
        body: activeDefaulters.map((defaulter, index) => [
          index + 1,
          defaulter.name,
          defaulter.roll_no,
          defaulter.batchName || "Unknown",
          defaulter.sectionName || "Unknown",
          defaulter.defaulterType,
          defaulter.remarks || defaulter.observation || "N/A",
          formatDate(defaulter.entryDate),
        ]),
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [71, 85, 105] },
      });
      currentY = doc.previousAutoTable.finalY + 15;
    }

    // Add summary
    doc.setFontSize(10);
    doc.text(
      `Total Approved Leave Requests: ${approvedLeaves.length}`,
      15,
      currentY
    );
    doc.text(
      `Total Approved OD Requests: ${approvedOD.length}`,
      15,
      currentY + 7
    );
    doc.text(
      `Total Active Defaulters: ${activeDefaulters.length}`,
      15,
      currentY + 14
    );

    // Add footer
    doc.setFontSize(8);
    doc.text(
      "Generated on: " + new Date().toLocaleString(),
      15,
      doc.internal.pageSize.height - 10
    );
    doc.text(
      "Page 1 of 1",
      doc.internal.pageSize.width - 25,
      doc.internal.pageSize.height - 10
    );

    // Save the PDF
    doc.save(`department_report_${selectedDate}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Compact Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold">Department Summary</h2>
            <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700/50 rounded-md p-1">
              <button
                onClick={() => navigateDate("prev")}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent border-none text-sm w-32 p-0 focus:ring-0"
              />
              <button
                onClick={() => navigateDate("next")}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
              Leaves: {todayRequests.length}
            </span>
            <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full">
              OD: {todayODRequests.length}
            </span>
            <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full">
              Defaulters: {summaryData.defaulters.length}
            </span>
            <button
              onClick={downloadDayReport}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
              title="Download approved requests report"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Requests Sections */}
      <div className="space-y-6">
        {/* Leave Requests */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-base font-semibold">Leave Requests</h3>
          </div>
          {todayRequests.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              No leave requests for {formatDisplayDate(selectedDate)}
            </div>
          ) : (
            renderRequestsTable(todayRequests, "leave")
          )}
        </div>

        {/* OD Requests */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-base font-semibold">OD Requests</h3>
          </div>
          {todayODRequests.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              No OD requests for {formatDisplayDate(selectedDate)}
            </div>
          ) : (
            renderRequestsTable(todayODRequests, "od")
          )}
        </div>
      </div>
    </div>
  );
};

export default HODGenerativeSummary;
