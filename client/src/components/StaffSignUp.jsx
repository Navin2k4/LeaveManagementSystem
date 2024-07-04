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
    isClassIncharge: false,
    classInchargeBatchId: "",
    classInchargeSectionId: "",
    isMentor: false,
    numberOfClassesHandledAsMentor: 0,
    mentorHandlingData: [],
    password: "",
    userType: "Staff",
  });

  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
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
      classInchargeBatchId: batchId,
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
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };
  const handleClassInchargeSectionChange = (e) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      classInchargeSectionId: value,
    }));
  };
  const handleRoleChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: checked }));
  };

  const handleNumClassesChange = (e) => {
    const numClasses = parseInt(e.target.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      numberOfClassesHandledAsMentor: numClasses,
    }));

    const newMentorHandlingData = [];
    for (let i = 0; i < numClasses; i++) {
      newMentorHandlingData.push({
        handlingbatcesid: "",
        handlingsectionid: "",
      });
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      mentorHandlingData: newMentorHandlingData,
    }));
  };

  const handleBatchSectionChange = (e, index) => {
    const { name, value } = e.target;
    const updatedMentorHandlingData = [...formData.mentorHandlingData];
    const propName = name.split("-")[0]; // Extract 'handlingbatcesid' or 'handlingsectionid'
    const dataIndex = parseInt(name.split("-")[1]); // Extract index from name

    updatedMentorHandlingData[index] = {
      ...updatedMentorHandlingData[index],
      [propName]: value,
    };

    setFormData((prevFormData) => ({
      ...prevFormData,
      mentorHandlingData: updatedMentorHandlingData,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Sign up failed");
      }

      setLoading(false);
      navigate("/signin");
    } catch (error) {
      setErrorMessage(
        "An error occurred while signing up. Please try again later."
      );
      setLoading(false);
    }
  };

  console.log(formData);

  return (
    <div className="flex justify-center my-8">
      <section className="w-full max-w-2xl px-6 py-3 mx-auto h-auto bg-white rounded-lg shadow-lg border-l-4 border-linkedin-blue">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Staff Sign Up</h2>
        </div>
        <Link to="/signup" className="text-center p-3">
          <h2 className="font-medium text-linkedin-blue hover:tracking-wider transition-all duration-500">
            Click here for Student Sign Up
          </h2>
        </Link>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="staff_name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <TextInput
                type="text"
                id="staff_name"
                placeholder="John Doe"
                className="block w-full py-2 mt-1 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="staff_id"
                  className="block text-sm font-medium text-gray-700"
                >
                  Staff ID
                </label>
                <TextInput
                  type="text"
                  id="staff_id"
                  placeholder="S001"
                  className="block w-full py-2 mt-1 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="staff_email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <TextInput
                  type="email"
                  id="staff_email"
                  placeholder="example@example.com"
                  className="block w-full py-2 mt-1 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="staff_phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone
                </label>
                <TextInput
                  type="tel"
                  id="staff_phone"
                  placeholder="1234567890"
                  className="block w-full py-2 mt-1 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col">
                <Label
                  htmlFor="staff_department"
                  className="mb-2 text-left font-bold tracking-wide"
                >
                  Department
                </Label>
                <Select
                  name="staff_department"
                  value={formData.staff_departmentId}
                  onChange={handleDepartmentChange}
                  className={errors.staff_department ? "border-red-500" : ""}
                >
                  <option value="">Select Department</option>
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
            <div className="grid grid-cols-1 gap-4">
              <div className="">
                <Label>Are you a Class Incharge</Label>
                <Checkbox
                  name="isClassIncharge"
                  id="isClassIncharge"
                  label="Class Incharge"
                  checked={formData.isClassIncharge}
                  onChange={handleRoleChange}
                  className="mx-2 border-black"
                />
                <Label>Are you a Mentor</Label>
                <Checkbox
                  name="isMentor"
                  id="isMentor"
                  label="Mentor"
                  checked={formData.isMentor}
                  onChange={handleRoleChange}
                  className="mx-2 border-black"
                />
              </div>
            </div>
            {formData.isClassIncharge && (
              <>
                <div>
                  <h2 className="text-linkedin-blue font-semibold">
                    Class Incharge Detail
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-3">
                    <Label
                      htmlFor="classInchargeBatchId"
                      className="mb-2 text-left font-bold tracking-wide"
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
                      className="mb-2 text-left font-bold tracking-wide"
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
                  <h2 className="text-linkedin-blue font-semibold">
                    Mentor Details
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col gap-3">
                    <Label
                      htmlFor="numberOfClassesHandledAsMentor"
                      className="mb-2 text-left font-bold tracking-wide"
                    >
                      Number of Classes Handled
                    </Label>
                    <TextInput
                      type="number"
                      id="numberOfClassesHandledAsMentor"
                      placeholder="Enter number of classes"
                      className="block w-full py-2 mt-1 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
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
                    <h2 className="text-linkedin-blue font-semibold">
                      Batch and Section for Mentees
                    </h2>
                    {formData.mentorHandlingData.map((item, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                      >
                        <div className="flex flex-col gap-3">
                          <Label
                            htmlFor={`handlingbatcesid-${index}`}
                            className="mb-2 text-left font-bold tracking-wide"
                          >
                            Batch
                          </Label>
                          <Select
                            name={`handlingbatcesid-${index}`}
                            value={item.handlingbatcesid}
                            onChange={(e) => handleBatchSectionChange(e, index)}
                            className={
                              errors[`handlingbatcesid-${index}`]
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
                          {errors[`handlingbatcesid-${index}`] && (
                            <p className="text-red-500 text-xs italic">
                              {errors[`handlingbatcesid-${index}`]}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-3">
                          <Label
                            htmlFor={`handlingsectionid-${index}`}
                            className="mb-2 text-left font-bold tracking-wide"
                          >
                            Section
                          </Label>
                          <Select
                            name={`handlingsectionid-${index}`}
                            value={item.handlingsectionid}
                            onChange={(e) => handleBatchSectionChange(e, index)}
                            className={
                              errors[`handlingsectionid-${index}`]
                                ? "border-red-500"
                                : ""
                            }
                          >
                            <option value="">Select Section</option>
                            {sections.map((section) => (
                              <option key={section._id} value={section._id}>
                                {section.section_name}
                              </option>
                            ))}
                          </Select>
                          {errors[`handlingsectionid-${index}`] && (
                            <p className="text-red-500 text-xs italic">
                              {errors[`handlingsectionid-${index}`]}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            <div>
              <div className="grid grid-cols-2">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <TextInput
                    type="password"
                    id="password"
                    placeholder="********"
                    className="block w-full py-2 mt-1 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirmpassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <TextInput
                    type="confirmpassword"
                    id="confirmpassword"
                    placeholder="********"
                    className="block w-full py-2 mt-1 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            <div>
              <button
                type="submit"
                className="w-full py-3 mt-4 font-medium tracking-wider text-white uppercase bg-linkedin-blue border border-transparent rounded-lg focus:outline-none hover:bg-linkedin-light-blue"
                disabled={loading}
              >
                {loading ? (
                  <Spinner className="w-6 h-6 mr-4 border-white" />
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
