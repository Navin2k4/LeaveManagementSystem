import React, { useEffect, useState } from "react";
import { Label, Checkbox, Tabs } from "flowbite-react";
import { useSelector } from "react-redux";
import { ScaleLoader } from "react-spinners";
import {
  Calendar,
  MapPin,
  Building2,
  FileText,
  AlertCircle,
  Trophy,
} from "lucide-react";

// Add this custom theme object
const customTabTheme = {
  base: "flex flex-col gap-2",
  tablist: {
    base: "flex text-center",
    styles: {
      default: "flex-wrap border-b border-gray-200 dark:border-gray-700",
    },
    tabitem: {
      base: "flex items-center justify-center p-4 rounded-t-lg text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 focus:outline-none",
      styles: {
        default: {
          base: "rounded-t-lg",
          active: {
            on: "bg-blue-100 text-[#1f3a6e] dark:bg-gray-700 dark:text-blue-500",
            off: "text-gray-500 hover:bg-gray-50 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300",
          },
        },
      },
    },
  },
  tabpanel: "py-3",
};

export default function ODRequestForm({ setTab, mentor, classIncharge }) {
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errors, setErrors] = useState({});

  // External OD specific states
  const [selectedEventType, setSelectedEventType] = useState({
    paperPresentation: false,
    projectPresentation: false,
    otherEvent: false,
  });

  const [activeTab, setActiveTab] = useState("Internal OD");

  const [formData, setFormData] = useState({
    name: currentUser.name,
    parent_phone: currentUser.parent_phone,
    email: currentUser.email,
    studentId:
      currentUser.userType === "Staff" ? currentUser.userId : currentUser.id,
    userType: currentUser.userType,
    rollNo:
      currentUser.userType === "Staff" ? currentUser.id : currentUser.roll_no,
    regNo: currentUser.register_no,
    batchId: currentUser.batchId,
    sectionId: currentUser.sectionId,
    section_name: currentUser.section_name,
    departmentId: currentUser.departmentId,
    classInchargeId: classIncharge._id,
    mentorId: mentor._id,
    odType: "Internal",
    startDate: "",
    endDate: "",
    noOfDays: 0,
    collegeName: "",
    city: "",
    eventName: "",
    programName: "",
    paperTitle: "",
    projectTitle: "",
    eventDetails: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEventTypeChange = (type) => {
    setSelectedEventType((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const calculateDays = () => {
    const { startDate, endDate } = formData;

    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);

    let totalDays = 0;
    let isSecondSaturdayInRange = false;

    // Ensure startDate is not after endDate
    if (start > end) {
      console.error("Start date must not be after end date");
      return;
    }

    for (
      let date = new Date(start);
      date <= end;
      date.setDate(date.getDate() + 1)
    ) {
      const dayOfWeek = date.getDay();

      // Exclude Sundays (0)
      if (dayOfWeek !== 0) {
        totalDays++;
      }

      // Check for the second Saturday
      if (dayOfWeek === 6) {
        // Saturday
        const firstDayOfMonth = new Date(
          date.getFullYear(),
          date.getMonth(),
          1
        );
        const firstSaturday = new Date(firstDayOfMonth);
        firstSaturday.setDate(1 + ((6 - firstDayOfMonth.getDay() + 7) % 7));

        // Find the second Saturday of the month
        const secondSaturday = new Date(firstSaturday);
        secondSaturday.setDate(firstSaturday.getDate() + 7);

        if (
          date.getDate() === secondSaturday.getDate() &&
          date.getMonth() === secondSaturday.getMonth()
        ) {
          isSecondSaturdayInRange = true;
        }
      }
    }

    // If the leave range includes the second Saturday, don't count it
    if (isSecondSaturdayInRange) {
      totalDays--;
    }

    setFormData((prev) => ({
      ...prev,
      noOfDays: totalDays,
    }));
  };

  useEffect(() => {
    calculateDays();
  }, [formData.startDate, formData.endDate]);

  const validateForm = () => {
    const newErrors = {};
    const currentDate = new Date().toISOString().split("T")[0];

    // Common validations for both Internal and External OD
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    } else if (formData.startDate < currentDate) {
      newErrors.startDate = "Start date cannot be in the past";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    } else if (formData.endDate < formData.startDate) {
      newErrors.endDate = "End date must be after start date";
    }

    // Internal OD specific validations
    if (formData.odType === "Internal") {
      if (!formData.reason) {
        newErrors.reason = "Reason is required";
      } else if (formData.reason.length > 200) {
        newErrors.reason = "Reason must be less than 200 characters";
      }
    }

    // External OD specific validations
    if (formData.odType === "External") {
      if (!formData.collegeName) {
        newErrors.collegeName = "College/Company name is required";
      }
      if (!formData.city) {
        newErrors.city = "City is required";
      }
      if (!formData.eventName) {
        newErrors.eventName = "Program/Event name is required";
      }

      // Check if at least one event type is selected
      const hasEventType = Object.values(selectedEventType).some(
        (value) => value
      );
      if (!hasEventType) {
        newErrors.eventType = "Please select at least one event type";
      }

      // Validate based on selected event types
      if (selectedEventType.paperPresentation && !formData.paperTitle) {
        newErrors.paperTitle = "Paper title is required";
      }
      if (selectedEventType.projectPresentation && !formData.projectTitle) {
        newErrors.projectTitle = "Project title is required";
      }
      if (selectedEventType.otherEvent && !formData.eventDetails) {
        newErrors.eventDetails = "Event details are required";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const { classInchargeId, mentorId } = formData;

      const requestBody = {
        ...formData,
        mentorId: classInchargeId === mentorId ? mentorId : mentorId,
        selectedEventType:
          formData.odType === "External" ? selectedEventType : null,
      };

      const res = await fetch("/api/od-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      if (!data.success) {
        if (
          data.message.includes("Leave end date must be after the start date")
        ) {
          setErrorMessage("Leave end date must be after the start date");
        } else if (
          data.message.includes(
            "You already have a leave request for this period"
          )
        ) {
          setErrorMessage("You already have a leave request for this period");
        } else {
          setErrorMessage(data.message);
        }
        setLoading(false);
        return;
      }
      if (res.ok) {
        setLoading(false);
        setTab("Your OD Requests");
      }
    } catch (error) {
      setErrorMessage(
        "An error occurred while submitting the OD request. Please try again later."
      );
      setLoading(false);
    }
  };

  const renderInternalODForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Calendar size={16} />
            Date From<span className="text-red-400">*</span>
          </Label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={`w-full rounded-lg border ${
              errors.startDate
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } shadow-sm text-sm`}
          />
          <ErrorMessage error={errors.startDate} />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Calendar size={16} />
            Date To<span className="text-red-400">*</span>
          </Label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={`w-full rounded-lg border ${
              errors.endDate
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } shadow-sm text-sm`}
          />
          <ErrorMessage error={errors.endDate} />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <FileText size={16} />
          Reason for OD<span className="text-red-400">*</span>
        </Label>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          rows="3"
          className={`w-full rounded-lg border ${
            errors.reason
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-600"
          } shadow-sm text-sm`}
          placeholder="Please provide the reason for internal OD..."
        />
        <ErrorMessage error={errors.reason} />
      </div>
    </div>
  );

  const renderExternalODForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Building2 size={16} />
            College/Company Name<span className="text-red-400">*</span>
          </Label>
          <input
            type="text"
            name="collegeName"
            value={formData.collegeName}
            onChange={handleChange}
            className={`w-full rounded-lg border ${
              errors.collegeName
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } shadow-sm text-sm`}
            placeholder="Enter college or company name"
          />
          <ErrorMessage error={errors.collegeName} />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <MapPin size={16} />
            City<span className="text-red-400">*</span>
          </Label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={`w-full rounded-lg border ${
              errors.city
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } shadow-sm text-sm`}
            placeholder="Enter city name"
          />
          <ErrorMessage error={errors.city} />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Trophy size={16} />
          Program/Event Name<span className="text-red-400">*</span>
        </Label>
        <input
          type="text"
          name="eventName"
          value={formData.eventName}
          onChange={handleChange}
          className={`w-full rounded-lg border ${
            errors.eventName
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-600"
          } shadow-sm text-sm`}
          placeholder="Enter program or event name"
        />
        <ErrorMessage error={errors.eventName} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Calendar size={16} />
            Date From<span className="text-red-400">*</span>
          </Label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={`w-full rounded-lg border ${
              errors.startDate
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } shadow-sm text-sm`}
          />
          <ErrorMessage error={errors.startDate} />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Calendar size={16} />
            Date To<span className="text-red-400">*</span>
          </Label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={`w-full rounded-lg border ${
              errors.endDate
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } shadow-sm text-sm`}
          />
          <ErrorMessage error={errors.endDate} />
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Event Type<span className="text-red-400">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="paperPresentation"
              checked={selectedEventType.paperPresentation}
              onChange={() => handleEventTypeChange("paperPresentation")}
              className="text-[#1f3a6e] rounded"
            />
            <Label htmlFor="paperPresentation" className="text-sm">
              Paper Presentation
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="projectPresentation"
              checked={selectedEventType.projectPresentation}
              onChange={() => handleEventTypeChange("projectPresentation")}
              className="text-[#1f3a6e] rounded"
            />
            <Label htmlFor="projectPresentation" className="text-sm">
              Project Presentation
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="otherEvent"
              checked={selectedEventType.otherEvent}
              onChange={() => handleEventTypeChange("otherEvent")}
              className="text-[#1f3a6e] rounded"
            />
            <Label htmlFor="otherEvent" className="text-sm">
              Other Event
            </Label>
          </div>
        </div>
        <ErrorMessage error={errors.eventType} />
      </div>

      {selectedEventType.paperPresentation && (
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <FileText size={16} />
            Paper Title<span className="text-red-400">*</span>
          </Label>
          <input
            type="text"
            name="paperTitle"
            value={formData.paperTitle}
            onChange={handleChange}
            className={`w-full rounded-lg border ${
              errors.paperTitle
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } shadow-sm text-sm`}
            placeholder="Enter paper title"
          />
          <ErrorMessage error={errors.paperTitle} />
        </div>
      )}

      {selectedEventType.projectPresentation && (
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <FileText size={16} />
            Project Title<span className="text-red-400">*</span>
          </Label>
          <input
            type="text"
            name="projectTitle"
            value={formData.projectTitle}
            onChange={handleChange}
            className={`w-full rounded-lg border ${
              errors.projectTitle
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } shadow-sm text-sm`}
            placeholder="Enter project title"
          />
          <ErrorMessage error={errors.projectTitle} />
        </div>
      )}

      {selectedEventType.otherEvent && (
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <FileText size={16} />
            Event Details<span className="text-red-400">*</span>
          </Label>
          <textarea
            name="eventDetails"
            value={formData.eventDetails}
            onChange={handleChange}
            rows="3"
            className={`w-full rounded-lg border ${
              errors.eventDetails
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } shadow-sm text-sm`}
            placeholder="Please provide detailed information about the event..."
          />
          <ErrorMessage error={errors.eventDetails} />
        </div>
      )}
    </div>
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData((prev) => ({
      ...prev,
      odType: tab === "Internal OD" ? "Internal" : "External",
    }));
  };

  const ErrorMessage = ({ error }) => {
    if (!error) return null;
    return (
      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
        <AlertCircle size={12} />
        {error}
      </p>
    );
  };

  return (
    <div className="w-full mx-auto p-4">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            OD Request
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Fill in the details below to submit your OD request
          </p>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
            <AlertCircle size={16} />
            {errorMessage}
          </div>
        )}

        <div className="p-4">
          <Tabs theme={customTabTheme} onActiveTabChange={handleTabChange}>
            <Tabs.Item active={activeTab === "Internal OD"} title="Internal OD">
              <div className="mt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {renderInternalODForm()}
                  <button
                    type="submit"
                    className="w-full bg-[#1f3a6e] text-white py-2.5 rounded-lg font-medium hover:bg-[#0b1f44] transition-all duration-300 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <ScaleLoader color="white" height={15} />
                      </div>
                    ) : (
                      "Submit Internal OD Request"
                    )}
                  </button>
                </form>
              </div>
            </Tabs.Item>

            <Tabs.Item active={activeTab === "External OD"} title="External OD">
              <div className="mt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {renderExternalODForm()}
                  <button
                    type="submit"
                    className="w-full bg-[#1f3a6e] text-white py-2.5 rounded-lg font-medium hover:bg-[#0b1f44] transition-all duration-300 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <ScaleLoader color="white" height={15} />
                      </div>
                    ) : (
                      "Submit External OD Request"
                    )}
                  </button>
                </form>
              </div>
            </Tabs.Item>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
