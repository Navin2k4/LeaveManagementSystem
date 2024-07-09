import React, { useEffect, useState } from "react";
import {
  TextInput,
  Label,
  Button,
  Select,
  Spinner,
  Checkbox,
} from "flowbite-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// TOFIX If end date not selected then set the end date as the start data bug fix 

export default function LeaveRequestForm({ setTab }) {
  const { currentUser } = useSelector((state) => state.user);

  const isStaff = currentUser.userType === "Staff" || false;

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [classIncharges, setClassIncharges] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([
    "Casual Leave",
    "Sick Leave",
    "Earned Leave",
    "Maternity Leave",
    "Paternity Leave",
    "Study Leave",
    "Duty Leave",
    "Special Leave",
    "Sabbatical Leave",
  ]);
  const [forMedical, setForMedical] = useState(false);
  const [forOneDay, setForOneDay] = useState(false);
  const [isHalfDay, setIsHalfDay] = useState(null);


  const [formData, setFormData] = useState({
    name: currentUser.name,
    userId: currentUser.userType === "Staff" ? currentUser.userId : currentUser.id,
    userType: currentUser.userType,
    rollNo: currentUser.userType === "Staff" ? currentUser.id : currentUser.roll_no,
    regNo: currentUser.register_no,
    forMedical,
    batchId: "",
    sectionId: "",
    section_name:currentUser.section_name,
    departmentId: "",
    reason: "",
    classInchargeId: "",
    mentorId: "",
    leaveStartDate: "",
    leaveEndDate: "",
    isHalfDay,
    noOfDays: 0,
    typeOfLeave: "", // Added field for type of leave selection
  });

  console.log(currentUser);

  const handleForMedicalChange = (e) => {
    setForMedical(e.target.checked);
    setFormData({ ...formData, forMedical: e.target.checked });
  };
  const calculateDays = () => {
    if (formData.leaveStartDate && formData.leaveEndDate) {
      const startDate = new Date(formData.leaveStartDate);
      const endDate = new Date(formData.leaveEndDate);
      const differenceInTime = endDate.getTime() - startDate.getTime();
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
      setFormData({
        ...formData,
        noOfDays: differenceInDays + 1,
      });
    } else {
      setFormData({
        ...formData,
        noOfDays: 1,
      });
    }
  };

  useEffect(() => {
    calculateDays();
  }, [formData.leaveStartDate, formData.leaveEndDate]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/departments")
      .then((response) => response.json())
      .then((data) => setDepartments(data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (formData.sectionId) {
      const fetchStaff = async () => {
        try {
          const resMentor = await fetch(
            `/api/sections/${formData.sectionId}/mentors`
          );
          const mentorsData = await resMentor.json();
          setMentors(mentorsData);

          const resClassIncharge = await fetch(
            `/api/sections/${formData.sectionId}/classIncharges`
          );
          const classInchargesData = await resClassIncharge.json();
          setClassIncharges(classInchargesData);

          // Set classInchargeId in formData
          if (classInchargesData.length > 0) {
            setFormData({
              ...formData,
              classInchargeId: classInchargesData[0]._id,
            });
          }
        } catch (error) {
          console.error(error);
        }
      };

      fetchStaff();
    } else {
      setMentors([]);
      setClassIncharges([]);
    }
  }, [formData.sectionId]);

  const handleDepartmentChange = async (e) => {
    const deptId = e.target.value;
    setFormData({ ...formData, departmentId: deptId });

    try {
      const res = await fetch(`/api/departments/${deptId}/batches`);
      const data = await res.json();
      setBatches(data);
      setSections([]);
      setMentors([]);
      setClassIncharges([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBatchChange = async (e) => {
    const batchId = e.target.value;
    setFormData({ ...formData, batchId: batchId });

    try {
      const res = await fetch(`/api/batches/${batchId}/sections`);
      const data = await res.json();
      setSections(data);
      setMentors([]);
      setClassIncharges([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSectionChange = (e) => {
    const sectionId = e.target.value;
    setFormData({ ...formData, sectionId: sectionId });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleForOneDayChange = (e) => {
    setForOneDay(e.target.checked);
    if (e.target.checked) {
      setFormData({ ...formData, leaveEndDate: "" });
    }
  };
    
  const handleIsHalfDayChange = (selectedOption) => {
    setIsHalfDay(selectedOption);
    setFormData({
      ...formData,
      leaveEndDate:"",
      isHalfDay: selectedOption 
    });
  };
  

  const validateForm = () => {
    const newErrors = {};
    if (!formData.departmentId) newErrors.departmentId = "Department must be selected";
    if (!formData.leaveStartDate) newErrors.leaveStartDate = "Date from must be selected";
    if (!forOneDay && !isHalfDay && !formData.leaveEndDate) newErrors.leaveEndDate = "Date to must be selected";
    if (!forOneDay && !isHalfDay && formData.leaveEndDate < formData.leaveStartDate) newErrors.leaveEndDate = "Date to must be greater than Date from";
    if (!formData.reason) newErrors.reason = "Reason must be given";
    if (formData.reason && formData.reason.length > 200) newErrors.reason = "Reason must be less than 200 characters";
    return newErrors;
  };

  console.log(formData);

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
      const res = await fetch("/api/leave-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          toDate: forOneDay ? formData.leaveStartDate : formData.leaveEndDate,
          forMedical: forMedical ? true : false,
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
        setTab("DashBoard");
      }
    } catch (error) {
      setErrorMessage(
        "An error occurred while submitting the leave request. Please try again later."
      );
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-custom-gray font-sans my-3 rounded px-8 pb-8 mb-4 max-w-5xl w-full">
        <div className="flex justify-center mb-4">
          <h1 className="text-custom-div-bg font-bold uppercase text-2xl px-6 py-2 tracking-widest">
            Leave Form
          </h1>
        </div>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <Label
              htmlFor="name"
              className="mb-2 text-left font-bold tracking-wide"
            >
              Name
            </Label>
            <TextInput
              type="text"
              name="name"
              value={formData.name}
              placeholder="Dinesh Kumar K K"
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <Label
                htmlFor="rollNo"
                className="text-left font-bold tracking-wide"
              >
                {isStaff ? "Staff Id" : "Roll No"}
              </Label>
              <TextInput
                type="text"
                name="rollNo"
                value={formData.rollNo}
                placeholder={isStaff ? "Eg: CSE1010" : "Eg: 22CSEB01"}
                onChange={handleChange}
              />
            </div>
            {!isStaff && (
              <div className="flex flex-col gap-3">
                <Label
                  htmlFor="regNo"
                  className="text-left font-bold tracking-wide"
                >
                  Register Number
                </Label>
                <TextInput
                  type="text"
                  name="regNo"
                  value={formData.regNo}
                  placeholder="913122104103"
                  onChange={handleChange}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col">
                <Label
                  htmlFor="departmentId"
                  className="mb-2 text-left font-bold tracking-wide"
                >
                  Department
                </Label>
                <Select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleDepartmentChange}
                  className={errors.departmentId ? "border-red-500" : ""}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.dept_name}
                    </option>
                  ))}
                </Select>
                {errors.departmentId && (
                  <p className="text-red-800 text-xs italic">
                    {errors.departmentId}
                  </p>
                )}
              </div>
          {!isStaff && (
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
              {/* TOFIX:Can get the id of the batch and the section only display the batch and the section */}
              <div className="flex flex-col gap-3">
                <Label
                  htmlFor="batchId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Batch
                </Label>
                <Select
                  name="batchId"
                  id="batchId"
                  value={formData.batchId}
                  onChange={handleBatchChange}
                  required
                  className={`w-full tracking-wider ${
                    errors.batchId ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Select Batch</option>
                  {batches.map((batchId) => (
                    <option key={batchId._id} value={batchId._id}>
                      {batchId.batch_name}
                    </option>
                  ))}
                </Select>
                {errors.batchId && (
                  <p className="text-red-800 text-xs italic">
                    {errors.batchId}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Label
                  htmlFor="sectionId"
                  className="text-left font-bold tracking-wide"
                >
                  Section
                </Label>
                <Select
                  name="sectionId"
                  value={formData.sectionId}
                  required
                  onChange={handleSectionChange}
                  className={errors.sectionId ? "border-red-500" : ""}
                >
                  <option value="">Select Section</option>
                  {sections.map((sectionId) => (
                    <option key={sectionId._id} value={sectionId._id}>
                      {sectionId.section_name}
                    </option>
                  ))}
                </Select>
                {errors.sectionId && (
                  <p className="text-red-800 text-xs italic">
                    {errors.sectionId}
                  </p>
                )}
              </div>
            </div>
          )}
          {!isStaff && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label
                  htmlFor="mentorId"
                  className="text-left font-bold tracking-wide"
                >
                  Mentor Name
                </Label>
                <Select
                  name="mentorId"
                  value={formData.mentorId}
                  required
                  onChange={handleChange}
                  className={errors.mentorId ? "border-red-500" : ""}
                >
                  <option value="">Select Mentor</option>
                  {mentors.map((mentor) => (
                    <option key={mentor._id} value={mentor._id}>
                      {mentor.staff_name}
                    </option>
                  ))}
                </Select>
                {errors.mentorId && (
                  <p className="text-red-800 text-xs italic">
                    {errors.mentorId}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Label
                  htmlFor="classInchargeId"
                  className="text-left font-bold tracking-wide"
                >
                  Class Incharge Name
                </Label>
                <TextInput
                  type="text"
                  name="classInchargeId"
                  required
                  value={
                    classIncharges.length > 0
                      ? classIncharges[0].staff_name
                      : ""
                  }
                  readOnly
                  className={`rounded-md ${
                    errors.classInchargeId ? "border-red-500" : ""
                  }`}
                />
                {errors.classInchargeId && (
                  <p className="text-red-800 text-xs italic">
                    {errors.classInchargeId}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <Label
                htmlFor="leaveStartDate"
                className="text-left font-bold tracking-wide"
              >
                Date From
              </Label>
              <TextInput
                type="date"
                name="leaveStartDate"
                value={formData.leaveStartDate}
                onChange={handleChange}
                className={errors.leaveStartDate ? "border-red-500" : ""}
              />
              {errors.leaveStartDate && (
                <p className="text-red-800 text-xs italic">
                  {errors.leaveStartDate}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Label
                htmlFor="leaveEndDate"
                className="text-left font-bold tracking-wide"
              >
                Date To
              </Label>
              <TextInput
                type="date"
                name="leaveEndDate"
                value={formData.leaveEndDate}
                onChange={handleChange}
                disabled={forOneDay}
                className={errors.leaveEndDate ? "border-red-500" : ""}
              />
              {errors.leaveEndDate && (
                <p className="text-red-800 text-xs italic">
                  {errors.leaveEndDate}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="forOneDay"
              name="forOneDay"
              checked={forOneDay}
              onChange={handleForOneDayChange}
              className="text-primary-blue border-secondary-blue"
              />
            <Label htmlFor="forOneDay">Apply leave for one day only </Label>
          </div>

          <div className="flex items-center space-x-4">

      <div className="flex items-center space-x-2">
  <Checkbox
    id="FN"
    name="forHalfDay"
    checked={formData.isHalfDay === 'FN'}
    onChange={() => handleIsHalfDayChange('FN')}
    className="text-primary-blue border-secondary-blue"
  />
  <Label htmlFor="FN" className="font-normal">
    FN
  </Label>
</div>
<div className="flex items-center space-x-2">
  <Checkbox
    id="AN"
    name="forHalfDay"
    checked={formData.isHalfDay === 'AN'}
    onChange={() => handleIsHalfDayChange('AN')}
    className="text-primary-blue border-secondary-blue"
  />
  <Label htmlFor="AN" className="font-normal">
    AN
  </Label>
</div>
<Label htmlFor="forHalfDay">
        Select One in case of half day
      </Label>
    </div>

          {isStaff ? (
            <div className="flex flex-col">
              <Label
                htmlFor="typeOfLeave"
                className="mb-2 text-left font-bold tracking-wide"
              >
                Type of Leave
              </Label>
              <Select
                id="typeOfLeave"
                name="typeOfLeave"
                value={formData.typeOfLeave}
                onChange={handleChange}
                className={`border border-custom-div-gray rounded-md py-2  text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.typeOfLeave ? "border-red-500" : ""
                }`}
              >
                <option value="">Select Type of Leave</option>
                {leaveTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
              {errors.typeOfLeave && (
                <p className="text-red-800 text-xs italic">
                  {errors.typeOfLeave}
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Checkbox
                id="forMedical"
                name="forMedical"
                checked={forMedical}
                onChange={handleForMedicalChange}
                className="text-primary-blue border-secondary-blue"
              />
              <Label htmlFor="forMedical">Is this for medical reason?</Label>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Label
              htmlFor="reason"
              className="text-left font-bold tracking-wide"
            >
              Reason
            </Label>
            <textarea
              name="reason"
              value={formData.reason}
              cols="30"
              rows="4"
              onChange={handleChange}
              className={`rounded-md ${errors.reason ? "border-red-500" : ""}`}
            ></textarea>
            {errors.reason && (
              <p className="text-red-800 text-xs italic">{errors.reason}</p>
            )}
          </div>
          <Button
            type="submit"
            className="bg-gradient-to-r from-primary-blue  via-secondary-blue/85 to-primary-blue  hover:bg-primary-blue text-white p-2 font-bold tracking-wide rounded-md transition-all duration-300"
          >
            {loading ? (
              <div className="flex items-center">
                <Spinner size="sm" className="mr-2" />
                <span className="text-white">Loading...</span>
              </div>
            ) : (
              <span className="text-white">Submit</span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
