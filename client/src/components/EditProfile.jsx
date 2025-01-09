import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Button } from "flowbite-react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

const EditProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", success: false });
  const [mentors, setMentors] = useState([]);
  const [classIncharges, setClassIncharges] = useState([]);
  console.log(mentors,classIncharges);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setOldPassword("");
    setNewPassword("");
    setShowOldPassword(false);
    setShowNewPassword(false);
    setFeedback({ message: "", success: false });
  };

  const handleSavePassword = async () => {
    if (!oldPassword || !newPassword) {
      setFeedback({ message: "Both fields are required.", success: false });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `/api/auth/changePassword/${currentUser.id}`,
        {
          oldPassword,
          newPassword,
        }
      );
      setFeedback({ message: response.data.message, success: true }); // Success feedback
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : "An error occurred.";
      setFeedback({ message: errorMessage, success: false }); // Error feedback
    } finally {
      setLoading(false);
    }
  };
  // useEffect(() => {
  //     const fetchStaff = async () => {
  //       try {
  //         const resMentor = await fetch(
  //           `/api/sections/${currentUser.sectionId}/mentors`
  //         );
  //         const mentorsData = await resMentor.json();
  //         setMentors(mentorsData);
  //         const resClassIncharge = await fetch(
  //           `/api/sections/${currentUser.sectionId}/classIncharges`
  //         );
  //         const classInchargesData = await resClassIncharge.json();
  //         setClassIncharges(classInchargesData);
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     };

  //     fetchStaff();
  // }, []);

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl mt-10 shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
        User Profile
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileField label="Name" value={currentUser.name} />
        <ProfileField label="Email" value={currentUser.email} />
        <ProfileField label="Phone" value={currentUser.phone} />
        <ProfileField label="Register No" value={currentUser.register_no} />
        <ProfileField label="Roll No" value={currentUser.roll_no} />
        <ProfileField label="Section" value={currentUser.section_name} />
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={toggleModal} gradientDuoTone="blueToPurple">
          Change Password
        </Button>
      </div>

      <Modal show={isModalOpen} onClose={toggleModal}>
        <Modal.Header>Change Password</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            {feedback.message && (
              <div
                className={`p-4 text-sm rounded-lg ${
                  feedback.success
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {feedback.message}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Old Password
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full border-gray-300 dark:border-gray-600 rounded-lg shadow-sm px-4 py-2 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter old password"
                />
                <button
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showOldPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border-gray-300 dark:border-gray-600 rounded-lg shadow-sm px-4 py-2 dark:bg-gray-700 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter new password"
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={handleSavePassword}
            disabled={loading}
            className="text-gray-900 bg-gray-200 border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <Button onClick={toggleModal} color="gray">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div>
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
      {label}
    </label>
    <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-lg px-4 py-2 shadow-sm">
      {value}
    </div>
  </div>
);

export default EditProfile;