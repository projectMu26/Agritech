import Order from '../models/Order.js';
import Resource from '../models/Resource.js';

// @desc    Create a new order for resources/supplies
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items specified' });
    }

    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const resource = await Resource.findById(item.resourceId);
      if (!resource) {
        return res.status(404).json({ message: `Resource with id ${item.resourceId} not found` });
      }

      if (resource.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${resource.name}. Available: ${resource.stock}, Requested: ${item.quantity}`,
        });
      }

      // Decrement stock
      resource.stock -= item.quantity;
      await resource.save();

      calculatedTotal += resource.price * item.quantity;
      validatedItems.push({
        resource: resource._id,
        name: resource.name,
        quantity: item.quantity,
        price: resource.price,
        unit: resource.unit,
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: validatedItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery (Kisan Pay)',
      totalAmount: calculatedTotal,
      orderStatus: 'Confirmed',
      paymentStatus: paymentMethod === 'Cash on Delivery (Kisan Pay)' ? 'Pending' : 'Completed',
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email phone').sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    const updated = await order.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};
