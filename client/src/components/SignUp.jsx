import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Spinner, TextInput, Select,Label } from "flowbite-react";

export default function SignUp() {
  const [formData, setFormData] = useState({
    roll_no: "",
    register_no: "",
    password: "",
    confirmpassword: "",
    name: "",
    email: "",
    phone: "",
    departmentId: "",
    sectionId: "",
    section_name:"",
    batchId: "",
    userType: "Student", // Set default userType to Student
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  useEffect(() => {
    fetch("/api/departments")
      .then((response) => response.json())
      .then((data) => setDepartments(data))
      .catch((error) => console.error(error));
  }, []);

  const handleDepartmentChange = async (e) => {
    const deptId = e.target.value;
    setFormData({ ...formData, departmentId: deptId });

    try {
      const res = await fetch(`/api/departments/${deptId}/batches`);
      const data = await res.json();
      setBatches(data);
      setSections([]);
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
    } catch (error) {
      console.error(error);
    }
  };


  const handleSectionChange = (e) => {
    const sectionId = e.target.value;
    setFormData({ ...formData, sectionId: sectionId });
  };


  useEffect(() => {
    const getSectionName = async () => {
      try {
        if (formData.sectionId) {
          const response = await fetch(`/api/section/${formData.sectionId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch section name");
          }
          const sectionData = await response.json();
          if (sectionData && sectionData.name) {
            setFormData((prevData) => ({
              ...prevData,
              section_name: sectionData.name,
            }));
          } else {
            console.error("Section name not found");
          }
        }
      } catch (error) {
        console.error("Error fetching section name:", error);
      }
    };

    getSectionName();
  }, [formData.sectionId]);



  const handleChange = (e) => {
    let { id, value } = e.target;

    if (
      id === "name" ||
      id === "roll_no" ||
      id === "department" ||
      id === "student_section"
    ) {
      value = value.toUpperCase();
    }

    setFormData({ ...formData, [id]: value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      roll_no,
      register_no,
      password,
      confirmpassword,
      name,
      email,
      phone,
      departmentId,
      sectionId,
      section_name,
      batchId,
      userType,
    } = formData;

    if (
      !roll_no ||
      !register_no ||
      !password ||
      !confirmpassword ||
      !name ||
      !email ||
      !phone ||
      !departmentId ||
      !sectionId ||
      !batchId
    ) {
      return setErrorMessage("Please fill out all fields");
    }

    if (!/^[0-9]{2}[A-Z]{1,6}[0-9]+$/.test(roll_no)) {
      return setErrorMessage("Invalid Roll Number");
    }

    if (!/^[0-9]{12}$/.test(register_no)) {
      return setErrorMessage("Invalid Register Number");
    }

    if (!/^[a-zA-Z\s]+$/.test(name)) {
      return setErrorMessage("Name should contain only letters and spaces");
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return setErrorMessage("Invalid Email");
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      return setErrorMessage("Invalid Phone Number");
    }

    if (!/^.{8,16}$/.test(password)) {
      return setErrorMessage("Password should be 8 to 16 characters long");
    }

    if (password !== confirmpassword) {
      return setErrorMessage("Passwords do not match");
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await fetch("/api/auth/studentsignup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        if (data.message.includes("duplicate key error collection")) {
          if (data.message.includes("email_1")) {
            setErrorMessage("Email is already in use");
          } else if (data.message.includes("roll_no")) {
            setErrorMessage("Roll Number is already in use");
          } else if (data.message.includes("register_no")) {
            setErrorMessage("Register Number is already in use");
          }
        } else {
          setErrorMessage(data.message);
        }
        setLoading(false);
        return;
      }

      if (res.ok) {
        setLoading(false);
        navigate("/studentsignin");
      }
    } catch (error) {
      setErrorMessage(
        "An error occurred while signing up. Please try again later."
      );
      setLoading(false);
    }
  };


  return (
    <div className="flex justify-center md:mt-5 ">
      <section className="w-full max-w-2xl px-6 py-3 mx-auto h-auto bg-white rounded-lg shadow-lg md:border-l-4 border-secondary-blue">
        <div className="mt-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary-blue tracking-wider">Student Sign Up</h2>
        </div>
        <Link to="/staffsignup" className="text-center p-3">
          <h2 className="font-medium  text-primary-blue hover:tracking-wider transition-all duration-500">
            Click here for Staff Sign Up
          </h2>
        </Link>
        </div>
        <form onSubmit={handleSubmit} className=" space-y-6">
          <div className="space-y-1">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <TextInput
                type="text"
                id="name"
                placeholder="John Doe"
                className="block w-full py-2 mt-1 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-blue"
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="roll_no"
                  className="block text-sm font-medium text-gray-700"
                >
                  Roll Number
                  <span className="text-red-600 font-bold"> *</span>
                </label>
                <TextInput
                  type="text"
                  id="roll_no"
                  placeholder="22CSEB48"
                  className="block w-full py-2 mt-1 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-blue"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="register_no"
                  className="block text-sm font-medium text-gray-700"
                >
                  Register Number
                  <span className="text-red-600 font-bold"> *</span>
                </label>
                <TextInput
                  type="text"
                  id="register_no"
                  placeholder="1234567891234567"
                  className="block w-full py-2 mt-1 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-blue"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <TextInput
                  type="email"
                  id="email"
                  placeholder="example@example.com"
                  className="block w-full py-2 mt-1 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-blue"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone
                </label>
                <TextInput
                  type="tel"
                  id="phone"
                  placeholder="1234567890"
                  className="block w-full py-2 mt-1 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-blue"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  className="block w-full py-2 mt-1 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-blue"
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
                  type="password"
                  id="confirmpassword"
                  placeholder="********"
                  className="block w-full py-2 mt-1 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-blue"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          {errorMessage && (
            <div className="mt-4 text-center">
              <p className="text-red-600 font-semibold">{errorMessage}</p>
            </div>
          )}
          
        <div className="flex items-center justify-between mt-3">
              <Link to="/studentsignin" className="text-primary-blue font-medium hover:underline">
                Already have an account? Sign in
              </Link>
              <button
                type="submit"
                className="px-6 py-2 text-white bg-primary-blue rounded-md shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-linkedin-blue"
                disabled={loading}
              >
                {loading ? (
              <div className="flex items-center">
              <Spinner size="sm" className="mr-2" />
              <span className='text-white'>Loading...</span>
            </div>                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
        </form>
      </section>
    </div>
  );
}
