import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import bcryptjs from "bcryptjs";
import { TextInput } from "flowbite-react";


export default function EditProfile() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNumber: "",
    registerNumber: "",
    phone: "",
    department: "",
    student_section: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        rollNumber: currentUser.roll_no,
        registerNumber: currentUser.register_no,
        phone: currentUser.phone,
        department: currentUser.department,
        student_section: currentUser.student_section,
        currentPassword: currentUser.password,
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dispatch action to update profile
    // dispatch(updateStart(formData)); // Replace with your actual Redux action
    // Optionally, handle redirection or success message
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    // Ensure passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Verify current password
    try {
      const isMatch = await bcryptjs.compare(
        formData.currentPassword,
        currentUser.password
      );

      if (!isMatch) {
        alert("Current password is incorrect!");
        return;
      }

      // Dispatch action to update password
      // dispatch(updatePasswordStart(formData.newPassword)); // Replace with your actual Redux action
      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Optionally, handle success message
      alert("Password updated successfully!");
    } catch (error) {
      console.error("Error comparing passwords:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-5">
      <form onSubmit={handleSubmit} className="bg-ternary-blue rounded-lg p-6 space-y-6">
      <div className="flex justify-center mb-4">
          <h1 className="text-custom-div-bg font-bold uppercase text-2xl px-6 py-2 tracking-widest">
            Edit Profile
          </h1>
        </div>        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <TextInput
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="rounded-md w-full focus:outline-none focus:ring-primary-blue"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <TextInput
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="rounded-md w-full focus:ring-primary-blue"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700">
              Roll Number
            </label>
            <TextInput
              type="text"
              id="rollNumber"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              className="rounded-md  w-full focus:ring-primary-blue"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="registerNumber" className="block text-sm font-medium text-gray-700">
              Register Number
            </label>
            <TextInput
              type="text"
              id="registerNumber"
              name="registerNumber"
              value={formData.registerNumber}
              onChange={handleChange}
              className="rounded-md w-full  focus:ring-primary-blue"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <TextInput
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className=" rounded-md w-full focus:ring-primary-blue"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="student_section" className="block text-sm font-medium text-gray-700">
              Section
            </label>
            <TextInput
              type="text"
              id="student_section"
              name="student_section"
              value={formData.student_section}
              onChange={handleChange}
              className="rounded-md w-full  focus:ring-primary-blue"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <TextInput
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className="rounded-md w-full focus:ring-primary-blue"
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <TextInput
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="rounded-md w-full focus:ring-primary-blue"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <TextInput
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className=" rounded-md  w-full  focus:ring-primary-blue"
              required
            />
          </div>
        </div>
        <div className="flex justify-center  gap-3 pt-4">
          <button
            type="submit"
            className="transition-all duration-300   bg-gradient-to-r from-primary-blue  via-secondary-blue/90 to-primary-blue  hover:bg-primary-blue text-white px-4 py-2 rounded-md "
          >
            Update Profile
          </button>
          <button
            type="button"
            onClick={handlePasswordUpdate}
            className="transition-all duration-300 text-white px-4 py-2 rounded-md  bg-gradient-to-r from-primary-blue  via-secondary-blue/95 to-primary-blue  hover:bg-primary-blue"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}
