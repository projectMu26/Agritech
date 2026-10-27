import Farm from '../models/Farm.js';
import Crop from '../models/Crop.js';

// @desc    Get all farms for logged-in user
// @route   GET /api/farms
// @access  Private
export const getFarms = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { user: req.user._id };
    const farms = await Farm.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: farms.length, data: farms });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single farm by ID with associated crops
// @route   GET /api/farms/:id
// @access  Private
export const getFarmById = async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.id).populate('user', 'name email phone');

    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    // Check ownership unless admin
    if (farm.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this farm' });
    }

    const crops = await Crop.find({ farm: farm._id });

    res.json({ success: true, data: { ...farm.toObject(), crops } });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new farm profile
// @route   POST /api/farms
// @access  Private
export const createFarm = async (req, res, next) => {
  try {
    const { name, location, totalArea, soilType, irrigationType, establishedYear, notes } = req.body;

    const farm = await Farm.create({
      user: req.user._id,
      name,
      location,
      totalArea,
      soilType: soilType || 'alluvial',
      irrigationType: irrigationType || 'drip',
      establishedYear: establishedYear || new Date().getFullYear(),
      notes: notes || '',
    });

    res.status(201).json({ success: true, data: farm });
  } catch (error) {
    next(error);
  }
};

// @desc    Update farm profile
// @route   PUT /api/farms/:id
// @access  Private
export const updateFarm = async (req, res, next) => {
  try {
    let farm = await Farm.findById(req.params.id);

    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    if (farm.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this farm' });
    }

    farm = await Farm.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: farm });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete farm profile and related crops
// @route   DELETE /api/farms/:id
// @access  Private
export const deleteFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.id);

    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    if (farm.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this farm' });
    }

    await Crop.deleteMany({ farm: farm._id });
    await farm.deleteOne();

    res.json({ success: true, message: 'Farm and associated crops deleted successfully' });
  } catch (error) {
    next(error);
  }
};
