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
      <section className="w-full max-w-md p-8 mx-auto h-auto bg-dark-blue rounded-lg shadow-black shadow-md border-l-4 border-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-ternary-blue"><span className='text-3xl uppercase text-white'>Staff</span> Sign In</h2>
          {/* <p className="mt-2 text-ternary-blue">Leave Applicant Login</p> */}
          <Link to="/studentsignin" className="text-center p-3">
            <h2 className="font-medium text-teal-300 hover:tracking-wider transition-all duration-500">
              Click here for Student Sign In
            </h2>
          </Link>
        </div>
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="identifier" className="my-4 block text-sm font-medium text-ternary-blue">
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
              <label htmlFor="password" className="my-4 block text-sm font-medium text-ternary-blue">
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
          <div className='flex gap-2 items-center'>

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
            </div>
        </form>
        <div className="flex gap-2 text-sm mt-5 justify-center">
          <span className='text-teal-300'>Create an Account?</span>
          <Link to="/staffsignup" className="text-teal-300 underline">
            {' '}Sign Up
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
