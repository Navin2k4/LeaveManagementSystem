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
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMentor, setIsMentor] = useState(false);
  const [isClassIncharge, setIsClassIncharge] = useState(false);
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 4;
  const endYear = startYear + 4;
  const [years, setYears] = useState([]);
  const [numClassesHandled, setNumClassesHandled] = useState(0);
  const [mentorBatchSections, setMentorBatchSections] = useState([]);

  useEffect(() => {
    const yearOptions = [];
    for (let year = startYear; year <= endYear; year++) {
      yearOptions.push(year);
    }
    setYears(yearOptions);
  }, [startYear, endYear]);

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

  const handleRoleChange = (e) => {
    const { name, checked } = e.target;

    if (name === "mentor") {
      setIsMentor(checked);
    } else if (name === "classIncharge") {
      setIsClassIncharge(checked);
    }
  };

  const handleNumClassesChange = (e) => {
    const { value } = e.target;
    setNumClassesHandled(parseInt(value));
    const newBatchSections = [];
    for (let i = 0; i < parseInt(value); i++) {
      newBatchSections.push({ batch: "", section: "" });
    }
    setMentorBatchSections(newBatchSections);
  };

  const handleBatchSectionChange = (e, index) => {
    const { id, value } = e.target;
    const updatedBatchSections = [...mentorBatchSections];
    updatedBatchSections[index] = { ...updatedBatchSections[index], [id]: value };
    setMentorBatchSections(updatedBatchSections);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      staff_id,
      staff_name,
      staff_mail,
      staff_phone,
      staff_handle_dept,
      password,
      confirmpassword,
    } = formData;

    // Add your validation logic here

    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        // Handle errors
        setErrorMessage(data.message || "Sign up failed");
        setLoading(false);
        return;
      }

      if (res.ok) {
        setLoading(false);
        navigate("/signin");
      }
    } catch (error) {
      setErrorMessage(
        "An error occurred while signing up. Please try again later."
      );
      setLoading(false);
    }
  };

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
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <TextInput
                type="text"
                id="name"
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
                  htmlFor="staff_mail"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <TextInput
                  type="email"
                  id="staff_mail"
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
              <div>
                <label
                  htmlFor="staff_handle_dept"
                  className="block text-sm font-medium text-gray-700"
                >
                  Department
                </label>
                <TextInput
                  type="text"
                  id="staff_handle_dept"
                  placeholder="Computer Science and Engineering"
                  className="block w-full py-2 mt-1 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="">
                <Label>Are you a Class Incharge</Label>
                <Checkbox
                  name="classIncharge"
                  id="classIncharge"
                  label="Class Incharge"
                  checked={isClassIncharge}
                  onChange={handleRoleChange}
                  className="mx-2 border-black"
                />
                <Label>Are you a Mentor</Label>
                <Checkbox
                  name="mentor"
                  id="mentor"
                  label="Mentor"
                  checked={isMentor}
                  onChange={handleRoleChange}
                  className="mx-2 border-black"
                />
              </div>
            </div>
            {isClassIncharge && (
              <>
              <div>
                <h2 className="text-linkedin-blue font-semibold">Class Incharge Detail</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="staff_handle_batch"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Handling Class Batch
                  </label>
                  <Select
                    name="staff_handle_batch"
                    id="staff_handle_batch"
                    onChange={handleChange}
                    required
                    className="w-full tracking-wider mt-3"
                  >
                    <option value="">Select Batch</option>
                    {years.map((year) => (
                      <option key={year} value={`${year}-${year + 4}`}>
                        {year}-{year + 4}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label
                    htmlFor="staff_handle_section"
                    className="block text-sm font-medium text-gray-700"
                  >
                      Handling Class Section
                  </label>
                  <TextInput
                    type="text"
                    id="staff_handle_section"
                    placeholder="A"
                    className="block w-full py-2 mt-1 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                    onChange={handleChange}
                  />
                </div>
              </div>
              </>
            )}
            {isMentor && (
                            <>
                            <div>
                              <h2 className="text-linkedin-blue font-semibold">Mentor Detail</h2>
                            </div>
              <div>
                <label
                  htmlFor="numClassesHandled"
                  className="block text-sm font-medium text-gray-700"
                >
                  Number of Classes Handled as Mentor
                </label>
                <TextInput
                  type="number"
                  id="numClassesHandled"
                  value={numClassesHandled}
                  min="0"
                  className="block w-full py-2 mt-1 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                  onChange={handleNumClassesChange}
                />
                {mentorBatchSections.map((batchSection, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label
                        htmlFor={`batch-${index}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Mentee Batch {index + 1}
                      </label>
                      <Select
                        name={`batch-${index}`}
                        id={`batch-${index}`}
                        onChange={(e) => handleBatchSectionChange(e, index)}
                        required
                        className="w-full tracking-wider mt-3"
                      >
                        <option value="">Select Batch</option>
                        {years.map((year) => (
                          <option key={year} value={`${year}-${year + 4}`}>
                            {year}-{year + 4}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <label
                        htmlFor={`section-${index}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Mentee Section {index + 1}
                      </label>
                      <TextInput
                        type="text"
                        id={`section-${index}`}
                        placeholder="A"
                        className="block w-full py-2 mt-1 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                        onChange={(e) => handleBatchSectionChange(e, index)}
                      />
                    </div>
                  </div>
                ))}
              </div>
              </>
            )}
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
                  type="password"
                  id="confirmpassword"
                  placeholder="********"
                  className="block w-full py-2 mt-1 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-4 text-center text-red-600">
              <p>{errorMessage}</p>
            </div>
          )}
          <button
            type="submit"
            className="flex justify-center w-full py-2 text-sm font-medium text-white bg-linkedin-blue rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <Spinner size="sm" className="mr-2" />
                <span>Loading...</span>
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        <div className="flex gap-2 text-sm mt-5 justify-center">
          <span>Have an account?</span>
          <Link to="/signin" className="text-linkedin-blue-300 underline">
            Sign In
          </Link>
        </div>
      </section>
    </div>
  );
}
