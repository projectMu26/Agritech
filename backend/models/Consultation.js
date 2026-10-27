import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    expertType: {
      type: String,
      enum: ['Agronomist', 'Soil Scientist', 'Plant Pathologist', 'Organic Farming Specialist', 'Irrigation Engineer'],
      required: true,
    },
    cropConcerned: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    preferredDate: {
      type: Date,
      required: true,
    },
    preferredTimeSlot: {
      type: String,
      enum: ['09:00 AM - 11:00 AM', '11:00 AM - 01:00 PM', '02:00 PM - 04:00 PM', '04:00 PM - 06:00 PM'],
      default: '11:00 AM - 01:00 PM',
    },
    consultationMode: {
      type: String,
      enum: ['Video Call', 'Phone Call', 'Chat / In-App Advisory'],
      default: 'Video Call',
    },
    status: {
      type: String,
      enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Scheduled',
    },
    advisoryNotes: {
      type: String,
      default: '',
    },
    assignedExpertName: {
      type: String,
      default: 'Dr. Ramesh Sharma (Senior Agronomist, IARI)',
    },
  },
  {
    timestamps: true,
  }
);

const Consultation = mongoose.model('Consultation', consultationSchema);

export default Consultation;
