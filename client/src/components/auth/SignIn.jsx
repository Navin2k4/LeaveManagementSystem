import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  signInSuccess,
  signInStart,
  signInFailure,
} from "../../redux/user/userSlice";
import { ScaleLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectRole, setSelectRole] = useState("");

  const handleDivClick = (value) => {
    setSelectRole(value);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!formData.identifier) {
      formErrors.identifier = "User Name is required";
      isValid = false;
    }

    if (!formData.password) {
      formErrors.password = "Password is required";
      isValid = false;
    }

    if (!selectRole) {
      formErrors.role = "Please select a role";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const { identifier, password } = formData;

    try {
      dispatch(signInStart());

      let endpoint;
      if (selectRole === "student") {
        endpoint = "/api/auth/studentsignin";
      } else if (selectRole === "staff") {
        endpoint = "/api/auth/staffsignin";
      } else {
        dispatch(signInFailure("Invalid role selected"));
        return;
      }

      console.log(identifier, password);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (data.statusCode === 400) {
        dispatch(signInFailure("All fields are required"));
      } else if (data.statusCode === 404) {
        dispatch(signInFailure("User not found"));
      } else if (!res.ok) {
        dispatch(signInFailure("Invalid Username or Password"));
      } else {
        dispatch(signInSuccess(data));
        if (selectRole === "student") {
          navigate("/profile");
        } else if (data.isHod) {
          navigate("/hoddash");
        } else {
          navigate("/staffdashboard");
        }
      }
    } catch (error) {
      dispatch(signInFailure("OOPS! Something went wrong"));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50">
      <div className="w-full max-w-md p-8 bg-gray-50 shadow-none md:bg-slate-200 rounded-lg md:shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Please sign in to continue</p>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => handleDivClick("student")}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              selectRole === "student"
                ? "bg-[#1f3a6e] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-white"
            } transition-all duration-300`}
          >
            Student
          </button>
          <button
            onClick={() => handleDivClick("staff")}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              selectRole === "staff"
                ? "bg-[#1f3a6e] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-white"
            } transition-all duration-300`}
          >
            Staff
          </button>
        </div>

        {errors.role && (
          <p className="text-red-500 text-sm text-center font-semibold mb-4">{errors.role}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {selectRole === "student" ? "Roll Number" : "Staff ID"}
            </label>
            <input
              type="text"
              id="identifier"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.identifier ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:ring-[#1f3a6e] focus:border-[#1f3a6e]`}
              placeholder={
                selectRole === "student"
                  ? "Enter roll number"
                  : "Enter staff ID"
              }
              onChange={handleChange}
            />
            {errors.identifier && (
              <p className="mt-1 text-sm text-red-500 font-semibold">{errors.identifier}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:ring-[#1f3a6e] focus:border-[#1f3a6e]`}
              placeholder="Enter your password"
              onChange={handleChange}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500 font-semibold">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1f3a6e] hover:bg-[#0b1f44] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1f3a6e] disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center">
                <ScaleLoader color="#ffffff" height={16} />
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {errorMessage && (
          <div className="mt-4">
            <p className="text-sm text-red-500 text-center font-semibold">{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
