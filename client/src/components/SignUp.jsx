import React, { useEffect } from "react";
import { Alert, Label, Spinner, Select, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 4;
  const endYear = startYear + 4;
  const [years, setYears] = useState([]);
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
    console.log(formData);
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
      department,
      student_section,
      batch,
    } = formData;

    if (
      !roll_no ||
      !register_no ||
      !password ||
      !confirmpassword ||
      !name ||
      !email ||
      !phone ||
      !department ||
      !student_section ||
      !batch
    ) {
      return setErrorMessage("Please fill out all fields");
    }

    if (!/^[0-9]{2}[A-Z]{1,6}[0-9]+$/.test(roll_no)) {
      return setErrorMessage("Invalid Roll Number");
    }

    if (!/^[0-9]{12}$/.test(register_no)) {
      return setErrorMessage("Invalid Register Number");
    }

    if (!/^[a-zA-Z\s]+$/.test(department)) {
      return setErrorMessage("Invalid Department");
    }

    if (!/^[A-Z]$/.test(student_section)) {
      return setErrorMessage("Invalid Section");
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

    let data;

    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      data = await res.json();

      if (data.success === false) {
        if (data.message.includes("duplicate key error collection")) {
          if (data.message.includes("email_1")) {
            setErrorMessage("Email is already in use");
          } else if (data.message.includes("username_1")) {
            setErrorMessage("Username is already taken");
          }
        } else {
          setErrorMessage(data.message);
        }
        setLoading(false);
        return;
      }
      if (res.ok) {
        setLoading(false);
        navigate("/signin");
      }
    } catch (error) {
      if (data) {
        setErrorMessage(data.message);
      } else {
        setErrorMessage(
          "An error occurred while signing up. Please try again later."
        );
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center my-8">
      <section className="w-full max-w-2xl px-6 py-3 mx-auto h-auto bg-white rounded-lg shadow-lg border-l-4 border-linkedin-blue">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Student Sign Up</h2>
        </div>

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
                className="block w-full py-2 mt-1  rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="roll_no"
                  className="block text-sm font-medium text-gray-700"
                >
                  Roll Number<span className="text-red-600 font-bold"> *</span>
                </label>
                <TextInput
                  type="text"
                  id="roll_no"
                  placeholder="22CSEB48"
                  className="block w-full py-2 mt-1  rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
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
                  className="block w-full py-2 mt-1  rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="student_section"
                  className="block text-sm font-medium text-gray-700"
                >
                  Section
                </label>
                <TextInput
                  type="text"
                  id="student_section"
                  placeholder="A"
                  className="block w-full py-2 mt-1  rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-gray-700"
                >
                  Department
                </label>
                <TextInput
                  type="text"
                  id="department"
                  placeholder="Computer Science and Engineering"
                  className="block w-full py-2 mt-1  rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-gray-700"
                >
                  Batch
                </label>
                <Select
                  name="batch"
                  id="batch"
                  onChange={handleChange}
                  required
                  className="w-full tracking-wider mt-3 "
                >
                  <option value="">Select Batch</option>
                  {years.map((year) => (
                    <option key={year} value={`${year}-${year + 4}`}>
                      {year}-{year + 4}
                    </option>
                  ))}
                </Select>
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
                  className="block w-full py-2 mt-1  rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
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
                  className="block w-full py-2 mt-1  rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
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
                  className="block w-full  py-2 mt-1  rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
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
                  className="block w-full py-2 mt-1  rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
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
            className="flex justify-center w-full  py-2 text-sm font-medium text-white bg-linkedin-blue rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
