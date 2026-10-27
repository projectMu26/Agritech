import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Resource name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['seeds', 'fertilizers', 'pesticides', 'tools', 'machinery', 'irrigation'],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      default: 'unit',
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 50,
    },
    description: {
      type: String,
      required: true,
    },
    manufacturer: {
      type: String,
      default: 'AgriTech Agro Supplies',
    },
    isOrganic: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;
