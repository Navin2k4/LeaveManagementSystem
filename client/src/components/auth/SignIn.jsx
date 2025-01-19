import { motion } from "framer-motion";
import { GraduationCap, Lock, User } from "lucide-react";
import React, { useState } from "react";
import { MdSupervisorAccount } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
      icon: <GraduationCap size={20} />,
      description: "Sign in as a student to manage your requests",
    },
    {
      value: "staff",
      label: "Staff",
      icon: <MdSupervisorAccount size={20} />,
      description: "Sign in as staff to manage student requests",
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
    <div className="min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <img
              src="/vcet.jpeg"
              alt="VCET Logo"
              className="h-16 w-16 rounded-full"
            />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-3xl font-bold text-gray-900"
          >
            Welcome Back
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 text-sm text-gray-600"
          >
            Sign in to access your account
          </motion.p>
        </div>

        {/* Role Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 space-y-6"
        >
          <div className="grid grid-cols-2 gap-4">
            {roleOptions.map((role) => (
              <button
                key={role.value}
                onClick={() => setSelectRole(role.value)}
                className={`relative p-4 rounded-lg border-2 transition-all duration-200
                  ${
                    selectRole === role.value
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }
                `}
              >
                <div className="flex flex-col items-center gap-2">
                  {role.icon}
                  <span className="font-medium">{role.label}</span>
                </div>
              </button>
            ))}
          </div>

          {errors.role && (
            <p className="text-sm text-red-500 text-center">{errors.role}</p>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm space-y-4">
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
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.identifier ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-blue-500 focus:border-blue-500`}
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
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Enter your password"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-600 text-center">
                  {errorMessage}
                </p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
