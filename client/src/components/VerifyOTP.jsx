import React, { useState } from 'react';
import OtpInput from 'react-otp-input';

export default function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleOtpChange = (otp) => {
    setOtp(otp);
    setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length < 4) {
      setErrorMessage('Please enter the 4-digit OTP.');
      return;
    }
    console.log('OTP Submitted:', otp);
  };

  return (
    <div className="pt-40 min-h-screen  bg-gray-100">
      <div className="w-full max-w-md px-6 py-8 mx-auto bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-primary-blue mb-2">Verify OTP</h2>
            <h1 htmlFor="otp" className="text-md text-center font-medium text-gray-500 mb-6">
              Enter the otp sent to your "email"
            </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <OtpInput
              value={otp}
              onChange={handleOtpChange}
              numInputs={4}
              renderSeparator={<span className="mx-2">-</span>}
              renderInput={(props) => (
                <input
                  {...props}
                  className="w-12 h-12 text-xl text-center border rounded-md focus:outline-none focus:ring-1 focus:ring-primary-blue"
                />
              )}
              containerStyle="justify-center mb-2"
            />
            {errorMessage && (
              <p className="text-red-600 text-center">{errorMessage}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full  py-2 text-white bg-primary-blue rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary-blue"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}
