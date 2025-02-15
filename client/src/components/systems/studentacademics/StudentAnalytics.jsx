import { Accordion, Button, Select } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { pdf } from "@react-pdf/renderer";
import GradeSheetPDF from "./GradeSheetPDF";
import { Award, BookOpen, TrendingUp, Loader2, Save } from "lucide-react";

const StudentAnalytics = ({ student, department, onResultsSave }) => {
  const [courseData, setCourseData] = useState(null);
  const [selectedGrades, setSelectedGrades] = useState({});
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [arrears, setArrears] = useState({});
  const [savedResults, setSavedResults] = useState({});
  const [saving, setSaving] = useState(false);

  const GRADE_POINTS = {
    O: 10,
    "A+": 9,
    A: 8,
    "B+": 7,
    B: 6,
    C: 5,
    F: 0,
    AB: 0,
    NA: null,
  };

  const gradeOptions = [
    { value: "O", label: "O" },
    { value: "A+", label: "A+" },
    { value: "A", label: "A" },
    { value: "B+", label: "B+" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "F", label: "F" },
    { value: "AB", label: "AB" },
    { value: "NA", label: "Not Applicable" },
  ];

  useEffect(() => {
    fetchCourseData();
  }, [department]);

  useEffect(() => {
    if (student?.semester_results) {
      setSavedResults(student.semester_results);
    }
  }, [student]);

  useEffect(() => {
    if (student?.id) {
      fetchSavedResults();
    }
  }, [student]);

  const fetchCourseData = async () => {
    try {
      const response = await fetch(
        `/api/cgpa/getCourseDataForDepartment?departmentId=${department}`
      );
      const data = await response.json();
      if (data.success) {
        setCourseData(data.data);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchSavedResults = async () => {
    try {
      const response = await fetch(
        `/api/cgpa/getStudentResults?studentId=${student.id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setSavedResults(data.data);

        // Pre-populate selected grades from saved results
        const savedGrades = {};
        Object.entries(data.data).forEach(([semester, semesterData]) => {
          semesterData.courses.forEach((course) => {
            savedGrades[`${semester}-${course.course_code}`] = course.grade;
          });
        });
        setSelectedGrades(savedGrades);

        // Pre-calculate results for each semester
        const calculatedResults = {};
        Object.entries(data.data).forEach(([semester, semesterData]) => {
          calculatedResults[semester] = {
            gpa: semesterData.gpa,
            cgpa: semesterData.cgpa,
            totalCredits: semesterData.totalCredits,
            earnedCredits: semesterData.earnedCredits,
          };
        });
        setResults(calculatedResults);
      }
    } catch (err) {
      console.error("Error fetching saved results:", err);
      setError("Failed to load saved results");
    }
  };

  const handleGradeChange = (courseCode, semester, grade) => {
    setSelectedGrades((prev) => ({
      ...prev,
      [`${semester}-${courseCode}`]: grade,
    }));
  };

  const getCoursesBySemester = (semester) => {
    let courses = [];

    // Add regular courses
    const regularCourses =
      courseData?.regular_courses.find((s) => s.semester_no === semester)
        ?.courses || [];
    courses = [...regularCourses];

    // Add verticals and open electives for semester 5 and above
    if (semester >= 5) {
      // Add vertical courses
      const verticalCourses =
        courseData?.verticals?.flatMap((vertical) =>
          vertical.courses.filter((course) => course.semester === semester)
        ) || [];
      courses = [...courses, ...verticalCourses];

      // Add open elective courses
      const openElectiveCourses =
        courseData?.open_courses?.find((s) => s.semester_no === semester)
          ?.courses || [];
      courses = [...courses, ...openElectiveCourses];
    }

    // Add arrear courses from previous semesters
    if (semester > 1) {
      const arrearCourses = [];
      for (let prevSem = 1; prevSem < semester; prevSem++) {
        const prevCourses = getCoursesBySemester(prevSem);
        prevCourses.forEach((course) => {
          const grade = selectedGrades[`${prevSem}-${course.course_code}`];
          if (grade === "F" || grade === "AB") {
            // Check if it's not already passed in a later semester
            const isPassedLater = checkIfPassedLater(
              course.course_code,
              prevSem,
              semester
            );
            if (!isPassedLater) {
              arrearCourses.push({
                ...course,
                isArrear: true,
                originalSemester: prevSem,
              });
            }
          }
        });
      }
      courses = [...courses, ...arrearCourses];
    }

    return courses;
  };

  // Helper function to check if a failed course was passed in later semesters
  const checkIfPassedLater = (courseCode, failedSem, currentSem) => {
    for (let sem = failedSem + 1; sem < currentSem; sem++) {
      const grade = selectedGrades[`${sem}-${courseCode}`];
      if (grade && grade !== "F" && grade !== "AB") {
        return true;
      }
    }
    return false;
  };

  const calculateSemesterGPA = (semester) => {
    const semesterCourses = getCoursesBySemester(semester);

    let totalGradePoints = 0;
    let totalCredits = 0;
    let earnedCredits = 0;

    semesterCourses.forEach((course) => {
      const grade = selectedGrades[`${semester}-${course.course_code}`];
      if (grade) {
        // Skip NA grades for elective courses
        if (
          grade === "NA" &&
          (course.vertical_type === "PE" || course.vertical_type === "OE")
        ) {
          return; // Skip this course in calculation
        }

        const gradePoint = GRADE_POINTS[grade];
        if (gradePoint !== null) {
          // Check for non-NA grades
          totalGradePoints += gradePoint * course.course_credits;
          totalCredits += course.course_credits;
          if (gradePoint > 0) earnedCredits += course.course_credits;
        }
      }
    });

    const gpa =
      totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;

    // Calculate CGPA including current semester
    let cumulativePoints = totalGradePoints;
    let cumulativeCredits = totalCredits;

    // Add points from previous semesters (including verticals and open electives)
    for (let prevSemester = 1; prevSemester < semester; prevSemester++) {
      const prevCourses = getCoursesBySemester(prevSemester);
      prevCourses.forEach((course) => {
        const grade = selectedGrades[`${prevSemester}-${course.course_code}`];
        if (grade) {
          const gradePoint = GRADE_POINTS[grade];
          cumulativePoints += gradePoint * course.course_credits;
          cumulativeCredits += course.course_credits;
        }
      });
    }

    const cgpa =
      cumulativeCredits > 0
        ? (cumulativePoints / cumulativeCredits).toFixed(2)
        : 0;

    return {
      gpa,
      cgpa,
      totalCredits,
      earnedCredits,
    };
  };

  const calculateResults = (semester) => {
    try {
      setLoading(true);
      const result = calculateSemesterGPA(semester);
      setResults((prev) => ({
        ...prev,
        [semester]: result,
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Modify the renderCourseRow function to show saved grades
  const renderCourseRow = (course, semester) => {
    const savedGrade = savedResults[semester]?.courses?.find(
      (c) => c.course_code === course.course_code
    )?.grade;

    return (
      <tr
        key={`${course.course_code}-${course.isArrear ? "arrear" : "regular"}`}
        className={`bg-white hover:bg-gray-50 ${
          course.isArrear ? "bg-red-50" : savedGrade ? "bg-green-50" : ""
        }`}
      >
        <td className="px-4 py-2 font-medium text-gray-900">
          {course.course_code}
          {course.isArrear && (
            <span className="ml-2 text-xs text-red-600">
              (Arrear - Sem {course.originalSemester})
            </span>
          )}
        </td>
        <td className="px-4 py-2">{course.course_name}</td>
        <td className="hidden md:table-cell px-4 py-2 text-center">
          {course.course_credits}
        </td>
        {semester >= 5 && (
          <td className="hidden md:table-cell px-4 py-2 text-center">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full 
                ${
                  course.vertical_type === "PE"
                    ? "bg-purple-100 text-purple-800"
                    : course.vertical_type === "OE"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
            >
              {course.vertical_type || "Regular"}
            </span>
          </td>
        )}
        <td className="px-4 py-2">
          <Select
            sizing="sm"
            className={`min-w-[100px] ${
              course.isArrear
                ? "border-red-300"
                : savedGrade
                ? "border-green-300"
                : ""
            }`}
            value={selectedGrades[`${semester}-${course.course_code}`] || ""}
            onChange={(e) =>
              handleGradeChange(course.course_code, semester, e.target.value)
            }
          >
            <option value="">Grade</option>
            {gradeOptions
              .filter(
                (grade) =>
                  grade.value !== "NA" ||
                  (grade.value === "NA" &&
                    (course.vertical_type === "PE" ||
                      course.vertical_type === "OE"))
              )
              .map((grade) => (
                <option key={grade.value} value={grade.value}>
                  {grade.value}
                </option>
              ))}
          </Select>
        </td>
      </tr>
    );
  };

  // Add this to show saved semester summary
  const renderSavedSemesterSummary = (semester) => {
    const savedData = savedResults[semester];
    if (!savedData) return null;
    return (
      <div className="text-sm text-gray-600">
        <div>Last saved results:</div>
        <div className="flex gap-4">
          <span>GPA: {savedData.gpa}</span>
          <span>CGPA: {savedData.cgpa}</span>
          <span>
            Credits: {savedData.earnedCredits}/{savedData.totalCredits}
          </span>
        </div>
      </div>
    );
  };

  const handleSaveResults = async (semester) => {
    try {
      setSaving(true);

      // Calculate results before saving
      const result = calculateSemesterGPA(semester);
      setResults((prev) => ({
        ...prev,
        [semester]: result,
      }));

      // Get all courses for this semester
      const semesterCourses = getCoursesBySemester(semester);

      // Prepare the semester result data
      const semesterResult = {
        courses: semesterCourses.map((course) => ({
          course_code: course.course_code,
          course_name: course.course_name,
          credits: course.course_credits,
          grade: selectedGrades[`${semester}-${course.course_code}`] || "",
          vertical_type: course.vertical_type || "Regular",
          isArrear: course.isArrear || false,
          originalSemester: course.originalSemester,
        })),
        gpa: result.gpa,
        cgpa: result.cgpa,
        totalCredits: result.totalCredits,
        earnedCredits: result.earnedCredits,
        lastUpdated: new Date(),
      };

      const response = await fetch("/api/cgpa/saveStudentAnalytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: student.id,
          semesterNo: semester,
          results: semesterResult,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setSavedResults(data.data);
        toast.success("Results calculated and saved successfully");
        onResultsSave?.(data.data);
      } else {
        throw new Error(data.message || "Failed to save results");
      }
    } catch (err) {
      console.error("Error saving results:", err);
      toast.error(err.message || "Failed to save results");
    } finally {
      setSaving(false);
    }
  };

  // Add function to prepare chart data
  const prepareChartData = () => {
    if (!savedResults || Object.keys(savedResults).length === 0) return [];

    return Object.entries(savedResults)
      .map(([semester, data]) => ({
        semester: `Sem ${semester}`,
        gpa: parseFloat(data.gpa) || 0,
        cgpa: parseFloat(data.cgpa) || 0,
      }))
      .sort(
        (a, b) =>
          parseInt(a.semester.split(" ")[1]) -
          parseInt(b.semester.split(" ")[1])
      );
  };

  // Add chart component
  const renderProgressChart = () => {
    const chartData = prepareChartData();
    if (chartData.length === 0) return null;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 w-full md:w-2/3">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Academic Progress
          </h3>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.1}
              />
              <XAxis
                dataKey="semester"
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "#374151", strokeWidth: 1 }}
              />
              <YAxis
                domain={[0, 10]}
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "#374151", strokeWidth: 1 }}
                tickFormatter={(value) => value.toFixed(1)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px",
                  color: "#E5E7EB",
                }}
                formatter={(value, name) => [`${value.toFixed(2)}`, name]}
                labelStyle={{ color: "#E5E7EB", marginBottom: "4px" }}
                labelFormatter={(label) => `Semester ${label.split(" ")[1]}`}
                cursor={{ stroke: "#6B7280", strokeWidth: 1 }}
                wrapperStyle={{ outline: "none" }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                iconSize={8}
              />
              <Line
                type="monotone"
                dataKey="gpa"
                stroke="#3B82F6"
                name="GPA"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#3B82F6" }}
                activeDot={{ r: 6, fill: "#3B82F6" }}
              />
              <Line
                type="monotone"
                dataKey="cgpa"
                stroke="#10B981"
                name="CGPA"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#10B981" }}
                activeDot={{ r: 6, fill: "#10B981" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // Update the renderOverallSummary function
  const renderOverallSummary = () => {
    if (!Object.keys(savedResults).length) return null;

    const latestSemester = Math.max(...Object.keys(savedResults).map(Number));
    const latestResults = savedResults[latestSemester];

    return (
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl shadow-lg w-full md:w-1/3">
        <h3 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Academic Summary
        </h3>
        <div className="space-y-4">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100">Completed Semesters</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {Object.keys(savedResults).length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-500/30 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-100" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100">Latest GPA</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {latestResults.gpa}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-500/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-100" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100">Current CGPA</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {latestResults.cgpa}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-500/30 flex items-center justify-center">
                <Award className="w-5 h-5 text-blue-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Add this function to handle PDF download
  const handleDownloadReport = async () => {
    try {
      const blob = await pdf(
        <GradeSheetPDF student={student} results={savedResults} />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Semester_Results_${student.roll_no}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate grade sheet");
    }
  };

  return (
    <div className="p-2 md:p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h2 className="text-xl font-semibold mb-2 md:mb-0">Semester Results</h2>
        <div className="flex items-center gap-4">
          {Object.keys(savedResults).length > 0 && (
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300"
              onClick={handleDownloadReport}
            >
              Download Report
            </Button>
          )}
        </div>
      </div>

      <Accordion collapseAll>
        {courseData?.regular_courses
          .sort((a, b) => a.semester_no - b.semester_no)
          .map((semester) => (
            <Accordion.Panel key={semester.semester_no}>
              <Accordion.Title>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
                  <span className="mb-2 md:mb-0">
                    Semester {semester.semester_no}
                  </span>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                    {results?.[semester.semester_no] && (
                      <span className="text-sm text-gray-600 ml-2">
                        GPA: {results[semester.semester_no].gpa} | CGPA:{" "}
                        {results[semester.semester_no].cgpa}
                      </span>
                    )}
                    {getCoursesBySemester(semester.semester_no).some(
                      (c) => c.isArrear
                    ) && (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full whitespace-nowrap">
                        Arrears:{" "}
                        {
                          getCoursesBySemester(semester.semester_no).filter(
                            (c) => c.isArrear
                          ).length
                        }
                      </span>
                    )}
                  </div>
                </div>
              </Accordion.Title>
              <Accordion.Content>
                <div className="overflow-x-auto -mx-4 md:mx-0">
                  <table className="w-full text-sm">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th className="px-2 md:px-4 py-2">Code</th>
                        <th className="px-2 md:px-4 py-2">Course</th>
                        <th className="hidden md:table-cell px-2 md:px-4 py-2 text-center">
                          Credits
                        </th>
                        {semester.semester_no >= 5 && (
                          <th className="hidden md:table-cell px-2 md:px-4 py-2 text-center">
                            Type
                          </th>
                        )}
                        <th className="px-2 md:px-4 py-2 text-center">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {getCoursesBySemester(semester.semester_no).map(
                        (course) =>
                          renderCourseRow(course, semester.semester_no)
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-col md:flex-row justify-between mt-4 gap-3">
                  <div className="text-sm text-gray-600 order-2 md:order-1">
                    {results?.[semester.semester_no] && (
                      <>
                        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                          <span>
                            Credits:{" "}
                            {results[semester.semester_no].earnedCredits}/
                            {results[semester.semester_no].totalCredits}
                          </span>
                          {renderSavedSemesterSummary(semester.semester_no)}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2 order-1 md:order-2">
                    <Button
                      className="flex-1 md:flex-none  bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-sm"
                      onClick={() => handleSaveResults(semester.semester_no)}
                      disabled={saving}
                    >
                      {saving ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Save className="w-4 h-4" />
                          Calculate & Save
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </Accordion.Content>
            </Accordion.Panel>
          ))}
      </Accordion>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {renderProgressChart()}
        {renderOverallSummary()}
      </div>
      {error && (
        <div className="text-red-500 text-center mt-4 text-sm">{error}</div>
      )}
    </div>
  );
};

export default StudentAnalytics;
