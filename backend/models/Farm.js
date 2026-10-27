import mongoose from 'mongoose';

const farmSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide farm name'],
      trim: true,
    },
    location: {
      address: { type: String, default: '' },
      city: { type: String, required: true },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
      lat: { type: Number, default: 28.6139 },
      lng: { type: Number, default: 77.209 },
    },
    totalArea: {
      type: Number,
      required: [true, 'Please provide total farm area (in acres)'],
    },
    soilType: {
      type: String,
      enum: ['clay', 'loam', 'sandy', 'silt', 'peaty', 'saline', 'black', 'alluvial', 'red'],
      default: 'alluvial',
    },
    irrigationType: {
      type: String,
      enum: ['drip', 'sprinkler', 'canal', 'rainfed', 'borewell', 'furrow'],
      default: 'drip',
    },
    establishedYear: {
      type: Number,
      default: 2020,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Farm = mongoose.model('Farm', farmSchema);

export default Farm;
