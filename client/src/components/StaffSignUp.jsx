import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Alert,
  Spinner,
  Select,
  TextInput,
  Checkbox,
  Label,
} from "flowbite-react";

export default function SignUp() {
  const [formData, setFormData] = useState({
    staff_name: "",
    staff_id: "",
    staff_email: "",
    staff_phone: "",
    staff_departmentId: "",
    isMentor: false,
    isClassIncharge: false,
    isHod:false,
    isPEStaff:false,
    classInchargeBatchId: null, // Use null instead of empty string
    classInchargeSectionId: null, // Use null instead of empty string
    numberOfClassesHandledAsMentor: 0,
    mentorHandlingData: [],
    password: "",
    confirmpassword: "",
    userType: "Staff",
  });

  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mentorSections, setMentorSections] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/departments")
      .then((response) => response.json())
      .then((data) => setDepartments(data))
      .catch((error) => console.error(error));
  }, []);

  const handleDepartmentChange = async (e) => {
    const deptId = e.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      staff_departmentId: deptId,
    }));

    try {
      const res = await fetch(`/api/departments/${deptId}/batches`);
      const data = await res.json();
      setBatches(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBatchChange = async (e) => {
    const batchId = e.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      classInchargeBatchId: batchId === "" ? null : batchId, // Convert empty string to null
    }));
    try {
      const res = await fetch(`/api/batches/${batchId}/sections`);
      const data = await res.json();
      setSections(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    let newValue = value;
    if (id === "staff_name" || id === "staff_id") {
      newValue = value.toUpperCase();
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: newValue,
    }));
  };

  const handleClassInchargeSectionChange = (e) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      classInchargeSectionId: value === "" ? null : value, // Convert empty string to null
    }));
  };

  const handleRoleChange = (event) => {
    const { name, checked } = event.target;

    if (name === 'isHod') {
      // If HOD checkbox is checked, deselect Class Incharge and Mentor
      if (checked) {
        setFormData({
          ...formData,
          isHod: checked,
          isClassIncharge: false,
          isMentor: false,
          isPEStaff: false
        });
      } else {
        // If HOD checkbox is unchecked, maintain the current state of other checkboxes
        setFormData({
          ...formData,
          isHod: checked,
        });
      }
    } else {
      // For Class Incharge and Mentor checkboxes, update their checked state
      setFormData({
        ...formData,
        [name]: checked,
      });
    }
  };

  const handleNumClassesChange = (e) => {
    const numClasses = parseInt(e.target.value, 10);
    const newMentorHandlingData = Array.from({ length: numClasses }, () => ({
      handlingBatchId: null, // Use null instead of empty string
      handlingSectionId: null, // Use null instead of empty string
    }));

    setFormData((prevFormData) => ({
      ...prevFormData,
      numberOfClassesHandledAsMentor: numClasses,
      mentorHandlingData: newMentorHandlingData,
    }));
  };

  const handleBatchSectionChange = async (e, index) => {
    const { name, value } = e.target;
    const updatedMentorHandlingData = [...formData.mentorHandlingData];
    const propName = name.split("-")[0]; // Extract 'handlingBatchId' or 'handlingSectionId'

    // Ensure handlingBatchId and handlingSectionId are null if value is ""
    const sanitizedValue = value === "" ? null : value;

    updatedMentorHandlingData[index] = {
      ...updatedMentorHandlingData[index],
      [propName]: sanitizedValue,
    };

    setFormData((prevFormData) => ({
      ...prevFormData,
      classInchargeBatchId: formData.classInchargeBatchId || null,
      classInchargeSectionId: formData.classInchargeSectionId || null,
      mentorHandlingData: updatedMentorHandlingData,
    }));

    if (propName === "handlingBatchId" && value !== "") {
      try {
        const res = await fetch(`/api/batches/${value}/sections`);
        const data = await res.json();

        const newMentorSections = [...mentorSections];
        newMentorSections[index] = data;
        setMentorSections(newMentorSections);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    const {
      staff_name,
      staff_id,
      staff_email,
      staff_phone,
      password,
      confirmpassword,
    } = formData;

    if (!staff_name) errors.staff_name = "Name is required";
    if (!/^[a-zA-Z\s]+$/.test(staff_name))
      errors.staff_name = "Name should contain only letters and spaces";
    if (!staff_id) errors.staff_id = "Staff ID is required";
    if (!staff_email) errors.staff_email = "Email is required";
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(staff_email))
      errors.staff_email = "Invalid email address";
    if (!staff_phone) errors.staff_phone = "Phone number is required";
    if (!/^[0-9]{10}$/.test(staff_phone))
      errors.staff_phone = "Invalid phone number";
    if (!password) errors.password = "Password is required";
    if (!/^.{8,16}$/.test(password))
      errors.password = "Password should be 8 to 16 characters long";
    if (password !== confirmpassword)
      errors.confirmpassword = "Passwords do not match";

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const formattedMentorHandlingData = formData.mentorHandlingData.map(
      (data) => ({
        handlingBatchId: data.handlingBatchId,
        handlingSectionId: data.handlingSectionId,
      })
    );

    try {
      setLoading(true);
      setErrorMessage(null);
      const endpoint = formData.isHod ? "/api/auth/hodsignup" : "/api/auth/staffsignup";
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            mentorHandlingData: formattedMentorHandlingData,
          }),
        });          
        const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        setErrorMessage(data.message || "Sign up failed");
        return;
      }
      if (!res.ok) {
        setLoading(false);
        return;
      }
      setLoading(false);
      navigate("/signin");
    } catch (error) {
      setErrorMessage(
        error.message ||
          "An error occurred while signing up. Please try again later."
      );
      setLoading(false);
    }
  };


  return (
    <div className="flex justify-center md:mt-5 md:my-10 ">
      <section className="w-full max-w-2xl px-6 py-3 mx-auto h-auto bg-gradient-to-t from-blue-500 to-[#0f172a] shadow-black md:shadow-md md:rounded-lg">
        <div className="mt-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white tracking-wider">
              Staff Sign Up
            </h2>
          </div>
          <Link to="/studentsignup" className="text-center p-3">
            <h2 className="font-medium  text-blue-200 underline hover:tracking-wider transition-all duration-500">
              Click here for Student Sign Up
            </h2>
          </Link>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="staff_name"
                className="block text-sm font-medium text-ternary-blue"
              >
                Name<span className="text-red-400"> *</span>
              </label>
              <TextInput
                type="text"
                id="staff_name"
                placeholder="John Doe"
                className="block w-full py-2 mt-1 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                onChange={handleChange}
              />
              {errors.staff_name && (
                <p className="text-red-500 text-xs italic">
                  {errors.staff_name}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="staff_id"
                  className="block text-sm font-medium text-ternary-blue"
                >
                  Staff ID<span className="text-red-400"> *</span>
                </label>
                <TextInput
                  type="text"
                  id="staff_id"
                  placeholder="S001"
                  className="block w-full py-2 mt-1 rounded-md shadow-sm focus:outline// ...continued from previous snippet

.none focus:ring-1 focus:ring-black"
                  onChange={handleChange}
                />
                {errors.staff_id && (
                  <p className="text-red-500 text-xs italic">
                    {errors.staff_id}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="staff_email"
                  className="block text-sm font-medium text-ternary-blue"
                >
                  Email<span className="text-red-400"> *</span>
                </label>
                <TextInput
                  type="email"
                  id="staff_email"
                  placeholder="example@example.com"
                  className="block w-full py-2 mt-1 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                  onChange={handleChange}
                  />
<p class="text-sm text-gray-200">OTP will be sent to your email after submitting</p>
                {errors.staff_email && (
                  <p className="text-red-500 text-xs italic">
                    {errors.staff_email}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="staff_phone"
                  className="block text-sm font-medium text-ternary-blue"
                >
                  Phone<span className="text-red-400"> *</span>
                </label>
                <TextInput
                  type="tel"
                  id="staff_phone"
                  placeholder="1234567890"
                  className="block w-full py-2 mt-1 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                  onChange={handleChange}
                />
                {errors.staff_phone && (
                  <p className="text-red-500 text-xs italic">
                    {errors.staff_phone}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <Label
                  htmlFor="staff_department"
                  className="mb-2 text-left font-bold text-ternary-blue tracking-wide"
                >
                  Department<span className="text-red-400"> *</span>
                </Label>
                <Select
                  name="staff_department"
                  value={formData.staff_departmentId}
                  onChange={handleDepartmentChange}
                  className={errors.staff_department ? "border-red-500 " : " mt-1"}
                >
                  <option value="" className="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.dept_name}
                    </option>
                  ))}
                </Select>
                {errors.staff_department && (
                  <p className="text-red-500 text-xs italic">
                    {errors.staff_department}
                  </p>
                )}
              </div>
            </div>
            <div className="flex md:flex-row flex-col gap-3 ">
              <div className="">
                <Label className="text-ternary-blue">Are you HOD</Label>
                <Checkbox
                  name="isHod"
                  id="isHod"
                  label="HOD"
                  checked={formData.isHod}
                  onChange={handleRoleChange}
                  className="text-orange-400 mx-2 border-black"
                />
              </div>
              <div className="">
                <Label className={`${formData.isHod ? 'text-gray-400' : 'text-ternary-blue'} `}  >Are you a Class Incharge</Label>
                <Checkbox
                  name="isClassIncharge"
                  id="isClassIncharge"
                  label="Class Incharge"
                  checked={formData.isClassIncharge}
                  onChange={handleRoleChange}
                  disabled={formData.isHod}
                  className={`${formData.isHod ? 'bg-gray-400 border-gray-300' : 'border-black'} mx-2 text-orange-400`}
                />
              </div>
              <div className="">
                <Label className={`${formData.isHod ? 'text-gray-400' : 'text-ternary-blue'} `}  >Are you a PE Staff</Label>
                <Checkbox
                  name="isPEStaff"
                  id="isPEStaff"
                  label="PE Staff"
                  checked={formData.isPEStaff}
                  onChange={handleRoleChange}
                  disabled={formData.isHod}
                  className={`${formData.isHod ? 'bg-gray-400 border-gray-300' : 'border-black'} mx-2 text-orange-400`}
                />
              </div>
              <div>
              <Label className={`${formData.isHod ? 'text-gray-400' : 'text-ternary-blue'} `}  >Are you a Mentor</Label>
              <Checkbox
                  name="isMentor"
                  id="isMentor"
                  label="Mentor"
                  checked={formData.isMentor}
                  onChange={handleRoleChange}
                  disabled={formData.isHod}

                  className={`${formData.isHod ? 'bg-gray-400 border-gray-300' : 'border-black'} mx-2 text-orange-400 `}
                />
              </div>
            </div>
            {formData.isClassIncharge && (
              <>
                <div>
                  <h2 className="text-ternary-blue font-semibold">
                    Class Incharge Detail
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-3">
                    <Label
                      htmlFor="classInchargeBatchId"
                      className="mb-2 text-left font-bold tracking-wide text-ternary-blue"
                    >
                      Batch
                    </Label>
                    <Select
                      name="classInchargeBatchId"
                      value={formData.classInchargeBatchId}
                      onChange={handleBatchChange}
                      className={
                        errors.classInchargeBatchId ? "border-red-500" : ""
                      }
                    >
                      <option value="">Select Batch</option>
                      {batches.map((batch) => (
                        <option key={batch._id} value={batch._id}>
                          {batch.batch_name}
                        </option>
                      ))}
                    </Select>
                    {errors.classInchargeBatchId && (
                      <p className="text-red-500 text-xs italic">
                        {errors.classInchargeBatchId}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label
                      htmlFor="classInchargeSectionId"
                      className="text-white mb-2 text-left font-bold tracking-wide"
                    >
                      Section
                    </Label>
                    <Select
                      name="classInchargeSectionId"
                      value={formData.classInchargeSectionId}
                      onChange={handleClassInchargeSectionChange}
                      className={
                        errors.classInchargeSectionId ? "border-red-500" : ""
                      }
                    >
                      <option value="">Select Section</option>
                      {sections.map((section) => (
                        <option key={section._id} value={section._id}>
                          {section.section_name}
                        </option>
                      ))}
                    </Select>

                    {errors.classInchargeSectionId && (
                      <p className="text-red-500 text-xs italic">
                        {errors.classInchargeSectionId}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
            {formData.isMentor && (
              <>
                <div>
                  <h2 className="text-ternary-blue font-semibold">
                    Mentor Details
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col gap-3">
                    <Label
                      htmlFor="numberOfClassesHandledAsMentor"
                      className="mb-2 text-left font-bold tracking-wide text-ternary-blue "
                    >
                      Number of Classes Handled
                    </Label>
                    <TextInput
                      type="number"
                      id="numberOfClassesHandledAsMentor"
                      placeholder="Enter number of classes"
                      className="block w-full  rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                      onChange={handleNumClassesChange}
                    />
                    {errors.numberOfClassesHandledAsMentor && (
                      <p className="text-red-500 text-xs italic">
                        {errors.numberOfClassesHandledAsMentor}
                      </p>
                    )}
                  </div>
                </div>
                {formData.numberOfClassesHandledAsMentor > 0 && (
                  <div>
                    <h2 className="text-ternary-blue font-semibold">
                      Handling Details
                    </h2>
                    {formData.mentorHandlingData.map((data, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4"
                      >
                        <div className="flex flex-col gap-3">
                          <Label
                            htmlFor={`handlingBatchId-${index}`}
                            className="mb-2 text-left font-bold tracking-wide text-ternary-blue"
                          >
                            Batch
                          </Label>
                          <Select
                            name={`handlingBatchId-${index}`}
                            value={data.handlingBatchId}
                            onChange={(e) => handleBatchSectionChange(e, index)}
                            className={
                              errors[`handlingBatchId-${index}`]
                                ? "border-red-500"
                                : ""
                            }
                          >
                            <option value="">Select Batch</option>
                            {batches.map((batch) => (
                              <option key={batch._id} value={batch._id}>
                                {batch.batch_name}
                              </option>
                            ))}
                          </Select>
                          {errors[`handlingBatchId-${index}`] && (
                            <p className="text-red-500 text-xs italic">
                              {errors[`handlingBatchId-${index}`]}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-3">
                          <Label
                            htmlFor={`handlingSectionId-${index}`}
                            className="mb-2 text-left font-bold tracking-wide text-ternary-blue"
                          >
                            Section
                          </Label>
                          <Select
                            name={`handlingSectionId-${index}`}
                            value={data.handlingSectionId}
                            onChange={(e) => handleBatchSectionChange(e, index)}
                            className={
                              errors[`handlingSectionId-${index}`]
                                ? "border-red-500"
                                : ""
                            }
                          >
                            <option value="">Select Section</option>
                            {mentorSections[index]?.map((section) => (
                              <option key={section._id} value={section._id}>
                                {section.section_name}
                              </option>
                            ))}
                          </Select>
                          {errors[`handlingSectionId-${index}`] && (
                            <p className="text-red-500 text-xs italic">
                              {errors[`handlingSectionId-${index}`]}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="password"
                  className="mb-2 text-left font-bold tracking-wide text-ternary-blue"
                >
                  Password<span className="text-red-400"> *</span>
                </Label>
                <TextInput
                  type="password"
                  id="password"
                  placeholder="Enter password"
                  className=" block w-full py-2 mt-1 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs italic">
                    {errors.password}
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="confirmpassword"
                  className="mb-2 text-left font-bold tracking-wide text-ternary-blue"
                >
                  Confirm Password<span className="text-red-400"> *</span>
                </Label>
                <TextInput
                  type="password"
                  id="confirmpassword"
                  placeholder="Confirm password"
                  className="block w-full py-2 mt-1 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                  onChange={handleChange}
                />
                {errors.confirmpassword && (
                  <p className="text-red-500 text-xs italic">
                    {errors.confirmpassword}
                  </p>
                )}
              </div>
            </div>
            {errorMessage && (
          <Alert color="failure" className="mb-4">
                {errorMessage}
              </Alert>
            )}
            <div className="flex  flex-col-reverse md:flex-row items-center justify-between mt-8 gap-3">
              <Link
                to="/signin"
                className="text-white underline font-medium"
              >
                Already have an account? Sign in
              </Link>
              <button
                type="submit"
                className="px-6 py-2 text-white bg-[#0f172a] rounded-md shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary-blue"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <Spinner size="sm" className="mr-2" />
                    <span className="text-white">Loading...</span>
                  </div>
                ) : (
                  <div className="px-10">
                    Sign Up

                  </div>
                )}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
