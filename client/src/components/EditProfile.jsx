import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import bcryptjs from "bcryptjs";

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
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
        <div className="mb-4">
          <label htmlFor="name" className="block mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border rounded-md p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border rounded-md p-2 w-full"
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="rollNumber" className="block mb-1">
              Roll Number
            </label>
            <input
              type="text"
              id="rollNumber"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              className="border rounded-md p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="registerNumber" className="block mb-1">
              Register Number
            </label>
            <input
              type="text"
              id="registerNumber"
              name="registerNumber"
              value={formData.registerNumber}
              onChange={handleChange}
              className="border rounded-md p-2 w-full"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="department" className="block mb-1">
              Department
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="border rounded-md p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="student_section" className="block mb-1">
              Section
            </label>
            <input
              type="text"
              id="student_section"
              name="student_section"
              value={formData.student_section}
              onChange={handleChange}
              className="border rounded-md p-2 w-full"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="currentPassword" className="block mb-1">
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className="border rounded-md p-2 w-full"
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="newPassword" className="block mb-1">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="border rounded-md p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="border rounded-md p-2 w-full"
              required
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mr-4"
          >
            Update Profile
          </button>
          <button
            type="button"
            onClick={handlePasswordUpdate}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Update Password
          </button>
        </div>
      </form>
  )
}
