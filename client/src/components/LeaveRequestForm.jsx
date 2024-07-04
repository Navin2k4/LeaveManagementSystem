import React, { useEffect, useState } from "react";
import { TextInput, Label, Button, Select ,Spinner, Checkbox} from "flowbite-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; 

export default function LeaveRequestForm({ setTab }) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const [batchs, setYears] = useState([]);
  const [departments, setDepartments] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [classIncharges, setClassIncharges] = useState([]);

  const [forMedical, setForMedical] = useState(false);
  const [forOneDay, setForOneDay] = useState(false);

  const [formData, setFormData] = useState({
    name: currentUser.name,
    userId: currentUser.id,
    userType:currentUser.userType,
    rollNo: currentUser.roll_no,
    regNo: currentUser.register_no,
    forMedical,
    batchId: "",
    sectionId: "",
    departmentId: "",
    reason: "",
    classInchargeId: "",
    mentorId: "",
    leaveStartDate: "",
    leaveEndDate: "",
    noOfDays:0,
  });

  const calculateDays = () => {
    if (formData.leaveStartDate && formData.leaveEndDate) {
      const startDate = new Date(formData.leaveStartDate);
      const endDate = new Date(formData.leaveEndDate);
      const differenceInTime = endDate.getTime() - startDate.getTime();
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
      setFormData({
        ...formData,
        noOfDays: differenceInDays
      });
    } else {
      setFormData({
        ...formData,
        noOfDays: 1 
      });
    }
  };

  useEffect(() => {
    calculateDays();
  }, [formData.leaveStartDate, formData.leaveEndDate]);
 const navigate = useNavigate();

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 4;
    const endYear = startYear + 4;
    const batchOptions = [];
    for (let batchId = startYear; batchId <= endYear; batchId++) {
      batchOptions.push(`${batchId}-${batchId + 4}`);
    }
    setYears(batchOptions);
  }, []);

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

  const handleForMedicalChange = (e) => {
    setForMedical(e.target.checked);
    setFormData({ ...formData, forMedical: e.target.checked });
  };
  
  const validateForm = () => {
    const newErrors = {};
    if (!formData.departmentId) newErrors.departmentId = "Department must be selected";
    if (!formData.batchId) newErrors.batchId = "Batch must be selected";
    if (!formData.sectionId) newErrors.sectionId = "Section must be selected";
    if (!formData.mentorId) newErrors.mentorId = "Mentor must be selected";
    if (!formData.classInchargeId) newErrors.classInchargeId = "Class Incharge must be selected";
    if (!formData.leaveStartDate) {
      newErrors.leaveStartDate = "Date from must be selected";
    } else {
      const today = new Date();
      const leaveStartDate = new Date(formData.leaveStartDate);
    if (leaveStartDate < today) {newErrors.leaveStartDate = "Leave start date cannot be in the past";}
    }
    if (!forOneDay && !formData.leaveEndDate) newErrors.leaveEndDate = "Date to must be selected";
    if (!forOneDay && formData.leaveEndDate < formData.leaveStartDate) newErrors.leaveEndDate = "Date to must be greater than Date from";
    if (!formData.reason) newErrors.reason = "Reason must be given";
    if (formData.reason && formData.reason.length > 200) newErrors.reason = "Reason must be less than 200 characters";
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
        if (data.message.includes("Leave end date must be after the start date")) {
          setErrorMessage("Leave end date must be after the start date");
        } else if (data.message.includes("You already have a leave request for this period")) {
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
      <div className="bg-custom-gray font-sans shadow-lg my-3 rounded px-8 pt-6 pb-8 mb-4 max-w-5xl w-full">
        <div className="flex justify-center space-x4 mb-4">
          <h1 className="text-custom-div-bg font-bold text-2xl px-6 py-2 tracking-wide">
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
                Roll No
              </Label>
              <TextInput
                type="text"
                name="rollNo"
                value={formData.rollNo}
                placeholder="22CSEB35"
                onChange={handleChange}
              />
            </div>
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
          </div>

          <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
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
                className={errors.departmentId ? 'border-red-500' : ''}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.dept_name}
                  </option>
                ))}
              </Select>
              {errors.departmentId && (
                <p className="text-red-500 text-xs italic">{errors.departmentId}</p>
              )}
            </div>

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
                className={`w-full tracking-wider ${errors.batchId ? 'border-red-500' : ''}`}
              >
                <option value="">Select Batch</option>
                {batches.map((batchId) => (
                  <option key={batchId._id} value={batchId._id}>
                    {batchId.batch_name}
                  </option>
                ))}
              </Select>
              {errors.batchId && (
                <p className="text-red-500 text-xs italic">{errors.batchId}</p>
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
                onChange={handleSectionChange}
                className={errors.sectionId ? 'border-red-500' : ''}
              >
                <option value="">Select Section</option>
                {sections.map((sectionId) => (
                  <option key={sectionId._id} value={sectionId._id}>
                    {sectionId.section_name}
                  </option>
                ))}
              </Select>
              {errors.sectionId && (
                <p className="text-red-500 text-xs italic">{errors.sectionId}</p>
              )}
            </div>
          </div>
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
                onChange={handleChange}
                className={errors.mentorId ? 'border-red-500' : ''}
              >
                <option value="">Select Mentor</option>
                {mentors.map((mentor) => (
                  <option key={mentor._id} value={mentor._id}>
                    {mentor.staff_name}
                  </option>
                ))}
              </Select>
              {errors.mentorId && (
                <p className="text-red-500 text-xs italic">{errors.mentorId}</p>
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
                value={classIncharges.length > 0 ? classIncharges[0].staff_name : ''}
                readOnly
                className={`rounded-md ${errors.classInchargeId ? 'border-red-500' : ''}`}
              />
              {errors.classInchargeId && (
                <p className="text-red-500 text-xs italic">{errors.classInchargeId}</p>
              )}
            </div>
          </div>
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
                className={errors.leaveStartDate ? 'border-red-500' : ''}
              />
              {errors.leaveStartDate && (
                <p className="text-red-500 text-xs italic">{errors.leaveStartDate}</p>
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
                className={errors.leaveEndDate ? 'border-red-500' : ''}
              />
              {errors.leaveEndDate && (
                <p className="text-red-500 text-xs italic">{errors.leaveEndDate}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="forOneDay"
              name="forOneDay"
              checked={forOneDay}
              onChange={handleForOneDayChange}
            />
            <Label htmlFor="forOneDay">Apply leave for one day only</Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="forMedical"
              name="forMedical"
              checked={forMedical}
              onChange={handleForMedicalChange}
            />
            <Label htmlFor="forMedical">Is this for medical reason?</Label>
            </div>

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
              className={`rounded-md ${errors.reason ? 'border-red-500' : ''}`}
            ></textarea>
            {errors.reason && (
              <p className="text-red-500 text-xs italic">{errors.reason}</p>
            )}
          </div>
          <Button
            type="submit"
            className="text-white p-2 font-bold tracking-wide rounded-md"
          >
            {loading ? (
              <div className="flex items-center">
                <Spinner size="sm" className="mr-2" />
                <span>Loading...</span>
              </div>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
