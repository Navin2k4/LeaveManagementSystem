import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signInSuccess, signInStart, signInFailure } from '../redux/user/userSlice';
import { Spinner } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let { identifier, password } = formData;

    if (!identifier || !password) {
      return dispatch(signInFailure('Please fill all the fields'));
    }

    try {
      dispatch(signInStart());

      const res = await fetch('/api/auth/studentsignin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
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
        navigate('/profile');
      }
    } catch (error) {
      dispatch(signInFailure('OOPS! Something went wrong'));
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <section className="w-full max-w-md p-8 mx-auto h-auto bg-white rounded-lg shadow-lg border-l-4 border-primary-blue">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
          <p className="mt-2 text-gray-600">Leave Applicant Login</p>
        <Link to="/staffsignin" className="text-center p-3">
          <h2 className="font-medium text-primary-blue hover:tracking-wider transition-all duration-500">
            Click here for Staff Sign In
          </h2>
        </Link>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="identifier" className="my-4 block text-sm font-medium text-gray-700">
                User Name
              </label>
              <input
                type="text"
                id="identifier"
                placeholder="Roll Number / Register Number"
                className="block w-full tracking-widest px-3 py-2 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-blue"
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="my-4 block text-sm font-medium text-gray-700 ">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="********"
                className="block w-full px-3 py-2 mt-1 tracking-widest border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-blue"
                onChange={handleChange}
              />
            </div>
          </div>
          <button
            type="submit"
            className="flex justify-center w-full px-4 py-2 text-sm font-medium  bg-gradient-to-r from-primary-blue  via-secondary-blue/85 to-primary-blue  hover:bg-primary-blue transition-all duration-300 text-white rounded-md  focus:outline-none focus:ring-2 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <Spinner size="sm" className="mr-2" />
                <span className='text-white'>Loading...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        <div className="flex gap-2 text-sm mt-5 justify-center">
          <span>Create an Account?</span>
          <Link to="/studentsignup" className="text-primary-blue-300 underline">
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
