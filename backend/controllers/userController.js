import { User } from "../models/userModel.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'atk'&& req.user.role !== 'sub-admin') {
      return res.status(403).json({
        message: "Access denied. Only admins can view all users."
      });
    }

    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'atk') {
      return res.status(403).json({
        message: "Access denied. Only admins can update user roles."
      });
    }

    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    if (!['user', 'admin', 'editor','sub-admin'].includes(role)) {
      return res.status(400).json({
        message: "Invalid role. Role must be either 'user', 'admin', or 'editor'."
      });
    }

    // Don't allow users to change their own role
    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot change your own role."
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'atk') {
      return res.status(403).json({
        message: "Access denied. Only admins can delete users."
      });
    }

    const { userId } = req.params;

    // Don't allow users to delete themselves
    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot delete your own account."
      });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "User deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}; 