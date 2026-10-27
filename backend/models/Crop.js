import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema(
  {
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
    },
    variety: {
      type: String,
      default: 'Standard Hybrid',
      trim: true,
    },
    areaPlanted: {
      type: Number,
      required: [true, 'Area planted in acres is required'],
    },
    plantingDate: {
      type: Date,
      required: [true, 'Planting date is required'],
    },
    expectedHarvestDate: {
      type: Date,
    },
    stage: {
      type: String,
      enum: ['Sowing', 'Germination', 'Vegetative', 'Flowering', 'Grain Filling', 'Maturity', 'Harvested'],
      default: 'Vegetative',
    },
    healthStatus: {
      type: String,
      enum: ['Excellent', 'Good', 'Moderate', 'Warning', 'Critical'],
      default: 'Good',
    },
    soilMetrics: {
      ph: { type: Number, default: 6.8 },
      moisture: { type: Number, default: 45 }, // percentage
      nitrogen: { type: Number, default: 120 }, // kg/ha
      phosphorus: { type: Number, default: 35 }, // kg/ha
      potassium: { type: Number, default: 180 }, // kg/ha
      organicCarbon: { type: Number, default: 0.75 }, // percentage
      lastTested: { type: Date, default: Date.now },
    },
    recommendations: [
      {
        category: String,
        message: String,
        severity: { type: String, enum: ['info', 'warning', 'urgent'], default: 'info' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Crop = mongoose.model('Crop', cropSchema);

export default Crop;
