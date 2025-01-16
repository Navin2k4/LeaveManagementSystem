import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  UserCheck,
  Clock,
  Calendar,
  AlertCircle,
  Search,
  Building,
  User,
  Users,
  List,
  PlusCircle,
  FileText,
} from "lucide-react";
import PTGenerateReport from "./PTGenerateReport";

const MarkDefaulterAndLate = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [defaulters, setDefaulters] = useState([]);
  const [rollNumber, setRollNumber] = useState("");
  const [selectedMentor, setSelectedMentor] = useState("");
  const [timeIn, setTimeIn] = useState("");
  const [formData, setFormData] = useState({
    studentName: "",
    academicYear: "",
    semester: "",
    year: "",
    sectionName: "",
    department: "",
    entryDate: new Date().toISOString().split("T")[0],
    timeIn: "",
    observation: "",
    classInchargeName: "",
    classInchargeId: null,
    mentorName: "",
    mentorId: null,
    defaulterType: "",
    rollNumber: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch defaulters list
  const fetchDefaulters = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/defaulter/getDefaulters");
      const data = await response.json();
      setDefaulters(data.defaulters);
    } catch (error) {
      console.error("Error fetching defaulters:", error);
      setError("Failed to fetch defaulters list");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "list") {
      fetchDefaulters();
    }
  }, [activeTab]);

  // Student data fetching
  const fetchStudentData = async () => {
    if (!rollNumber.trim()) return;

    try {
      const response = await fetch(
        `/api/defaulter/getStudentDetailsByRollforDefaulters/${rollNumber}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      if (data && data.name) {
        setFormData((prev) => ({
          ...prev,
          studentName: data.name || "N/A",
          academicYear: data.batch_name || "N/A",
          semester: data.semester || "N/A",
          year: data.year || "N/A",
          department: data.department_name || "N/A",
          sectionName: data.sectionName || "N/A",
          mentorName: data.mentorName || "N/A",
          mentorId: data.mentorId || null,
          classInchargeName: data.classInchargeName || "N/A",
          classInchargeId: data.classInchargeId || null,
          rollNumber: rollNumber,
        }));
        setError("");
      } else {
        setFormData((prev) => ({
          ...prev,
          studentName: "N/A",
          academicYear: "N/A",
          semester: "N/A",
          year: "N/A",
          department: "N/A",
          sectionName: "N/A",
          mentorName: "N/A",
          mentorId: null,
          classInchargeName: "N/A",
          classInchargeId: null,
        }));
        setError("Student not found");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      setError("Error fetching student data");
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (rollNumber.trim()) {
        fetchStudentData();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [rollNumber]);

  const handleChange = (e) => {
    const { name, value, type, id } = e.target;

    if (name === "rollNumber") {
      setRollNumber(value.toUpperCase());
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "radio" ? id : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const payload = {
        rollNumber: formData.rollNumber,
        entryDate: formData.entryDate,
        timeIn: formData.timeIn,
        observation: formData.observation,
        mentorId: formData.mentorId,
        classInchargeId: formData.classInchargeId,
        defaulterType:
          formData.defaulterType === "lateEntry"
            ? "Late"
            : formData.defaulterType === "dressCode"
            ? "Discipline and Dresscode"
            : formData.defaulterType === "both"
            ? "Both"
            : "",
      };

      const response = await fetch("/api/defaulter/markDefaulter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccessMessage(result.message);
        resetForm();
        if (activeTab === "list") {
          fetchDefaulters(); // Refresh the list if we're on the list tab
        }
      } else {
        const err = await response.json();
        setError(err.message || "Error occurred while marking defaulter");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to submit form: " + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      studentName: "",
      academicYear: "",
      semester: "",
      year: "",
      department: "",
      sectionName: "",
      entryDate: new Date().toISOString().split("T")[0],
      timeIn: "",
      observation: "",
      mentorName: "",
      classInchargeName: "",
      defaulterType: "",
      // rollNumber: "",
    });
    setRollNumber("");
    setSelectedMentor("");
    setTimeIn("");
    setError("");
    setSuccessMessage("");
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  // Tab Components
  const TabNavigation = () => (
    <div className="flex space-x-2 mb-6 border-b">
      <button
        onClick={() => setActiveTab("list")}
        className={`flex items-center px-4 py-2 ${
          activeTab === "list"
            ? "border-b-2 border-blue-500 text-blue-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <List className="w-4 h-4 mr-2" />
        List Defaulters
      </button>
      <button
        onClick={() => setActiveTab("add")}
        className={`flex items-center px-4 py-2 ${
          activeTab === "add"
            ? "border-b-2 border-blue-500 text-blue-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <PlusCircle className="w-4 h-4 mr-2" />
        Add Defaulter
      </button>
      <button
        onClick={() => setActiveTab("generate")}
        className={`flex items-center px-4 py-2 ${
          activeTab === "generate"
            ? "border-b-2 border-blue-500 text-blue-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <FileText className="w-4 h-4 mr-2" />
        Generate Report
      </button>
    </div>
  );

  const ListDefaulters = () => (
    <div className="bg-white rounded-lg shadow">
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roll No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mentor
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {defaulters.map((defaulter, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {defaulter.roll_no}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {defaulter.studentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {defaulter.departmentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        defaulter.defaulterType === "Late"
                          ? "bg-yellow-100 text-yellow-800"
                          : defaulter.defaulterType === "Both"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {defaulter.defaulterType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(defaulter.entryDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {defaulter.mentorName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-full mx-auto p-6"
    >
      <TabNavigation />

      {activeTab === "list" && <ListDefaulters />}

      {activeTab === "add" && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Search Section */}
            <motion.div variants={fadeInUp} className="relative">
              <label
                htmlFor="rollNumber"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Roll Number
              </label>
              <div className="relative w-full">
                <input
                  type="text"
                  id="rollNumber"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </motion.div>

            {/* Student Details Grid */}
            <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded flex items-center">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm font-semibold text-gray-500">
                  Student:{" "}
                  <span className="ml-1">{formData.studentName || "N/A"}</span>
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm font-semibold text-gray-500">
                  Year:{" "}
                  <span className="ml-1">{formData.academicYear || "N/A"}</span>
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded flex items-center">
                <Building className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm font-semibold text-gray-500">
                  Dept:{" "}
                  <span className="ml-1">{formData.department || "N/A"}</span>
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded flex items-center">
                <Building className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm font-semibold text-gray-500">
                  Section:{" "}
                  <span className="ml-1">{formData.sectionName || "N/A"}</span>
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded flex items-center">
                <Users className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm font-semibold text-gray-500">
                  Class Incharge:{" "}
                  <span className="ml-1">
                    {formData.classInchargeName || "N/A"}
                  </span>
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded flex items-center">
                <Users className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm font-semibold text-gray-500">
                  Mentor:{" "}
                  <span className="ml-1">{formData.mentorName || "N/A"}</span>
                </span>
              </div>
            </motion.div>

            {/* Defaulter Type Selection */}
            <motion.div variants={fadeInUp} className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Defaulter Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    id: "dressCode",
                    label: "Dress Code",
                    icon: <AlertCircle />,
                  },
                  { id: "lateEntry", label: "Late Entry", icon: <Clock /> },
                  { id: "both", label: "Both", icon: <UserCheck /> },
                ].map((type) => (
                  <label
                    key={type.id}
                    className={`
                    flex items-center gap-3 p-4 rounded-lg cursor-pointer
                    transition-all duration-200
                    ${
                      formData.defaulterType === type.id
                        ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800"
                        : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                    }
                    border hover:border-blue-300 dark:hover:border-blue-700
                  `}
                  >
                    <input
                      type="radio"
                      id={type.id}
                      name="defaulterType"
                      checked={formData.defaulterType === type.id}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <span
                      className={`
                    ${
                      formData.defaulterType === type.id
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }
                  `}
                    >
                      {type.icon}
                    </span>
                    <span
                      className={`
                    font-medium
                    ${
                      formData.defaulterType === type.id
                        ? "text-blue-900 dark:text-blue-100"
                        : "text-gray-700 dark:text-gray-300"
                    }
                  `}
                    >
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>

            {/* Date and Time Section */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Entry Date
                </label>
                <input
                  type="date"
                  name="entryDate"
                  value={formData.entryDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Time In
                </label>
                <input
                  type="time"
                  name="timeIn"
                  value={formData.timeIn}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border 
                          ${
                            formData.defaulterType === "dressCode"
                              ? "bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
                              : "bg-white dark:bg-gray-700"
                          }
                          border-gray-300 dark:border-gray-600 
                          text-gray-900 dark:text-gray-100
                          focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
                  disabled={formData.defaulterType === "dressCode"}
                  required={formData.defaulterType !== "dressCode"}
                />
              </div>
            </motion.div>

            {/* Observation Field */}
            <motion.div variants={fadeInUp}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Observation
              </label>
              <textarea
                name="observation"
                value={formData.observation}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border
                        ${
                          formData.defaulterType === "lateEntry"
                            ? "bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
                            : "bg-white dark:bg-gray-700"
                        }
                        border-gray-300 dark:border-gray-600
                        text-gray-900 dark:text-gray-100
                        focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
                rows="3"
                disabled={formData.defaulterType === "lateEntry"}
                required={formData.defaulterType !== "lateEntry"}
              />
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={fadeInUp} className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r bg-[#1f3a6e] rounded-lg text-white 
                         transition-all duration-200"
              >
                Submit Entry
              </button>
            </motion.div>
          </form>
        </div>
      )}

      {activeTab === "generate" && <PTGenerateReport />}

      {/* Error and Success Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-center"
        >
          {error}
        </motion.div>
      )}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-center"
        >
          {successMessage}
        </motion.div>
      )}
    </motion.div>
  );
};

export default MarkDefaulterAndLate;
