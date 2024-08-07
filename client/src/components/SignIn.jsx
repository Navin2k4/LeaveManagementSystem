import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  signInSuccess,
  signInStart,
  signInFailure,
} from "../redux/user/userSlice";
import { Spinner } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectRole, setSelectRole] = useState('');

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
      let redirectTo;
      switch (selectRole) {
        case 'student':
          endpoint = '/api/auth/studentsignin';
          redirectTo = '/profile';
          break;
        case 'staff':
          endpoint = '/api/auth/staffsignin';
          redirectTo = '/staffdashboard';
          break;
        case 'hod':
          endpoint = '/api/auth/hodsignin';
          redirectTo = '/hoddash';
          break;
        default:
          dispatch(signInFailure("Invalid role selected"));
          return;
      }

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
        navigate(redirectTo);
      }
    } catch (error) {
      dispatch(signInFailure("OOPS! Something went wrong"));
    }
  };

  return (
    <div className="flex justify-center md:my-20 ">
      <div className="w-full md:max-w-md py-20 px-8 md:p-8  mx-auto h-auto bg-gradient-to-t from-blue-500 to-[#0f172a] md:rounded-2xl md:shadow-md shadow-black">
      <hr className="border-t-2 border-gray-600 " />
      <div className="text-center my-4">
        <h2 className="text-3xl font-bold text-white">Sign In</h2>
      </div>
      <hr className="border-t-2 border-gray-600 my-4" />
 

        <div className="grid grid-cols-3 items-center justify-center gap-3 mt-6">
          <div
            className={`flex items-center w-full rounded cursor-pointer ${selectRole === 'student' ? 'bg-blue-500' : 'bg-white'} transition-all duration-300`}
            onClick={() => handleDivClick('student')}
          >
            <input
              id="bordered-checkbox-1"
              type="radio"
              value="student"
              name="bordered-checkbox"
              className="w-4 h-4 focus:ring-0 hidden"
              checked={selectRole === 'student'}
              readOnly
            />
            <label
              htmlFor="bordered-checkbox-1"
              className={`w-full py-4 text-sm text-center dark:text-gray-300 ${selectRole === 'student' ? 'text-white font-semibold tracking-widest' : 'text-gray-900'} transition-all duration-300`}
            >
              Student
            </label>
          </div>
          <div
            className={`flex items-center w-full rounded cursor-pointer ${selectRole === 'staff' ? 'bg-blue-500' : 'bg-white'} transition-all duration-300`}
            onClick={() => handleDivClick('staff')}
          >
            <input
              id="bordered-checkbox-2"
              type="radio"
              value="staff"
              name="bordered-checkbox"
              className="w-4 h-4 focus:ring-0 hidden"
              checked={selectRole === 'staff'}
              readOnly
            />
            <label
              htmlFor="bordered-checkbox-2"
              className={`w-full py-4 text-sm text-center dark:text-gray-300 ${selectRole === 'staff' ? 'text-white font-semibold tracking-widest' : 'text-gray-900'} transition-all duration-300`}
            >
              Staff
            </label>
          </div>
          <div
            className={`flex items-center w-full rounded cursor-pointer ${selectRole === 'hod' ? 'bg-blue-500' : 'bg-white'} transition-all duration-300`}
            onClick={() => handleDivClick('hod')}
          >
            <input
              id="bordered-checkbox-3"
              type="radio"
              value="hod"
              name="bordered-checkbox"
              className="w-4 h-4 focus:ring-0 hidden"
              checked={selectRole === 'hod'}
              readOnly
            />
            <label
              htmlFor="bordered-checkbox-3"
              className={`w-full py-4 text-sm text-center dark:text-gray-300 ${selectRole === 'hod' ? 'text-white font-semibold tracking-widest' : 'text-gray-900'} transition-all duration-300`}
            >
              HOD
            </label>
          </div>
        </div>
        {errors.role && <p className="text-red-200 text-center pt-4 text-sm">{errors.role}</p>}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="identifier" className="my-4 block text-sm font-medium text-white">
                User Name
              </label>
              <input
                type="text"
                id="identifier"
                placeholder="Register Number / User Id"
                className={`block w-full tracking-widest px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${errors.identifier ? 'border-red-500' : 'border-gray-300'} focus:ring-primary-blue`}
                onChange={handleChange}
              />
              {errors.identifier && <p className="text-red-200 py-2 text-sm">{errors.identifier}</p>}
            </div>
            <div>
              <label htmlFor="password" className="my-4 block text-sm font-medium text-white">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="********"
                className={`block w-full px-3 py-2 mt-1 tracking-widest border rounded-md shadow-sm focus:outline-none focus:ring-1 ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-primary-blue`}
                onChange={handleChange}
              />
              {errors.password && <p className="text-red-200 py-2 text-sm">{errors.password}</p>}
            </div>
          </div>
          <button
            type="submit"
            className="flex justify-center w-full px-4 py-2 text-sm font-medium bg-black hover:bg-blue-400 hover:text-black transition-all duration-300 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <Spinner size="sm" className="mr-2" />
                <span className="text-white">Loading...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </button>
          <button
            className="flex justify-center w-full  transition-all duration-300 text-white underline font-semibold hover:scale-105"
          >
          <Link to='/studentsignup' >
            CLICK HERE TO SIGNUP
          </Link>
          </button>
        </form>

        {errorMessage && (
          <div className="mt-4 text-center ">
            <p className="bg-white mx-10 p-2 rounded-3xl text-red-600 font-semibold">{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}