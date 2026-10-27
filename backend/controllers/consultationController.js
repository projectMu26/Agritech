import Consultation from '../models/Consultation.js';

// @desc    Book a new expert consultation
// @route   POST /api/consultations
// @access  Private
export const requestConsultation = async (req, res, next) => {
  try {
    const { expertType, cropConcerned, topic, description, preferredDate, preferredTimeSlot, consultationMode } = req.body;

    const consultation = await Consultation.create({
      farmer: req.user._id,
      expertType,
      cropConcerned,
      topic,
      description,
      preferredDate,
      preferredTimeSlot,
      consultationMode,
    });

    res.status(201).json({ success: true, data: consultation });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's consultations
// @route   GET /api/consultations/my
// @access  Private
export const getMyConsultations = async (req, res, next) => {
  try {
    const consultations = await Consultation.find({ farmer: req.user._id }).sort({ preferredDate: -1 });
    res.json({ success: true, count: consultations.length, data: consultations });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all consultations (Admin / Expert)
// @route   GET /api/consultations
// @access  Private/Expert/Admin
export const getAllConsultations = async (req, res, next) => {
  try {
    const consultations = await Consultation.find({})
      .populate('farmer', 'name email phone location')
      .sort({ preferredDate: -1 });
    res.json({ success: true, count: consultations.length, data: consultations });
  } catch (error) {
    next(error);
  }
};

// @desc    Update consultation status & advisory notes (Expert / Admin)
// @route   PUT /api/consultations/:id
// @access  Private/Expert/Admin
export const updateConsultation = async (req, res, next) => {
  try {
    const { status, advisoryNotes, assignedExpertName } = req.body;
    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation record not found' });
    }

    if (status) consultation.status = status;
    if (advisoryNotes) consultation.advisoryNotes = advisoryNotes;
    if (assignedExpertName) consultation.assignedExpertName = assignedExpertName;

    const updated = await consultation.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};
