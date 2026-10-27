import Crop from '../models/Crop.js';
import Farm from '../models/Farm.js';
import { analyzeSoil } from '../utils/soilAnalytics.js';
import { analyzePestRisk } from '../utils/pestAdvisory.js';

// @desc    Get all crops for user (optionally filter by farmId)
// @route   GET /api/crops
// @access  Private
export const getCrops = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };

    if (req.query.farmId) {
      filter.farm = req.query.farmId;
    }

    const crops = await Crop.find(filter).populate('farm', 'name location totalArea soilType').sort({ createdAt: -1 });

    res.json({ success: true, count: crops.length, data: crops });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single crop by ID with complete diagnostic report
// @route   GET /api/crops/:id
// @access  Private
export const getCropById = async (req, res, next) => {
  try {
    const crop = await Crop.findById(req.params.id).populate('farm', 'name location soilType irrigationType');

    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    if (crop.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this crop' });
    }

    // Run dynamic diagnostics
    const soilReport = analyzeSoil(crop.soilMetrics);
    const pestAdvisory = analyzePestRisk(crop.cropName, { temperature: 27, humidity: 72 });

    res.json({
      success: true,
      data: crop,
      diagnostics: {
        soilReport,
        pestAdvisory,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new crop to a farm
// @route   POST /api/crops
// @access  Private
export const createCrop = async (req, res, next) => {
  try {
    const { farmId, cropName, variety, areaPlanted, plantingDate, expectedHarvestDate, stage, healthStatus, soilMetrics, notes } = req.body;

    const farm = await Farm.findById(farmId);
    if (!farm) {
      return res.status(404).json({ message: 'Associated farm not found' });
    }

    if (farm.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only add crops to your own farm' });
    }

    // Calculate initial soil recommendations
    const soilAnalysis = analyzeSoil(soilMetrics || {});

    const crop = await Crop.create({
      farm: farmId,
      user: req.user._id,
      cropName,
      variety: variety || 'Standard',
      areaPlanted,
      plantingDate,
      expectedHarvestDate,
      stage: stage || 'Vegetative',
      healthStatus: healthStatus || 'Good',
      soilMetrics: soilMetrics || {},
      recommendations: soilAnalysis.recommendations,
      notes: notes || '',
    });

    res.status(201).json({ success: true, data: crop });
  } catch (error) {
    next(error);
  }
};

// @desc    Update crop details or growth stage
// @route   PUT /api/crops/:id
// @access  Private
export const updateCrop = async (req, res, next) => {
  try {
    let crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    if (crop.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this crop' });
    }

    // If soil metrics are updated, recalculate recommendations
    if (req.body.soilMetrics) {
      const mergedMetrics = { ...crop.soilMetrics.toObject(), ...req.body.soilMetrics, lastTested: new Date() };
      const analysis = analyzeSoil(mergedMetrics);
      req.body.soilMetrics = mergedMetrics;
      req.body.recommendations = analysis.recommendations;
    }

    crop = await Crop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: crop });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete crop
// @route   DELETE /api/crops/:id
// @access  Private
export const deleteCrop = async (req, res, next) => {
  try {
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    if (crop.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this crop' });
    }

    await crop.deleteOne();

    res.json({ success: true, message: 'Crop record deleted successfully' });
  } catch (error) {
    next(error);
  }
};
