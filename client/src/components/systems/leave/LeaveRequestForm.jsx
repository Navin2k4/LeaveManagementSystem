import React, { useEffect, useState } from "react";
import { Label, Checkbox } from "flowbite-react";
import { useSelector } from "react-redux";
import { ScaleLoader } from "react-spinners";
import { Calendar, Clock, FileText, AlertCircle } from "lucide-react";

export default function LeaveRequestForm({ setTab, mentor, classIncharge }) {
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const [forMedical, setForMedical] = useState(false);
  const [forOneDay, setForOneDay] = useState(false);
  const [isHalfDay, setIsHalfDay] = useState(null);

  const [formData, setFormData] = useState({
    name: currentUser.name,
    parent_phone: currentUser.parent_phone,
    email: currentUser.email,
    userId:
      currentUser.userType === "Staff" ? currentUser.userId : currentUser.id,
    userType: currentUser.userType,
    rollNo:
      currentUser.userType === "Staff" ? currentUser.id : currentUser.roll_no,
    regNo: currentUser.register_no,
    forMedical,
    batchId: currentUser.batchId,
    sectionId: currentUser.sectionId,
    section_name: currentUser.section_name,
    departmentId: currentUser.departmentId,
    reason: "",
    classInchargeId: classIncharge._id,
    mentorId: mentor._id,
    leaveStartDate: "",
    leaveEndDate: "",
    isHalfDay: null,
    noOfDays: 0,
    typeOfLeave: "",
  });
  const handleForMedicalChange = (e) => {
    setForMedical(e.target.checked);
    setFormData({ ...formData, forMedical: e.target.checked });
  };

  const calculateDays = () => {
    const { leaveStartDate, leaveEndDate } = formData;

    if (!leaveStartDate || !leaveEndDate) return;

    const startDate = new Date(leaveStartDate);
    const endDate = new Date(leaveEndDate);

    let totalDays = 0;
    let isSecondSaturdayInRange = false;

    // Ensure startDate is not after endDate
    if (startDate > endDate) {
      console.error("Start date must not be after end date");
      return;
    }

    for (
      let date = new Date(startDate);
      date <= endDate;
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

    // Calculate the total number of days inclusive
    const differenceInTime = endDate.getTime() - startDate.getTime();
    const differenceInDays =
      Math.ceil(differenceInTime / (1000 * 3600 * 24)) + 1;

    setFormData((prevFormData) => ({
      ...prevFormData,
      noOfDays: totalDays,
      differenceInDays: differenceInDays,
    }));
  };

  useEffect(() => {
    if (forOneDay && formData.leaveStartDate) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        leaveEndDate: prevFormData.leaveStartDate,
      }));
    }
    calculateDays();
  }, [formData.leaveStartDate, formData.leaveEndDate, forOneDay]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleForOneDayChange = (e) => {
    setForOneDay(e.target.checked);
    if (e.target.checked) {
      setFormData({ ...formData, leaveEndDate: formData.leaveStartDate });
    }
  };

  const handleIsHalfDayChange = (selectedOption) => {
    setIsHalfDay((prevIsHalfDay) =>
      prevIsHalfDay === selectedOption ? null : selectedOption
    );
    setFormData({
      ...formData,
      isHalfDay: isHalfDay === selectedOption ? null : selectedOption,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const currentDate = new Date().toISOString().split("T")[0];

    if (!formData.departmentId) {
      newErrors.departmentId = "Department must be selected";
    }

    if (!formData.leaveStartDate) {
      newErrors.leaveStartDate = "Date from must be selected";
    } else if (formData.leaveStartDate < currentDate) {
      newErrors.leaveStartDate = "Date from must not be in the past";
    }

    if (!forOneDay && !isHalfDay && !formData.leaveEndDate) {
      newErrors.leaveEndDate = "Date to must be selected";
    } else if (formData.leaveEndDate && formData.leaveEndDate < currentDate) {
      newErrors.leaveEndDate = "Date to must not be in the past";
    } else if (
      !forOneDay &&
      formData.leaveEndDate &&
      formData.leaveEndDate < formData.leaveStartDate
    ) {
      newErrors.leaveEndDate = "Date to must be greater than Date from";
    }
    if (!formData.reason) {
      newErrors.reason = "Reason must be given";
    } else if (formData.reason.length > 200) {
      newErrors.reason = "Reason must be less than 200 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const { classInchargeId, mentorId } = formData;
      const res = await fetch("/api/leave-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          toDate: forOneDay ? formData.leaveStartDate : formData.leaveEndDate,
          forMedical: forMedical ? true : false,
          mentorId: classInchargeId === mentorId ? mentorId : mentorId,
        }),
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
        setTab("Your Leave Requests");
      }
    } catch (error) {
      setErrorMessage(
        "An error occurred while submitting the leave request. Please try again later."
      );
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Leave Request
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Fill in the details below to submit your leave request
          </p>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <form className="p-4 space-y-4" onSubmit={handleSubmit}>
          {/* Date Selection Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Calendar size={16} />
                Date From<span className="text-red-400">*</span>
              </Label>
              <input
                type="date"
                name="leaveStartDate"
                value={formData.leaveStartDate}
                onChange={handleChange}
                className={`w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm text-sm
                  ${errors.leaveStartDate ? "border-red-500" : ""}`}
              />
              {errors.leaveStartDate && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.leaveStartDate}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Calendar size={16} />
                Date To<span className="text-red-400">*</span>
              </Label>
              <input
                type="date"
                name="leaveEndDate"
                value={formData.leaveEndDate}
                onChange={handleChange}
                disabled={forOneDay}
                className={`w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm text-sm
                  ${errors.leaveEndDate ? "border-red-500" : ""}`}
              />
              {errors.leaveEndDate && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.leaveEndDate}
                </p>
              )}
            </div>
          </div>

          {/* Options Section */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="forOneDay"
                checked={forOneDay}
                onChange={handleForOneDayChange}
                className="text-[#1f3a6e] rounded"
              />
              <Label
                htmlFor="forOneDay"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                Apply leave for one day only
              </Label>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-500" />
                <Label className="text-sm text-gray-700 dark:text-gray-300">
                  Half Day Options:
                </Label>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="FN"
                    checked={isHalfDay === "FN"}
                    onChange={() => handleIsHalfDayChange("FN")}
                    className="text-[#1f3a6e] rounded"
                  />
                  <Label htmlFor="FN" className="text-sm">
                    FN
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="AN"
                    checked={isHalfDay === "AN"}
                    onChange={() => handleIsHalfDayChange("AN")}
                    className="text-[#1f3a6e] rounded"
                  />
                  <Label htmlFor="AN" className="text-sm">
                    AN
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="forMedical"
                checked={forMedical}
                onChange={handleForMedicalChange}
                className="text-[#1f3a6e] rounded"
              />
              <Label
                htmlFor="forMedical"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                Is this for medical reason?
              </Label>
            </div>
          </div>

          {/* Reason Section */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <FileText size={16} />
              Reason<span className="text-red-400">*</span>
            </Label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="3"
              className={`w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm text-sm
                ${errors.reason ? "border-red-500" : ""}`}
              placeholder="Please provide a detailed reason for your leave request..."
            ></textarea>
            {errors.reason && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.reason}
              </p>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {errorMessage}
            </div>
          )}

          {/* Submit Button */}
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
              "Submit Leave Request"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
