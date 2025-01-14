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
} from "lucide-react";
import PTGenerateReport from "./PTGenerateReport";

const MarkDefaulterAndLate = () => {
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

  useEffect(() => {
    if (rollNumber) {
      fetchStudentData();
    } else {
      resetForm();
    }
  }, [rollNumber]);

  const fetchStudentData = async () => {
    try {
      const formattedRollNumber = rollNumber.toUpperCase();
      const response = await fetch(
        `/api/defaulter/getStudentDetailsByRollforDefaulters/${formattedRollNumber}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      console.log(data);

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
          rollNumber: formattedRollNumber,
        }));
      } else {
        resetForm();
        setError("Student not found");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      setError("Error fetching student data");
      resetForm();
    }
  };

  const handleChange = (e) => {
    const { name, value, type, id } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "radio" ? id : value,
    }));

    if (name === "rollNumber") {
      setRollNumber(value);
    }
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

      if (response.status === 200) {
        const result = await response.json();
        setSuccessMessage(result.message);
        resetForm();
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
      // rollNumber: ''
    });
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-full mx-auto"
    >
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
                { id: "dressCode", label: "Dress Code", icon: <AlertCircle /> },
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
      </div>
      <PTGenerateReport />
    </motion.div>
  );
};

export default MarkDefaulterAndLate;
