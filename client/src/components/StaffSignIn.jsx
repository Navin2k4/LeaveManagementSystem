import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signInSuccess, signInStart, signInFailure } from '../redux/user/userSlice';
import { Spinner } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';

export default function StaffSignIn() {
  const [formData, setFormData] = useState({});
  const { error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [staffloading, setStaffLoading] = useState(false);
  const [hodloading, setHodLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e, signInType) => {
    e.preventDefault();

    let { staff_id, password } = formData;

    if (!staff_id || !password) {
      return dispatch(signInFailure('Please fill all the fields'));
    }

    try {
      dispatch(signInStart());

      let endpoint;
      if (signInType === 'staff') {
        setStaffLoading(true); // Set loading state for staff sign-in
        endpoint = '/api/auth/staffsignin';
      } else if (signInType === 'hod') {
        setHodLoading(true); // Set loading state for HOD sign-in
        endpoint = '/api/auth/hodsignin';
      } else {
        return dispatch(signInFailure('Invalid sign-in type'));
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ staff_id, password }),
      });

      const data = await res.json();

      if (data.statusCode === 400) {
        dispatch(signInFailure('All fields are required'));
      } else if (data.statusCode === 404) {
        dispatch(signInFailure('User not found'));
      } else if (!res.ok) {
        dispatch(signInFailure('Invalid Username or Password'));
      } else {
        dispatch(signInSuccess(data));
        if (signInType === 'staff') {
          navigate('/staffdashboard');
        } else if (signInType === 'hod') {
          navigate('/hoddash');
        }
      }

      // Reset loading states after request completes
      setStaffLoading(false);
      setHodLoading(false);
    } catch (error) {
      dispatch(signInFailure('OOPS! Something went wrong'));
      // Reset loading states in case of error
      setStaffLoading(false);
      setHodLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <section className="w-full max-w-md p-8 mx-auto h-auto bg-white rounded-lg shadow-lg border-l-4 border-primary-blue">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
          <p className="mt-2 text-gray-600">Leave Applicant Login</p>
          <Link to="/studentsignin" className="text-center p-3">
            <h2 className="font-medium text-primary-blue hover:tracking-wider transition-all duration-500">
              Click here for Student Sign In
            </h2>
          </Link>
        </div>
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="identifier" className="my-4 block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="staff_id"
                placeholder="Your Staff Id"
                className="block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="my-4 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="********"
                className="block w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                onChange={handleChange}
              />
            </div>
          </div>
          <button
            id='staffsubmitbtn'
            type="submit"
            className="flex justify-center w-full px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary-blue via-secondary-blue/85 to-primary-blue hover:bg-primary-blue transition-all duration-300 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
            disabled={staffloading}
            onClick={(e) => handleSubmit(e, 'staff')}
          >
            {staffloading && <Spinner size="sm" className="mr-2" />}
            {!staffloading ? 'Sign In as STAFF' : 'Signing In...'}
          </button>
          <button
            id='hodsubmitbtn'
            type="submit"
            className="flex justify-center w-full px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary-blue via-secondary-blue/85 to-primary-blue hover:bg-primary-blue transition-all duration-300 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
            disabled={hodloading}
            onClick={(e) => handleSubmit(e, 'hod')}
          >
            {hodloading && <Spinner size="sm" className="mr-2" />}
            {!hodloading ? 'Sign In as HOD' : 'Signing In...'}
          </button>
        </form>
        <div className="flex gap-2 text-sm mt-5 justify-center">
          <span>Create an Account?</span>
          <Link to="/staffsignup" className="text-primary-blue-300 underline">
            Sign Up
          </Link>
        </div>
        {errorMessage && (
          <div className="mt-4 text-center text-red-600">
            <p>{errorMessage}</p>
          </div>
        )}
      </section>
    </div>
  );
}
