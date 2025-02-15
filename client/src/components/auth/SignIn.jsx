import { motion } from "framer-motion";
import { GraduationCap, Lock, User } from "lucide-react";
import React, { useState } from "react";
import { MdSupervisorAccount } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/user/userSlice";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectRole, setSelectRole] = useState("");

  const roleOptions = [
    {
      value: "student",
      label: "Student",
      icon: <GraduationCap className="h-6 w-6" />,
      description: "Access your leave & OD requests",
    },
    {
      value: "staff",
      label: "Staff",
      icon: <MdSupervisorAccount className="h-6 w-6" />,
      description: "Manage student requests & approvals",
    },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    // Clear error when user starts typing
    if (errors[e.target.id]) {
      setErrors({ ...errors, [e.target.id]: "" });
    }
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
    if (!validateForm()) return;

    try {
      dispatch(signInStart());
      const endpoint =
        selectRole === "student"
          ? "/api/auth/studentsignin"
          : "/api/auth/staffsignin";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(signInFailure(data.message || "Invalid credentials"));
        return;
      }

      dispatch(signInSuccess(data));
      if (selectRole === "student") {
        navigate("/profile");
      } else if (data.isHod) {
        navigate("/hoddash");
      } else {
        navigate("/staffdashboard");
      }
    } catch (error) {
      dispatch(signInFailure("Something went wrong. Please try again."));
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 flex gap-8">
        {/* Right Section - Sign In Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 bg-white p-8 rounded-2xl shadow-xl space-y-6"
        >
          <div className="text-center items-center flex flex-col gap-4">
                    {/* <img
            src="/vcet.jpeg"
            alt="VCET Logo"
            className="h-20 w-20 rounded-full shadow-lg"
          /> */}
            <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
            <p className="mt-2 text-sm text-gray-600">
              Please select your role and enter your credentials
            </p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4">
            {roleOptions.map((role) => (
              <button
                disabled={loading}
                key={role.value}
                onClick={() => setSelectRole(role.value)}
                className={`relative p-4 rounded-xl border-2 transition-all duration-200
                  ${
                    selectRole === role.value
                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                      : "border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                <div className="flex flex-col items-center gap-2">
                  {role.icon}
                  <span className="font-medium">{role.label}</span>
                  <p className="text-xs text-gray-500">{role.description}</p>
                </div>
              </button>
            ))}
          </div>

          {errors.role && (
            <p className="text-sm text-red-500 text-center">{errors.role}</p>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {selectRole === "student" ? "Roll Number" : "Staff ID"}
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="identifier"
                    type="text"
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2.5 border ${
                      errors.identifier ? "border-red-500" : "border-gray-300"
                    } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                    placeholder={
                      selectRole === "student"
                        ? "Enter roll number"
                        : "Enter staff ID"
                    }
                  />
                </div>
                {errors.identifier && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.identifier}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2.5 border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                    placeholder="Enter your password"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-xl bg-red-50 p-4">
                <p className="text-sm text-red-600 text-center">
                  {errorMessage}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                "Sign In"
              )}
            </button>
            <div className="flex items-center justify-center">  
              <p className="text-sm text-gray-500">
                <Link to="/forgotpassword" className="text-blue-500 hover:text-blue-600">
                  Forgot Password?
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
