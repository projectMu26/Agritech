import User from '../models/User.js';
import Farm from '../models/Farm.js';
import Crop from '../models/Crop.js';
import Order from '../models/Order.js';
import Resource from '../models/Resource.js';
import Consultation from '../models/Consultation.js';

// @desc    Get system-wide platform statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res, next) => {
  try {
    const [totalUsers, totalFarms, totalCrops, totalOrders, totalResources, totalConsultations] = await Promise.all([
      User.countDocuments(),
      Farm.countDocuments(),
      Crop.countDocuments(),
      Order.countDocuments(),
      Resource.countDocuments(),
      Consultation.countDocuments(),
    ]);

    // Calculate revenue from completed or confirmed orders
    const orders = await Order.find({ paymentStatus: { $ne: 'Failed' } });
    const totalRevenue = orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

    const pendingOrders = await Order.countDocuments({ orderStatus: 'Processing' });
    const pendingConsultations = await Consultation.countDocuments({ status: 'Scheduled' });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalFarms,
        totalCrops,
        totalOrders,
        totalResources,
        totalConsultations,
        totalRevenue,
        pendingOrders,
        pendingConsultations,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with filtering
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role or status
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role || user.role;
    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Admin cannot delete their own account' });
    }

    await user.deleteOne();
    res.json({ success: true, message: 'User removed from platform' });
  } catch (error) {
    next(error);
  }
};
