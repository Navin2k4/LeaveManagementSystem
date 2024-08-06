import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "flowbite-react";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { email } = location.state || {};

  const handleOtpChange = (event) => {
    setOtp(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/auth/verifyOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (response.ok) {
        setLoading(false);
        navigate("/signin");
      } else {
        setLoading(false);
        setErrorMessage(data.message);
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage("Error verifying OTP. Please try again later.");
      console.error("Error verifying OTP:", error);
    }
  };

  return (
    <>
      <div className="w-full max-w-md mt-4 px-6 py-8 mx-auto bg-white rounded-lg shadow-md">
        <h2 className="text-center text-2xl font-bold text-corporate-blue">
          Verify OTP
        </h2>
        <h1 className="text-md text-center font-medium text-gray-500 mb-6 p-2">
          Enter the OTP Sent to your email
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <input
              type="text"
              className="border border-gray-500 rounded-md justify-center"
              placeholder="Enter the OTP"
              onChange={handleOtpChange}
            />
            {errorMessage && (
              <p className="text-red-500 text-xs italic">{errorMessage}</p>
            )}
          </div>
          <div className="flex justify-center mt-3">
            <button
              type="submit"
              className="px-6 py-2 text-white bg-primary-blue rounded-md shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-linkedin-blue"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <Spinner size="sm" className="mr-2" />
                  <span className="text-white">Verifying...</span>
                </div>
              ) : (
                "Verify OTP"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
