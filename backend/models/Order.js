import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  resource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    required: true,
  },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  unit: { type: String, default: 'unit' },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      contactNumber: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ['Cash on Delivery (Kisan Pay)', 'UPI / Net Banking', 'Credit/Debit Card', 'Kisan Credit Card (KCC)'],
      default: 'Cash on Delivery (Kisan Pay)',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Pending',
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0.0,
    },
    orderStatus: {
      type: String,
      enum: ['Processing', 'Confirmed', 'Dispatched', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Processing',
    },
    deliveryDateEstimated: {
      type: Date,
      default: () => new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // +4 days
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
