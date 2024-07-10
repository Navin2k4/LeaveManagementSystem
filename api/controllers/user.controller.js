import Student from "../models/student.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';

export const signout = (req, res, next) => {
    try {
        res
            .clearCookie('access_token')
            .status(200)
            .json('User has been signed out');
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    const {
        roll_no,
        register_no,
        name,
        email,
        phone,
        departmentId,
        sectionId,
        section_name,
        batchId,
        currentPassword,
        newPassword,
    } = req.body;

    try {
        const user = await Student.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (currentPassword) {
            const isPasswordValid = await bcryptjs.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Current password is incorrect' });
            }
        }
        if (newPassword) {
            if (newPassword.length < 8 || newPassword.length > 16) {
                return res.status(400).json({ message: 'Password must be at least 8 and atmosr 16 characters' });
            }
            req.body.password = await bcryptjs.hash(newPassword, 10);
        }
        const updatedFields = {
            roll_no,
            register_no,
            name,
            email,
            phone,
            departmentId,
            sectionId,
            section_name,
            batchId,
        };
        const updatedUser = await Student.findByIdAndUpdate(
            req.params.id,
            { $set: updatedFields },
            { new: true }
        );
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    if ( req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to delete this user'));
    }
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json('User has been deleted');
    } catch (error) {
        next(error);
    }
};
