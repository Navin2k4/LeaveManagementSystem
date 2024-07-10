import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import {
    updateStart,
    updateSuccess,
    updateFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
} from '../redux/user/userSlice.js';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function EditProfile() {
    const dispatch = useDispatch();
    const { currentUser, error, loading } = useSelector((state) => state.user);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        roll_no: '',
        register_no: '',
        departmentId: '',
        sectionId: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    console.log(currentUser);
    useEffect(() => {
        if (currentUser) {
            setFormData({
                name: currentUser.name,
                email: currentUser.email,
                roll_no: currentUser.roll_no,
                register_no: currentUser.register_no,
                departmentId: currentUser.departmentId,
                sectionId: currentUser.sectionId,
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        }
    }, [currentUser]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);

        // Validate if new password matches confirm password
        if (formData.newPassword !== formData.confirmPassword) {
            setUpdateUserError('New password and confirm password must match');
            return;
        }

        // Prepare data to send to backend
        const sendData = {
            roll_no: formData.roll_no,
            register_no: formData.register_no,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            departmentId: formData.departmentId,
            sectionId: formData.sectionId,
            currentPassword: formData.currentPassword,
        };

        // Only include newPassword if it's provided
        if (formData.newPassword) {
            sendData.newPassword = formData.newPassword;
        }

        try {
            dispatch(updateStart());
            const res = await fetch(`/api/user/update/${currentUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sendData),
            });
            const data = await res.json();
            if (!res.ok) {
                dispatch(updateFailure(data.message));
                setUpdateUserError(data.message);
            } else {
                dispatch(updateSuccess(data));
                setUpdateUserSuccess("User's profile updated successfully");
            }
        } catch (error) {
            dispatch(updateFailure(error.message));
            setUpdateUserError(error.message);
        }
    };

    const handleDeleteUser = async () => {
        setShowModal(false);
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser.id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (!res.ok) {
                dispatch(deleteUserFailure(data.message));
            } else {
                dispatch(deleteUserSuccess(data));
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-5">
            <form onSubmit={handleSubmit} className="bg-ternary-blue rounded-lg p-6 space-y-6">
                <div className="flex justify-center mb-4">
                    <h1 className="text-custom-div-bg font-bold uppercase text-2xl px-6 py-2 tracking-widest">
                        Edit Profile
                    </h1>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                        <label htmlFor="roll_no" className="block text-sm font-medium text-gray-700">
                            Roll Number
                        </label>
                        <TextInput
                            type="text"
                            id="roll_no"
                            name="roll_no"
                            value={formData.roll_no}
                            onChange={handleChange}
                            className="rounded-md w-full focus:ring-primary-blue"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="register_no" className="block text-sm font-medium text-gray-700">
                            Register Number
                        </label>
                        <TextInput
                            type="text"
                            id="register_no"
                            name="register_no"
                            value={formData.register_no}
                            onChange={handleChange}
                            className="rounded-md w-full focus:ring-primary-blue"
                            required
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700">
                            Department
                        </label>
                        <TextInput
                            type="text"
                            id="departmentId"
                            name="departmentId"
                            value={formData.departmentId}
                            onChange={handleChange}
                            className="rounded-md w-full focus:ring-primary-blue"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="sectionId" className="block text-sm font-medium text-gray-700">
                            Section
                        </label>
                        <TextInput
                            type="text"
                            id="sectionId"
                            name="sectionId"
                            value={formData.sectionId}
                            onChange={handleChange}
                            className="rounded-md w-full focus:ring-primary-blue"
                            required
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                            className="rounded-md w-full focus                            :ring-primary-blue"
                            required={formData.newPassword || formData.confirmPassword}
                        />
                    </div>
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
                        />
                    </div>
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
                        className="rounded-md w-full focus:ring-primary-blue"
                    />
                </div>
                {updateUserError && (
                    <Alert type="danger" className="mt-4">
                        <HiOutlineExclamationCircle className="inline-block h-4 w-4 mr-1 -mt-1" />
                        {updateUserError}
                    </Alert>
                )}
                {updateUserSuccess && (
                    <Alert type="success" className="mt-4">
                        {updateUserSuccess}
                    </Alert>
                )}
                {/* <div className="flex justify-end mt-4">
                    <Button type="submit" className="mr-2" disabled={loading}>
                        {loading ? 'Updating...' : 'Update'}
                    </Button>
                    <Button type="button" onClick={() => setShowModal(true)} className="bg-red-500">
                        Delete Account
                    </Button>
                </div> */}
            </form>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <div className="p-6">
                    <h3 className="text-lg font-semibold">Confirm Deletion</h3>
                    <p className="text-sm mt-2">Are you sure you want to delete your account?</p>
                    <div className="flex justify-end mt-4">
                        <Button onClick={handleDeleteUser} className="bg-red-500 mr-2">
                            Delete
                        </Button>
                        <Button onClick={() => setShowModal(false)}>Cancel</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

