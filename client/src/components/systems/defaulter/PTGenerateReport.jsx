import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

export default function PTGenerateReport() {
  const [defaulterType, setDefaulterType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [mentorFilter, setMentorFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const navigate = useNavigate();

  // Filter the data based on the filter criteria
  useEffect(() => {
    const filterData = () => {
      let filtered = reportData;
      if (mentorFilter) {
        filtered = filtered.filter((item) =>
          item.mentorName?.toLowerCase().includes(mentorFilter.toLowerCase())
        );
      }
      if (departmentFilter) {
        filtered = filtered.filter((item) =>
          item.departmentName
            ?.toLowerCase()
            .includes(departmentFilter.toLowerCase())
        );
      }
      if (sectionFilter) {
        filtered = filtered.filter((item) =>
          item.section_name?.toLowerCase().includes(sectionFilter.toLowerCase())
        );
      }
      setFilteredData(filtered);
    };
    filterData();
  }, [reportData, mentorFilter, departmentFilter, sectionFilter]);

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const apiUrl = `http://localhost:3000/api/defaulter/getDefaulterReport/${defaulterType}/${fromDate}/${toDate}`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(
          `Failed to generate the report. Status: ${response.status}`
        );
      }
      const data = await response.json();
      setReportData(data.defaulterReport);
      setFilteredData(data.defaulterReport);
    } catch (error) {
      console.error("Error generating report:", error);
      setError("An error occurred while generating the report.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [
        [
          "Roll Number",
          "Student Name",
          "Department",
          "Batch",
          "Year",
          "Section",
          "Mentor Name",
          "Date",
          "Type",
        ],
      ],
      body: filteredData.map((item) => [
        item.roll_no,
        item.studentName,
        item.departmentName,
        item.batchName,
        item.year,
        item.section_name,
        item.mentorName,
        new Date(item.entryDate).toLocaleDateString(),
        item.defaulterType,
      ]),
    });
    doc.save("defaulters_report.pdf");
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Defaulters Report");
    XLSX.writeFile(workbook, "defaulters_report.xlsx");
  };

  const clearFilters = () => {
    setMentorFilter("");
    setDepartmentFilter("");
    setSectionFilter("");
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Generate Report</h2>
      <form onSubmit={handleGenerateReport} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="defaulterType"
              className="block text-sm font-medium text-gray-700"
            >
              Defaulters type:
            </label>
            <select
              id="defaulterType"
              value={defaulterType}
              onChange={(e) => setDefaulterType(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">--Select--</option>
              <option value="Discipline and Dresscode">
                Discipline (Dresscode)
              </option>
              <option value="Late">Latecomers</option>
              <option value="Both">Dresscode and Latecomers</option>
              <option value="All">All</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="fromDate"
              className="block text-sm font-medium text-gray-700"
            >
              From Date:
            </label>
            <input
              type="date"
              id="fromDate"
              name="fromDate"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="toDate"
              className="block text-sm font-medium text-gray-700"
            >
              To Date:
            </label>
            <input
              type="date"
              id="toDate"
              name="toDate"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Report"}
          </button>
        </div>
      </form>
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      {reportData.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Defaulters Report</h3>
            <div className="space-x-2">
              <button
                onClick={downloadPDF}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Download PDF
              </button>
              <button
                onClick={downloadExcel}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Download Excel
              </button>
            </div>
          </div>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Filter by Mentor Name"
              value={mentorFilter}
              onChange={(e) => setMentorFilter(e.target.value)}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Filter by Department"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Filter by Section"
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="p-2 border rounded"
            />
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Clear Filters
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full mx-auto bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b">Roll Number</th>
                  <th className="py-2 px-4 border-b">Student Name</th>
                  <th className="py-2 px-4 border-b">Department</th>
                  <th className="py-2 px-4 border-b">Batch</th>
                  <th className="py-2 px-4 border-b">Year</th>
                  <th className="py-2 px-4 border-b">Section</th>
                  <th className="py-2 px-4 border-b">Mentor Name</th>
                  <th className="py-2 px-4 border-b">Date</th>
                  <th className="py-2 px-4 border-b">Type</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="py-2 px-4 border-b">{item.roll_no}</td>
                      <td className="py-2 px-4 border-b">{item.studentName}</td>
                      <td className="py-2 px-4 border-b">
                        {item.departmentName}
                      </td>
                      <td className="py-2 px-6 border-b">{item.batchName}</td>
                      <td className="py-2 px-4 border-b">{item.year}</td>
                      <td className="py-2 px-4 border-b">
                        {item.section_name}
                      </td>
                      <td className="py-2 px-4 border-b">{item.mentorName}</td>
                      <td className="py-2 px-4 border-b">
                        {new Date(item.entryDate).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-7 border-b">
                        {item.defaulterType}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="py-4 px-4 border-b text-center">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
