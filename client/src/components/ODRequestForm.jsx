import React, { useState } from "react";
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

  const [formData, setFormData] = useState({
    // Common fields
    name: currentUser.name,
    email: currentUser.email,
    userId:
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

    // OD specific fields
    odType: "internal", // or "external"
    startDate: "",
    endDate: "",
    reason: "",

    // External OD fields
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your submit logic here
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
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm text-sm"
          />
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
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm text-sm"
          />
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
          className="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm text-sm"
          placeholder="Please provide the reason for internal OD..."
        />
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
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm text-sm"
            placeholder="Enter college or company name"
          />
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
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm text-sm"
            placeholder="Enter city name"
          />
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
          className="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm text-sm"
          placeholder="Enter program or event name"
        />
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
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm text-sm"
          />
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
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm text-sm"
          />
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Event Type
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
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm text-sm"
            placeholder="Enter paper title"
          />
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
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm text-sm"
            placeholder="Enter project title"
          />
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
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm text-sm"
            placeholder="Please provide detailed information about the event..."
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-slate-200 p-4">
          <h2 className="text-lg font-semibold text-black">Request OD</h2>
          <p className="text-black/80 text-sm mt-1">
            Fill in the details below to submit your OD request
          </p>
        </div>

        <div className="p-4">
          <Tabs theme={customTabTheme}>
            <Tabs.Item active={true} title="Internal OD">
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

            <Tabs.Item title="External OD">
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
