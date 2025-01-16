import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Button, Spinner } from "flowbite-react";
import { Eye, EyeOff, User, Mail, Phone, Hash, BookOpen } from "lucide-react";
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
        `/api/auth/changePassword/${currentUser.userType}/${currentUser.id}`,
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

  return (
    <div className="w-full mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">

        {/* Profile Content */}
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProfileCard
              icon={<User className="w-4 h-4" />}
              label="Name"
              value={currentUser.name}
            />
            <ProfileCard
              icon={<Mail className="w-4 h-4" />}
              label="Email"
              value={currentUser.email}
            />
            <ProfileCard
              icon={<Phone className="w-4 h-4" />}
              label="Phone"
              value={currentUser.phone}
            />
            <ProfileCard
              icon={<Phone className="w-4 h-4" />}
              label="Parent Phone"
              value={currentUser.parent_phone}
            />
            <ProfileCard
              icon={<Hash className="w-4 h-4" />}
              label="Register No"
              value={currentUser.register_no}
            />
            <ProfileCard
              icon={<Hash className="w-4 h-4" />}
              label="Roll No"
              value={currentUser.roll_no}
            />
            <ProfileCard
              icon={<BookOpen className="w-4 h-4" />}
              label="Section"
              value={currentUser.section_name}
            />
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              onClick={toggleModal}
              size="sm"
              className="rounded-lg bg-[#1f3a6e] hover:bg-[#0b1f44] transition-all duration-300"
            >
              <p className="text-white text-sm font-semibold">Change Password</p>
            </Button>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      <Modal show={isModalOpen} onClose={toggleModal} size="sm">
        <Modal.Header className="border-b border-gray-200 dark:border-gray-700 p-4">
          <span className="text-lg font-semibold">Change Password</span>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="space-y-4">
            {feedback.message && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  feedback.success
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {feedback.message}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Old Password
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter current password"
                />
                <button
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter new password"
                />
                <button
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-t border-gray-200 dark:border-gray-700 p-4">
          <Button
            onClick={handleSavePassword}
            disabled={loading}
            size="sm"
            className="rounded-lg"
          >
            {loading ? <Spinner size="sm" /> : <p className="text-white">Save Changes</p>}
          </Button>
          <Button
            onClick={toggleModal}
            color="gray"
            size="sm"
            className="rounded-lg"
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const ProfileCard = ({ icon, label, value }) => (
  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 transition-all duration-200 hover:shadow-sm">
    <div className="flex items-center space-x-2 mb-1">
      <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md text-blue-600 dark:text-blue-400">
        {icon}
      </div>
      <span className="text-md font-medium text-gray-500 dark:text-gray-400">
        {label}
      </span>
    </div>
    <p className="text-md font-semibold text-gray-800 dark:text-gray-200">
      {value || "Not provided"}
    </p>
  </div>
);

export default EditProfile;
