import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Spinner } from "flowbite-react";
import { Info } from "lucide-react";
import { toast } from "react-hot-toast";
import { utils as XLSXUtils, write as XLSXWrite } from "xlsx";

const StudentAcademicData = ({ userId }) => {
  const [studentResults, setStudentResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const getStudentResultsForClassIncharge = async () => {
    try {
      const response = await axios.get(
        `/api/cgpa/getStudentResultsByClassInchargeId/${userId}`
      );
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch student results");
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    getStudentResultsForClassIncharge().then((data) => {
      setStudentResults(data.data);
      setLoading(false);
    });
  }, [userId]);

  const calculateLatestCGPA = (results) => {
    if (!results || Object.keys(results).length === 0) return "N/A";
    const latestSem = Math.max(...Object.keys(results).map(Number));
    return results[latestSem]?.cgpa || "N/A";
  };

  const generateExcelReport = () => {
    try {
      // Create workbook
      const workbook = XLSXUtils.book_new();

      // Get all unique semesters
      const allSemesters = [
        ...new Set(
          studentResults.flatMap((student) =>
            Object.keys(student.semester_results || {})
          )
        ),
      ].sort((a, b) => a - b);

      // Generate sheet for each semester
      allSemesters.forEach((semester) => {
        // Get all courses for this semester
        const courseCodes = new Set();
        studentResults.forEach((student) => {
          const semResults =
            student.semester_results?.[semester]?.courses || [];
          semResults.forEach((course) => courseCodes.add(course.course_code));
        });
        const sortedCourseCodes = [...courseCodes].sort();

        // Prepare headers
        const headers = [
          "Name",
          "Register No",
          "Roll No",
          ...sortedCourseCodes,
          "GPA",
          "CGPA",
          "Credits Earned",
          "Total Credits",
        ];

        // Prepare data rows
        const rows = studentResults.map((student) => {
          const semesterResult = student.semester_results?.[semester];
          const courseGrades = {};

          // Initialize all courses with '-'
          sortedCourseCodes.forEach((code) => (courseGrades[code] = "-"));

          // Fill in actual grades
          semesterResult?.courses?.forEach((course) => {
            courseGrades[course.course_code] = course.grade;
          });

          return [
            student.name,
            student.register_no,
            student.roll_no,
            ...sortedCourseCodes.map((code) => courseGrades[code]),
            semesterResult?.gpa || "-",
            semesterResult?.cgpa || "-",
            semesterResult?.earnedCredits || "-",
            semesterResult?.totalCredits || "-",
          ];
        });

        // Create worksheet
        const worksheet = XLSXUtils.aoa_to_sheet([headers, ...rows]);

        // Set column widths
        const colWidths = [
          { wch: 25 }, // Name
          { wch: 15 }, // Register No
          { wch: 12 }, // Roll No
          ...sortedCourseCodes.map(() => ({ wch: 8 })), // Course codes
          { wch: 8 }, // GPA
          { wch: 8 }, // CGPA
          { wch: 12 }, // Credits Earned
          { wch: 12 }, // Total Credits
        ];
        worksheet["!cols"] = colWidths;

        // Style the header row
        const headerRange = XLSXUtils.decode_range(worksheet["!ref"]);
        for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
          const address = XLSXUtils.encode_cell({ r: 0, c: C });
          worksheet[address].s = {
            font: { bold: true },
            fill: { fgColor: { rgb: "EEEEEE" } },
          };
        }

        // Add the worksheet to workbook
        XLSXUtils.book_append_sheet(
          workbook,
          worksheet,
          `Semester ${semester}`
        );
      });

      // Save the workbook
      const excelBuffer = XLSXWrite(workbook, {
        bookType: "xlsx",
        type: "array",
        bookSST: false,
      });

      // Download the file
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "CSEB_Cumulative_Academic_Report.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Report generated successfully");
    } catch (error) {
      console.error("Error generating excel:", error);
      toast.error("Failed to generate report");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Student Results
            </h2>
            <p className="text-gray-600 mt-1">
              View academic records of all students
            </p>
          </div>
          <Button
            className="bg-green-500 hover:bg-green-600"
            onClick={generateExcelReport}
            disabled={loading || studentResults.length === 0}
          >
            Download Cumulative Report
          </Button>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Roll No</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Register No</Table.HeadCell>
            <Table.HeadCell>Current CGPA</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {studentResults.map((student) => (
              <Table.Row
                key={student._id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="font-medium">
                  {student.roll_no}
                </Table.Cell>
                <Table.Cell>{student.name}</Table.Cell>
                <Table.Cell>{student.register_no}</Table.Cell>
                <Table.Cell className="font-bold">
                  {calculateLatestCGPA(student.semester_results)}
                </Table.Cell>
                <Table.Cell>
                  <Button
                    size="sm"
                    color="light"
                    onClick={() => {
                      setSelectedStudent(student);
                      setShowDetails(true);
                    }}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {studentResults.map((student) => (
          <div
            key={student._id}
            className="bg-white p-4 rounded-lg shadow space-y-2"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{student.name}</p>
                <p className="text-sm text-gray-600">{student.roll_no}</p>
              </div>
              <Button
                size="sm"
                color="light"
                onClick={() => {
                  setSelectedStudent(student);
                  setShowDetails(true);
                }}
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                CGPA: {calculateLatestCGPA(student.semester_results)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      <Modal show={showDetails} onClose={() => setShowDetails(false)} size="xl">
        <Modal.Header>Student Academic Details</Modal.Header>
        <Modal.Body>
          {selectedStudent && (
            <div className="space-y-6">
              {/* Student Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{selectedStudent.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Roll Number</p>
                  <p className="font-medium">{selectedStudent.roll_no}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Register Number</p>
                  <p className="font-medium">{selectedStudent.register_no}</p>
                </div>
              </div>

              {/* Semester Results */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Semester Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selectedStudent.semester_results || {})
                    .sort((a, b) => a[0] - b[0])
                    .map(([semester, data]) => (
                      <div
                        key={semester}
                        className="bg-gray-50 p-4 rounded-lg space-y-2"
                      >
                        <h4 className="font-medium">Semester {semester}</h4>
                        <div className="space-y-1">
                          <p className="text-sm">GPA: {data.gpa}</p>
                          <p className="text-sm">CGPA: {data.cgpa}</p>
                          <p className="text-sm">
                            Credits: {data.earnedCredits}/{data.totalCredits}
                          </p>
                        </div>

                        {/* Course Details */}
                        <div className="mt-3">
                          <p className="text-sm font-medium mb-2">Courses:</p>
                          <div className="space-y-1">
                            {data.courses.map((course, idx) => (
                              <div
                                key={idx}
                                className="text-sm grid grid-cols-3 gap-2"
                              >
                                <span>{course.course_code}</span>
                                <span>{course.grade}</span>
                                <span
                                  className={
                                    course.grade === "F" ||
                                    course.grade === "AB"
                                      ? "text-red-500"
                                      : "text-green-500"
                                  }
                                >
                                  {course.grade === "F" || course.grade === "AB"
                                    ? "FAIL"
                                    : "PASS"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default StudentAcademicData;
