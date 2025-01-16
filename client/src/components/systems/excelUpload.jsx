import React, { useState } from "react";
import { Button, Table, Modal } from "react-bootstrap";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const UploadExcel = ({ type = "student" }) => {
  const [file, setFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadResults, setUploadResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Define the column headers
  const columnHeaders =
    type === "student"
      ? [
          "Roll No",
          "Register No",
          "Name",
          "Email",
          "Phone",
          "Parent Phone",
          "Department",
          "Batch",
          "Section",
          "Mentor",
        ]
      : [
          "Staff ID",
          "Name",
          "Email",
          "Phone",
          "Department",
          "Batch",
          "Section",
          "Class Incharge",
          "Mentor",
          "HOD",
        ];

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      readExcelFile(uploadedFile);
    }
  };

  const readExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];

      // Read as array of arrays
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 1,
        raw: false,
      });

      // Remove empty rows and format data
      const formattedData = sheetData
        .filter((row) => row[0]) // Filter out empty rows
        .map((row) => {
          const rowData = {};
          columnHeaders.forEach((header, index) => {
            rowData[header] = row[index] ? row[index].toString().trim() : "";
          });
          return rowData;
        });

      setExcelData(formattedData);
    };
    reader.readAsBinaryString(file);
  };

  const downloadReport = (data, type) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, type);
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(dataBlob, `${type}_records.xlsx`);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const endpoint =
        type === "student"
          ? "/api/data/uploadData"
          : "/api/data/uploadStaffData";
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadResults(result);
        setShowResults(true);
        setShowPreview(false);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error(error);
      alert("Error uploading file");
    }
  };

  const ResultsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-8xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-800 rounded-t-lg">
          <h3 className="text-xl font-bold text-white">Upload Results</h3>
          <button
            onClick={() => {
              setShowResults(false);
              setFile(null);
              setExcelData([]);
              setUploadResults(null);
            }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {/* Summary Section */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {Object.entries(uploadResults.summary).map(([key, value]) => (
              <div key={key} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 uppercase">
                  {key}
                </h4>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          {/* Tabs for different record types */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {["successful", "duplicates", "errors"].map(
                  (type) =>
                    uploadResults.details[type].length > 0 && (
                      <div key={type} className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold capitalize">
                            {type} Records ({uploadResults.details[type].length}
                            )
                          </h3>
                          <button
                            onClick={() =>
                              downloadReport(uploadResults.details[type], type)
                            }
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                          >
                            Download {type} List
                          </button>
                        </div>
                        <div className="bg-white shadow overflow-hidden rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                {Object.keys(
                                  uploadResults.details[type][0]
                                ).map((header) => (
                                  <th
                                    key={header}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {uploadResults.details[type].map(
                                (record, index) => (
                                  <tr key={index}>
                                    {Object.values(record).map((value, i) => (
                                      <td
                                        key={i}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                      >
                                        {value}
                                      </td>
                                    ))}
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )
                )}
              </nav>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={() => {
              setShowResults(false);
              setFile(null);
              setExcelData([]);
              setUploadResults(null);
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="">
      <div className="">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Upload {type === "student" ? "Student" : "Staff"} Data
        </h2>

        <div className="flex flex-wrap gap-4 mb-6">
          <label
            htmlFor="file-upload"
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 cursor-pointer transition duration-200 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Choose File
            <input
              id="file-upload"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {file && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-600 font-medium">
              Selected file: <span className="text-blue-600">{file.name}</span>
            </p>

            <div className="flex gap-4">
              <Button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 flex items-center gap-2"
                onClick={() => setShowPreview(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Preview Data
              </Button>

              <Button
                variant="success"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200 flex items-center gap-2"
                onClick={handleSubmit}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Upload {type === "student" ? "Student" : "Staff"} Data
              </Button>
            </div>
          </div>
        )}
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-800 rounded-t-lg">
              <h3 className="text-xl font-bold text-white">
                Excel Data Preview
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-auto">
              {excelData.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      {columnHeaders.map((header, index) => (
                        <th
                          key={index}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {excelData.map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-gray-50">
                        {columnHeaders.map((header, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                          >
                            {row[header]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No data to display
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-200"
                >
                  Close
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showResults && uploadResults && <ResultsModal />}
    </div>
  );
};

export default UploadExcel;
