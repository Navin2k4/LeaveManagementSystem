import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Spinner, TextInput, Select, Label } from "flowbite-react";

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
    section_name: "",
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

  const validateForm = () => {
    const errors = {};
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
      batchId,
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
      errors.allfieldsRequired = "Please fill out all fields";
    }
    const departmentCodes = [
      "CIV",
      "CSE",
      "CSEC",
      "ECE",
      "EEE",
      "IT",
      "AID",
      "MECH",
      "SH",
      "MBA",
    ];

    const departmentPattern = departmentCodes.join("|");
    const regex = new RegExp(
      `^[0-9]{2}(L)?(${departmentPattern})(A|B|C)?[0-9]{2}$`,
      "i"
    );

    if (!regex.test(roll_no)) {
      errors.roll_no = "Invalid Roll Number";
    }

    // * Department Codes: List of department acronyms.
    // * Regex Pattern:
    // * ^[0-9]{2}: Starts with a 2-digit year.
    // * (L)?: Optional "L" for lateral entry.
    // * (${departmentPattern}): Department code.
    // * [0-9]{2}$: Roll number of exactly 2 digits.

    if (!/^[0-9]{12}$/.test(register_no)) {
      errors.reg_no = "Invalid Register Number";
    }

    if (!/^[a-zA-Z\s]+$/.test(name)) {
      errors.student_name = "Name should contain only letters and spaces";
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      errors.email = "Invalid Email";
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      errors.phone = "Invalid Phone Number";
    }

    if (!/^.{8,16}$/.test(password)) {
      errors.password = "Password should be 8 to 16 characters long";
    }

    if (password !== confirmpassword) {
      errors.confirmpassword = "Passwords do not match";
    }
    setErrors(errors);
    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await fetch("/api/auth/studentsignup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      setLoading(false);

      if (!res.ok) {
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
        return;
      }
      navigate("/verify-otp", { state: { email: formData.email } });
    } catch (error) {
      setErrorMessage(
        "An error occurred while signing up. Please try again later."
      );
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center md:mt-5 md:my-10  ">
      <section
        className="w-full max-w-2xl px-6 py-3 mx-auto h-auto bg-gradient-to-t from-blue-500 to-[#0f172a]
 md:rounded-lg shadow-lg md:border-l-4 pb-10 "
      >
        <div className="mt-4">
          <div className="text-center m-4">
            <h2 className="text-3xl font-bold text-white tracking-wider">
              Sign Up
            </h2>
          </div>
          <Link to="/staffsignup" className="text-center p-3">
            <h2 className="font-medium  text-blue-200 underline hover:tracking-wider transition-all duration-500">
              Click here for Staff Sign Up
            </h2>
          </Link>
        </div>
        <form onSubmit={handleSubmit} className=" space-y-6">
          <div className="space-y-1">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-white"
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
              {errors.student_name && (
                <p className="text-red-600 font-bold bg-white/80 w-max px-2 py-[0.5] rounded-lg text-xs italic">
                  {errors.student_name}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="roll_no"
                  className="block text-sm font-medium text-white"
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
                {errors.roll_no && (
                  <p className="text-red-600 font-bold bg-white/80 w-max px-2 py-[0.5] rounded-lg text-xs italic">
                    {errors.roll_no}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="register_no"
                  className="block text-sm font-medium text-white"
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
                {errors.reg_no && (
                  <p className="text-red-600 font-bold bg-white/80 w-max px-2 py-[0.5] rounded-lg text-xs italic">
                    {errors.reg_no}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <Label
                  htmlFor="departmentId"
                  className="mb-2 text-left font-bold tracking-wide text-white"
                >
                  Department
                </Label>
                <Select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleDepartmentChange}
                  className={errors.departmentId ? "border-red-500" : "mt-1"}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.dept_name}
                    </option>
                  ))}
                </Select>
                {errors.departmentId && (
                  <p className="text-red-600 font-bold bg-white/80 w-max px-2 py-[0.5] rounded-lg text-xs italic">
                    {errors.departmentId}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Label
                  htmlFor="batchId"
                  className="block text-sm font-medium text-white"
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
                  <p className="text-red-600 font-bold bg-white/80 w-max px-2 py-[0.5] rounded-lg text-xs italic">
                    {errors.batchId}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Label
                  htmlFor="sectionId"
                  className="text-left font-bold tracking-wide text-white"
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
                  <p className="text-red-600 font-bold bg-white/80 w-max px-2 py-[0.5] rounded-lg text-xs italic">
                    {errors.sectionId}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white"
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
                <p class="text-sm text-gray-200 mb-3">
                  OTP will be sent to your email after submitting
                </p>

                {errors.email && (
                  <p className="text-red-600 font-bold bg-white/80 w-max px-2 py-[0.5] rounded-lg text-xs italic">
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-white"
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
                {errors.phone && (
                  <p className="text-red-600 font-bold bg-white/80 w-max px-2 py-[0.5] rounded-lg text-xs italic">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-white"
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
                {errors.password && (
                  <p className="text-red-600 font-bold bg-white/80 w-max px-2 py-[0.5] rounded-lg text-xs italic">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmpassword"
                  className="block text-sm font-medium text-white"
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
                {errors.confirmpassword && (
                  <p className="text-red-600 font-bold bg-white/80 w-max px-2 py-[0.5] rounded-lg text-xs italic">
                    {errors.confirmpassword}
                  </p>
                )}
              </div>
            </div>
          </div>
          {errors.allfieldsRequired && (
            <p className="text-red-600 font-bold bg-white/80 w-max px-2 py-[0.5] rounded-lg text-xs italic">
              {errors.allfieldsRequired}
            </p>
          )}
          {errorMessage && (
            <p className="text-red-600 font-bold bg-white/80 w-max px-2 py-[0.5] rounded-lg text-xs italic">
              {errorMessage}
            </p>
          )}

          <div className="flex flex-col-reverse md:flex-row items-center justify-between mt-3 gap-3">
            <Link
              to="/signin"
              className="text-white underline font-medium hover:underline"
            >
              Already have an account? Sign in
            </Link>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-[#0f172a]
 rounded-md shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-linkedin-blue"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <Spinner size="sm" className="mr-2" />
                  <span className="text-white">Loading...</span>
                </div>
              ) : (
                <div className="px-10">Sign Up</div>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
